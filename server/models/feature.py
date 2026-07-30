from extensions import db

class Feature(db.Model):
    __tablename__ = 'features'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(50), nullable=True)
    description = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'icon': self.icon, 'description': self.description, 'category': self.category}

    def __repr__(self):
        return f'<Feature {self.id} {self.name}>'