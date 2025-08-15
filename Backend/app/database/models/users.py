from sqlalchemy import event
from app.database.database import database as db
from app.database.models.quest_workflow import QuestWorkflow

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False,)
    password = db.Column(db.String(300), nullable=False)
    quest_step = db.Column(db.Integer, nullable=False, default=1)
    change_password = db.Column(db.Integer, default=0, nullable=False)
    quest_workflow = db.relationship("QuestWorkflow", back_populates='user', cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password': self.password
        }
# Define the event listener function
def create_quest_workflow(mapper, connection, target):
    # Create a new QuestWorkflow instance
    new_workflow = QuestWorkflow(user_id=target.id)
    # Add the new QuestWorkflow instance to the session
    db.session.add(new_workflow)    
    
event.listen(User, 'after_insert', create_quest_workflow)