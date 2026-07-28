from marshmallow import Schema, fields, validate
from extensions import ma
from models import User

class UserSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = User
        load_instance = True
        fields = ('id', 'email', 'role', 'license_number', 'rental_intent', 'verification_status', 'rating', 'is_banned', 'created_at')
user_schema = UserSchema()
users_schema = UserSchema(many=True)

class RegisterSchema(Schema):
    email = fields.Email(required=True, error_messages={'required': 'Email is required', 'invalid': 'Enter a valid email address'})
    password = fields.String(required=True, validate=validate.Length(min=5, error='Password must be at least 5 characters'))
    role = fields.String(load_default='client', validate=validate.OneOf(['client', 'admin']))
    rental_intent = fields.String(load_default='both', validate=validate.OneOf(['renter', 'owner', 'both']))
register_schema = RegisterSchema()

class LoginSchema(Schema):
    email = fields.Email(required=True, error_messages={'required': 'Email is required', 'invalid': 'Enter a valid email address'})
    password = fields.String(required=True, error_messages={'required': 'Password is required'})
login_schema = LoginSchema()
