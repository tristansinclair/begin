"""
Utility functions for extracting and processing conversation context from message lists.

This module provides shared functionality for parsing messages and extracting conversation
context that can be used across different nodes in the graph.
"""

from typing import Any, Tuple

from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langchain_core.messages import AnyMessage


def parse_message(msg: AnyMessage) -> Tuple[str, str]:
    """Extract content from a message, handling different message types.
    
    Args:
        msg: A message object of any supported type (HumanMessage, AIMessage, ToolMessage, etc.)
        
    Returns:
        Tuple of (message_type, content) where message_type is a string identifier
        and content is the extracted text content.
    """
    match msg:
        case HumanMessage():
            msg_type = "user"
        case AIMessage():
            msg_type = "assistant"
        case ToolMessage():
            msg_type = "tool"
        case _:
            msg_type = "unknown"

    match msg.content:
        case list() as content_list:
            content = ' '.join([el.get('text', str(el)) for el in content_list if isinstance(el, dict) and 'text' in el])
            if not content:
                content = str(msg.content)
        case str() as content_str:
            content = content_str
        case _:
            content = str(msg.content)

    return msg_type, content.strip()


def extract_conversation_context(messages: list[AnyMessage], max_human_messages: int = 2) -> Tuple[str, str]:
    """
    Extract the latest human message for analysis and all messages up to and including the previous N human messages for context.

    Args:
        messages: List of messages from state.messages
        max_human_messages: Maximum number of previous human messages to include in context (default: 2)

    Returns:
        Tuple of (latest_human_message, formatted_context)
    """
    # Extract the latest human message for analysis
    latest_message_content = ""
    if messages and hasattr(messages[-1], 'content'):
        latest_message_content = str(messages[-1].content)

    # Build context from previous messages up to and including the previous N human messages
    context_messages = []
    human_message_count = 0

    # Work backwards through messages (excluding the latest one) until we find max_human_messages human messages
    for msg in reversed(messages[:-1]):
        # Extract content based on message type
        msg_type, content = parse_message(msg)

        if isinstance(msg, ToolMessage):
            content = '\n'.join([el for el in content.split('\n') if el.strip() != ''][:5]) + '\n[Details shown to user omitted here for brevity.]'

        # Add to context if we have valid content
        if msg_type and content:
            context_messages.append(f"<{msg_type}>{content}</{msg_type}>")

            # Count human messages
            if isinstance(msg, HumanMessage):
                human_message_count += 1

                # Stop if we've reached the desired number of human messages
                if human_message_count >= max_human_messages:
                    break

    # Reverse to get chronological order
    recent_context = list(reversed(context_messages))

    # Format context
    formatted_context = "\n".join(recent_context).strip()

    return latest_message_content, formatted_context
