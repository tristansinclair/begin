"""
Message Redaction Utility

Provides functionality to redact blocked messages from conversation history
while preserving the original messages in state. This allows the main agent
to receive a clean, policy-compliant version of the conversation.
"""

from langchain_core.messages import AnyMessage, SystemMessage

def create_redacted_messages(
    messages: list[AnyMessage], 
    blocked_ids: set[str],
    redaction_text: str = "User message blocked by content policy, ignore"
) -> list[AnyMessage]:
    """
    Create a redacted version of the message history where blocked messages
    are replaced with system messages indicating content was blocked.
    
    Args:
        messages: Original list of messages from state
        blocked_ids: Set of message IDs that should be redacted
        redaction_text: System message text to replace blocked messages with
        
    Returns:
        List of messages with blocked messages replaced by system messages
    """
    if not blocked_ids:
        return messages
    
    redacted_messages = []
    
    for message in messages:
        # Handle both dict and LangChain message object formats
        message_id = message.id if hasattr(message, 'id') else message.get('id')
        
        if message_id in blocked_ids:
            # Replace blocked message with SystemMessage indicating content was blocked
            # This maintains logical coherence and gives clear instruction to ignore
            redacted_message = SystemMessage(content=redaction_text)
            redacted_messages.append(redacted_message)
        else:
            redacted_messages.append(message)
    
    return redacted_messages