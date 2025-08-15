from app.database.database import database as db
from app.database import models as m

def create_recruiter(recruiter_info):
    new_recruiter = m.Recruiter(
        name=recruiter_info['name'],
        phone=recruiter_info.get('phone'),
        email=recruiter_info.get('email')
    )
    db.session.add(new_recruiter)
    db.session.commit()
    return new_recruiter

def get_all_recruiters():
    all_recruiters = m.Recruiter.query.all()
    return [recruiter.serialize() for recruiter in all_recruiters]

def get_recruiter_by_id(recruiter_id):
    recruiter = m.Recruiter.query.get_or_404(recruiter_id)
    return recruiter.serialize()

def update_recruiter(recruiter_id, new_info):
    recruiter = m.Recruiter.query.get_or_404(recruiter_id)
    if 'name' in new_info:
        recruiter.name = new_info['name']
    if 'phone' in new_info:
        recruiter.phone = new_info.get('phone')
    if 'email' in new_info:
        recruiter.email = new_info.get('email')
    db.session.commit()
    return recruiter.serialize()

def delete_recruiter(recruiter_id):
    recruiter = m.Recruiter.query.get_or_404(recruiter_id)
    db.session.delete(recruiter)
    db.session.commit()
    return {'message': 'Recruiter deleted successfully'}