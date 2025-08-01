import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
from dotenv import load_dotenv

from clients.postgres_client import AsyncPostgresClient
from core.chat_agent import ChatAgent
from core.langsmith_config import configure_langsmith, get_langsmith_config

load_dotenv()

# Configure LangSmith tracing
langsmith_enabled = configure_langsmith()

db_client: Optional[AsyncPostgresClient] = None
chat_agent: Optional[ChatAgent] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_client, chat_agent
    db_client = AsyncPostgresClient()
    chat_agent = ChatAgent()
    
    try:
        await db_client.ping_engine()
        await db_client.open_checkpointer_pool()
        await db_client.ping_checkpointer_pool()
    except Exception as e:
        print(f"Database connection failed: {e}")
    
    yield
    
    if db_client:
        await db_client.dispose_engine()
        await db_client.dispose_checkpointer_pool()


app = FastAPI(
    title="Backend API",
    description="FastAPI backend with PostgreSQL connectivity and LangGraph chat",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    database: str
    langsmith: bool


class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    response: str
    thread_id: str


@app.get("/")
async def root():
    return {"message": "Backend API is running"}


@app.get("/health", response_model=HealthResponse)
async def health_check():
    db_status = "disconnected"
    
    if db_client and db_client.engine:
        try:
            await db_client.ping_engine()
            db_status = "connected"
        except Exception:
            db_status = "error"
    
    return HealthResponse(
        status="healthy",
        database=db_status,
        langsmith=langsmith_enabled
    )


@app.get("/db/test")
async def test_db():
    if not db_client or not db_client.engine:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        from sqlalchemy import text
        async with db_client.engine.connect() as conn:
            result = await conn.execute(text("SELECT 1 as test_value, NOW() as current_time"))
            row = result.fetchone()
            return {
                "test_value": row[0],
                "current_time": str(row[1]),
                "message": "Database connection successful"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not chat_agent:
        raise HTTPException(status_code=503, detail="Chat agent not available")
    
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")
    
    try:
        response = await chat_agent.chat(request.message, request.thread_id)
        return ChatResponse(
            response=response,
            thread_id=request.thread_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/tools")
async def get_available_tools():
    """Get list of available tools for the ReAct agent."""
    if not chat_agent:
        raise HTTPException(status_code=503, detail="Chat agent not available")
    
    try:
        tools = chat_agent.get_available_tools()
        return {
            "tools": tools,
            "description": "Available tools that the ReAct agent can use during conversations"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting tools: {str(e)}")


@app.get("/langsmith/config")
async def get_langsmith_config_endpoint():
    """Get LangSmith tracing configuration status."""
    config = get_langsmith_config()
    return {
        "langsmith_tracing": config,
        "setup_instructions": {
            "required_env_vars": [
                "LANGCHAIN_API_KEY - Your LangSmith API key"
            ],
            "optional_env_vars": [
                "LANGCHAIN_PROJECT - Project name (default: 'ReAct-Agent')",
                "LANGCHAIN_ENDPOINT - LangSmith endpoint (default: 'https://api.smith.langchain.com')",
                "LANGCHAIN_TRACING_V2 - Enable tracing (default: 'true' if API key is set)"
            ],
            "langsmith_url": "https://smith.langchain.com"
        }
    }


if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )