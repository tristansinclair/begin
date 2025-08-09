"""
Message Conversion Layer for LangGraph Integration.

This module handles all LangGraph/LangChain specific logic, converting between
LangGraph types and the clean API format. This keeps server.py framework-agnostic.
"""

import json
import uuid
from datetime import date, datetime
from typing import Any, AsyncGenerator

from langchain_core.messages import AIMessage, AIMessageChunk, BaseMessage, HumanMessage, ToolMessage

from clients.logging_client import LoggingClient
from core.graphs.types.artifact import StreamingArtifact
from utils.api_models import (
    ConversionResult,
    ProcessedMessage,
)

# Configure logging
logger = LoggingClient.get_logger(__name__)

# In-memory storage for default messages (future: move to database)
DEFAULT_MESSAGES = {
    "welcome_message_1": (
        "Welcome to Cait! I'm here to help you with your"
        " financial planning. How can I assist you today?"
    ),
    "demo_analysis": "Let me analyze your financial situation and provide some insights...",
    "portfolio_review": "I'll review your investment portfolio and suggest optimizations...",
}

# Hardcoded starting messages (future: move to database)
STARTING_MESSAGES = [
    {"label": "Portfolio Analysis", "message": "Can you analyze my investment portfolio?"},
    {"label": "Debt Optimization", "message": "How can I optimize my student loan payments?"},
    {"label": "Retirement Planning", "message": "Help me plan for retirement savings."},
    {"label": "College Planning", "message": "What are my options for college funding?"},
]


class StateGraphEncoder(json.JSONEncoder):
    """Custom JSON encoder for LangGraph state objects."""

    def default(self, obj):
        if isinstance(obj, BaseMessage):
            return obj.to_json()["kwargs"]
        if hasattr(obj, "__dict__"):  # For RowData or similar objects
            return obj.__dict__
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        return super().default(obj)


def get_default_message(message_id: str) -> str | None:
    """
    Retrieve a default message by ID.

    Args:
        message_id: The ID of the default message to retrieve.

    Returns:
        The default message content, or None if not found.
    """
    return DEFAULT_MESSAGES.get(message_id)


def get_starting_messages() -> list[dict[str, str]]:
    """
    Get the hardcoded starting messages.

    Returns:
        List of starting message dictionaries with 'label' and 'message' keys.
    """
    return STARTING_MESSAGES.copy()


def should_convert_tool_to_artifact(tool_message: ToolMessage) -> bool:
    """
    Determine if a ToolMessage should be converted to an artifact.

    Args:
        tool_message: The ToolMessage to check.

    Returns:
        True if the tool message should become an artifact, False otherwise.
    """
    # Check if tool has artifact data indicating visual display
    return hasattr(tool_message, 'artifact') and bool(tool_message.artifact)


def convert_ai_message_chunk_for_streaming(chunk: AIMessageChunk) -> dict[str, Any] | None:
    """
    Convert an AIMessageChunk for SSE streaming.

    AIMessageChunks can look like this:
    - { content="Hi world" }
    - { content=[{'type': 'tool_use', 'input': 'du', 'id': None, 'index': 1}] }
    - { content=[{'index': 1}] }
    - { content=[] }
    - { content=[{'type': 'text', 'text': 'Hello, world!'}] }

    Args:
        chunk: The AIMessageChunk from LangGraph.

    Returns:
        Dictionary in API format, or None if chunk should be filtered.
    """
    if not hasattr(chunk, "content") or not chunk.content:
        logger.debug("Filtering empty AI message chunk")
        return None

    content = chunk.content

    # Pull text out of content for Anthropic models
    if isinstance(content, list):
        embedded_content_chunk = content[0]

        text_check = (
            isinstance(embedded_content_chunk, dict) and
            embedded_content_chunk.get("type","") == "text" and
            embedded_content_chunk.get("text", "")
        )

        if text_check:
            content = embedded_content_chunk.get("text", "")
        else:
            logger.debug(
                "Skipping non-text content in AI Message Chunk. Content type: %s",
                type(embedded_content_chunk),
            )
            return None

    return {"id": chunk.id, "type": "ai_message", "content": content}


def convert_tool_message_for_streaming(tool_message: ToolMessage) -> dict[str, Any] | None:
    """
    Convert a ToolMessage for SSE streaming.

    Args:
        tool_message: The ToolMessage from LangGraph.

    Returns:
        Dictionary in API format (artifact), or None if tool should be filtered.
    """
    if not should_convert_tool_to_artifact(tool_message):
        logger.debug("Filtering tool message: %s", tool_message.name)
        return None

    logger.info("Converting ToolMessage to artifact for tool_call_id: %s", tool_message.tool_call_id)

    # Build the flattened artifact chunk
    chunk: dict[str, Any] = {"id": tool_message.tool_call_id, "type": "artifact"}

    # If artifact data is provided, flatten it into the chunk
    if hasattr(tool_message, 'artifact') and isinstance(tool_message.artifact, dict):
        chunk["artifact"] = tool_message.artifact

    return chunk


