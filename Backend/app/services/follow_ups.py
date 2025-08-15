from app.database.database import database as db
from app.database import models as m

def create_follow_up(follow_up_info, job_id):
    # Create a new follow_up and associate it with a job.
    new_follow_up = m.FollowUp(
        date=follow_up_info['date']
    )
    job = m.Job.query.get(job_id)
    if job:
        new_follow_up.job = job
    db.session.add(new_follow_up)
    db.session.commit()
    return new_follow_up

def get_all_follow_ups():
    # Retrieve all follow_ups and serialize them.
    all_follow_ups = m.FollowUp.query.all()
    return [follow_up.serialize() for follow_up in all_follow_ups]

def get_follow_up_by_id(follow_up_id):
    # Retrieve an follow_up by its ID and serialize it.
    follow_up = m.FollowUp.query.get_or_404(follow_up_id)
    return follow_up.serialize()

def get_by_job_id(job_id):
    # Retrieve follow_ups by job ID and serialize them.
    follow_ups = m.FollowUp.query.filter_by(job_id=job_id).all()
    return [follow_up.serialize() for follow_up in follow_ups]

def update_follow_up(follow_up_id, new_info):
    # Update an follow_up by its ID.
    follow_up = m.FollowUp.query.get_or_404(follow_up_id)

    if 'date' in new_info:
        follow_up.date = new_info['date']
    if 'status' in new_info:
        follow_up.status = new_info['status']
    
    try:
        db.session.commit()
        return {'message': 'Follow up updated successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete_follow_up(follow_up_id):
    # Delete an follow_up by its ID.
    follow_up = m.FollowUp.query.get_or_404(follow_up_id)
    db.session.delete(follow_up)
    db.session.commit()
    return {'message': 'Follow up deleted successfully'}