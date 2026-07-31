from datetime import datetime
from extensions import db

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(30), nullable=False, default='general')
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id', ondelete='SET NULL'), nullable=True)
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    simulated_email_sent = db.Column(db.Boolean, nullable=False, default=False)
    simulated_sms_sent = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref=db.backref('notifications', lazy=True, cascade='all, delete-orphan'))

    def to_dict(self):
        return {'id': self.id, 'type': self.type, 'title': self.title, 'message': self.message, 'booking_id': self.booking_id, 'is_read': self.is_read, 'simulated_email_sent': self.simulated_email_sent, 'simulated_sms_sent': self.simulated_sms_sent, 'created_at': self.created_at.isoformat() if self.created_at else None}

    def __repr__(self):
        return f'<Notification {self.id} user={self.user_id} {self.type}>'
