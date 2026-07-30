from datetime import datetime
from extensions import db

class DriverApplication(db.Model):
    __tablename__ = 'driver_applications'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    id_number = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    license_number = db.Column(db.String(50), nullable=False)
    preferred_category = db.Column(db.String(30), nullable=False)
    cv_filename = db.Column(db.String(255), nullable=False)
    cv_original_name = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'full_name': self.full_name, 'id_number': self.id_number, 'email': self.email, 'phone': self.phone, 'license_number': self.license_number, 'preferred_category': self.preferred_category, 'cv_original_name': self.cv_original_name, 'status': self.status, 'created_at': self.created_at.isoformat() if self.created_at else None}

    def __repr__(self):
        return f'<DriverApplication {self.id} {self.full_name} ({self.status})>'
