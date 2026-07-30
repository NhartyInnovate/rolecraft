from typing import Any, Dict
import time
from openai import AsyncOpenAI
from backend.core.config import settings
from backend.ai.services.base_adapter import BaseLLMAdapter

class LLMService(BaseLLMAdapter):
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4-turbo"  # Default configuration model

    async def generate_chat_response(
        self,
        system_prompt: str,
        user_prompt: str,
        history: list[dict],
        response_schema: Any = None
    ) -> Dict[str, Any]:
        
        # Build messages payload list
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_prompt})

        try:
            kwargs = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7,
            }
            
            # Request schema enforcement if structure is defined
            if response_schema:
                kwargs["response_format"] = {"type": "json_object"}

            response = await self.client.chat.completions.create(**kwargs)
            
            choice = response.choices[0]
            usage = response.usage

            return {
                "content": choice.message.content or "",
                "model_used": response.model,
                "prompt_tokens": usage.prompt_tokens if usage else None,
                "completion_tokens": usage.completion_tokens if usage else None,
                "finish_reason": choice.finish_reason or "stop",
                "provider_name": "OpenAI"
            }
            
        except Exception as e:
            # Fallback mock responses for local offline execution / dev validation
            if settings.ENVIRONMENT == "dev" or "mock-key" in settings.OPENAI_API_KEY:
                if "CV details" in system_prompt or "parser" in system_prompt or "CVAnalysis" in system_prompt or "extracted text" in user_prompt or "document parser" in system_prompt:
                    content_val = '{"personal_info": {"name": {"value": "John Doe", "confidence": "HIGH"}, "email": {"value": "john@example.com", "confidence": "HIGH"}}, "headline": {"value": "Software Engineer", "confidence": "MEDIUM"}, "summary": {"value": "Passionate developer.", "confidence": "LOW"}, "experience": []}'
                else:
                    content_val = '{"question": "What was your team size in that role?", "detected_gap": "team_size"}'
                return {
                    "content": content_val,
                    "model_used": "mock-gpt-model",
                    "prompt_tokens": 100,
                    "completion_tokens": 50,
                    "finish_reason": "stop",
                    "provider_name": "MockProvider"
                }
            raise e
