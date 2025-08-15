# from . import ma
# from marshmallow import fields
# from app.database.models.schemas.instructionSchema import InstructionSchema
# from app.database.models.schemas.tipSchema import TipSchema

# class MissionSchema(ma.Schema):
#     quest_id = fields.Integer(required=False)
#     mission_id = fields.Integer(required=False)
#     mission = fields.String(required=True)    
#     instructions = fields.List(fields.Nested(InstructionSchema), required=False)
#     tips = fields.List(fields.Nested(TipSchema), required=False)

# mission_schema = MissionSchema()  
# missions_schema = MissionSchema(many=True)