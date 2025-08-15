from app.database.database import database as db
from app.database import models as m
from app.services.emails import send_reminder_email
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import logging

scheduler = BackgroundScheduler()
scheduler.start()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_job(job_info):
    # Create a new job.
    new_job = m.Job(
        company_name=job_info['company_name'].capitalize(),
        user_id=job_info['user_id'],
        position=job_info['position'],
        url=job_info['url'],
        motivation=job_info['motivation'],
        date_applied=job_info['date_applied'],
        reminder_date=job_info['reminder_date'],
        notes=job_info.get('notes')        
    )
    hiring_manager_info = job_info.get('hiring_manager', [])
    new_hiring_manager = m.HiringManager(
        name=hiring_manager_info['name'],
        url=hiring_manager_info.get('url'),        
        job=new_job
    )
    new_job.hiring_manager = (new_hiring_manager)

    recruiter_info = job_info.get('recruiter', [])
    new_recruiter = m.Recruiter(
        name=recruiter_info['name'],
        url=recruiter_info.get('url'),        
        job=new_job
        )
    new_job.recruiter = (new_recruiter)

    follow_ups_info = job_info.get('follow_ups', [])
    for follow_up_info in follow_ups_info:
        new_follow_up = m.FollowUp(
            date=follow_up_info['date'],
            job=new_job
        )
        new_job.follow_ups.append(new_follow_up)
    
    db.session.add(new_job)
    db.session.commit()

    user = m.User.query.get(new_job.user_id)
   
    if new_job.reminder_date:
        schedule_reminder_email(user.email, user.name, new_job.date_applied, new_job.reminder_date, new_job.company_name, new_job.position, new_job.hiring_manager.name if new_job.hiring_manager else None,
            new_job.recruiter.name if new_job.recruiter else None)

    return new_job


def schedule_reminder_email(email, name, date_applied, reminder_date, company_name, position, hiring_manager_name=None, recruiter_name=None):
    # Convert reminder_date to datetime object if it's a string
    if isinstance(reminder_date, str):
        reminder_date = datetime.strptime(reminder_date, '%Y-%m-%d')
    
    logger.info(f"Scheduling email to {email} for job {company_name} at {reminder_date}")
    scheduler.add_job(send_reminder_email, 'date', run_date=reminder_date, args=[email, name, date_applied, reminder_date, company_name, position, hiring_manager_name, recruiter_name], misfire_grace_time=86400)


def get_all():
    # Retrieve all jobs and serialize them.
    all_jobs = m.Job.query.all()
    return [job.serialize() for job in all_jobs]

def get_by_id(job_id):
    # Retrieve a job by its ID and serialize it.
    job = m.Job.query.get_or_404(job_id)
    return job.serialize()

def get_by_user_id(user_id):
    # Retrieve a job by its ID and serialize it.
    jobs = m.Job.query.filter_by(user_id=user_id).all()
    return [job.serialize() for job in jobs]

def update_job(job_id, new_info):
    # Update a job and its associated follow-ups.
    job = m.Job.query.get_or_404(job_id)

    if 'company_name' in new_info:
        job.company_name = new_info['company_name']
    if 'position' in new_info:
       job.position = new_info['position']
    if 'url' in new_info:
        job.url = new_info['url']
    if 'motivation' in new_info:
        job.motivation = new_info['motivation']
    if 'date_applied' in new_info:
        job.date_applied = new_info['date_applied']
    if 'reminder_date' in new_info:
        job.reminder_date = new_info['reminder_date']
    if 'status' in new_info:
        job.status = new_info['status']
    if 'notes' in new_info:
        job.status = new_info['notes']
    # Fix: Treat `hiring_manager` as an object, not a list
    if 'hiring_manager' in new_info:
        hiring_manager_info = new_info['hiring_manager']
        if job.hiring_manager:  # Update existing hiring manager
            hiring_manager = job.hiring_manager  # No need to use [0]
            if 'name' in hiring_manager_info:
                hiring_manager.name = hiring_manager_info['name']
            if 'url' in hiring_manager_info:
                hiring_manager.url = hiring_manager_info.get('url')            
        else:  # Create a new hiring manager if it doesn't exist
            new_hiring_manager = m.HiringManager(
                name=hiring_manager_info['name'],
                url=hiring_manager_info.get('url'),
                job=job
            )
            job.hiring_manager = new_hiring_manager
    # Fix: Treat `recruiter` as an object, not a list
    if 'recruiter' in new_info:
        recruiter_info = new_info['recruiter']
        if job.recruiter:  # Update existing recruiter
            recruiter = job.recruiter  # No need to use [0]
            if 'name' in recruiter_info:
                recruiter.name = recruiter_info['name']
            if 'url' in recruiter_info:
                recruiter.url = recruiter_info['url']
        else:  # Create a new recruiter if it doesn't exist
            new_recruiter = m.Recruiter(
                name=recruiter_info['name'],
                url=recruiter_info.get('url'),  # Fixed this to refer to recruiter info
                job=job
            )
            job.recruiter = new_recruiter  
    if 'follow_ups' in new_info:
        for follow_up_info in new_info['follow_ups']:
            if 'follow_up_id' in follow_up_info:
                # Update existing follow up.
                follow_up = m.FollowUp.query.get_or_404(follow_up_info['follow_up_id'])
                if 'date' in follow_up_info:
                    follow_up.date = follow_up_info['date']
                if 'status' in follow_up_info:
                    follow_up.status = follow_up_info['status']
            else:
                # Create new follow up.
                follow_up = m.FollowUp(
                    date=follow_up_info['date'],
                    job=job
                )
                job.follow_ups.append(follow_up)              
    try:
        db.session.commit()
        return {'message': 'Job updated successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete_job(job_id):
    # Delete a job by its ID.
    job = m.Job.query.get_or_404(job_id)
    db.session.delete(job)
    db.session.commit()
    return {'message': 'Job deleted successfully'}