def process_streaming_chunk(stream_mode: str, chunk: Any, thread_id: str) ->str | None:
    """
    Process a stream chunk from LangGraph and format it for SSE.

    Args:
        stream_mode: The mode of the stream chunk ("messages" or "values").
        chunk: The chunk data from LangGraph.
        thread_id: The ID of the thread (for logging).

    Returns:
        SSE-formatted data string, or None if chunk should be skipped.
    """
    if stream_mode == "messages":
        logger.debug("Processing message chunk for thread %s", thread_id)

        # Handle AI message chunks
        if isinstance(chunk[0], AIMessageChunk):
            formatted_chunk = convert_ai_message_chunk_for_streaming(chunk[0])
            if formatted_chunk:
                return f"data: {json.dumps(formatted_chunk)}\n\n"

        return None

    elif stream_mode == "custom":

        if isinstance(chunk, StreamingArtifact):
            serialized_artifact = chunk.model_dump(mode="json")
            return f"data: {json.dumps(serialized_artifact)}\n\n"

        return None

    elif stream_mode == "values":
        # Handle state updates - only stream state updates, not suggested messages
        try:
            # Work with the chunk dict directly before serialization
            filtered_state_dict = {}

            # Only convert messages if the key exists
            if "messages" in chunk:
                converted_messages = convert_historical_messages(chunk["messages"]).messages
                filtered_state_dict["messages"] = converted_messages

            # Include artifacts if the key exists (even if empty list)
            if "artifacts" in chunk:
                filtered_state_dict["artifacts"] = chunk["artifacts"]

            # Return None if neither messages nor artifacts keys are present
            if not filtered_state_dict:
                return None

            state_chunk = {
                "type": "state_update",
                "state": filtered_state_dict,
            }

            return f"data: {json.dumps(state_chunk, cls=StateGraphEncoder)}\n\n"

        except (TypeError, ValueError) as err:
            logger.error("Error serializing state for thread %s: %s", thread_id, err, exc_info=True)
            # Handle non-serializable objects gracefully
            fallback_chunk = {"type": "state_update", "state": {"error": "State not serializable"}}
            return f"data: {json.dumps(fallback_chunk)}\n\n"

    else:
        logger.debug("Ignoring stream mode: %s", stream_mode)
        return None


def convert_historical_messages(messages: list[BaseMessage]) -> ConversionResult:
    """
    Convert historical messages from LangGraph format to API format.

    This includes human messages, AI messages, and converts ToolMessages to artifacts.
    Used for the GET state endpoint.

    Args:
        messages: List of LangGraph BaseMessage objects.

    Returns:
        ConversionResult with processed messages.
    """
    processed_messages = []

    for msg in messages:
        if isinstance(msg, HumanMessage):
            content = msg.content
            processed_messages.append(ProcessedMessage(type="human", content=content, id=msg.id))

        elif isinstance(msg, AIMessage):
            content = msg.content

            if isinstance(content, list):

                text_parts = []
                for item in content:
                    if isinstance(item, str):
                        text_parts.append(item)
                    elif isinstance(item, dict) and "text" in item:
                        text_parts.append(item["text"])
                    elif hasattr(item, "text"):
                        text_parts.append(item.text)

                # If there are no text parts, skip the message
                if not text_parts:
                    continue

                content = " ".join(text_parts)

            processed_messages.append(ProcessedMessage(type="ai_message", content=content, id=msg.id))

        elif isinstance(msg, ToolMessage) and should_convert_tool_to_artifact(msg):
            # Build the processed message with artifact data
            processed_msg = ProcessedMessage(
                type="artifact",
                content=None,
                id=msg.tool_call_id
            )

            # If artifact data is provided, flatten it into the message
            if hasattr(msg, 'artifact') and isinstance(msg.artifact, dict):
                processed_msg.artifact = msg.artifact

            processed_messages.append(processed_msg)

            logger.info("Converted historical ToolMessage to artifact: %s", msg.tool_call_id)

        else:
            # Filter out internal messages
            logger.debug("Filtering internal message type: %s", type(msg).__name__)

    return ConversionResult(messages=processed_messages)


async def  stream_graph_responses(
    graph, input_state: dict[str, Any], config: dict[str, Any], thread_id: str
) -> AsyncGenerator[str, None]:
    """
    Stream responses from the LangGraph and convert them to API format.

    Args:
        graph: The compiled LangGraph instance.
        input_state: The input state for the graph.
        config: The configuration for the graph execution.
        thread_id: The thread ID for logging.

    Yields:
        SSE-formatted data strings.
    """
    try:
        logger.info("Starting graph stream for thread: %s", thread_id)

        stream_modes = ["messages", "values", "custom"]

        async for stream_mode, chunk in graph.astream(input_state, config=config, stream_mode=stream_modes):
            try:
                formatted_data = process_streaming_chunk(stream_mode, chunk, thread_id)
                if formatted_data:
                    yield formatted_data
            except Exception as chunk_error:
                logger.error(
                    "Error processing stream chunk for thread %s: %s", thread_id, str(chunk_error), exc_info=True
                )
                error_chunk = {"id": str(uuid.uuid4()), "type": "error", "content": "Error processing response chunk"}
                yield f"data: {json.dumps(error_chunk)}\n\n"

        # Signal end of stream
        done_chunk = {"type": "done"}
        yield f"data: {json.dumps(done_chunk)}\n\n"

        logger.info("Completed graph stream for thread: %s", thread_id)

    except Exception as e:
        logger.error("Error in graph stream for thread %s: %s", thread_id, str(e), exc_info=True)
        error_chunk = {"id": str(uuid.uuid4()), "type": "error", "content": str(e)}
        yield f"data: {json.dumps(error_chunk)}\n\n"


async def invoke_graph_raw(
    graph, input_state: dict[str, Any], config: dict[str, Any]
) -> dict[str, Any]:
    """
    Invoke graph and return completely raw output for testing.

    Args:
        graph: The compiled LangGraph instance.
        input_state: The input state for the graph.
        config: The configuration for the graph execution.

    Returns:
        The raw output from graph.ainvoke() without any processing.
    """
    return await graph.ainvoke(input_state, config=config)


def create_user_message_for_graph(content: str) -> dict[str, Any]:
    """
    Create a user message in the format expected by LangGraph.

    Args:
        content: The message content from the user.

    Returns:
        Dictionary representing a HumanMessage for LangGraph.
    """
    return {"messages": [HumanMessage(content=content)]}
