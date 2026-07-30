from extensions import db

class Driver(db.Model):
    __tablename__ = 'drivers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Float, nullable=False, default=4.0)
    daily_rate = db.Column(db.Float, nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    license_number = db.Column(db.String(50), nullable=True)
    bio = db.Column(db.String(255), nullable=True)
    is_available = db.Column(db.Boolean, nullable=False, default=True)
    email = db.Column(db.String(255), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=True)
    bookings = db.relationship('Booking', backref='driver', lazy=True)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'rating': self.rating, 'daily_rate': self.daily_rate, 'phone': self.phone, 'license_number': self.license_number, 'bio': self.bio, 'is_available': self.is_available, 'email': self.email}

    def __repr__(self):
        return f'<Driver {self.id} {self.name} ({self.rating}/5)>'