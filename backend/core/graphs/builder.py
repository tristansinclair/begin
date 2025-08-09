"""
Graph builder module for configuring agent graphs based on environment variables.

This module provides a centralized way to configure different agent graphs
based on CLIENT and CAIT_ARCHITECTURE environment variables.
"""

import os
from typing import Any, Set, Tuple

from langgraph.graph import StateGraph

from clients.logging_client import LoggingClient
from core.graphs.single_agent import graph as single_agent_graph

# Configure logging
logger = LoggingClient.get_logger(__name__)

# Define allowed combinations of CLIENT and CAIT_ARCHITECTURE
ALLOWED_COMBINATIONS: Set[Tuple[str, str]] = {
    ("CANDIDLY", "SINGLE_REACT_AGENT"),
    ("VANGUARD", "SWARM"),
}

# Map combinations to their respective graphs
GRAPH_MAP: dict[Tuple[str, str], StateGraph] = {
    ("CANDIDLY", "SINGLE_REACT_AGENT"): single_agent_graph,
}


def _get_env_variables() -> Tuple[str, str]:
    """
    Get and validate required environment variables.

    Returns:
        Tuple of (client, architecture) values.

    Raises:
        ValueError: If required environment variables are missing.
    """
    client = os.getenv("CLIENT")
    architecture = os.getenv("CAIT_ARCHITECTURE")

    if not client:
        raise ValueError("CLIENT environment variable is required")

    if not architecture:
        raise ValueError("CAIT_ARCHITECTURE environment variable is required")

    return client, architecture


def _validate_combination(client: str, architecture: str) -> None:
    """
    Validate that the client and architecture combination is supported.

    Args:
        client: The client name (e.g., "CANDIDLY", "VANGUARD").
        architecture: The architecture type (e.g., "SINGLE_REACT_AGENT", "SWARM").

    Raises:
        ValueError: If the combination is not supported.
    """
    combination = (client, architecture)

    if combination not in ALLOWED_COMBINATIONS:
        raise ValueError(
            f"{client} does not yet support {architecture} configuration. "
            f"Allowed combinations: {', '.join([f'{c}+{a}' for c, a in ALLOWED_COMBINATIONS])}"
        )


def get_graph() -> StateGraph:
    """
    Returns the configured uncompiled graph based on environment variables.

    Reads CLIENT and CAIT_ARCHITECTURE environment variables to determine
    which graph configuration to return.

    Returns:
        StateGraph: The uncompiled graph for the specified configuration.

    Raises:
        ValueError: If environment variables are missing or combination is unsupported.
    """
    client, architecture = _get_env_variables()

    logger.info("Configuring graph for CLIENT=%s, CAIT_ARCHITECTURE=%s", client, architecture)

    _validate_combination(client, architecture)

    combination = (client, architecture)
    graph = GRAPH_MAP[combination]

    logger.info("Successfully configured %s graph for %s client", architecture, client)

    return graph


async def create_initial_state_for_user(user_id: str, **kwargs) -> dict[str, Any]:
    """
    Creates initial state for a user based on the configured CLIENT.

    This function serves as a unified entry point for state initialization,
    dispatching to the appropriate client-specific function based on the
    CLIENT environment variable.

    Args:
        user_id: The ID of the user to create initial state for.
        **kwargs: Additional keyword arguments:
            - candidly_api: CandidlyAPIClient instance
            - candidly_token: Candidly authentication token

    Returns:
        Dict[str, Any]: The initial state dictionary for the user.

    Raises:
        ValueError: If CLIENT environment variable is missing or unsupported.
    """
    # generate user info object
    # user_info = await candidly_api.get_user_candidly_info(
    #     candidly_token=candidly_token,
    #     user_id=user_id
    # )

    # Return initial state with user info
    user_info = {
        "user_info": user_id,
        "react_loop_iterations": 0,
        "guardrail_assessment": None,
    }

    return user_info