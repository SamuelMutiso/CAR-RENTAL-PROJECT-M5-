from datetime import datetime
from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(20), nullable=False, default='client')
    license_number = db.Column(db.String(50), nullable=True)
    verification_status = db.Column(db.String(20), nullable=False, default='unverified')
    rental_intent = db.Column(db.String(20), nullable=False, default='both')
    rating = db.Column(db.Float, nullable=False, default=0.0)
    is_banned = db.Column(db.Boolean, nullable=False, default=False)
    reset_token = db.Column(db.String(255), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    vehicles = db.relationship('Vehicle', backref='owner', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='renter', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {'id': self.id, 'email': self.email, 'username': self.username, 'name': self.name, 'phone': self.phone, 'role': self.role, 'license_number': self.license_number, 'rental_intent': self.rental_intent, 'verification_status': self.verification_status, 'rating': self.rating, 'is_banned': self.is_banned, 'created_at': self.created_at.isoformat() if self.created_at else None}

    def __repr__(self):
        return f'<User {self.id} {self.email} ({self.role})>'
