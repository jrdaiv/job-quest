from . import ma
from marshmallow import fields
# from app.database.models.schemas.missionSchema import MissionSchema

class QuestSchema(ma.Schema):
    quest_id = fields.Integer(required=False)
    title = fields.String(required=True)         
    missions = fields.Integer(required=True)
    
quest_schema = QuestSchema()  
quests_schema = QuestSchema(many=True)