from flask_marshmallow import Marshmallow
ma = Marshmallow()

from .questSchema import quest_schema, quests_schema
# from .missionSchema import mission_schema, missions_schema
# from .instructionSchema import instruction_schema, instructions_schema
# from .tipSchema import tip_schema, tips_schema
from .jobSchema import job_schema, jobs_schema
from .followUpSchema import follow_up_schema, follow_ups_schema
from .hiringManagerSchema import hiring_manager_schema, hiring_managers_schema
from .recruiterSchema import recruiter_schema, recruiters_schema
from .userSchema import user_schema, users_schema