from flask import Blueprint, request, jsonify
from extensions import db, logger
from models import User, Vehicle, Booking
from utils.decorators import admin_required
from schemas import user_schema, users_schema
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/stats', methods=['GET'])
@admin_required
def stats():
    total_users = User.query.count()
    total_vehicles = Vehicle.query.count()
    total_bookings = Booking.query.count()
    total_revenue = db.session.query(db.func.coalesce(db.func.sum(Booking.total_price), 0)).filter(Booking.status == 'completed').scalar()
    return (jsonify({'total_users': total_users, 'total_vehicles': total_vehicles, 'total_bookings': total_bookings, 'total_revenue': total_revenue}), 200)

@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
def list_users():
    query = User.query
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 15, type=int)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    result = users_schema.dump(paginated.items)
    for (row, user) in zip(result, paginated.items):
        row['vehicle_count'] = len(user.vehicles)
        row['booking_count'] = len(user.bookings)
    return (jsonify({'users': result, 'page': paginated.page, 'per_page': paginated.per_page, 'total': paginated.total, 'total_pages': paginated.pages}), 200)

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    try:
        user = db.session.get(User, user_id)
        if not user:
            return (jsonify({'error': 'User not found'}), 404)
        data = request.get_json() or {}
        if 'is_banned' in data:
            user.is_banned = bool(data['is_banned'])
        if 'verification_status' in data:
            user.verification_status = data['verification_status']
        if 'role' in data and data['role'] in ('client', 'admin'):
            user.role = data['role']
        db.session.commit()
        return (jsonify(user_schema.dump(user)), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Update user error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    try:
        user = db.session.get(User, user_id)
        if not user:
            return (jsonify({'error': 'User not found'}), 404)
        db.session.delete(user)
        db.session.commit()
        return (jsonify({'message': 'User and their listings/bookings deleted'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Delete user error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)
