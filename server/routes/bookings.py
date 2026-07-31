import uuid
from datetime import date
from flask import Blueprint, request, jsonify, g
from extensions import db, logger
from models import Booking, Vehicle, User, Driver, Notification
from schemas import booking_schema, bookings_schema
from utils.decorators import jwt_required, admin_required, driver_required
from utils.booking_helpers import parse_date, valid_phone, convoy_discount, has_conflict, driver_has_conflict, price_for_vehicle
bookings_bp = Blueprint('bookings', __name__)
VALID_EVENT_TYPES = ('wedding', 'funeral', 'safari', 'group_transportation', 'international_traveller', 'other')
VALID_TRAVELLER_SERVICES = ('airport_pickup', 'airport_dropoff', 'round_trip', 'hotel_transfer', 'tourist_transfer', 'multi_day_driver', 'multi_destination')
REFUND_POLICY_TEXT = ('Cancellation & refund policy: bookings cancelled before the pickup date are fully refunded. '
                       'Cancelling on the pickup day itself incurs a 10% cancellation fee. '
                       'Once the vehicle has been picked up, the booking is non-refundable.')

def _send_confirmation_receipt(booking):
    vehicle_label = f'{booking.vehicle.make} {booking.vehicle.model}' if booking.vehicle else 'your vehicle'
    days = (booking.end_date - booking.start_date).days if booking.start_date and booking.end_date else None
    daily_rate = booking.vehicle.daily_rate if booking.vehicle else None
    payment_label = 'M-Pesa' if booking.payment_method == 'mpesa' else booking.payment_method
    confirm_message = f'Your booking for the {vehicle_label} ({booking.start_date.isoformat()} to {booking.end_date.isoformat()}) has been confirmed. Get ready for pickup!'
    receipt_lines = [
        f'Receipt for Booking #{booking.id}',
        f'Vehicle: {vehicle_label}',
        f'Dates: {booking.start_date.isoformat()} to {booking.end_date.isoformat()}' + (f' ({days} day(s))' if days else ''),
    ]
    if daily_rate:
        receipt_lines.append(f'Daily rate: KES {daily_rate:,.0f}')
    if booking.discount_percent:
        receipt_lines.append(f'Discount applied: {booking.discount_percent:.0f}%')
    receipt_lines.append(f'Total paid: KES {booking.total_price:,.0f}')
    receipt_lines.append(f'Payment method: {payment_label}')
    receipt_lines.append(f'Payment status: {"Paid" if booking.payment_status == "paid" else "Pending"}')
    if booking.mpesa_phone:
        receipt_lines.append(f'M-Pesa number: {booking.mpesa_phone}')
    receipt_lines.append('')
    receipt_lines.append(REFUND_POLICY_TEXT)
    db.session.add(Notification(user_id=booking.renter_id, type='booking_confirmed', title='Booking confirmed', message=confirm_message, booking_id=booking.id, simulated_email_sent=True, simulated_sms_sent=bool(booking.contact_phone)))
    db.session.add(Notification(user_id=booking.renter_id, type='receipt', title=f'Payment receipt - Booking #{booking.id}', message='\n'.join(receipt_lines), booking_id=booking.id, simulated_email_sent=True))

def _send_cancellation_notice(booking):
    vehicle_label = f'{booking.vehicle.make} {booking.vehicle.model}' if booking.vehicle else 'your vehicle'
    if booking.cancellation_penalty_percent and booking.cancellation_penalty_percent > 0:
        message = (f'Your booking for the {vehicle_label} was cancelled on the pickup day, so a '
                    f'{booking.cancellation_penalty_percent:.0f}% cancellation fee applies. '
                    f'{REFUND_POLICY_TEXT}')
    else:
        message = f'Your booking for the {vehicle_label} was cancelled and is fully refunded. {REFUND_POLICY_TEXT}'
    db.session.add(Notification(user_id=booking.renter_id, type='booking_cancelled', title='Booking cancelled', message=message, booking_id=booking.id, simulated_email_sent=True, simulated_sms_sent=bool(booking.contact_phone)))

