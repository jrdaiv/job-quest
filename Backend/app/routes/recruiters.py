import traceback
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from app.services import recruiters as recruiter_svc
from app.database.models import schemas as s

app = Blueprint('recruiters', __name__, url_prefix='/api/recruiters')

@app.route('/register', methods=['POST'])
def create_recruiter():
    try:
        recruiter_data = s.recruiter_schema.load(request.json)
        recruiter_saved = recruiter_svc.create_recruiter(recruiter_data)
        return jsonify({'message': 'Recruiter Created'}), 201
    except ValidationError as e:
        return jsonify(e.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/all', methods=['GET'])
def get_all_recruiters():
    all_recruiters = recruiter_svc.get_all_recruiters()
    return s.recruiters_schema.jsonify(all_recruiters), 200

@app.route("/<int:recruiter_id>", methods=['GET'])
def get_recruiter_by_id(recruiter_id):
    recruiter = recruiter_svc.get_recruiter_by_id(recruiter_id)
    return s.recruiter_schema.jsonify(recruiter), 200

@app.route("/update/<int:recruiter_id>", methods=['PUT'])
def update_recruiter(recruiter_id):
    try:
        new_info = s.recruiter_schema.load(request.json, partial=True)
        response = recruiter_svc.update_recruiter(recruiter_id, new_info)
        return jsonify(response), 200
    except ValidationError as e:
        return jsonify(e.messages), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/delete/<int:recruiter_id>", methods=['DELETE'])
def delete_recruiter(recruiter_id):
    try:
        response = recruiter_svc.delete_recruiter(recruiter_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500