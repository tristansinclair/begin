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

from supabase import create_client, Client

from utils.message_converter import (
    convert_historical_messages,
    create_user_message_for_graph,
    get_default_message,
    get_starting_messages,
    invoke_graph_raw,
    stream_graph_responses,
)

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

    # supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    app.state.supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_ANON_KEY"))

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


async def validate_thread_id(user_id: str, thread_id: str, context: Request) -> None:
    # get db_client from app context
    db_client = context.app.state.db_client

    # confirm thread id against conversations table
    try:
        thread_id_valid = await db_client.confirm_thread_id(
            user_id=user_id,
            thread_id=thread_id
        )

    except Exception as e:
        logger.exception(f"error validating thread_id {thread_id} for user_id {user_id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error validating thread_id {thread_id} for user_id {user_id}"
        ) from e

    # raise 404 if thread_id doesn't exist or is mis-matched
    if not thread_id_valid:
        logger.error(f"thread validation failed for user_id {user_id} and thread_id {thread_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"thread_id {thread_id} not found for user_id {user_id}"
        )

async def get_or_initialize_thread_state(
        user_id: str,
        thread_id: str,
        user_message: str,
) -> dict[str, Any]:
    """
    Gets the existing thread state or initializes a new one if it doesn't exist.

    Args:
        user_id: The ID of the user.
        thread_id: The ID of the thread.
        user_message: The user message content.
        candidly_token: The Candidly authentication token.

    Returns:
        The input state for the graph.
    """
    config = {"configurable": {"thread_id": thread_id}}
    thread_state = await app.state.graph.aget_state(config)

    if thread_state.values.get("user_info", None) is None:
        logger.info("New thread %s: Setting initial state for user %s", thread_id, user_id)

        # Create initial state with user info
        input_state = await create_initial_state_for_user(
            user_id=user_id,
        )

        # Add the user message
        user_message_dict = create_user_message_for_graph(user_message)
        input_state.update(user_message_dict)

        return input_state

    else:
        # Existing thread - just add new message
        return create_user_message_for_graph(user_message)


async def get_user_credentials(context: Request) -> str:
    """
    Check if a user is authenticated with Supabase.
    Extract the JWT token from Authorization header and verify with Supabase.
    Returns the user ID string.
    """
    # Get the Authorization header
    auth_header = context.headers.get("Authorization")
    
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    # Extract the token (Bearer <token>)
    try:
        scheme, token = auth_header.split(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format"
        )
    
    # Verify the token with Supabase
    try:
        response = context.app.state.supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        return response.user.id
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )


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

    return health_status


@app.get("/get_user")
async def get_user(context: Request):
    """
    Test the authentication of the user. Return the user info.
    """
    # Get the Authorization header and retrieve full user details
    auth_header = context.headers.get("Authorization")
    
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    # Extract the token (Bearer <token>)
    try:
        scheme, token = auth_header.split(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format"
        )
    
    # Verify the token with Supabase and get full user details
    try:
        response = context.app.state.supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        # Extract user details
        user = response.user
        return {
            "authenticated": True,
            "user_id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "metadata": user.user_metadata
        }
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )


@app.post("/threads/{thread_id}/chat")
async def chat_stream(thread_id: str, request: ChatRequest, context: Request) -> StreamingResponse:
    """
    Primary chat endpoint that streams messages for chat and tool calls.

    Args:
        thread_id: The unique identifier for the thread.
        context: FastAPI application context.
        request: The chat request containing message and optional default_message_id.

    Returns:
        A streaming response with SSE-formatted events.
    """
    # ensure user_id and token are in request (raises HTTP errors on failure)
    user_id = await get_user_credentials(context)

    # validate user_id thread_id pair (raises HTTP errors on failure)
    await validate_thread_id(
        user_id=user_id,
        thread_id=thread_id,
        context=context
    )

    try:
        logger.info("Starting chat stream for thread: %s", thread_id)

        # Handle default message if specified
        if request.default_message_id:
            default_content = get_default_message(request.default_message_id)
            if default_content:
                logger.info("Using default message: %s", request.default_message_id)

                # Stream the default message
                async def stream_default():
                    chunks = [
                        {"id": str(uuid.uuid4()), "type": "ai_message", "content": default_content},
                        {"type": "done"},
                    ]
                    for chunk in chunks:
                        yield f"data: {json.dumps(chunk)}\n\n"

                return StreamingResponse(stream_default(), media_type="text/event-stream", headers=get_sse_headers())
            else:
                logger.warning("Default message not found: %s", request.default_message_id)

        # initialize input state and config for graph
        input_state = await get_or_initialize_thread_state(
            user_id=user_id,
            thread_id=thread_id,
            user_message=request.message,
        )

        config = {
            "configurable": {
                "thread_id": thread_id,
                "user_id": user_id,
                "db_client": context.app.state.db_client,
                "db_engine": context.app.state.db_engine,
                # "pg_vectorstore": context.app.state.pg_vectorstore,
            }
        }

        # Stream the response
        return StreamingResponse(
            stream_graph_responses(app.state.graph, input_state, config, thread_id),
            media_type="text/event-stream",
            headers=get_sse_headers(),
        )

    except Exception as e:
        logger.exception(f"Error in chat stream for thread {thread_id}")
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}") from e


@app.post("/generate-thread-id", status_code=status.HTTP_201_CREATED, response_model=ThreadIdResponse)
async def generate_thread_id(context: Request):
    """
    Generates a thread UUID for the frontend to use and defines a
    user_id / thread_id in the conversations table.

    Args:
        context: FastAPI application context.

    Returns:
        ThreadIdResponse with a new UUID.
    """
    # ensure user_id and token are in request (raises HTTP errors on failure)
    user_id = await get_user_credentials(context)

    # log the user response
    logger.info(f"user_id: {user_id}")





    # initialize thread_id and get db_client from context
    thread_id = str(uuid.uuid4())
    db_client = context.app.state.db_client

    # attempt to insert thread_id user_id pair
    try:
        await db_client.insert_thread_id(
            user_id=user_id,
            thread_id=thread_id,
        )
        logger.info(f"generated new thread_id {thread_id} for user_id {user_id}")

        return ThreadIdResponse(thread_id=thread_id)

    except Exception as e:
        logger.exception(f"error generating thread_id {thread_id} for user_id {user_id}")
        raise HTTPException(status_code=500, detail="could not create thread_id") from e


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
