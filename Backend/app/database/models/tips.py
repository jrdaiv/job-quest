# from app.database.database import database as db

# class Tip(db.Model):
#     __tablename__ = 'tips'
#     id = db.Column(db.Integer, primary_key=True)
#     mission_id = db.Column(db.Integer, db.ForeignKey('missions.id'), nullable=False)
#     tip = db.Column(db.Text, nullable=False)
#     mission = db.relationship('Mission', back_populates='tips')

#     def serialize(self):
#         return {
#             'tip_id': self.id,
#             'tip': self.tip
#         }