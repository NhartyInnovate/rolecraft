import json
from typing import Dict, Any
from backend.profiles.schemas import ProfessionalProfileResponse
from backend.ai.prompts.interview import INTERVIEW_SYSTEM_PROMPT, INTERVIEW_USER_PROMPT

class PromptService:
    @staticmethod
    def build_interview_prompts(
        profile: ProfessionalProfileResponse | None,
        goal: str,
        user_input: str
    ) -> Dict[str, str]:
        # Formulate profile JSON string
        profile_json = "{}"
        if profile:
            profile_json = json.dumps(profile.model_dump(), default=str, indent=2)
            
        goal_objective = f"Collect information to perform: {goal.replace('_', ' ').title()}"

        system_prompt = INTERVIEW_SYSTEM_PROMPT.format(
            profile_json=profile_json,
            goal_objective=goal_objective
        )
        
        user_prompt = INTERVIEW_USER_PROMPT.format(user_input=user_input)

        return {
            "system_prompt": system_prompt,
            "user_prompt": user_prompt
        }
