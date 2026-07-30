from datetime import datetime
from extensions import db

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'full_name': self.full_name, 'email': self.email, 'phone': self.phone, 'message': self.message, 'is_read': self.is_read, 'created_at': self.created_at.isoformat() if self.created_at else None}

    def __repr__(self):
        return f'<ContactMessage {self.id} {self.full_name}>'
