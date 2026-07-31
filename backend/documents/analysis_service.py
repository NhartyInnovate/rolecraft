import json
import os
import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, EmailStr, field_validator
from fastapi import HTTPException, status
from backend.ai.services.llm_service import LLMService
from backend.documents.schemas import ConfidenceLevel

# ----------------- VALIDATION SCHEMAS -----------------

class ExtractedFieldModel(BaseModel):
    value: Optional[str] = None
    confidence: float | str

    @field_validator("confidence")
    @classmethod
    def normalize_confidence(cls, v: float | str) -> str:
        # Coerce/normalize numerical confidence score limits to HIGH, MEDIUM, LOW strings
        if isinstance(v, (int, float)):
            if v >= 0.8:
                return ConfidenceLevel.HIGH.value
            elif v >= 0.5:
                return ConfidenceLevel.MEDIUM.value
            else:
                return ConfidenceLevel.LOW.value
        if isinstance(v, str):
            val_upper = v.upper()
            if val_upper in [ConfidenceLevel.HIGH.value, ConfidenceLevel.MEDIUM.value, ConfidenceLevel.LOW.value]:
                return val_upper
        return ConfidenceLevel.LOW.value

class EmailFieldModel(ExtractedFieldModel):
    @field_validator("value")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v:
            v_clean = v.strip()
            if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', v_clean):
                raise ValueError("Invalid email format")
            return v_clean
        return v

class PhoneFieldModel(ExtractedFieldModel):
    @field_validator("value")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v:
            v_clean = v.strip()
            # Basic validation: ensure it contains digits and allowed chars (+, -, spaces, parens)
            # Length should be reasonable
            if not re.match(r'^[\d\+\-\s\(\)]+$', v_clean) or len(v_clean) < 5:
                raise ValueError("Invalid phone format")
            return v_clean
        return v

class DateFieldModel(ExtractedFieldModel):
    @field_validator("value")
    @classmethod
    def validate_date(cls, v: Optional[str]) -> Optional[str]:
        if v:
            v_clean = v.strip()
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', v_clean):
                raise ValueError("Date must be in YYYY-MM-DD format")
            return v_clean
        return v

class WorkExperienceModel(BaseModel):
    company: ExtractedFieldModel
    role: ExtractedFieldModel
    start_date: DateFieldModel
    end_date: DateFieldModel

class EducationModel(BaseModel):
    institution: ExtractedFieldModel
    degree: ExtractedFieldModel
    graduation_year: ExtractedFieldModel

class SkillModel(BaseModel):
    name: ExtractedFieldModel

# Consolidated Document CV Schema result validator
class CVExtractionSchema(BaseModel):
    personal_info: Dict[str, Any]
    headline: ExtractedFieldModel
    summary: ExtractedFieldModel
    experience: List[WorkExperienceModel] = []
    education: List[EducationModel] = []
    skills: List[SkillModel] = []
    projects: List[Any] = []
    certifications: List[Any] = []

    @field_validator("personal_info")
    @classmethod
    def validate_personal_info(cls, v: Dict[str, Any]) -> Dict[str, Any]:
        required_keys = {"name", "email", "phone", "location"}
        if not required_keys.issubset(v.keys()):
            raise ValueError(f"personal_info missing required keys: {required_keys}")
        
        # Validate individual personal_info fields
        v["name"] = ExtractedFieldModel(**v["name"]).model_dump()
        v["email"] = EmailFieldModel(**v["email"]).model_dump()
        v["phone"] = PhoneFieldModel(**v["phone"]).model_dump()
        v["location"] = ExtractedFieldModel(**v["location"]).model_dump()
        return v

# Schema Registry mapping document types to Pydantic validators
DOCUMENT_SCHEMAS = {
    "cv": CVExtractionSchema
}

# ----------------- PROMPT LOADER -----------------

class PromptLoader:
    @staticmethod
    def load_prompt(document_type: str, version: str = "v1") -> str:
        # Load external prompts from prompts/ directory structure
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        prompt_path = os.path.join(base_dir, "prompts", document_type, f"{version}.txt")
        if not os.path.exists(prompt_path):
            raise FileNotFoundError(f"Prompt resource not found at path: {prompt_path}")
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()

# ----------------- ORCHESTRATION SERVICE -----------------

class DocumentAnalysisService:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    async def extract_document(self, document_type: str, text: str, version: str = "v1") -> Dict[str, Any]:
        # Validate document type registry support
        if document_type not in DOCUMENT_SCHEMAS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported document extraction type: {document_type}"
            )

        # 1. Load Prompt using versioned prompt loader
        try:
            system_prompt = PromptLoader.load_prompt(document_type, version)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load prompt template: {str(e)}"
            )

        # 2. Invoke LLM client adapter (raising ConnectionError or similar if keys are unavailable/mock)
        try:
            llm_response = await self.llm_service.generate_chat_response(
                system_prompt=system_prompt,
                user_prompt=f"Extracted document text:\n{text}",
                history=[],
                response_schema={"type": "json_object"}
            )
        except ConnectionError as ce:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="LLM provider unavailable. Please configure API keys."
            )
        except Exception as ex:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"LLM request failed: {str(ex)}"
            )

        # 3. Clean markdown fences or wraps from output content prior to json loads
        content = llm_response.get("content", "").strip()
        if content.startswith("```"):
            # Strip markdown block wrappers
            content = re.sub(r'^```(?:json)?\s*|\s*```$', '', content, flags=re.MULTILINE).strip()

        # 4. Strict JSON loader
        try:
            parsed_json = json.loads(content)
        except Exception as je:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"LLM returned invalid structured JSON representation: {str(je)}"
            )

        # 5. Schema validation using Registry validator schemas
        validator_cls = DOCUMENT_SCHEMAS[document_type]
        try:
            validated_model = validator_cls(**parsed_json)
            validated_data = validated_model.model_dump()
        except Exception as val_err:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document schema extraction validation failed: {str(val_err)}"
            )

        # Structured Logging Metrics
        print(f"[METRIC UPLOAD] DocType={document_type} "
              f"Model={llm_response.get('model_used')} "
              f"PromptVersion={version} "
              f"PromptTokens={llm_response.get('prompt_tokens')} "
              f"CompletionTokens={llm_response.get('completion_tokens')} "
              f"Status=SUCCESS")

        return validated_data

    # Maintain CV-specific method reference for backward compatibility if any
    async def analyze_cv_text(self, text: str) -> Dict[str, Any]:
        return await self.extract_document(document_type="cv", text=text, version="v1")

# Class alias for backward compatibility
CVAnalysisService = DocumentAnalysisService
