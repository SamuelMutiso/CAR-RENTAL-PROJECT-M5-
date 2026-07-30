from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from extensions import db, logger
from models import ContactMessage
from utils.decorators import admin_required
from schemas import contact_message_schema, contact_messages_schema, contact_message_input_schema
contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def create_contact_message():
    try:
        data = request.get_json() or {}
        try:
            validated_data = contact_message_input_schema.load(data)
        except ValidationError as err:
            logger.info(f'Create contact message validation error: {err.messages}')
            return (jsonify({'errors': err.messages}), 400)
        contact_message = ContactMessage(**validated_data)
        db.session.add(contact_message)
        db.session.commit()
        return (jsonify(contact_message_schema.dump(contact_message)), 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Create contact message error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@contact_bp.route('/admin/contact-messages', methods=['GET'])
@admin_required
def list_contact_messages():
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return (jsonify(contact_messages_schema.dump(messages)), 200)

@contact_bp.route('/admin/contact-messages/<int:message_id>', methods=['PUT'])
@admin_required
def update_contact_message(message_id):
    try:
        contact_message = db.session.get(ContactMessage, message_id)
        if not contact_message:
            return (jsonify({'error': 'Message not found'}), 404)
        data = request.get_json() or {}
        if 'is_read' in data:
            contact_message.is_read = bool(data['is_read'])
        db.session.commit()
        return (jsonify(contact_message_schema.dump(contact_message)), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Update contact message error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@contact_bp.route('/admin/contact-messages/<int:message_id>', methods=['DELETE'])
@admin_required
def delete_contact_message(message_id):
    try:
        contact_message = db.session.get(ContactMessage, message_id)
        if not contact_message:
            return (jsonify({'error': 'Message not found'}), 404)
        db.session.delete(contact_message)
        db.session.commit()
        return (jsonify({'message': 'Message deleted'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Delete contact message error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)
