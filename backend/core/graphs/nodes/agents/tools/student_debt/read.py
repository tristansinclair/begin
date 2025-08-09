from typing import Annotated, Literal

from langchain.tools import tool
from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import ToolException
from langchain_core.tools.base import InjectedToolCallId
from langgraph.types import Command

from clients.logging_client import LoggingClient
from core.graphs.utils.rag.helpers import format_chunks, retrieve_relevant_chunks

logger = LoggingClient.get_logger(__name__)

@tool
async def query_knowledgebase(
    query: str,
    tool_call_id: Annotated[str, InjectedToolCallId],
    config: RunnableConfig,
) -> Command[Literal["student_debt_agent"]]:
    """
    Use this tool to query your knowledge base for information by passing a query "string".

    Args:
        query: string to use for researching the konwledge base.

    Returns:
        A list of chunks of relevant data found in the knowledge base.

    """
    try:
        chunks = await retrieve_relevant_chunks(query, config)

        tool_message = ToolMessage(
            content=f"Retrieved {len(chunks)} chunks from the knowledgebase: \n{format_chunks(chunks)}",
            tool_call_id=tool_call_id,
        )
    except Exception as e:
        logger.exception("Unable to retrieve relevant chunks from the knowledgebase.")
        raise ToolException("Unable to retrieve relevant chunks from the knowledgebase. Please try again.") from e

    return Command(
        goto="student_debt_agent",
        update={
            "messages": [tool_message],
            "references": {
                "rag_query": query,
                "perform_rag": True,
                "retrieved_chunks": chunks
            }
        }
    )


