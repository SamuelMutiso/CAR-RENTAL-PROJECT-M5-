from flask import Blueprint, jsonify, g
from extensions import db, logger
from models import Notification
from utils.decorators import jwt_required
from schemas import notifications_schema
notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required
def list_notifications():
    items = Notification.query.filter_by(user_id=g.current_user.id).order_by(Notification.created_at.desc()).limit(50).all()
    unread_count = Notification.query.filter_by(user_id=g.current_user.id, is_read=False).count()
    return (jsonify({'notifications': notifications_schema.dump(items), 'unread_count': unread_count}), 200)

@notifications_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required
def mark_read(notification_id):
    try:
        notification = Notification.query.filter_by(id=notification_id, user_id=g.current_user.id).first()
        if not notification:
            return (jsonify({'error': 'Notification not found'}), 404)
        notification.is_read = True
        db.session.commit()
        return (jsonify({'message': 'Marked as read'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Mark notification read error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@notifications_bp.route('/notifications/read-all', methods=['PUT'])
@jwt_required
def mark_all_read():
    try:
        Notification.query.filter_by(user_id=g.current_user.id, is_read=False).update({'is_read': True})
        db.session.commit()
        return (jsonify({'message': 'All notifications marked as read'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Mark all notifications read error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)
