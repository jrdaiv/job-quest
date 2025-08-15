# from app.database.database import database as db

# class Instruction(db.Model):
#     __tablename__ = 'instructions'
#     id = db.Column(db.Integer, primary_key=True)
#     mission_id = db.Column(db.Integer, db.ForeignKey('missions.id'), nullable=False)
#     instruction = db.Column(db.Text, nullable=False)
#     url = db.Column(db.String(2048))
#     mission = db.relationship('Mission', back_populates='instructions')
    

#     def serialize(self):
#         return {
#             'instruction_id': self.id,
#             'instruction': self.instruction,
#             'url': self.url,
#             'mission_id': self.mission_id
#         }