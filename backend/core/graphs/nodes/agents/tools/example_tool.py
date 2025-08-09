from typing import Annotated, Literal

from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langchain_core.tools.base import InjectedToolCallId
from langgraph.prebuilt import InjectedState
from langgraph.types import Command

from core.graphs.types.state import CandidlyAgentState

"""
In this first example, the tool does not need to update any attributes of the state.

When you have a tool like this, you can just treat it as a normal Python function
that the agent will invoke no need to use the Command type!

If you need to access the state, you can do so by using the prebuilt InjectedState
class. This passes the state to the function without exposing it to the LLM as an 
argument it needs to populate.
"""


@tool
def example_tool_no_state_update(arg1: str, state: Annotated[CandidlyAgentState, InjectedState]):
    """A descriptive docstring for the tool to give the LLM context.

    See here for best practices with Anthropic:

    https://docs.anthropic.com/en/docs/build-with-claude/tool-use/implement-tool-use#best-practices-for-tool-definitions
    """
    result = None
    try:
        # Here is how you can access data from the state.
        data = state["data"]

        result = f"This is a test result {data}"
    except Exception:
        result = (
            "Failed to execute the example tool. Guide the user in a different direction within your capabilities."
        )

    # Pretty simple! Just return the results as you would any other function.
    return result


"""
Sometimes you may want to update the state from inside a tool.

To do this, we will leverage LangGraph's Command type. In order to do so,
you will need to specify the next node you want to go to (which will be the
name of the agent invoking the tool), and the updates you want to make to the
sate.

Do not forget to include a new tool message with it's associated tool call id!
"""


@tool
def example_tool_with_state_update(
    arg1: str, tool_call_id: Annotated[str, InjectedToolCallId]
) -> Command[Literal["agent_name"]]:
    """A descriptive docstring for the tool to give the LLM context."""
    update_state = {}
    tool_message = None

    try:
        # Implement function logic here.
        update_state["data"] = f"Updated data {arg1}"

        tool_message = ToolMessage(content="This is a test result", tool_call_id=tool_call_id)

    except Exception:
        tool_message = ToolMessage(
            content="Failed to execute the example tool. Guide the user in a different direction within your capabilities.",
            tool_call_id=tool_call_id,
        )

    update_state["messages"] = [tool_message]

    return Command(goto="agent_name", update=update_state)
