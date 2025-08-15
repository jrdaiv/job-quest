# import traceback
# from flask import Blueprint, jsonify, request
# from marshmallow import ValidationError
# from app.services import tips as tips_svc
# from app.database.models import schemas as s
# from app.config.config import Config as cf
# from app.config.caching import cache

# app = Blueprint('tips', __name__, url_prefix='/api/tips')
# # Create a Blueprint for tips with a URL prefix.

# @app.route('/register', methods=['POST'])
# def create_tip():
#     # Route to create a new tip.
#     try:
#         tip_data = s.tip_schema.load(request.json)
#         # Load and validate tip data from the request.
#         mission_id = request.json.get('mission_id')
#         # Get mission ID from the request.
#         tip_saved = tips_svc.create_tip(tip_data, mission_id)
#         # Save the new tip.
#         return jsonify({'message': 'Tip Created'}), 201
#         # Return success response.
#     except ValidationError as e:
#         return jsonify(e.messages), 400
#         # Return validation error response.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.

# @app.route('/all', methods=['GET'])
# def get_all_tips():
#     # Route to get all tips.
#     all_tips = tips_svc.get_all_tips()
#     return s.tips_schema.jsonify(all_tips), 200
#     # Return the tips in JSON format with a 200 status code.

# @app.route("/<int:tip_id>", methods=['GET'])
# def get_tip_by_id(tip_id):
#     # Route to get a tip by its ID.
#     tip = tips_svc.get_tip_by_id(tip_id)
#     return s.tip_schema.jsonify(tip), 200
#     # Return the tip in JSON format with a 200 status code.

# @app.route("/mission/<int:mission_id>", methods=['GET'])
# def get_by_mission_id(mission_id):
#     # Route to get tips by mission ID.
#     tips = tips_svc.get_by_mission_id(mission_id)
#     return s.tips_schema.jsonify(tips), 200
#     # Return the tips in JSON format with a 200 status code.

# @app.route("/update-tip/<int:tip_id>", methods=['PUT'])
# def update_tip(tip_id):
#     # Route to update a tip by its ID.
#     try:
#         try:
#             new_info = s.tip_schema.load(request.json, partial=True)
#             # Load and validate new tip data from the request.
#             response, status = tips_svc.update_tip(tip_id, new_info)
#             # Call the service to update the tip.
#             return jsonify(response), status
#             # Return the response and status.
#         except ValidationError as e:
#             return jsonify(e.messages), 400
#             # Return validation error response.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.

# @app.route("/delete-tip/<int:tip_id>", methods=['DELETE'])
# def delete_tip(tip_id):
#     # Route to delete a tip by its ID.
#     try:
#         response = tips_svc.delete_tip(tip_id)
#         # Call the service to delete the tip.
#         return jsonify(response), 200
#         # Return success response.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.