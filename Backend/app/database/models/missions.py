# from app.database.database import database as db

# class Mission(db.Model):
#     __tablename__ = 'missions'
#     id = db.Column(db.Integer, primary_key=True)
#     quest_id = db.Column(db.Integer, db.ForeignKey('quests.id'), nullable=False)
#     mission = db.Column(db.String(100), nullable=False)
#     quest = db.relationship('Quest', back_populates='missions')
#     instructions = db.relationship('Instruction', back_populates='mission', cascade="all, delete-orphan") 
#     tips = db.relationship('Tip', back_populates='mission', cascade="all, delete-orphan")

#     def serialize(self):
#         return {
#             'mission_id': self.id,
#             'mission': self.mission,            
#             'instructions': [instruction.serialize() for instruction in self.instructions],
#             'tips': [tip.serialize() for tip in self.tips]
#         }