@bookings_bp.route('/bookings', methods=['POST'])
@jwt_required
def create_booking():
    try:
        data = request.get_json() or {}
        vehicle_id = data.get('vehicle_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        hire_type = data.get('hire_type', 'self_drive')
        driver_id = data.get('driver_id')
        contact_phone = data.get('contact_phone')
        payment_method = data.get('payment_method', 'mpesa')
        if payment_method not in ('mpesa', 'cash'):
            payment_method = 'mpesa'
        payment_status = 'paid' if data.get('payment_status') == 'paid' else 'pending'
        mpesa_phone = data.get('mpesa_phone') if payment_method == 'mpesa' else None
        if not (vehicle_id and start_date and end_date):
            return (jsonify({'error': 'vehicle_id, start_date and end_date are required'}), 400)
        if not valid_phone(contact_phone):
            return (jsonify({'error': 'contact_phone must be in the format +254 followed by 9 digits, e.g. +254795038762'}), 400)
        if hire_type not in ('self_drive', 'chauffeur'):
            hire_type = 'self_drive'
        vehicle = db.session.get(Vehicle, vehicle_id)
        if not vehicle or not vehicle.is_available:
            return (jsonify({'error': 'Vehicle not available'}), 404)
        start = parse_date(start_date)
        end = parse_date(end_date)
        if start < date.today():
            return (jsonify({'error': 'start_date cannot be in the past'}), 400)
        if end <= start:
            return (jsonify({'error': 'end_date must be after start_date'}), 400)
        driver = None
        if hire_type == 'chauffeur':
            if not driver_id:
                return (jsonify({'error': 'driver_id is required for a chauffeur-driven hire'}), 400)
            driver = db.session.get(Driver, driver_id)
            if not driver or not driver.is_available:
                return (jsonify({'error': 'Driver not available'}), 404)
            if driver_has_conflict(driver_id, start, end):
                return (jsonify({'error': f'{driver.name} is already booked for these dates - please choose a different driver or dates'}), 409)
        if has_conflict(vehicle_id, start, end):
            return (jsonify({'error': 'Vehicle not available for these dates'}), 409)
        days = (end - start).days
        total_price = price_for_vehicle(vehicle, driver, days)
        booking = Booking(vehicle_id=vehicle_id, renter_id=g.current_user.id, start_date=start, end_date=end, total_price=total_price, notes=data.get('notes'), status='pending', hire_type=hire_type, driver_id=driver.id if driver else None, driver_status='pending' if driver else None, contact_phone=contact_phone, payment_method=payment_method, payment_status=payment_status, mpesa_phone=mpesa_phone)
        db.session.add(booking)
        db.session.commit()
        return (jsonify(booking_schema.dump(booking)), 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Create booking error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@bookings_bp.route('/bookings/convoy', methods=['POST'])
@jwt_required
def create_convoy_booking():
    try:
        data = request.get_json() or {}
        event_type = data.get('event_type', 'other')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        contact_phone = data.get('contact_phone')
        vehicles_payload = data.get('vehicles') or []
        payment_method = data.get('payment_method', 'mpesa')
        if payment_method not in ('mpesa', 'cash'):
            payment_method = 'mpesa'
        payment_status = 'paid' if data.get('payment_status') == 'paid' else 'pending'
        mpesa_phone = data.get('mpesa_phone') if payment_method == 'mpesa' else None
        if event_type not in VALID_EVENT_TYPES:
            event_type = 'other'
        traveller_service = None
        if event_type == 'international_traveller':
            traveller_service = data.get('traveller_service')
            if traveller_service not in VALID_TRAVELLER_SERVICES:
                return (jsonify({'error': 'traveller_service is required for an international traveller booking and must be one of: ' + ', '.join(VALID_TRAVELLER_SERVICES)}), 400)
        if not (start_date and end_date) or len(vehicles_payload) < 1:
            return (jsonify({'error': 'start_date, end_date and at least one vehicle are required'}), 400)
        if not valid_phone(contact_phone):
            return (jsonify({'error': 'contact_phone must be in the format +254 followed by 9 digits, e.g. +254795038762'}), 400)
        start = parse_date(start_date)
        end = parse_date(end_date)
        if start < date.today():
            return (jsonify({'error': 'start_date cannot be in the past'}), 400)
        if end <= start:
            return (jsonify({'error': 'end_date must be after start_date'}), 400)
        days = (end - start).days
        driver_ids_in_request = [entry.get('driver_id') for entry in vehicles_payload if entry.get('hire_type') == 'chauffeur' and entry.get('driver_id')]
        duplicates = {d for d in driver_ids_in_request if driver_ids_in_request.count(d) > 1}
        if duplicates:
            dup_names = [db.session.get(Driver, d).name for d in duplicates if db.session.get(Driver, d)]
            return (jsonify({'error': f"The same driver ({', '.join(dup_names)}) can't be assigned to more than one vehicle in this convoy"}), 400)
        resolved = []
        for entry in vehicles_payload:
            vehicle_id = entry.get('vehicle_id')
            hire_type = entry.get('hire_type', 'self_drive')
            driver_id = entry.get('driver_id')
            vehicle = db.session.get(Vehicle, vehicle_id)
            if not vehicle or not vehicle.is_available:
                return (jsonify({'error': f'Vehicle {vehicle_id} is not available'}), 404)
            if has_conflict(vehicle_id, start, end):
                return (jsonify({'error': f'{vehicle.make} {vehicle.model} is not available for these dates'}), 409)
            driver = None
            if hire_type == 'chauffeur':
                driver = db.session.get(Driver, driver_id)
                if not driver or not driver.is_available:
                    return (jsonify({'error': f'Driver {driver_id} is not available'}), 404)
                if driver_has_conflict(driver_id, start, end):
                    return (jsonify({'error': f'{driver.name} is already booked for these dates - please choose a different driver'}), 409)
            resolved.append((vehicle, driver, hire_type))
        discount = convoy_discount(len(resolved))
        convoy_id = uuid.uuid4().hex
        pickup_location = (data.get('pickup_location') or '').strip()[:120] or None
        dropoff_location = (data.get('dropoff_location') or '').strip()[:120] or None
        meet_and_greet = bool(data.get('meet_and_greet')) if traveller_service else False
        created = []
        for (vehicle, driver, hire_type) in resolved:
            base_price = price_for_vehicle(vehicle, driver, days)
            booking = Booking(vehicle_id=vehicle.id, renter_id=g.current_user.id, start_date=start, end_date=end, total_price=round(base_price * (1 - discount), 2), notes=data.get('notes'), status='pending', hire_type=hire_type, driver_id=driver.id if driver else None, driver_status='pending' if driver else None, contact_phone=contact_phone, event_type=event_type, is_convoy=True, convoy_id=convoy_id, discount_percent=discount * 100, traveller_service=traveller_service, pickup_location=pickup_location, dropoff_location=dropoff_location, meet_and_greet=meet_and_greet, payment_method=payment_method, payment_status=payment_status, mpesa_phone=mpesa_phone)
            db.session.add(booking)
            created.append(booking)
        db.session.commit()
        return (jsonify({'convoy_id': convoy_id, 'discount_percent': discount * 100, 'bookings': bookings_schema.dump(created)}), 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Create convoy booking error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@bookings_bp.route('/bookings/me', methods=['GET'])
@jwt_required
def my_bookings():
    bookings = Booking.query.filter_by(renter_id=g.current_user.id).order_by(Booking.created_at.desc()).all()
    return (jsonify(bookings_schema.dump(bookings)), 200)

@bookings_bp.route('/bookings/owner', methods=['GET'])
@jwt_required
def owner_bookings():
    bookings = Booking.query.join(Vehicle, Booking.vehicle_id == Vehicle.id).filter(Vehicle.owner_id == g.current_user.id).order_by(Booking.created_at.desc()).all()
    return (jsonify(bookings_schema.dump(bookings)), 200)

@bookings_bp.route('/bookings/<int:booking_id>', methods=['PUT'])
@jwt_required
def update_booking(booking_id):
    try:
        booking = db.session.get(Booking, booking_id)
        if not booking:
            return (jsonify({'error': 'Booking not found'}), 404)
        data = request.get_json() or {}
        user = g.current_user
        is_owner = booking.vehicle.owner_id == user.id
        is_renter = booking.renter_id == user.id
        is_admin = user.role == 'admin'
        if not (is_owner or is_renter or is_admin):
            return (jsonify({'error': 'Forbidden'}), 403)
        VALID_STATUSES = {'pending', 'confirmed', 'active', 'completed', 'cancelled'}
        new_status = data.get('status')
        was_confirmed = booking.status == 'confirmed'
        if new_status:
            if is_admin and new_status in VALID_STATUSES:
                if new_status == 'confirmed' and booking.driver_id:
                    if driver_has_conflict(booking.driver_id, booking.start_date, booking.end_date, exclude_booking_id=booking.id):
                        return (jsonify({'error': 'This driver is already confirmed on another booking for overlapping dates'}), 409)
                booking.status = new_status
            elif is_owner and booking.status == 'pending' and (new_status in ('confirmed', 'cancelled')):
                if new_status == 'confirmed' and booking.driver_id:
                    if driver_has_conflict(booking.driver_id, booking.start_date, booking.end_date, exclude_booking_id=booking.id):
                        return (jsonify({'error': 'This driver is already confirmed on another booking for overlapping dates'}), 409)
                booking.status = new_status
            elif is_owner and booking.status == 'confirmed' and (new_status == 'completed'):
                booking.status = new_status
            elif is_renter and booking.status in ('pending', 'confirmed') and (new_status == 'cancelled'):
                if booking.start_date and date.today() > booking.start_date:
                    return (jsonify({'error': 'No refunds once the vehicle has been picked up.'}), 400)
                booking.status = new_status
            else:
                return (jsonify({'error': f'Cannot change status from {booking.status} to {new_status}'}), 400)
            if booking.status == 'cancelled':
                if booking.driver_id and booking.driver_status != 'cancelled':
                    booking.driver_status = 'cancelled'
                booking.cancellation_penalty_percent = 10.0 if (booking.start_date and date.today() == booking.start_date) else 0.0
                _send_cancellation_notice(booking)
            elif booking.status == 'confirmed' and not was_confirmed:
                _send_confirmation_receipt(booking)
        if 'review_rating' in data:
            if not is_renter:
                return (jsonify({'error': 'Only the renter can leave a review'}), 403)
            if booking.status != 'completed':
                return (jsonify({'error': 'Can only review a completed booking'}), 400)
            booking.review_rating = data['review_rating']
            owner = db.session.get(User, booking.vehicle.owner_id)
            reviewed = Booking.query.join(Vehicle, Booking.vehicle_id == Vehicle.id).filter(Vehicle.owner_id == owner.id, Booking.review_rating.isnot(None)).all()
            owner.rating = sum((b.review_rating for b in reviewed)) / len(reviewed)
        db.session.commit()
        return (jsonify(booking_schema.dump(booking)), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Update booking error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@bookings_bp.route('/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required
def delete_booking(booking_id):
    try:
        booking = db.session.get(Booking, booking_id)
        if not booking:
            return (jsonify({'error': 'Booking not found'}), 404)
        if booking.renter_id != g.current_user.id and booking.vehicle.owner_id != g.current_user.id:
            return (jsonify({'error': 'Forbidden'}), 403)
        if booking.status not in ('pending', 'cancelled'):
            return (jsonify({'error': 'Only pending or cancelled bookings can be deleted'}), 400)
        db.session.delete(booking)
        db.session.commit()
        return (jsonify({'message': 'Booking deleted'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Delete booking error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)


@bookings_bp.route('/admin/bookings', methods=['GET'])
@admin_required
def list_all_bookings():
    query = Booking.query.order_by(Booking.created_at.desc())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 15, type=int)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    return (jsonify({'bookings': bookings_schema.dump(paginated.items), 'page': paginated.page, 'per_page': paginated.per_page, 'total': paginated.total, 'total_pages': paginated.pages}), 200)

@bookings_bp.route('/driver/bookings', methods=['GET'])
@driver_required
def list_driver_bookings():
    bookings = Booking.query.filter_by(driver_id=g.current_driver.id).order_by(Booking.created_at.desc()).all()
    return (jsonify(bookings_schema.dump(bookings)), 200)

@bookings_bp.route('/driver/bookings/<int:booking_id>', methods=['PUT'])
@driver_required
def respond_to_booking(booking_id):
    try:
        booking = db.session.get(Booking, booking_id)
        if not booking or booking.driver_id != g.current_driver.id:
            return (jsonify({'error': 'Booking not found'}), 404)
        if booking.status == 'cancelled':
            return (jsonify({'error': 'This booking was cancelled by the client'}), 400)
        data = request.get_json() or {}
        new_status = data.get('driver_status')
        if new_status not in ('accepted', 'declined'):
            return (jsonify({'error': "driver_status must be 'accepted' or 'declined'"}), 400)
        booking.driver_status = new_status
        vehicle_label = f'{booking.vehicle.make} {booking.vehicle.model}' if booking.vehicle else 'your vehicle'
        driver_name = g.current_driver.name
        if new_status == 'accepted':
            title = 'Chauffeur confirmed'
            message = f'{driver_name} has accepted your booking for the {vehicle_label} ({booking.start_date.isoformat()} to {booking.end_date.isoformat()}).'
        else:
            title = 'Chauffeur unavailable'
            message = f'{driver_name} declined your booking for the {vehicle_label}. Please pick another chauffeur or contact support.'
        notification = Notification(user_id=booking.renter_id, type=f'booking_{new_status}', title=title, message=message, booking_id=booking.id, simulated_email_sent=True, simulated_sms_sent=bool(booking.contact_phone))
        db.session.add(notification)
        db.session.commit()
        return (jsonify(booking_schema.dump(booking)), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Driver respond to booking error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)
