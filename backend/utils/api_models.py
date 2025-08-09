"""
API Models for the refactored backend endpoints.

These models define the clean interface contracts without any LangGraph/LangChain dependencies.
They match the API specification from the task context document.
"""

from typing import Any, Literal

from langchain_core.documents import Document
from pydantic import BaseModel


# Request Models
class ChatRequest(BaseModel):
    """Request model for the chat endpoint."""

    message: str
    default_message_id: str | None = None


class StateUpdateRequest(BaseModel):
    """Request model for updating thread state."""

    values: dict[str, Any]


class ChunksRequest(BaseModel):
    """Request model for retrieving chunks by IDs."""

    ids: list[str]


class ServiceConsentsRequest(BaseModel):
    """Request model for inserting and updating service consents."""
    services: list[str]

# Response Models for SSE Streaming
class AIMessageChunk(BaseModel):
    """AI message chunk for streaming."""

    id: str
    type: Literal["ai_message"]
    content: str


class ArtifactChunk(BaseModel):
    """Artifact chunk for streaming."""

    id: str
    type: Literal["artifact"]
    artifact: dict[str, Any]

class SuggestedMessagesChunk(BaseModel):
    """Suggested messages chunk for streaming."""

    id: str
    type: Literal["suggested-messages"]
    content: list[dict[str, str]]  # [{"label": "...", "message": "..."}]


class ErrorChunk(BaseModel):
    """Error chunk for streaming."""

    id: str
    type: Literal["error"]
    content: str


class StateUpdateChunk(BaseModel):
    """State update chunk for streaming."""

    type: Literal["state_update"]
    state: dict[str, Any]


class DoneChunk(BaseModel):
    """End of stream marker."""

    type: Literal["done"]


# Response Models for Regular Endpoints
class ThreadIdResponse(BaseModel):
    """Response for thread ID generation."""

    thread_id: str

class ThreadsResponse(BaseModel):
    """Response for requesting a list of user's threads."""

    threads: list[dict[str, Any]]

class StartingMessagesResponse(BaseModel):
    """Response for starting messages."""

    id: str
    starting_messages: list[dict[str, str]]  # [{"label": "...", "message": "..."}]


class StateResponse(BaseModel):
    """Response for thread state."""

    id: str
    state: dict[str, Any]


class HealthResponse(BaseModel):
    """Response for health check."""

    status: str
    services: dict[str, dict]


class ChunksResponse(BaseModel):
    """Response for chunks retrieval."""

    # TODO: Investigate what type this is.
    chunks: list[Any]


class ServiceConsentsResponse(BaseModel):
    """Response model for retrieving a list of service consents for a user."""
    service_consents: list[dict[str, Any]]


# Internal Models for Message Processing
class ProcessedMessage(BaseModel):
    """Internal model for processed messages."""
    id: str
    type: Literal["human", "ai_message", "artifact"]
    content: str | None = None
    # Additional fields for artifact messages
    artifact: dict[str, Any] | None = None

class InvokeResponse(BaseModel):
    """Response for invoke endpoint - raw graph output for testing."""
    raw_output: dict[str, Any]  # Exactly what .ainvoke() returns


class ConversionResult(BaseModel):
    """Result of message conversion process."""

    messages: list[ProcessedMessage]


class RagDocResponse(BaseModel):
    """Result of message conversion process."""

    result: list[Document]
