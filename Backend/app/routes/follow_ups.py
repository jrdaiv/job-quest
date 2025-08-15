import traceback
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from app.services import follow_ups as follow_ups_svc
from app.database.models import schemas as s
from app.config.config import Config as cf
from app.config.caching import cache

app = Blueprint('follow_ups', __name__, url_prefix='/api/follow_ups')
# Create a Blueprint for follow_ups with a URL prefix.

@app.route('/register', methods=['POST'])
def create_follow_up():
    # Route to create a new follow_up.
    try:
        try:
            follow_up_data = s.follow_up_schema.load(request.json)
            # Load and validate follow_up data from the request.
            job_id = request.json.get('job_id')
            # Get job ID from the request.
            follow_up_saved = follow_ups_svc.create_follow_up(follow_up_data, job_id)
            # Save the new follow_up.
            return jsonify({'message': 'Follow up Created'}), 201
            # Return success response.
        except ValidationError as e:
            return jsonify(e.messages), 400
            # Return validation error response.
    except traceback:
        return jsonify(traceback, 500)
        # Return general error response.

@app.route('/all', methods=['GET'])
def get_all_follow_ups():
    # Route to get all follow_ups.
    all_follow_ups = follow_ups_svc.get_all_follow_ups()
    # Retrieve all follow_ups.
    return s.follow_ups_schema.jsonify(all_follow_ups), 200
    # Return the follow_ups in JSON format with a 200 status code.

@app.route("/<int:follow_up_id>", methods=['GET'])
def get_follow_up_by_id(follow_up_id):
    # Route to get an follow_up by its ID.
    follow_up = follow_ups_svc.get_follow_up_by_id(follow_up_id)
    # Retrieve the follow_up by its ID.
    return s.follow_up_schema.jsonify(follow_up), 200
    # Return the follow_up in JSON format with a 200 status code.

@app.route("/job/<int:job_id>", methods=['GET'])
def get_by_job_id(job_id):
    # Route to get follow_ups by job ID.
    follow_ups = follow_ups_svc.get_by_job_id(job_id)
    # Retrieve follow_ups by job ID.
    return s.follow_ups_schema.jsonify(follow_ups), 200
    # Return the follow_ups in JSON format with a 200 status code.

@app.route("/update-follow-up/<int:follow_up_id>", methods=['PUT'])
def update_follow_up(follow_up_id):
    # Route to update an follow_up by its ID.
    try:
        try:
            new_info = s.follow_up_schema.load(request.json, partial=True)
            # Load and validate new follow_up data from the request.
            response, status = follow_ups_svc.update_follow_up(follow_up_id, new_info)
            # Call the service to update the follow_up.
            return jsonify(response), status
            # Return the response and status.
        except ValidationError as e:
            return jsonify(e.messages), 400
            # Return validation error response.
    except traceback:
        return jsonify(traceback, 500)
        # Return general error response.

@app.route("/delete-follow-up/<int:follow_up_id>", methods=['DELETE'])
def delete_follow_up(follow_up_id):
    # Route to delete an follow_up by its ID.
    try:
        response = follow_ups_svc.delete_follow_up(follow_up_id)
        # Call the service to delete the follow_up.
        return jsonify(response), 200
        # Return success response.
    except traceback:
        return jsonify(traceback, 500)
        # Return general error response.