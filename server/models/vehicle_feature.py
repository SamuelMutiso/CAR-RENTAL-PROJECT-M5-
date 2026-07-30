from extensions import db
vehicle_features = db.Table('vehicle_features', db.Column('vehicle_id', db.Integer, db.ForeignKey('vehicles.id'), primary_key=True), db.Column('feature_id', db.Integer, db.ForeignKey('features.id'), primary_key=True))
