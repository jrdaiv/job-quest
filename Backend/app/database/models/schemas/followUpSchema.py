from . import ma
from marshmallow import fields

class FollowUpSchema(ma.Schema):
    follow_up_id = fields.Integer(required=False)
    job_id = fields.Integer(required=False)
    date = fields.Date(required=True)
    status = fields.Boolean(required=False)

follow_up_schema = FollowUpSchema()  
follow_ups_schema = FollowUpSchema(many=True)