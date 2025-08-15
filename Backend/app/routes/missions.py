# import traceback
# from flask import Blueprint, jsonify, request
# from marshmallow import ValidationError
# from app.config.caching import cache
# from app.database.models import schemas as s
# from app.services import missions as missions_svc
# from app.config.config import Config as cf

# app = Blueprint('missions', __name__, url_prefix='/api/missions')
# # Create a Blueprint for missions with a URL prefix.

# @app.route('/register', methods=['POST'])
# def create_mission():
#     # Route to create a new mission
#     try:
#         try:
#             mission_data = s.mission_schema.load(request.json)
#             # Load and validate mission data from the request.
#             mission_saved = missions_svc.create_mission(mission_data)
#             # Save the new mission.
#             return jsonify({'message': 'Mission Created'}), 201
#             # Return success response.
#         except ValidationError as e:
#             return jsonify(e.messages), 400
#             # Return validation error response.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.

# @app.route('/all', methods=['GET'])
# def get_all():
#     # Route to get all missions.
#     all_missions = missions_svc.get_all()
#     # Retrieve all missions.
#     return s.missions_schema.jsonify(all_missions), 200
#     # Return the missions in JSON format with a 200 status code.

# @app.route("/<int:mission_id>", methods=['GET'])
# def get_by_id(mission_id):
#     # Route to get a mission by its ID.
#     mission = missions_svc.get_by_id(mission_id)
#     # Retrieve the mission by its ID.
#     return s.mission_schema.jsonify(mission), 200
#     # Return the mission in JSON format with a 200 status code.

# @app.route('/in-quest/<int:quest_id>', methods=['GET'])
# def get_by_quest_id(quest_id):
#     # Route to get missions by quest ID.
#     all_missions = missions_svc.get_by_quest_id(quest_id)
#     # Retrieve missions by quest ID.
#     return s.missions_schema.jsonify(all_missions), 200
#     # Return the missions in JSON format with a 200 status code.

# @app.route("/update-mission/<int:mission_id>", methods=['PUT'])
# def update_mission(mission_id):
#     # Route to update a mission by its ID.
#     try:
#         try:
#             new_info = s.mission_schema.load(request.json, partial=True)
#             # Load and validate new mission data from the request.
#             response, status = missions_svc.update_mission(mission_id, new_info)
#             # Call the service to update the mission.
#             return jsonify(response), status
#             # Return the response and status.
#         except ValidationError as e:
#             return jsonify(e.messages), 400
#             # Return the validation error response
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.

# @app.route("delete-mission/<int:mission_id>", methods=['DELETE'])
# def delete_mission(mission_id):
#     # Route to delete a mission by its ID.
#     try:
#         return missions_svc.delete_mission(mission_id)
#         # Call the service to delete the mission.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.