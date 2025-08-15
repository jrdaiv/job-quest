from . import ma
from marshmallow import fields
from app.database.models.schemas.followUpSchema import FollowUpSchema
from app.database.models.schemas.hiringManagerSchema import HiringManagerSchema
from app.database.models.schemas.recruiterSchema import RecruiterSchema

class JobSchema(ma.Schema):
    job_id = fields.Integer(required=False)
    user_id = fields.Integer(required=True)
    company_name = fields.String(required=True)
    position = fields.String(required=True)
    url = fields.String(required=True)
    motivation = fields.Integer(required=True)
    date_applied = fields.Date(required=True)
    reminder_date = fields.Date(required=True)
    status= fields.String(required=False)
    notes = fields.String(required=False)
    hiring_manager = fields.Nested(HiringManagerSchema, required=False)
    recruiter = fields.Nested(RecruiterSchema, required=False)
    follow_ups = fields.List(fields.Nested(FollowUpSchema), required=False)
    

job_schema = JobSchema()  
jobs_schema = JobSchema(many=True)