from extensions import ma
from models import Driver

class DriverSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Driver
        load_instance = True
        fields = ('id', 'name', 'rating', 'daily_rate', 'phone', 'license_number', 'bio', 'is_available', 'email')
driver_schema = DriverSchema()
drivers_schema = DriverSchema(many=True)
