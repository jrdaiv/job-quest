from app.database.database import database as db
from app.database import models as m

def create_hiring_manager(hiring_manager_info):
    new_hiring_manager = m.HiringManager(
        job_id=hiring_manager_info.get('job_id'),
        name=hiring_manager_info['name'],
        url=hiring_manager_info.get('url')
    )
    db.session.add(new_hiring_manager)
    db.session.commit()
    return new_hiring_manager

def get_all_hiring_managers():
    all_hiring_managers = m.HiringManager.query.all()
    return [hiring_manager.serialize() for hiring_manager in all_hiring_managers]

def get_hiring_manager_by_id(hiring_manager_id):
    hiring_manager = m.HiringManager.query.get_or_404(hiring_manager_id)
    return hiring_manager.serialize()

def update_hiring_manager(hiring_manager_id, new_info):
    hiring_manager = m.HiringManager.query.get_or_404(hiring_manager_id)
    if 'name' in new_info:
        hiring_manager.name = new_info['name']
    if 'url' in new_info:
        hiring_manager.phone = new_info.get('url')
    db.session.commit()
    return hiring_manager.serialize()

def delete_hiring_manager(hiring_manager_id):
    hiring_manager = m.HiringManager.query.get_or_404(hiring_manager_id)
    db.session.delete(hiring_manager)
    db.session.commit()
    return {'message': 'Hiring Manager deleted successfully'}