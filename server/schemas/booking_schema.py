from extensions import ma
from models import Booking

class BookingSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Booking
        load_instance = True
        include_fk = True
        fields = ('id', 'start_date', 'end_date', 'total_price', 'status', 'created_at', 'notes', 'review_rating', 'vehicle_id', 'renter_id', 'contact_phone', 'hire_type', 'driver_id', 'driver_status', 'event_type', 'is_convoy', 'convoy_id', 'discount_percent', 'traveller_service', 'pickup_location', 'dropoff_location', 'meet_and_greet', 'payment_method', 'payment_status', 'mpesa_phone', 'cancellation_penalty_percent', 'vehicle_make', 'vehicle_model', 'vehicle_image', 'vehicle_daily_rate', 'renter_name', 'owner_id', 'driver_name', 'driver_rating')
    vehicle_make = ma.Method('get_vehicle_make')
    vehicle_model = ma.Method('get_vehicle_model')
    vehicle_image = ma.Method('get_vehicle_image')
    vehicle_daily_rate = ma.Method('get_vehicle_daily_rate')
    renter_name = ma.Method('get_renter_name')
    owner_id = ma.Method('get_owner_id')
    driver_name = ma.Method('get_driver_name')
    driver_rating = ma.Method('get_driver_rating')

    def get_vehicle_make(self, booking):
        return booking.vehicle.make if booking.vehicle else None

    def get_vehicle_model(self, booking):
        return booking.vehicle.model if booking.vehicle else None

    def get_vehicle_image(self, booking):
        return booking.vehicle.image_url if booking.vehicle else None

    def get_vehicle_daily_rate(self, booking):
        return booking.vehicle.daily_rate if booking.vehicle else None

    def get_renter_name(self, booking):
        if not booking.renter:
            return None
        return booking.renter.name or booking.renter.email.split('@')[0]

    def get_owner_id(self, booking):
        return booking.vehicle.owner_id if booking.vehicle else None

    def get_driver_name(self, booking):
        return booking.driver.name if booking.driver else None

    def get_driver_rating(self, booking):
        return booking.driver.rating if booking.driver else None
booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)
