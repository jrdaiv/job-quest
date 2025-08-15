from app.database.database import database as db

class Quest(db.Model):
    __tablename__ = 'quests'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)    
    missions = db.Column(db.Integer, nullable=False)
    def serialize(self):
        return {
            'quest_id': self.id,
            'title': self.title,
            'missions': self.missions
        }