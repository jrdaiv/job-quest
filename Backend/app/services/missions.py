# from app.database.database import database as db
# from app.database import models as m

# def create_mission(mission_info):
#     # Create a new mission with associated instructions and tips.
#     new_mission = m.Mission(
#         mission=mission_info['mission'].capitalize(),
#         quest_id=mission_info['quest_id']
#     )

#     instructions_info = mission_info.get('instructions', [])
#     for instruction_info in instructions_info:
#         new_instruction = m.Instruction(
#             instruction=instruction_info['instruction'],
#             mission=new_mission
#         )
#         new_mission.instructions.append(new_instruction)

#     tips_info = mission_info.get('tips', [])
#     for tip_info in tips_info:
#         new_tip = m.Tip(
#             tip=tip_info['tip'],
#             mission=new_mission
#         )
#         new_mission.tips.append(new_tip)
    
#     db.session.add(new_mission)
#     db.session.commit()

#     return new_mission

# def get_all():
#     # Retrieve all missions and serialize them.
#     all_missions = m.Mission.query.all()
#     return [mission.serialize() for mission in all_missions]

# def get_by_id(mission_id):
#     # Retrieve a mission by its ID and serialize it.
#     mission = m.Mission.query.get_or_404(mission_id)
#     return mission.serialize()

# def get_by_quest_id(quest_id):
#     # Retrieve missions by quest ID and serialize them.
#     quest = m.Quest.query.get_or_404(quest_id)
#     all_missions = quest.missions
#     return [mission.serialize() for mission in all_missions]

# def update_mission(mission_id, new_info):
#     # Update a mission and its associated instructions and tips.
#     mission = m.Mission.query.get_or_404(mission_id)

#     if 'mission' in new_info:
#         mission.mission = new_info['mission']
#     if 'quest_id' in new_info:
#         mission.quest_id = new_info['quest_id']
#     if 'instructions' in new_info:
#         for instruction_info in new_info['instructions']:
#             if 'instruction_id' in instruction_info:
#                 # Update existing instruction.
#                 instruction = m.Instruction.query.get_or_404(instruction_info['instruction_id'])
#                 if 'instruction' in instruction_info:
#                     instruction.instruction = instruction_info['instruction']
#             else:
#                 # Create new instruction.
#                 new_instruction = m.Instruction(
#                     instruction=instruction_info['instruction'],
#                     mission=mission
#                 )
#                 mission.instructions.append(new_instruction)                
                               
#     if 'tips' in new_info:
#         for tip_info in new_info['tips']:
#             if 'tip_id' in tip_info:
#                 # Update existing tip.
#                 tip = m.Tip.query.get_or_404(tip_info['tip_id'])
#                 if 'tip' in tip_info:
#                     tip.tip = tip_info['tip']
#             else:
#                 # Create new tip.
#                 new_tip = m.Tip(
#                     tip=tip_info['tip']
#                 )
#                 mission.tips.append(new_tip)

#             db.session.commit()             
    
#     try:
#         db.session.commit()
#         return {'message': 'Mission updated successfully'}, 200
#     except Exception as e:
#         db.session.rollback()
#         return {'error': str(e)}, 500

# def delete_mission(mission_id):
#     # Delete a mission by its ID.
#     mission = m.Mission.query.get_or_404(mission_id)
#     db.session.delete(mission)
#     db.session.commit()
#     return {'message': 'Mission deleted successfully'}