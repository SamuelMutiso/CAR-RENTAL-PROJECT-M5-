from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, g
import jwt
from sqlalchemy.exc import IntegrityError
from extensions import db, bcrypt, logger
from config import Config
from models import Driver
from utils.decorators import admin_required, driver_required
from schemas import driver_schema, drivers_schema
drivers_bp = Blueprint('drivers', __name__)

def _make_driver_token(driver):
    payload = {'driver_id': driver.id, 'type': 'driver', 'exp': datetime.utcnow() + Config.JWT_EXPIRY}
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

@drivers_bp.route('/drivers', methods=['GET'])
def list_drivers():
    drivers = Driver.query.filter_by(is_available=True).order_by(Driver.rating.desc()).all()
    return (jsonify(drivers_schema.dump(drivers)), 200)

@drivers_bp.route('/drivers', methods=['POST'])
@admin_required
def create_driver():
    try:
        data = request.get_json() or {}
        if not data.get('name') or not data.get('daily_rate'):
            return (jsonify({'error': 'name and daily_rate are required'}), 400)
        if data.get('email') and Driver.query.filter_by(email=data['email'].strip().lower()).first():
            return (jsonify({'errors': {'email': ['A driver with that email already exists']}}), 409)
        driver = Driver(name=data['name'], rating=data.get('rating', 4.0), daily_rate=data['daily_rate'], phone=data.get('phone'), license_number=data.get('license_number'), bio=data.get('bio'))
        if data.get('email') and data.get('password'):
            driver.email = data['email'].strip().lower()
            driver.password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        db.session.add(driver)
        db.session.commit()
        return (jsonify(driver_schema.dump(driver)), 201)
    except IntegrityError:
        db.session.rollback()
        logger.error('Create driver integrity error')
        return (jsonify({'errors': {'email': ['A driver with that email already exists']}}), 409)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Create driver error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@drivers_bp.route('/driver-login', methods=['POST'])
def driver_login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    driver = Driver.query.filter_by(email=email).first()
    if not driver or not driver.password_hash or (not bcrypt.check_password_hash(driver.password_hash, password or '')):
        return (jsonify({'error': 'Invalid email or password'}), 401)
    token = _make_driver_token(driver)
    return (jsonify({'token': token, 'driver': driver_schema.dump(driver)}), 200)

@drivers_bp.route('/driver/me', methods=['GET'])
@driver_required
def get_driver_me():
    return (jsonify(driver_schema.dump(g.current_driver)), 200)