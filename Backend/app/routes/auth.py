from flask import Blueprint, jsonify, request, url_for
from app.database import models as m
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.database.database import database as db
from werkzeug.security import generate_password_hash, check_password_hash


app = Blueprint('auth', __name__, url_prefix='/api/auth')
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify(message="Email and password are required"), 400
     
    user = m.User.query.filter_by(email=data['email'].lower()).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={
            'id': user.id,
            'name': user.name,
            'email': user.email,        
            'reset_password': user.change_password
        })
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(message="Invalid email or password"), 401