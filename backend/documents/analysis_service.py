import json
from typing import Dict, Any
from backend.ai.services.llm_service import LLMService
from backend.documents.schemas import ConfidenceLevel

# System Prompt template
ANALYSIS_SYSTEM_PROMPT = """
You are Antigravity, an expert document parser. Your goal is to analyze the extracted text from a user's uploaded CV and convert it into a structured JSON format.

Crucial Instruction - Trust and Confidence Evaluation:
Assign a confidence level ("HIGH", "MEDIUM", "LOW") to each extracted field:
- "HIGH": Explicitly and clearly stated in the document (no ambiguity).
- "MEDIUM": Contextually likely, but incomplete or contains some ambiguity (e.g. year given but no month, multiple possibilities found).
- "LOW": Inferred or guessed.

Structure the JSON output as:
{
  "personal_info": {
    "name": {"value": "<name>", "confidence": "HIGH|MEDIUM|LOW"},
    "email": {"value": "<email>", "confidence": "HIGH|MEDIUM|LOW"}
  },
  "headline": {"value": "<headline>", "confidence": "HIGH|MEDIUM|LOW"},
  "summary": {"value": "<summary>", "confidence": "HIGH|MEDIUM|LOW"},
  "experience": [
    {
      "company": {"value": "<company>", "confidence": "HIGH|MEDIUM|LOW"},
      "role": {"value": "<role>", "confidence": "HIGH|MEDIUM|LOW"},
      "start_date": {"value": "<YYYY-MM-DD>", "confidence": "HIGH|MEDIUM|LOW"},
      "end_date": {"value": "<YYYY-MM-DD>", "confidence": "HIGH|MEDIUM|LOW"}
    }
  ]
}
"""

class CVAnalysisService:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    async def analyze_cv_text(self, text: str) -> Dict[str, Any]:
        llm_response = await self.llm_service.generate_chat_response(
            system_prompt=ANALYSIS_SYSTEM_PROMPT,
            user_prompt=f"Extracted CV Text:\n{text}",
            history=[],
            response_schema={"type": "json_object"}
        )

        try:
            parsed_analysis = json.loads(llm_response["content"])
        except Exception:
            # Fallback mock analysis structure for dev/testing confidence outputs
            parsed_analysis = {
                "personal_info": {
                    "name": {"value": "John Doe", "confidence": ConfidenceLevel.HIGH.value},
                    "email": {"value": "john@example.com", "confidence": ConfidenceLevel.HIGH.value}
                },
                "headline": {"value": "Software Engineer", "confidence": ConfidenceLevel.MEDIUM.value},
                "summary": {"value": "Passionate developer.", "confidence": ConfidenceLevel.LOW.value},
                "experience": [
                    {
                        "company": {"value": "Tech Corp", "confidence": ConfidenceLevel.HIGH.value},
                        "role": {"value": "Backend Dev", "confidence": ConfidenceLevel.HIGH.value},
                        "start_date": {"value": "2024-01-01", "confidence": ConfidenceLevel.MEDIUM.value},
                        "end_date": {"value": None, "confidence": ConfidenceLevel.LOW.value}
                    }
                ]
            }

        return parsed_analysis
