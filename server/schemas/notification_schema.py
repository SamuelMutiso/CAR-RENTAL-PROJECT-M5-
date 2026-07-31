from extensions import ma
from models import Notification

class NotificationSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Notification
        load_instance = True
        include_fk = True
        fields = ('id', 'type', 'title', 'message', 'booking_id', 'is_read', 'simulated_email_sent', 'simulated_sms_sent', 'created_at')
notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)
