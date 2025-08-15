import traceback
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from app.config.caching import cache
from app.database.models import schemas as s
from app.services import jobs as jobs_svc
from app.config.config import Config as cf
import logging

app = Blueprint('jobs', __name__, url_prefix='/api/jobs')
# Create a Blueprint for jobs with a URL prefix.

def should_force_update():
    return request.args.get('forced_update', 'false').lower() == 'true'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/register', methods=['POST'])
def create_job():
    # Route to create a new job
    try:
        job_data = s.job_schema.load(request.json)
        # Load and validate job data from the request.
        job_saved = jobs_svc.create_job(job_data)
        # Save the new job.
        return jsonify({'message': 'Job Created'}), 201
        # Return success response.
    except ValidationError as e:
        logger.error(f"Validation error: {e.messages}")
        return jsonify(e.messages), 400
        # Return validation error response.
    except Exception as e:
        logger.error(f"Internal server error: {str(e)}")
        return jsonify({'error': str(e)}), 500
        # Return general error response.

@app.route('/all', methods=['GET'])
@cache.cached(timeout=60)
def get_all():
    # Route to get all jobs.
    all_jobs = jobs_svc.get_all()
    # Retrieve all jobs.
    return s.jobs_schema.jsonify(all_jobs), 200
    # Return the jobs in JSON format with a 200 status code.

@app.route("/<int:job_id>", methods=['GET'])
def get_by_id(job_id):
    # Route to get a job by its ID.
    job = jobs_svc.get_by_id(job_id)
    # Retrieve the job by its ID.
    return s.job_schema.jsonify(job), 200
    # Return the job in JSON format with a 200 status code.

@app.route('/<int:user_id>/all', methods=['GET'])
@cache.cached(timeout=60, forced_update=should_force_update)
def get_by_user_id(user_id):
    # Route to get all jobs.
    all_jobs = jobs_svc.get_by_user_id(user_id)
    # Retrieve all jobs.
    return s.jobs_schema.jsonify(all_jobs), 200
    # Return the jobs in JSON format with a 200 status code.

@app.route("/update-job/<int:job_id>", methods=['PUT'])
def update_job(job_id):
    # Route to update a job by its ID.
    try:
        new_info = s.job_schema.load(request.json, partial=True)
        # Load and validate new job data from the request.
        response, status = jobs_svc.update_job(job_id, new_info)
        # Call the service to update the job.
        return jsonify(response), status
        # Return the response and status.
    except ValidationError as e:
        return jsonify(e.messages), 400
        # Return the validation error response
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        # Return general error response.

@app.route("/delete-job/<int:job_id>", methods=['DELETE'])
def delete_job(job_id):
    # Route to delete a job by its ID.
    try:
        return jobs_svc.delete_job(job_id)
        # Call the service to delete the job.
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        # Return general error response.