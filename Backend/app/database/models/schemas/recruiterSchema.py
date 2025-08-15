from . import ma
from marshmallow import fields

class RecruiterSchema(ma.Schema):
    recruiter_id = fields.Integer(required=False)
    job_id = fields.Integer(required=False)
    name = fields.String(required=True)
    url = fields.String(required=True)

recruiter_schema = RecruiterSchema()  
recruiters_schema = RecruiterSchema(many=True)