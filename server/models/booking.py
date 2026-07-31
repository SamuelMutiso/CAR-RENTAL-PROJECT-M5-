from datetime import datetime
from extensions import db

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text, nullable=True)
    review_rating = db.Column(db.Integer, nullable=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    renter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    contact_phone = db.Column(db.String(20), nullable=False)
    hire_type = db.Column(db.String(20), nullable=False, default='self_drive')
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)
    driver_status = db.Column(db.String(20), nullable=True)
    event_type = db.Column(db.String(20), nullable=True)
    is_convoy = db.Column(db.Boolean, nullable=False, default=False)
    convoy_id = db.Column(db.String(36), nullable=True, index=True)
    discount_percent = db.Column(db.Float, nullable=False, default=0.0)
    traveller_service = db.Column(db.String(30), nullable=True)
    pickup_location = db.Column(db.String(120), nullable=True)
    dropoff_location = db.Column(db.String(120), nullable=True)
    meet_and_greet = db.Column(db.Boolean, nullable=False, default=False)
    payment_method = db.Column(db.String(20), nullable=False, default='mpesa')
    payment_status = db.Column(db.String(20), nullable=False, default='pending')
    mpesa_phone = db.Column(db.String(20), nullable=True)
    cancellation_penalty_percent = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        return {'id': self.id, 'start_date': self.start_date.isoformat() if self.start_date else None, 'end_date': self.end_date.isoformat() if self.end_date else None, 'total_price': self.total_price, 'status': self.status, 'created_at': self.created_at.isoformat() if self.created_at else None, 'notes': self.notes, 'review_rating': self.review_rating, 'vehicle_id': self.vehicle_id, 'renter_id': self.renter_id, 'contact_phone': self.contact_phone, 'hire_type': self.hire_type, 'driver_id': self.driver_id, 'driver_status': self.driver_status, 'event_type': self.event_type, 'is_convoy': self.is_convoy, 'convoy_id': self.convoy_id, 'discount_percent': self.discount_percent, 'traveller_service': self.traveller_service, 'pickup_location': self.pickup_location, 'dropoff_location': self.dropoff_location, 'meet_and_greet': self.meet_and_greet, 'payment_method': self.payment_method, 'payment_status': self.payment_status, 'mpesa_phone': self.mpesa_phone, 'cancellation_penalty_percent': self.cancellation_penalty_percent,'vehicle_make': self.vehicle.make if self.vehicle else None, 'vehicle_model': self.vehicle.model if self.vehicle else None, 'vehicle_image': self.vehicle.image_url if self.vehicle else None, 'vehicle_daily_rate': self.vehicle.daily_rate if self.vehicle else None, 'renter_name': (self.renter.name or self.renter.email.split('@')[0]) if self.renter else None,'owner_id': self.vehicle.owner_id if self.vehicle else None, 'driver_name': self.driver.name if self.driver else None, 'driver_rating': self.driver.rating if self.driver else None}

    def __repr__(self):
        return f'<Booking {self.id} vehicle={self.vehicle_id} renter={self.renter_id} {self.status}>'
