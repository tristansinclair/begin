##########
# ### Import Packages

# import typing packages
from typing import Any

from langchain_core.messages import AIMessage, AnyMessage
from langchain_core.runnables import RunnableConfig

# import logging client
# from clients.candidly_api_client import CandidlyAPIClient
from clients.logging_client import LoggingClient
from clients.postgres_client import AsyncPostgresClient
from core.graphs.types.state import CandidlyAgentState

# configure logger
logger = LoggingClient.get_logger(__name__)

##########
# ### Utility Functions

# BP Note: We may want to replace this with LLM summarization
# that occurs parallel to the rag / guardrail nodes and is based
# on the first N AIMessages. Based on some testing of the ChatGPT
# WebApp, I believe OpenAI is doing something similar i.e. LLM
# Summarization on first N messages.

# truncate text up to character limit
def truncate_text_for_title(text: str, char_limit: int=50) -> str:
    # truncate text based on char limit
    start_text = text[:char_limit]

    # identify last space, to drop partial words
    space_idx = start_text.rfind(' ')

    # return formatted text
    if space_idx == -1:
        return start_text + '...'
    else:
        return start_text[:space_idx] + '...'


# checks and generates title for thread if needed
async def create_thread_title(
        messages: list[AnyMessage],
        thread_id: str,
        user_id: str,
        db_client: AsyncPostgresClient
) -> None:
    # initialize counters for messages
    ai_message_count = 0
    title_message = None
    set_title = False

    # iterate up to the first 4 ai messages
    for message in messages:
        if type(message) is AIMessage:
            ai_message_count += 1

            if ai_message_count >= 1:
                set_title = True

            if ai_message_count == 4:
                break

            title_message = message

    # set title if between 1-3 ai messages
    if set_title and ai_message_count <= 3:
        # placeholder for title
        title = None

        # string content variant
        if type(title_message.content) is str:
            title = truncate_text_for_title(text=title_message.content)

        # list[str] content variant
        if type(title_message.content) is list and type(title_message.content[0]) is str:
            title = truncate_text_for_title(text=title_message.content[0])

        # list[dict] content variant (bedrock multi-modal)
        if type(title_message.content) is list and type(title_message.content[0]) is dict:
            text_content = [x for x in title_message.content if x['type'] == 'text']

            if len(text_content) == 0:
                return

            title = truncate_text_for_title(text=text_content[0]['text'])

        # set new title in database
        if title is not None:
            await db_client.update_thread_title(
                title=title,
                user_id=user_id,
                thread_id=thread_id,
            )
            logger.info(f'updated title for thread: {thread_id}')


##########
# ### Node Logic

async def initialize_node(state: CandidlyAgentState, config: RunnableConfig) -> dict[str, Any]:
    """
    Initializes the state for the graph at the start of a new conversation turn.

    Args:
        state (CandidlyAgentState): The current state of the Candidly agent containing
            conversation context and agent data.
        config (RunnableConfig): Configuration for the runnable.

    Returns:
        dict[str, Any]: A dictionary containing initialization values for the graph state.
            Currently sets 'react_loop_iterations' to 0.
    """
    # extract user_id and thread_id from configurable
    user_id = config['configurable']['user_id']
    thread_id = config['configurable']['thread_id']

    # runs a short check to see if title should be created for thread
    await create_thread_title(
        messages=state.messages,
        thread_id=thread_id,
        user_id=user_id,
        db_client=config['configurable']['db_client']
    )

    # initialize state_update
    state_update: dict[str, Any] = {"react_loop_iterations": 0}

    return state_update
