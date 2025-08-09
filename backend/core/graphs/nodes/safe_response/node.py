from typing import Literal

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.types import Command

from core.graphs.types.state import CandidlyAgentState
from core.graphs.utils.model import get_safe_response_model
from core.prompts.loader import render_template
from core.graphs.nodes.utils.conversation_context import extract_conversation_context

# Import the model for generating safe responses
model = get_safe_response_model()


async def safe_response_node(state: CandidlyAgentState) -> Command[Literal["__end__"]]:
    """
    Handles blocked user inputs by generating appropriate safe responses with conversation context.

    This node is invoked when the guardrail system blocks a user input.
    It uses an LLM to generate contextually appropriate responses based on
    the original user message, the guardrail assessment, and conversation history.

    Args:
        state (CandidlyAgentState): The current state containing the original message and guardrail assessment information.

    Returns:
        Command[Literal["__end__"]]: Always ends the conversation with a safe response.
    """
    # Extract the flagged message and conversation context
    flagged_message, conversation_context = extract_conversation_context(state.messages, max_human_messages=2)

    # Extract guardrail information from state
    assessment = state.guardrail_assessment
    reasoning = assessment.reasoning or "No specific reason provided"

    # Load the system role and prompt templates
    system_role = render_template("candidly/safe_response_role.j2", {}).strip()
    prompt = render_template("candidly/safe_response_prompt.j2", {
        "flagged_message": flagged_message,
        "conversation_context": conversation_context,
        "reasoning": reasoning
    }).strip()

    # Generate safe response using LLM
    try:
        messages = [
            SystemMessage(content=system_role),
            HumanMessage(content=prompt),
        ]

        response = await model.ainvoke(messages)
        safe_response_content = response.content

    except Exception as e:
        # Fallback to a generic safe response if LLM fails
        safe_response_content = (
            "I'm not able to help with that request. I'm here to assist with "
            "student loan repayment options, forgiveness programs, and related "
            "financial planning. What can I help you with regarding your student loans?"
        )

    # Return the safe response and end the conversation
    return Command(
        goto="__end__",
        update={
            "messages": [AIMessage(content=safe_response_content)],
        }
    )
