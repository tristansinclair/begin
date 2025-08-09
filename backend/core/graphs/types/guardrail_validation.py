from pydantic import BaseModel


class ValidationResult(BaseModel):
    reasoning: str
    blocked: bool
