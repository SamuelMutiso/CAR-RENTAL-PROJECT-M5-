from extensions import ma
from models import Feature

class FeatureSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Feature
        load_instance = True
        fields = ('id', 'name', 'icon', 'description', 'category')
feature_schema = FeatureSchema()
features_schema = FeatureSchema(many=True)