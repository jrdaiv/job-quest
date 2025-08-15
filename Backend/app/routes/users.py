import traceback
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from ..config.caching import cache
from app.database.models import schemas as s
from app.services import users as users_svc
from app.config.config import Config as cf
from app.services.emails import send_signup_email 

app = Blueprint('users', __name__, url_prefix='/api/users')

@app.route('/register', methods=['POST'])
def create_user():
    try:
        user_data = s.user_schema.load(request.json)
        user_saved = users_svc.create_user(user_data)
        
        # Send the signup email after the user is created
        # send_signup_email(user_saved.email, user_saved.name)
        
        return jsonify({'message': 'User Created'}), 201
    except ValidationError as e:
        return jsonify(e.messages), 400
    except ValueError as e:
        return jsonify({'error': str(e)}), 400 
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/all-users', methods=['GET'])
@cache.cached(timeout=60)
def get_users():
    all_users = users_svc.get_all()
    return s.users_schema.jsonify(all_users), 200

@app.route('/<int:user_id>')
def get_by_id(user_id):
    user = users_svc.get_by_id(user_id)
    return s.user_schema.jsonify(user), 200

@app.route('/update-user/<int:user_id>', methods=['POST'])
def update_user(user_id):
    try:
        try:
            new_info = s.user_schema.load(request.json, partial=True)
            response, status = users_svc.update_user(user_id, new_info)    
            return jsonify(response), status
        except ValidationError as e:
            return jsonify(e.messages), 400
    except traceback:

        return jsonify(traceback, 500)


@app.route('/delete-user/<int:user_id>', methods=['DELETE'])
def delete(user_id):
    try:
        return users_svc.delete(user_id)
    except traceback:
        return jsonify(traceback, 500)
    
@app.route('/test')
def test():
    return "Test route is working"