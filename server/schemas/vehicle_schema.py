from marshmallow import Schema, fields, validate
from extensions import ma
from models import Vehicle
from .feature_schema import FeatureSchema

class VehicleSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Vehicle
        load_instance = True
        include_fk = True
        fields = ('id', 'make', 'model', 'year', 'daily_rate', 'location', 'is_available', 'image_url', 'description', 'category', 'condition', 'mileage', 'fuel_type', 'transmission', 'drive', 'exterior_color', 'is_approved', 'owner_id', 'created_at', 'owner_name', 'owner_rating', 'features')
    owner_name = ma.Method('get_owner_name')
    owner_rating = ma.Method('get_owner_rating')
    features = ma.Nested(FeatureSchema, many=True)

    def get_owner_name(self, vehicle):
        return vehicle.owner.email.split('@')[0] if vehicle.owner else None

    def get_owner_rating(self, vehicle):
        return vehicle.owner.rating if vehicle.owner else None
vehicle_schema = VehicleSchema()
vehicles_schema = VehicleSchema(many=True)
vehicle_list_schema = VehicleSchema(many=True, exclude=('features',))

class VehicleInputSchema(Schema):
    make = fields.String(required=True, validate=validate.Length(min=1, error='Make is required'))
    model = fields.String(required=True, validate=validate.Length(min=1, error='Model is required'))
    year = fields.Integer(required=True, validate=validate.Range(min=1980, max=2100, error='Enter a valid year'))
    daily_rate = fields.Float(required=True, validate=validate.Range(min=1, error='Daily rate must be greater than 0'))
    location = fields.String(required=True, validate=validate.Length(min=1, error='Location is required'))
    category = fields.String(required=True, validate=validate.Length(min=1, error='Category is required'))
    image_url = fields.String(required=False, allow_none=True)
    description = fields.String(required=False, allow_none=True)
    condition = fields.String(required=False, load_default='Used')
    mileage = fields.Integer(required=False, load_default=0, validate=validate.Range(min=0, error='Mileage cannot be negative'))
    fuel_type = fields.String(required=False, load_default='Petrol')
    transmission = fields.String(required=False, load_default='Automatic')
    drive = fields.String(required=False, load_default='FWD')
    exterior_color = fields.String(required=False, load_default='White')
    features = fields.List(fields.Integer(), required=False, load_default=[])
vehicle_input_schema = VehicleInputSchema()

class VehicleUpdateSchema(Schema):
    make = fields.String(required=False, validate=validate.Length(min=1))
    model = fields.String(required=False, validate=validate.Length(min=1))
    year = fields.Integer(required=False, validate=validate.Range(min=1980, max=2100))
    daily_rate = fields.Float(required=False, validate=validate.Range(min=1))
    location = fields.String(required=False, validate=validate.Length(min=1))
    category = fields.String(required=False, validate=validate.Length(min=1))
    image_url = fields.String(required=False, allow_none=True)
    description = fields.String(required=False, allow_none=True)
    is_available = fields.Boolean(required=False)
    condition = fields.String(required=False)
    mileage = fields.Integer(required=False, validate=validate.Range(min=0))
    fuel_type = fields.String(required=False)
    transmission = fields.String(required=False)
    drive = fields.String(required=False)
    exterior_color = fields.String(required=False)
    features = fields.List(fields.Integer(), required=False)
vehicle_update_schema = VehicleUpdateSchema()