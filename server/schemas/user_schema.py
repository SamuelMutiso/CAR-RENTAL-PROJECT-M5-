from marshmallow import Schema, fields, validate
from extensions import ma
from models import User

class UserSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = User
        load_instance = True
        fields = ('id', 'email', 'username', 'name', 'phone', 'role', 'license_number', 'rental_intent', 'verification_status', 'rating', 'is_banned', 'created_at')
user_schema = UserSchema()
users_schema = UserSchema(many=True)

USERNAME_REGEX = r'^[a-zA-Z0-9_]{3,30}$'

class RegisterSchema(Schema):
    email = fields.Email(required=True, error_messages={'required': 'Email is required', 'invalid': 'Enter a valid email address'})
    username = fields.String(required=True, validate=validate.Regexp(USERNAME_REGEX, error='Usernames can only contain letters, numbers and underscores (3-30 characters)'), error_messages={'required': 'Username is required'})
    password = fields.String(required=True, validate=validate.Length(min=5, error='Password must be at least 5 characters'))
    name = fields.String(required=True, validate=validate.Length(min=2, error='Enter your full name'), error_messages={'required': 'Name is required'})
    phone = fields.String(required=True, validate=validate.Regexp(r'^\+254\d{9}$', error='Enter a valid phone number, e.g. +254712345678'), error_messages={'required': 'Phone number is required'})
    role = fields.String(load_default='client', validate=validate.OneOf(['client', 'admin']))
    rental_intent = fields.String(load_default='both', validate=validate.OneOf(['renter', 'owner', 'both']))
register_schema = RegisterSchema()

class LoginSchema(Schema):
    email = fields.Email(required=True, error_messages={'required': 'Email is required', 'invalid': 'Enter a valid email address'})
    password = fields.String(required=True, error_messages={'required': 'Password is required'})
login_schema = LoginSchema()
