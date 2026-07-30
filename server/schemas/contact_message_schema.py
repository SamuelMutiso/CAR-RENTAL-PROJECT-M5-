from marshmallow import Schema, fields, validate
from extensions import ma
from models import ContactMessage

class ContactMessageSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = ContactMessage
        load_instance = True
        fields = ('id', 'full_name', 'email', 'phone', 'message', 'is_read', 'created_at')
contact_message_schema = ContactMessageSchema()
contact_messages_schema = ContactMessageSchema(many=True)

class ContactMessageInputSchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=1, error='Full name is required'))
    email = fields.Email(required=True, error_messages={'required': 'Email is required', 'invalid': 'Enter a valid email address'})
    phone = fields.String(required=False, allow_none=True)
    message = fields.String(required=True, validate=validate.Length(min=1, error='Message is required'))
contact_message_input_schema = ContactMessageInputSchema()
