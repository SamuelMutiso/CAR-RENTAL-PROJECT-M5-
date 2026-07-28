from functools import wraps
from flask import request, g, jsonify
import jwt
from extensions import db
from config import Config
from models import User, Driver

def _decode_token(token):
    try:
        return jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
    except jwt.PyJWTError:
        return None

def jwt_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return (jsonify({'error': 'Unauthorized'}), 401)
        token = auth_header.split(' ', 1)[1]
        payload = _decode_token(token)
        if not payload:
            return (jsonify({'error': 'Unauthorized'}), 401)
        user = db.session.get(User, payload.get('user_id'))
        if not user:
            return (jsonify({'error': 'Unauthorized'}), 401)
        if user.is_banned:
            return (jsonify({'error': 'Account banned'}), 403)
        g.current_user = user
        return fn(*args, **kwargs)
    return wrapper

def admin_required(fn):

    @wraps(fn)
    @jwt_required
    def wrapper(*args, **kwargs):
        if g.current_user.role != 'admin':
            return (jsonify({'error': 'Forbidden'}), 403)
        return fn(*args, **kwargs)
    return wrapper

def driver_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return (jsonify({'error': 'Unauthorized'}), 401)
        token = auth_header.split(' ', 1)[1]
        payload = _decode_token(token)
        if not payload or payload.get('type') != 'driver':
            return (jsonify({'error': 'Unauthorized'}), 401)
        driver = db.session.get(Driver, payload.get('driver_id'))
        if not driver:
            return (jsonify({'error': 'Unauthorized'}), 401)
        g.current_driver = driver
        return fn(*args, **kwargs)
    return wrapper