import json
from typing import Dict, Any
from backend.ai.services.llm_service import LLMService
from backend.ai.services.prompt_service import PromptService
from backend.profiles.schemas import ProfessionalProfileResponse

class InterviewService:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    async def get_next_question(
        self,
        profile: ProfessionalProfileResponse | None,
        goal: str,
        user_input: str,
        history: list[dict]
    ) -> Dict[str, Any]:
        
        # Build prompt templates
        prompts = PromptService.build_interview_prompts(profile, goal, user_input)
        
        # Call LLM service requesting JSON parsing
        llm_response = await self.llm_service.generate_chat_response(
            system_prompt=prompts["system_prompt"],
            user_prompt=prompts["user_prompt"],
            history=history,
            response_schema={"type": "json_object"}
        )
        
        # Parse JSON output properties
        try:
            parsed = json.loads(llm_response["content"])
            question_text = parsed.get("question", "Could you tell me more about your recent achievements?")
        except Exception:
            question_text = llm_response["content"]

        # Return format matching response structure
        return {
            "content": question_text,
            "model_used": llm_response.get("model_used"),
            "prompt_tokens": llm_response.get("prompt_tokens"),
            "completion_tokens": llm_response.get("completion_tokens"),
            "finish_reason": llm_response.get("finish_reason"),
            "provider_name": llm_response.get("provider_name")
        }
