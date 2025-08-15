from app.database.database import database as db

class Recruiter(db.Model):
    __tablename__ = 'recruiters'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(2048), nullable=False)
    job = db.relationship('Job', back_populates='recruiter', uselist=False)
    
    def serialize(self):
        return {
            'recruiter_id': self.id,            
            'name': self.name,
            'url': self.url              
        }