# import traceback
# from flask import Blueprint, jsonify, request
# from marshmallow import ValidationError
# from app.services import instructions as instructions_svc
# from app.database.models import schemas as s
# from app.config.config import Config as cf
# from app.config.caching import cache

# app = Blueprint('instructions', __name__, url_prefix='/api/instructions')
# # Create a Blueprint for instructions with a URL prefix.

# @app.route('/register', methods=['POST'])
# def create_instruction():
#     # Route to create a new instruction.
#     try:
#         try:
#             instruction_data = s.instruction_schema.load(request.json)
#             # Load and validate instruction data from the request.
#             mission_id = request.json.get('mission_id')
#             # Get mission ID from the request.
#             instruction_saved = instructions_svc.create_instruction(instruction_data, mission_id)
#             # Save the new instruction.
#             return jsonify({'message': 'Instruction Created'}), 201
#             # Return success response.
#         except ValidationError as e:
#             return jsonify(e.messages), 400
#             # Return validation error response.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.

# @app.route('/all', methods=['GET'])
# def get_all_instructions():
#     # Route to get all instructions.
#     all_instructions = instructions_svc.get_all_instructions()
#     # Retrieve all instructions.
#     return s.instructions_schema.jsonify(all_instructions), 200
#     # Return the instructions in JSON format with a 200 status code.

# @app.route("/<int:instruction_id>", methods=['GET'])
# def get_instruction_by_id(instruction_id):
#     # Route to get an instruction by its ID.
#     instruction = instructions_svc.get_instruction_by_id(instruction_id)
#     # Retrieve the instruction by its ID.
#     return s.instruction_schema.jsonify(instruction), 200
#     # Return the instruction in JSON format with a 200 status code.

# @app.route("/mission/<int:mission_id>", methods=['GET'])
# def get_by_mission_id(mission_id):
#     # Route to get instructions by mission ID.
#     instructions = instructions_svc.get_by_mission_id(mission_id)
#     # Retrieve instructions by mission ID.
#     return s.instructions_schema.jsonify(instructions), 200
#     # Return the instructions in JSON format with a 200 status code.

# @app.route("/update-instruction/<int:instruction_id>", methods=['PUT'])
# def update_instruction(instruction_id):
#     # Route to update an instruction by its ID.
#     try:
#         try:
#             new_info = s.instruction_schema.load(request.json, partial=True)
#             # Load and validate new instruction data from the request.
#             response, status = instructions_svc.update_instruction(instruction_id, new_info)
#             # Call the service to update the instruction.
#             return jsonify(response), status
#             # Return the response and status.
#         except ValidationError as e:
#             return jsonify(e.messages), 400
#             # Return validation error response.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.

# @app.route("/delete-instruction/<int:instruction_id>", methods=['DELETE'])
# def delete_instruction(instruction_id):
#     # Route to delete an instruction by its ID.
#     try:
#         response = instructions_svc.delete_instruction(instruction_id)
#         # Call the service to delete the instruction.
#         return jsonify(response), 200
#         # Return success response.
#     except traceback:
#         return jsonify(traceback, 500)
#         # Return general error response.