from flask import Blueprint, request, jsonify
from extensions import db, logger
from models import Feature
from utils.decorators import jwt_required, admin_required
from schemas import feature_schema, features_schema
features_bp = Blueprint('features', __name__)

@features_bp.route('/features', methods=['GET'])
def list_features():
    features = Feature.query.order_by(Feature.name).all()
    return (jsonify(features_schema.dump(features)), 200)

@features_bp.route('/features', methods=['POST'])
@jwt_required
def create_feature():
    try:
        data = request.get_json() or {}
        if not data.get('name'):
            return (jsonify({'error': 'name is required'}), 400)
        feature = Feature(name=data['name'], icon=data.get('icon'), description=data.get('description'), category=data.get('category'))
        db.session.add(feature)
        db.session.commit()
        return (jsonify(feature_schema.dump(feature)), 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Create feature error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@features_bp.route('/features/<int:feature_id>', methods=['PUT'])
@jwt_required
def update_feature(feature_id):
    try:
        feature = db.session.get(Feature, feature_id)
        if not feature:
            return (jsonify({'error': 'Feature not found'}), 404)
        data = request.get_json() or {}
        for field in ['name', 'icon', 'description', 'category']:
            if field in data:
                setattr(feature, field, data[field])
        db.session.commit()
        return (jsonify(feature_schema.dump(feature)), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Update feature error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@features_bp.route('/features/<int:feature_id>', methods=['DELETE'])
@admin_required
def delete_feature(feature_id):
    try:
        feature = db.session.get(Feature, feature_id)
        if not feature:
            return (jsonify({'error': 'Feature not found'}), 404)
        db.session.delete(feature)
        db.session.commit()
        return (jsonify({'message': 'Feature deleted'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Delete feature error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)