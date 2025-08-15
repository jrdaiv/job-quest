from app.database.database import database as db

class FollowUp(db.Model):
    __tablename__ = 'follow_ups'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)    
    status = db.Column(db.Boolean, nullable=False, default=False)
    job = db.relationship('Job', back_populates='follow_ups')
    def serialize(self):
        return {
            'follow_up_id': self.id,        
            'date': self.date,
            'status': self.status,        
        }