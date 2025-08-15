# from app.database.database import database as db
# from app.database import models as m

# def create_instruction(instruction_info, mission_id):
#     # Create a new instruction and associate it with a mission.
#     new_instruction = m.Instruction(
#         instruction=instruction_info['instruction'],
#         url=instruction_info['url']
#     )
#     mission = m.Mission.query.get(mission_id)
#     if mission:
#         new_instruction.mission = mission
#     db.session.add(new_instruction)
#     db.session.commit()
#     return new_instruction

# def get_all_instructions():
#     # Retrieve all instructions and serialize them.
#     all_instructions = m.Instruction.query.all()
#     return [instruction.serialize() for instruction in all_instructions]

# def get_instruction_by_id(instruction_id):
#     # Retrieve an instruction by its ID and serialize it.
#     instruction = m.Instruction.query.get_or_404(instruction_id)
#     return instruction.serialize()

# def get_by_mission_id(mission_id):
#     # Retrieve instructions by mission ID and serialize them.
#     instructions = m.Instruction.query.filter_by(mission_id=mission_id).all()
#     return [instruction.serialize() for instruction in instructions]

# def update_instruction(instruction_id, new_info):
#     # Update an instruction by its ID.
#     instruction = m.Instruction.query.get_or_404(instruction_id)

#     if 'instruction' in new_info:
#         instruction.instruction = new_info['instruction']
#     if 'url' in new_info:
#         instruction.url = new_info['url']
#     try:
#         db.session.commit()
#         return {'message': 'Instruction updated successfully'}, 200
#     except Exception as e:
#         db.session.rollback()
#         return {'error': str(e)}, 500

# def delete_instruction(instruction_id):
#     # Delete an instruction by its ID.
#     instruction = m.Instruction.query.get_or_404(instruction_id)
#     db.session.delete(instruction)
#     db.session.commit()
#     return {'message': 'Instruction deleted successfully'}