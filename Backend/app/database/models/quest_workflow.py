from app.database.database import database as db

class QuestWorkflow(db.Model):
    __tablename__ = 'quest_workflow'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    quest_0 = db.Column(db.Integer, nullable=False, default=1)
    quest_1 = db.Column(db.Integer, nullable=False, default=0)
    quest_2 = db.Column(db.Integer, nullable=False, default=0)
    quest_3 = db.Column(db.Integer, nullable=False, default=0)
    quest_4 = db.Column(db.Integer, nullable=False, default=0)
    quest_5 = db.Column(db.Integer, nullable=False, default=0)
    quest_6 = db.Column(db.Integer, nullable=False, default=0)
    user = db.relationship("User", back_populates='quest_workflow')

    def serialize(self):
        return {
            'id': self.id,
            'quest_0': self.quest_0,
            'quest_1': self.quest_1,
            'quest_2': self.quest_2,
            'quest_3': self.quest_3,
            'quest_4': self.quest_4,
            'quest_5': self.quest_5,
            'quest_6': self.quest_6
        }