import os
import uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from marshmallow import ValidationError
from extensions import db, logger
from models import DriverApplication
from utils.decorators import admin_required
from schemas import driver_application_schema, driver_applications_schema, driver_application_input_schema
driver_applications_bp = Blueprint('driver_applications', __name__)
ALLOWED_CV_EXTENSIONS = {'pdf', 'doc', 'docx'}

def _allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_CV_EXTENSIONS

@driver_applications_bp.route('/driver-applications', methods=['POST'])
def create_driver_application():
    try:
        try:
            validated_data = driver_application_input_schema.load(request.form.to_dict())
        except ValidationError as err:
            logger.info(f'Driver application validation error: {err.messages}')
            return (jsonify({'errors': err.messages}), 400)
        if 'cv' not in request.files or request.files['cv'].filename == '':
            return (jsonify({'error': 'A CV file is required'}), 400)
        cv_file = request.files['cv']
        if not _allowed_file(cv_file.filename):
            return (jsonify({'error': 'CV must be a PDF, DOC, or DOCX file'}), 400)
        original_name = secure_filename(cv_file.filename)
        stored_name = f'{uuid.uuid4().hex}_{original_name}'
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        cv_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], stored_name))
        application = DriverApplication(cv_filename=stored_name, cv_original_name=original_name, **validated_data)
        db.session.add(application)
        db.session.commit()
        return (jsonify(driver_application_schema.dump(application)), 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Create driver application error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@driver_applications_bp.route('/admin/driver-applications', methods=['GET'])
@admin_required
def list_driver_applications():
    query = DriverApplication.query.order_by(DriverApplication.created_at.desc())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    return (jsonify({'applications': driver_applications_schema.dump(paginated.items), 'page': paginated.page, 'per_page': paginated.per_page, 'total': paginated.total, 'total_pages': paginated.pages}), 200)

@driver_applications_bp.route('/admin/driver-applications/<int:application_id>', methods=['PUT'])
@admin_required
def update_driver_application(application_id):
    try:
        application = db.session.get(DriverApplication, application_id)
        if not application:
            return (jsonify({'error': 'Application not found'}), 404)
        data = request.get_json() or {}
        if data.get('status') in ('pending', 'approved', 'rejected'):
            application.status = data['status']
        db.session.commit()
        return (jsonify(driver_application_schema.dump(application)), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Update driver application error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@driver_applications_bp.route('/admin/driver-applications/<int:application_id>/cv', methods=['GET'])
@admin_required
def download_cv(application_id):
    application = db.session.get(DriverApplication, application_id)
    if not application:
        return (jsonify({'error': 'Application not found'}), 404)
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], application.cv_filename, as_attachment=True, download_name=application.cv_original_name or application.cv_filename)
