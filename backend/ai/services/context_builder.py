from abc import ABC, abstractmethod
from typing import List, Dict

class BaseContextBuilder(ABC):
    
    @abstractmethod
    def build_history_context(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        Parses messages history list and formats/summarizes it.
        """
        pass

class DefaultContextBuilder(BaseContextBuilder):
    def __init__(self, limit: int = 10):
        self.limit = limit

    def build_history_context(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        # Default truncation behavior
        truncated = messages[-self.limit:] if len(messages) > self.limit else messages
        formatted = []
        for msg in truncated:
            # Map role definitions to LLM standard formatting roles
            role = "assistant" if msg["role"].upper() == "AI" else msg["role"].lower()
            formatted.append({"role": role, "content": msg["content"]})
        return formatted
