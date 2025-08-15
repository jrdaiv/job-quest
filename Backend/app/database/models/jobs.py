from app.database.database import database as db

class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable= False)
    company_name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(250), nullable = False)
    url = db.Column(db.String(2048), nullable = False)
    motivation = db.Column(db.Integer, nullable=False)
    date_applied = db.Column(db.Date, nullable=False)
    reminder_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(100), nullable=False, default='Not Started')
    notes = db.Column(db.Text)
    hiring_manager = db.relationship('HiringManager', back_populates='job', uselist=False, cascade='all, delete-orphan')
    recruiter = db.relationship('Recruiter', back_populates='job', uselist=False, cascade='all, delete-orphan')
    follow_ups = db.relationship('FollowUp', back_populates='job', cascade="all, delete-orphan")
    
    def serialize(self):
        return {
            'job_id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'position': self.position,
            'url': self.url,
            'motivation': self.motivation,
            'date_applied': self.date_applied,
            'reminder_date': self.reminder_date,
            'status': self.status,
            'notes': self.notes,
            'hiring_manager': self.hiring_manager.serialize() if self.hiring_manager else None,
            'recruiter': self.recruiter.serialize() if self.recruiter else None,
            'follow_ups': [follow_up.serialize() for follow_up in self.follow_ups]
        }