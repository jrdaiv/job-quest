from . import ma
from marshmallow import fields

class HiringManagerSchema(ma.Schema):
    hiring_manager_id = fields.Integer(required=False)
    job_id = fields.Integer(required=False)
    name = fields.String(required=True)
    url = fields.String(required=True)

hiring_manager_schema = HiringManagerSchema()  
hiring_managers_schema = HiringManagerSchema(many=True)