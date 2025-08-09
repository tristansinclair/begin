from typing import Literal

from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.types import Command

from clients.logging_client import LoggingClient
from core.graphs.types.rag import EntryRagOutput
from core.graphs.types.state import CandidlyAgentState
from core.graphs.utils.model import get_fast_model
from core.graphs.utils.rag.helpers import retrieve_relevant_chunks
from core.prompts.loader import render_template

logger = LoggingClient.get_logger(__name__)
model = get_fast_model()


async def entry_rag_node(
    state: CandidlyAgentState, config: RunnableConfig
) -> Command[Literal["merge"]]:
    """
    Given a user chat input, determines if RAG should be performed. If so, enriches
    the query and performs RAG before routing to the student debt agent.

    Args:
        state (CandidlyAgentState): The current state of the agent.
        config (RunnableConfig): Configuration for the runnable.

    Returns:
        Command[Literal["student_debt_agent"]]: The next node to route to.
    """
    if config.get("configurable",{}).get("pg_vectorstore", None) is None:
        return Command(
            goto="merge_node",
            update={
                "references":
                    {
                        "perform_rag": False,
                        "rag_query": "",
                        "retrieved_chunks": [],
                    }
                }
        )

    try:
        last_message = state.messages[-1]
        system_prompt_content = render_template("candidly/input_rag.j2", {})
        system_message = SystemMessage(content=system_prompt_content)

        response = await model.with_structured_output(EntryRagOutput).ainvoke([system_message, last_message])

        references = {
            "perform_rag": response.perform_rag,
            "rag_query": "",
            "retrieved_chunks": [],
        }

        if response.perform_rag:
            knowledge_base_query = response.rag_query if response.rag_query != "" else last_message.content

            references["rag_query"] = knowledge_base_query

            chunks = await retrieve_relevant_chunks(knowledge_base_query, config)
            references["retrieved_chunks"] = chunks

        return Command(
            goto="merge_node",
            update={
                "references": references
            }
        )
    except Exception:
        logger.exception("Error in entry_rag_node")

        return Command(
            goto="merge_node",
            update={
                "references":
                    {
                        "perform_rag": False,
                        "rag_query": "",
                        "retrieved_chunks": [],
                    }
                }
        )
