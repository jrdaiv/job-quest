from app.database.database import database as db
from app.database import models as m

def create_quest(quest_info):
    # Create a new quest with associated missions, instructions, and tips.
    new_quest = m.Quest(
        title=quest_info['title'].title(),
        missions=quest_info['missions']
    )

    # missions_info = quest_info.get('missions', [])
    # for mission_info in missions_info:
    #     new_mission = m.Mission(
    #         mission=mission_info['mission'],
    #         quest=new_quest
    #     )

    #     instructions_info = mission_info.get('instructions', [])
    #     for instruction_info in instructions_info:
    #         new_instruction = m.Instruction(
    #             instruction=instruction_info['instruction'],
    #             url=instruction_info.get('url'),
    #             mission=new_mission
    #         )

    #     tips_info = mission_info.get('tips', [])
    #     for tip_info in tips_info:
    #         new_tip = m.Tip(
    #             tip=tip_info['tip']
    #         )

    #         new_mission.tips.append(new_tip)
    #         new_mission.instructions.append(new_instruction)

    #     new_quest.missions.append(new_mission)
    
    db.session.add(new_quest)
    db.session.commit()

    return new_quest

def get_all():
    # Retrieve all quests and serialize them.
    all_quests = m.Quest.query.all()
    return [quest.serialize() for quest in all_quests]

def get_by_id(quest_id):
    # Retrieve a quest by its ID and serialize it.
    quest = m.Quest.query.get_or_404(quest_id)
    return quest.serialize()

def update_quest(quest_id, new_info):
    # Update a quest and its associated missions, instructions, and tips.
    quest = m.Quest.query.get_or_404(quest_id)

    if 'title' in new_info:
        quest.title = new_info['title']
    if 'missions' in new_info:
        quest.missions = new_info['missions']
    # if 'missions' in new_info:
    #     for mission_info in new_info['missions']:
    #         if 'mission_id' in mission_info:
    #             # Update existing mission.
    #             mission = m.Mission.query.get_or_404(mission_info['mission_id'])
    #             if 'mission' in mission_info:
    #                 mission.mission = mission_info['mission']
    #         else:
    #             # Create new mission.
    #             mission = m.Mission(
    #                 mission=mission_info['mission'],
    #                 quest=quest
    #             )
    #             quest.missions.append(mission)

    #         if 'instructions' in mission_info:
    #             for instruction_info in mission_info['instructions']:
    #                 if 'instruction_id' in instruction_info:
    #                     # Update existing instruction.
    #                     instruction = m.Instruction.query.get_or_404(instruction_info['instruction_id'])
    #                     if 'instruction' in instruction_info:
    #                         instruction.instruction = instruction_info['instruction']
    #                     if 'url' in instruction_info:
    #                         instruction.url = instruction_info['url']
    #                 else:
    #                     # Create new instruction.
    #                     new_instruction = m.Instruction(
    #                         instruction=instruction_info['instruction'],
    #                         url=instruction_info.get('url'),
    #                         mission=mission
    #                     )
    #                     mission.instructions.append(new_instruction)       

    #         if 'tips' in mission_info:
    #             for tip_info in mission_info['tips']:
    #                 if 'tip_id' in tip_info:
    #                     # Update existing tip.
    #                     tip = m.Tip.query.get_or_404(tip_info['tip_id'])
    #                     if 'tip' in tip_info:
    #                         tip.tip = tip_info['tip']
    #                 else:
    #                     # Create new tip.
    #                     new_tip = m.Tip(
    #                         tip=tip_info['tip']
    #                     )
    #                     mission.tips.append(new_tip)

    #         db.session.commit()             

    # if 'status' in new_info:
    #     quest.status = new_info['status']
    
    try:
        db.session.commit()
        return {'message': 'Quest updated successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete_quest(quest_id):
    # Delete a quest by its ID.
    quest = m.Quest.query.get_or_404(quest_id)
    db.session.delete(quest)
    db.session.commit()
    return {'message': 'Quest deleted successfully'}