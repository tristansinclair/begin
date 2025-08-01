import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)


def configure_langsmith() -> bool:
    """
    Configure LangSmith tracing based on environment variables.
    
    Required environment variables:
    - LANGCHAIN_API_KEY: Your LangSmith API key
    
    Optional environment variables:
    - LANGCHAIN_TRACING_V2: Enable tracing (default: true if API key is set)
    - LANGCHAIN_ENDPOINT: LangSmith endpoint (default: https://api.smith.langchain.com)
    - LANGCHAIN_PROJECT: Project name for organizing traces (default: "ReAct-Agent")
    
    Returns:
        bool: True if LangSmith is configured and enabled, False otherwise
    """
    
    api_key = os.getenv("LANGCHAIN_API_KEY")
    
    if not api_key:
        logger.info("LangSmith tracing disabled: LANGCHAIN_API_KEY not found")
        return False
    
    # Set default values for LangSmith configuration
    os.environ.setdefault("LANGCHAIN_TRACING_V2", "true")
    os.environ.setdefault("LANGCHAIN_ENDPOINT", "https://api.smith.langchain.com")
    os.environ.setdefault("LANGCHAIN_PROJECT", "ReAct-Agent")
    
    # Log the configuration
    project_name = os.getenv("LANGCHAIN_PROJECT")
    endpoint = os.getenv("LANGCHAIN_ENDPOINT")
    
    logger.info(f"LangSmith tracing enabled:")
    logger.info(f"  - Project: {project_name}")
    logger.info(f"  - Endpoint: {endpoint}")
    logger.info(f"  - API Key: {'*' * (len(api_key) - 4) + api_key[-4:] if len(api_key) > 4 else '***'}")
    
    return True


def get_langsmith_config() -> dict:
    """Get current LangSmith configuration as a dictionary."""
    return {
        "enabled": os.getenv("LANGCHAIN_TRACING_V2", "false").lower() == "true",
        "api_key_set": bool(os.getenv("LANGCHAIN_API_KEY")),
        "project": os.getenv("LANGCHAIN_PROJECT", "ReAct-Agent"),
        "endpoint": os.getenv("LANGCHAIN_ENDPOINT", "https://api.smith.langchain.com")
    }


def create_run_name(message: str, thread_id: str) -> str:
    """Create a descriptive run name for LangSmith traces."""
    # Truncate message if too long
    truncated_message = message[:50] + "..." if len(message) > 50 else message
    return f"Chat: {truncated_message} (Thread: {thread_id})"