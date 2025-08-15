import traceback
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from app.services import hiring_managers as hiring_manager_svc
from app.database.models import schemas as s

app = Blueprint('hiring_managers', __name__, url_prefix='/api/hiring_managers')

@app.route('/register', methods=['POST'])
def create_hiring_manager():
    try:
        hiring_manager_data = s.hiring_manager_schema.load(request.json)
        hiring_manager_saved = hiring_manager_svc.create_hiring_manager(hiring_manager_data)
        return jsonify({'message': 'Hiring Manager Created'}), 201
    except ValidationError as e:
        return jsonify(e.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/all', methods=['GET'])
def get_all_hiring_managers():
    all_hiring_managers = hiring_manager_svc.get_all_hiring_managers()
    return s.hiring_managers_schema.jsonify(all_hiring_managers), 200

@app.route("/<int:hiring_manager_id>", methods=['GET'])
def get_hiring_manager_by_id(hiring_manager_id):
    hiring_manager = hiring_manager_svc.get_hiring_manager_by_id(hiring_manager_id)
    return s.hiring_manager_schema.jsonify(hiring_manager), 200

@app.route("/update/<int:hiring_manager_id>", methods=['PUT'])
def update_hiring_manager(hiring_manager_id):
    try:
        new_info = s.hiring_manager_schema.load(request.json, partial=True)
        response = hiring_manager_svc.update_hiring_manager(hiring_manager_id, new_info)
        return jsonify(response), 200
    except ValidationError as e:
        return jsonify(e.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/delete/<int:hiring_manager_id>", methods=['DELETE'])
def delete_hiring_manager(hiring_manager_id):
    try:
        response = hiring_manager_svc.delete_hiring_manager(hiring_manager_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500