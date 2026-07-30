import re
from datetime import datetime
from models import Booking
CONVOY_DISCOUNT_TIERS = [(6, 0.15), (4, 0.1), (2, 0.05)]
PHONE_PATTERN = re.compile('^\\+254\\d{9}$')

def parse_date(value):
    return datetime.strptime(value, '%Y-%m-%d').date()

def valid_phone(value):
    return bool(value) and bool(PHONE_PATTERN.match(value))

def convoy_discount(vehicle_count):
    for (min_count, discount) in CONVOY_DISCOUNT_TIERS:
        if vehicle_count >= min_count:
            return discount
    return 0.0

def has_conflict(vehicle_id, start, end):
    return Booking.query.filter(Booking.vehicle_id == vehicle_id, Booking.status.in_(['confirmed', 'active']), Booking.start_date < end, Booking.end_date > start).first() is not None

def driver_has_conflict(driver_id, start, end, exclude_booking_id=None):
    query = Booking.query.filter(Booking.driver_id == driver_id, Booking.status.in_(['confirmed', 'active']), Booking.start_date < end, Booking.end_date > start)
    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)
    return query.first() is not None

def price_for_vehicle(vehicle, driver, days):
    price = days * vehicle.daily_rate
    if driver:
        price += days * driver.daily_rate
    return price
