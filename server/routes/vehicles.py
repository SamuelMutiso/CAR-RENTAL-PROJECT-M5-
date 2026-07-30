from flask import Blueprint, request, jsonify, g
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from extensions import db, logger
from models import Vehicle, Feature
from utils.decorators import jwt_required, admin_required
from schemas import vehicle_schema, vehicles_schema, vehicle_input_schema, vehicle_update_schema
vehicles_bp = Blueprint('vehicles', __name__)

@vehicles_bp.route('/vehicles', methods=['GET'])
def list_vehicles():
    query = Vehicle.query.filter_by(is_approved=True, is_available=True)
    location = request.args.get('location')
    if location:
        query = query.filter(Vehicle.location == location)
    category = request.args.get('category')
    if category:
        query = query.filter(Vehicle.category == category)
    min_rate = request.args.get('min_rate')
    if min_rate:
        query = query.filter(Vehicle.daily_rate >= float(min_rate))
    max_rate = request.args.get('max_rate')
    if max_rate:
        query = query.filter(Vehicle.daily_rate <= float(max_rate))
    condition = request.args.get('condition')
    if condition:
        query = query.filter(Vehicle.condition == condition)
    make = request.args.get('make')
    if make:
        query = query.filter(Vehicle.make == make)
    model = request.args.get('model')
    if model:
        query = query.filter(Vehicle.model == model)
    max_mileage = request.args.get('max_mileage')
    if max_mileage:
        query = query.filter(Vehicle.mileage <= int(max_mileage))
    fuel_type = request.args.get('fuel_type')
    if fuel_type:
        query = query.filter(Vehicle.fuel_type == fuel_type)
    year = request.args.get('year')
    if year:
        query = query.filter(Vehicle.year == int(year))
    transmission = request.args.get('transmission')
    if transmission:
        query = query.filter(Vehicle.transmission == transmission)
    drive = request.args.get('drive')
    if drive:
        query = query.filter(Vehicle.drive == drive)
    exterior_color = request.args.get('exterior_color')
    if exterior_color:
        query = query.filter(Vehicle.exterior_color == exterior_color)
    keyword = request.args.get('q')
    if keyword:
        like = f'%{keyword}%'
        query = query.filter(db.or_(Vehicle.make.ilike(like), Vehicle.model.ilike(like), Vehicle.description.ilike(like)))
    query = query.order_by(Vehicle.created_at.desc())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    return (jsonify({'vehicles': vehicles_schema.dump(paginated.items), 'page': paginated.page, 'per_page': paginated.per_page, 'total': paginated.total, 'total_pages': paginated.pages}), 200)

@vehicles_bp.route('/vehicles/mine', methods=['GET'])
@jwt_required
def my_vehicles():
    vehicles = Vehicle.query.filter_by(owner_id=g.current_user.id).order_by(Vehicle.created_at.desc()).all()
    return (jsonify(vehicles_schema.dump(vehicles)), 200)

@vehicles_bp.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = db.session.get(Vehicle, vehicle_id)
    if not vehicle:
        return (jsonify({'error': 'Vehicle not found'}), 404)
    return (jsonify(vehicle_schema.dump(vehicle)), 200)

@vehicles_bp.route('/vehicles', methods=['POST'])
@jwt_required
def create_vehicle():
    try:
        data = request.get_json() or {}
        try:
            validated_data = vehicle_input_schema.load(data)
        except ValidationError as err:
            logger.info(f'Create vehicle validation error: {err.messages}')
            return (jsonify({'errors': err.messages}), 400)
        feature_ids = validated_data.pop('features', [])
        vehicle = Vehicle(owner_id=g.current_user.id, is_approved=False, **validated_data)
        if feature_ids:
            vehicle.features = Feature.query.filter(Feature.id.in_(feature_ids)).all()
        db.session.add(vehicle)
        db.session.commit()
        return (jsonify(vehicle_schema.dump(vehicle)), 201)
    except IntegrityError:
        db.session.rollback()
        logger.error('Create vehicle integrity error')
        return (jsonify({'error': 'Could not save this listing - check the details and try again'}), 409)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Create vehicle error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@vehicles_bp.route('/vehicles/<int:vehicle_id>', methods=['PUT'])
@jwt_required
def update_vehicle(vehicle_id):
    try:
        vehicle = db.session.get(Vehicle, vehicle_id)
        if not vehicle:
            return (jsonify({'error': 'Vehicle not found'}), 404)
        if vehicle.owner_id != g.current_user.id:
            return (jsonify({'error': 'You do not own this listing'}), 403)
        data = request.get_json() or {}
        try:
            validated_data = vehicle_update_schema.load(data, partial=True)
        except ValidationError as err:
            logger.info(f'Update vehicle validation error: {err.messages}')
            return (jsonify({'errors': err.messages}), 400)
        feature_ids = validated_data.pop('features', None)
        for field, value in validated_data.items():
            setattr(vehicle, field, value)
        if feature_ids is not None:
            vehicle.features = Feature.query.filter(Feature.id.in_(feature_ids)).all()
        db.session.commit()
        return (jsonify(vehicle_schema.dump(vehicle)), 200)
    except IntegrityError:
        db.session.rollback()
        logger.error('Update vehicle integrity error')
        return (jsonify({'error': 'Could not update this listing - check the details and try again'}), 409)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Update vehicle error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)

@vehicles_bp.route('/vehicles/<int:vehicle_id>', methods=['DELETE'])
@jwt_required
def delete_vehicle(vehicle_id):
    try:
        vehicle = db.session.get(Vehicle, vehicle_id)
        if not vehicle:
            return (jsonify({'error': 'Vehicle not found'}), 404)
        if vehicle.owner_id != g.current_user.id:
            return (jsonify({'error': 'You do not own this listing'}), 403)
        db.session.delete(vehicle)
        db.session.commit()
        return (jsonify({'message': 'Vehicle deleted'}), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Delete vehicle error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)


@vehicles_bp.route('/admin/vehicles', methods=['GET'])
@admin_required
def list_all_vehicles():
    query = Vehicle.query.order_by(Vehicle.created_at.desc())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 15, type=int)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    return (jsonify({'vehicles': vehicles_schema.dump(paginated.items), 'page': paginated.page, 'per_page': paginated.per_page, 'total': paginated.total, 'total_pages': paginated.pages}), 200)

@vehicles_bp.route('/admin/vehicles/<int:vehicle_id>', methods=['PUT'])
@admin_required
def review_vehicle(vehicle_id):
    try:
        vehicle = db.session.get(Vehicle, vehicle_id)
        if not vehicle:
            return (jsonify({'error': 'Vehicle not found'}), 404)
        data = request.get_json() or {}
        if 'is_approved' in data:
            vehicle.is_approved = bool(data['is_approved'])
        db.session.commit()
        return (jsonify(vehicle_schema.dump(vehicle)), 200)
    except Exception as e:
        db.session.rollback()
        logger.error(f'Review vehicle error: {e}')
        return (jsonify({'error': 'Internal server error'}), 500)