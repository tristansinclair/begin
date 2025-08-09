import os

import dotenv
from langchain.chat_models import init_chat_model

from clients.logging_client import LoggingClient

dotenv.load_dotenv()

logger = LoggingClient.get_logger(__name__)

MODEL_PROVIDER = os.environ.get("MODEL_PROVIDER")

PROVIDER_SMALL_MODEL_MAPPING = {
    "openai": "openai:gpt-4.1-mini",
}

PROVIDER_LARGE_MODEL_MAPPING = {
    "openai": "openai:gpt-4.1",
}

def get_chat_model():
    """Returns chat model used across the repository to enable easy configuration."""
    model_card = PROVIDER_LARGE_MODEL_MAPPING[MODEL_PROVIDER]
    model_name = model_card.split(":")[1]
    logger.info(f"Using chat model: {model_card}")

    return init_chat_model(
        model_card,
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        disable_streaming=False,
        tags=[model_name],
        stream_usage=True,
    )


def get_summary_model():
    """
    Returns summary model used across the repository to enable easy configuration.
    """
    model_card = PROVIDER_SMALL_MODEL_MAPPING[MODEL_PROVIDER]
    model_name = model_card.split(":")[1]
    logger.info(f"Using summary model: {model_card}")

    return init_chat_model(
        model_card,
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        disable_streaming=True,
        tags=[model_name],
        stream_usage=True,
    )


def get_guardrail_model():
    """
    Returns guardrail model optimized for fast security validation.
    Uses Claude Haiku for speed and efficiency in input validation.
    """
    model_card = PROVIDER_SMALL_MODEL_MAPPING[MODEL_PROVIDER]
    model_name = model_card.split(":")[1]
    logger.info(f"Using guardrail model: {model_card}")


    return init_chat_model(
        model_card,
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        disable_streaming=True,
        tags=[model_name],
        stream_usage=True,
    )


def get_safe_response_model():
    """
    Returns safe-response model optimized for fast appropriate responses.
    Uses Claude Haiku for speed and efficiency in response.
    """
    model_card = PROVIDER_SMALL_MODEL_MAPPING[MODEL_PROVIDER]
    model_name = model_card.split(":")[1]
    logger.info(f"Using safe-response model: {model_card}")


    return init_chat_model(
        model_card,
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        disable_streaming=False,
        tags=[model_name],
        stream_usage=True,
    )


def get_fast_model():
    """
    Returns fast model used across the repository to enable easy configuration.
    """
    model_card = PROVIDER_SMALL_MODEL_MAPPING[MODEL_PROVIDER]
    model_name = model_card.split(":")[1]
    logger.info(f"Using fast model: {model_card}")

    return init_chat_model(
        model_card,
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        disable_streaming=True,
        tags=[model_name],
        stream_usage=True,
    )


def get_sql_model():
    """
    Returns SQL model used across the repository to enable easy configuration.
    """
    model_card = PROVIDER_SMALL_MODEL_MAPPING[MODEL_PROVIDER]
    model_name = model_card.split(":")[1]
    logger.info(f"Using SQL model: {model_card}")

    return init_chat_model(
        model_card,
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        disable_streaming=True,
        tags=[model_name],
        stream_usage=True,
    )
