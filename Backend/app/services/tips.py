# from app.database.database import database as db
# from app.database import models as m

# from app.database.database import database as db
# from app.database import models as m

# def create_tip(tip_info, mission_id):
#     # Create a new tip and associate it with a mission.
#     new_tip = m.Tip(
#         tip=tip_info['tip']
#     )
#     mission = m.Mission.query.get(mission_id)
#     if mission:
#         new_tip.mission = mission
#     db.session.add(new_tip)
#     db.session.commit()
#     return new_tip

# def get_all_tips():
#     # Retrieve all tips and serialize them.
#     all_tips = m.Tip.query.all()
#     return [tip.serialize() for tip in all_tips]

# def get_tip_by_id(tip_id):
#     # Retrieve a tip by its ID and serialize it.
#     tip = m.Tip.query.get_or_404(tip_id)
#     return tip.serialize()

# def get_by_mission_id(mission_id):
#     # Retrieve tips by mission ID and serialize them.
#     tips = m.Tip.query.filter_by(mission_id=mission_id).all()
#     return [tip.serialize() for tip in tips]

# def update_tip(tip_id, new_info):
#     # Update a tip by its ID.
#     tip = m.Tip.query.get_or_404(tip_id)

#     if 'tip' in new_info:
#         tip.tip = new_info['tip']
    
#     try:
#         db.session.commit()
#         return {'message': 'Tip updated successfully'}, 200
#     except Exception as e:
#         db.session.rollback()
#         return {'error': str(e)}, 500

# def delete_tip(tip_id):
#     # Delete a tip by its ID.
#     tip = m.Tip.query.get_or_404(tip_id)
#     db.session.delete(tip)
#     db.session.commit()
#     return {'message': 'Tip deleted successfully'}
