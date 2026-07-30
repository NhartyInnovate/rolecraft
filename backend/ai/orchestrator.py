from typing import Dict, Any
from backend.ai.services.llm_service import LLMService
from backend.ai.services.interview_service import InterviewService
from backend.profiles.schemas import ProfessionalProfileResponse

class AIOrchestrator:
    def __init__(self):
        self.llm_service = LLMService()
        self.interview_service = InterviewService(self.llm_service)

    async def run_step(
        self,
        goal: str,
        profile: ProfessionalProfileResponse | None,
        user_input: str,
        history: list[dict]
    ) -> Dict[str, Any]:
        """
        Thin orchestrator routing traffic cleanly to specialized subsystems.
        """
        # Route to specialized InterviewService for conversation processing
        if goal in {"CREATE_CV", "IMPROVE_CV", "TAILOR_CV", "COVER_LETTER"}:
            return await self.interview_service.get_next_question(
                profile=profile,
                goal=goal,
                user_input=user_input,
                history=history
            )
        
        raise ValueError(f"Goal orchestration routing configuration missing for: {goal}")
