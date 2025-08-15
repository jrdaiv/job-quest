from . import ma
from marshmallow import fields

class UserSchema(ma.Schema):
    id = fields.Integer(required=False)
    name = fields.String(required=True)
    email = fields.Email(required=True)
    password = fields.String(required=True)
    quest_step = fields.Integer(required=False)
    # quest_workflow = fields.Nested(QuestWorkflowSchema, required=False)
    changePassword = fields.Integer(required=False)

user_schema = UserSchema()
users_schema = UserSchema(many=True)