from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseLLMAdapter(ABC):
    
    @abstractmethod
    async def generate_chat_response(
        self,
        system_prompt: str,
        user_prompt: str,
        history: list[dict],
        response_schema: Any = None
    ) -> Dict[str, Any]:
        """
        Submits prompts and messages history to the AI provider.
        Returns a dictionary containing response text, token details, and completion stats:
        {
           "content": str,
           "model_used": str,
           "prompt_tokens": int | None,
           "completion_tokens": int | None,
           "finish_reason": str,
           "provider_name": str
        }
        """
        pass
