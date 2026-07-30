import secrets
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, g
import jwt
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from extensions import db, bcrypt, logger
from config import Config
from models import User
from utils.decorators import jwt_required
from schemas import user_schema, register_schema, login_schema
auth_bp = Blueprint('auth', __name__)

def _make_token(user):
    payload = {'user_id': user.id, 'role': user.role, 'exp': datetime.utcnow() + Config.JWT_EXPIRY}
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        try:
            validated_data = register_schema.load(data)
        except ValidationError as err:
            logger.info(f'Register validation error: {err.messages}')
            return (jsonify({'errors': err.messages}), 400)
        email = validated_data['email'].strip().lower()
        if User.query.filter_by(email=email).first():
            return (jsonify({'errors': {'email': ['An account with that email already exists']}}), 409)
        password_hash = bcrypt.generate_password_hash(validated_data['password']).decode('utf-8')
        user = User(email=email, password_hash=password_hash, role=validated_data.get('role', 'client'), rental_intent=validated_data.get('rental_intent', 'both'))
        db.session.add(user)
        db.session.commit()
        token = _make_token(user)
        return (jsonify({'token': token, 'user': user_schema.dump(user)}), 201)
    except IntegrityError:
        db.session.rollback()
        logger.error('Register integrity error: a user with that email already exists')
        return (jsonify({'errors': {'email': ['An account with that email already exists']}}), 409)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Register error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        try:
            validated_data = login_schema.load(data)
        except ValidationError as err:
            logger.info(f'Login validation error: {err.messages}')
            return (jsonify({'errors': err.messages}), 400)
        email = validated_data['email'].strip().lower()
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, validated_data['password']):
            return (jsonify({'error': 'Invalid email or password'}), 401)
        if user.is_banned:
            return (jsonify({'error': 'This account has been banned'}), 403)
        token = _make_token(user)
        return (jsonify({'token': token, 'user': user_schema.dump(user)}), 200)
    except Exception as e:
        logger.error(f'Login error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@auth_bp.route('/auth/google', methods=['POST'])
def google_login():
    try:
        data = request.get_json() or {}
        credential = data.get('credential')
        if not credential:
            return (jsonify({'error': 'credential is required'}), 400)
        if not Config.GOOGLE_CLIENT_ID:
            return (jsonify({'error': 'Google sign-in is not configured on this server'}), 500)
        try:
            idinfo = google_id_token.verify_oauth2_token(credential, google_requests.Request(), Config.GOOGLE_CLIENT_ID)
        except ValueError:
            return (jsonify({'error': 'Invalid Google credential'}), 401)
        if not idinfo.get('email_verified', False):
            return (jsonify({'error': 'Google email is not verified'}), 401)
        email = (idinfo.get('email') or '').strip().lower()
        if not email:
            return (jsonify({'error': 'Google account has no email'}), 400)
        user = User.query.filter_by(email=email).first()
        if not user:
            password_hash = bcrypt.generate_password_hash(secrets.token_urlsafe(24)).decode('utf-8')
            user = User(email=email, password_hash=password_hash, role='client', rental_intent='both', verification_status='verified')
            db.session.add(user)
            db.session.commit()
        if user.is_banned:
            return (jsonify({'error': 'This account has been banned'}), 403)
        token = _make_token(user)
        return (jsonify({'token': token, 'user': user_schema.dump(user)}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Google login error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@auth_bp.route('/me', methods=['GET'])
@jwt_required
def get_me():
    return (jsonify(user_schema.dump(g.current_user)), 200)

@auth_bp.route('/me', methods=['PUT'])
@jwt_required
def update_me():
    try:
        data = request.get_json() or {}
        user = g.current_user
        if 'license_number' in data:
            user.license_number = data['license_number']
        if 'rental_intent' in data and data['rental_intent'] in ('renter', 'owner', 'both'):
            user.rental_intent = data['rental_intent']
        if 'email' in data and data['email']:
            new_email = data['email'].strip().lower()
            existing = User.query.filter(User.email == new_email, User.id != user.id).first()
            if existing:
                return (jsonify({'errors': {'email': ['That email is already in use']}}), 409)
            user.email = new_email
        db.session.commit()
        return (jsonify(user_schema.dump(user)), 200)
    except IntegrityError:
        db.session.rollback()
        logger.error('Update profile integrity error: that email is already in use')
        return (jsonify({'errors': {'email': ['That email is already in use']}}), 409)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Update profile error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@auth_bp.route('/me/password', methods=['PUT'])
@jwt_required
def change_password():
    try:
        data = request.get_json() or {}
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        if not current_password or not new_password:
            return (jsonify({'error': 'current_password and new_password are required'}), 400)
        if len(new_password) < 5:
            return (jsonify({'errors': {'new_password': ['Password must be at least 5 characters']}}), 400)
        user = g.current_user
        if not bcrypt.check_password_hash(user.password_hash, current_password):
            return (jsonify({'error': 'Current password is incorrect'}), 401)
        user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return (jsonify({'message': 'Password updated successfully'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Change password error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@auth_bp.route('/reset-password', methods=['POST'])
def request_reset():
    try:
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        user = User.query.filter_by(email=email).first()
        if not user:
            return (jsonify({'message': 'If that email exists, a reset token was generated'}), 200)
        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        return (jsonify({'message': 'Reset token generated', 'reset_token': token}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Password reset request error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@auth_bp.route('/reset-password/confirm', methods=['POST'])
def confirm_reset():
    try:
        data = request.get_json() or {}
        token = data.get('token')
        new_password = data.get('new_password')
        if not token or not new_password:
            return (jsonify({'error': 'token and new_password are required'}), 400)
        if len(new_password) < 5:
            return (jsonify({'errors': {'new_password': ['Password must be at least 5 characters']}}), 400)
        user = User.query.filter_by(reset_token=token).first()
        if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
            return (jsonify({'error': 'Invalid or expired reset token'}), 400)
        user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()
        return (jsonify({'message': 'Password updated successfully'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Password reset confirm error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)
