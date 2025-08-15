import traceback
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from app.config.caching import cache
from app.database.models import schemas as s
from app.services import quests as quests_svc
from app.config.config import Config as cf

app = Blueprint('quests', __name__, url_prefix='/api/quests')
# Create a Blueprint for quests with a URL prefix.

@app.route('/register', methods=['POST'])
def create_quest():
    # Route to create a new quest.
    try:
        try:
            quest_data = s.quest_schema.load(request.json)
            # Load and validate quest data from the request.
            quest_saved = quests_svc.create_quest(quest_data)
            # Save the new quest.
            return jsonify({'message': 'Quest Created'}), 201
            # Return success response.
        
        except ValidationError as e:
            return jsonify(e.messages), 400
            # Return validation error response.
    except traceback:
        return jsonify(traceback, 500)
        # Return error response if an exception occurs.
    
@app.route('/all', methods=['GET'])
@cache.cached(timeout=60)
def get_all():
    # Route to get all quests.
    all_quests = quests_svc.get_all()
    # Retrieve all quests.
    return s.quests_schema.jsonify(all_quests), 200
    # Return the quests in JSON format with a 200 status code.

@app.route("/<int:quest_id>", methods=['GET'])
def get_by_id(quest_id):
    # Route to get a quest by its ID.
    quest = quests_svc.get_by_id(quest_id)
    # Retrieve the quest by its ID.
    return s.quest_schema.jsonify(quest), 200
    # Return the quest in JSON format with a 200 status code.

@app.route("/update-quest/<int:quest_id>", methods=['PUT'])
def update_quest(quest_id):
    # Route to update a quest by its ID.
    try:
        try:
            new_info = s.quest_schema.load(request.json, partial=True)
            # Load and validate new quest data from the request.
            response, status = quests_svc.update_quest(quest_id, new_info)
            # Call the service to update the quest.
            return jsonify(response), status
            # Return the response and status.
        except ValidationError as e:
            return jsonify(e.messages), 400
            # Return validation error response.
    except traceback:
        return jsonify(traceback, 500)
        # Return error response if an exception occurs.
    
@app.route("/delete-quest/<int:quest_id>", methods=['DELETE'])
def delete_quest(quest_id):
    # Route to delete a quest by its ID.
    try:
        return quests_svc.delete_quest(quest_id)
        # Call the service to delete the quest.
    except traceback:
        return jsonify(traceback, 500)
        # Return error response if an exception occurs.

    