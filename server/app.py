from flask import Flask, jsonify
from config import Config
from extensions import db, bcrypt, cors, migrate, ma

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={'/*': {'origins': Config.CORS_ORIGINS}})
    migrate.init_app(app, db)
    ma.init_app(app)
    from routes.auth import auth_bp
    from routes.vehicles import vehicles_bp
    from routes.features import features_bp
    from routes.drivers import drivers_bp
    from routes.driver_applications import driver_applications_bp
    from routes.bookings import bookings_bp
    from routes.admin import admin_bp
    from routes.contact import contact_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicles_bp)
    app.register_blueprint(features_bp)
    app.register_blueprint(drivers_bp)
    app.register_blueprint(driver_applications_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(contact_bp)

    @app.route('/')
    def health_check():
        return jsonify({'status': 'ok', 'message': 'GearShift API is running'})
    return app
app = create_app()
if __name__ == '__main__':
    app.run(debug=True, port=5000)