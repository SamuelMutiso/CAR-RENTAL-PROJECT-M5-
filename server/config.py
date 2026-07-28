import os
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()

class Config:
    _database_url = os.environ.get('DATABASE_URL') or 'sqlite:///gearshift.db'
    if _database_url.startswith('postgres://'):
        _database_url = _database_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = _database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-change-me'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-secret-change-me'
    JWT_EXPIRY = timedelta(days=7)
    CORS_ORIGINS = [origin.strip() for origin in (os.environ.get('CORS_ORIGINS') or 'http://127.0.0.1:5173').split(',') if origin.strip()]
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads', 'cvs')
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024