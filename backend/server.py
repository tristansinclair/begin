import json
import os
import uuid
from contextlib import asynccontextmanager
from typing import Any

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from clients.postgres_client import AsyncPostgresClient
from clients.logging_client import LoggingClient

from core.graphs.builder import create_initial_state_for_user, get_graph
from utils.api_models import (
    ChatRequest,
    ChunksRequest,
    ChunksResponse,
    HealthResponse,
    InvokeResponse,
    ServiceConsentsRequest,
    ServiceConsentsResponse,
    StartingMessagesResponse,
    StateResponse,
    StateUpdateRequest,
    ThreadIdResponse,
    ThreadsResponse,
)

# from utils.message_converter import (
#     convert_historical_messages,
#     create_user_message_for_graph,
#     get_default_message,
#     get_starting_messages,
#     invoke_graph_raw,
#     stream_graph_responses,
# )

# Load environment variables
load_dotenv()

# Configure logging
logger = LoggingClient.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    # Create db client and store in app.state
    app.state.db_client = AsyncPostgresClient()
    app.state.db_engine = app.state.db_client.get_engine()
    await app.state.db_client.open_checkpointer_pool()

    # Ping test on db engine and checkpointer pool
    await app.state.db_client.ping_engine()
    await app.state.db_client.ping_checkpointer_pool()

    # initialize PGVectorStore
    # app.state.pg_vectorstore = await create_vector_store(
    #     db_engine=app.state.db_engine
    # )

    # Create an async graph
    uncompiled_graph = get_graph()
    graph = uncompiled_graph.compile(
        checkpointer=app.state.db_client.get_checkpointer(),
    )
    app.state.graph = graph

    # FastAPI convention: app runs here
    yield

    # Shutdown: clean up resources
    await app.state.db_client.dispose_engine()
    await app.state.db_client.dispose_checkpointer_pool()
    await app.state.candidly_api.close()


app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_sse_headers() -> dict[str, str]:
    """
    Returns the headers required for Server-Sent Events (SSE).

    Returns:
        Dictionary of header name-value pairs.
    """
    return {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "X-Accel-Buffering": "no",  # Important for Nginx
    }


# async def get_or_initialize_thread_state(
#         user_id: str,
#         thread_id: str,
#         user_message: str,
#         candidly_token: str
# ) -> dict[str, Any]:
#     """
#     Gets the existing thread state or initializes a new one if it doesn't exist.

#     Args:
#         user_id: The ID of the user.
#         thread_id: The ID of the thread.
#         user_message: The user message content.
#         candidly_token: The Candidly authentication token.

#     Returns:
#         The input state for the graph.
#     """
#     config = {"configurable": {"thread_id": thread_id}}
#     thread_state = await app.state.graph.aget_state(config)

#     if thread_state.values.get("user_info", None) is None:
#         logger.info("New thread %s: Setting initial state for user %s", thread_id, user_id)

#         # Create initial state with user info
#         input_state = await create_initial_state_for_user(
#             user_id=user_id,
#             candidly_api=app.state.candidly_api,
#             candidly_token=candidly_token
#         )

#         # Add the user message
#         user_message_dict = create_user_message_for_graph(user_message)
#         input_state.update(user_message_dict)

#         return input_state

#     else:
#         # Existing thread - just add new message
#         return create_user_message_for_graph(user_message)


# error handling for header missing candidly_uuid and candidly_token
async def get_user_credentials(context: Request) -> tuple[str, str]:
    """
    Extract and validate user credentials from request headers.

    Args:
        context: The FastAPI request context.

    Returns:
        A tuple of (candidly_uuid, candidly_token).

    Raises:
        HTTPException: If headers are missing or invalid.
    """
    # attempt to get candidly_uuid from header
    candidly_uuid = context.headers.get("x-user-uuid")
    candidly_token = context.headers.get("x-candidly-token")

    if not candidly_uuid:
        logger.error("bad request made missing required header parameter: x-user-uuid")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="missing required header parameter: x-user-uuid",
        )

    try:
        uuid.UUID(candidly_uuid)
    except Exception as e:
        logger.error(f"invalid x-user-uuid header parameter received: {candidly_uuid}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid x-user-uuid header parameter",
        ) from e

    # devs can pass in any non-empty string to fake token when USE_SYNTHETIC_USERS=True
    if not candidly_token:
        logger.error(
            "bad request made missing required header parameter: x-candidly-token"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="missing required header parameter: x-candidly-token",
        )

    return candidly_uuid, candidly_token


@app.get("/health", response_model=HealthResponse)
async def health(context: Request):
    """
    Basic health check of client connections and server.

    Returns:
        HealthResponse with status and service information.
    """
    # initialize services dict
    health_status = {"status": "healthy", "services": {}}

    # database engine health check
    try:
        await context.app.state.db_client.ping_engine()
        health_status["services"]["database"] = {"status": "up"}
    except Exception:
        logger.exception("database health check failed")
        health_status["status"] = "degraded"
        health_status["services"]["database"] = {
            "status": "down",
            "error": "ping failed please check logs",
        }

    # checkpointer health check
    try:
        await context.app.state.db_client.ping_checkpointer_pool()
        health_status["services"]["checkpointer"] = {"status": "up"}
    except Exception:
        logger.exception("checkpointer health check failed")
        health_status["status"] = "degraded"
        health_status["services"]["checkpointer"] = {
            "status": "down",
            "error": "ping failed please check logs",
        }

    # phoenix llm tracing health check
    try:
        context.app.state.phoenix_client.ping_endpoint()
        health_status["services"]["phoenix"] = {"status": "up"}
    except Exception:
        logger.exception("phoenix health check failed")
        health_status["status"] = "degraded"
        health_status["services"]["checkpointer"] = {
            "status": "down",
            "error": "ping failed please check logs",
        }

    return health_status


def main():
    """Run the uvicorn server."""
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    port = int(os.getenv("BACKEND_PORT", "8000"))
    uvicorn.run(
        "server:app",
        host=host,
        port=port,
        reload=True,
        reload_dirs=(["."])
    )


if __name__ == "__main__":
    main()
