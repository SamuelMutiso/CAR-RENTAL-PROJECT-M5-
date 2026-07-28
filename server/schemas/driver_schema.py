from marshmallow import Schema, fields, validate
from extensions import ma
from models import DriverApplication

class DriverApplicationSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = DriverApplication
        load_instance = True
        fields = ('id', 'full_name', 'id_number', 'email', 'phone', 'license_number', 'preferred_category', 'cv_original_name', 'status', 'created_at')
driver_application_schema = DriverApplicationSchema()
driver_applications_schema = DriverApplicationSchema(many=True)

class DriverApplicationInputSchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=1, error='Full name is required'))
    id_number = fields.String(required=True, validate=validate.Length(min=1, error='ID number is required'))
    email = fields.Email(required=True, error_messages={'required': 'Email is required', 'invalid': 'Enter a valid email address'})
    phone = fields.String(required=True, validate=validate.Length(min=10, error='Enter a valid phone number'))
    license_number = fields.String(required=True, validate=validate.Length(min=1, error='License number is required'))
    preferred_category = fields.String(required=True, validate=validate.Length(min=1, error='Preferred category is required'))
driver_application_input_schema = DriverApplicationInputSchema()
