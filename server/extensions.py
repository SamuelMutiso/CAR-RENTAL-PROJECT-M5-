import logging
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
db = SQLAlchemy()
bcrypt = Bcrypt()
cors = CORS()
migrate = Migrate()
ma = Marshmallow()
logger = logging.getLogger('gearshift')
logger.setLevel(logging.INFO)
if not logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter('[%(asctime)s] %(levelname)s in %(name)s: %(message)s'))
    logger.addHandler(_handler)