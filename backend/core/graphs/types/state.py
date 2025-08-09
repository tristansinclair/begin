from typing import Annotated

from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field

from core.graphs.types.guardrail_validation import ValidationResult


class CandidlyAgentState(BaseModel):
    messages: Annotated[list[AnyMessage], add_messages]

    # -- Needed for our custom react agent --
    react_loop_iterations: int

    # -- Guardrail status tracking --
    guardrail_assessment: ValidationResult | None = None
    blocked_message_ids: set[str] = Field(default_factory=set)
