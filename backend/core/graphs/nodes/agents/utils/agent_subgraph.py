"""
Custom React Agent Subgraph Implementation

This module provides a reusable React agent subgraph that can work with any state schema.
It offers more control than LangGraph's prebuilt create_react_agent, including:
- Dynamic tool binding based on agent state
- Configurable max iterations with proper loop control
- Comprehensive logging and error handling
- Support for any state schema (requires only 'messages' key)

IMPORTANT: Each state should have a 'messages' key and optionally a 'react_loop_iterations' key
if you want to limit the number of React loop iterations per conversation turn.
"""

from typing import Any, Callable, Literal, Optional, Type

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import BaseTool
from langgraph.graph import StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.prebuilt import ToolNode
from langgraph.types import Command
from pydantic import BaseModel

from clients.logging_client import LoggingClient
from core.graphs.nodes.agents.utils.message_redaction import create_redacted_messages

logger = LoggingClient.get_logger(__name__)


def _has_react_loop_iterations_field(state_schema: Type) -> bool:
    """
    Check if state schema has react_loop_iterations field.
    Supports both Pydantic models and TypedDict.
    """
    if hasattr(state_schema, "model_fields"):
        return "react_loop_iterations" in state_schema.model_fields

    # For TypedDict
    if hasattr(state_schema, "__annotations__"):
        return "react_loop_iterations" in state_schema.__annotations__

    return False


def create_react_agent_subgraph(
    state_schema: Type,
    model: BaseChatModel,
    tools: list[BaseTool],
    system_prompt_builder: Callable,
    max_react_loops: int = 6,
    dynamic_tool_binder: Callable | None = None,
    name: str = "react_agent",
) -> CompiledStateGraph:
    """
    Creates a reusable React agent subgraph that works with any state schema.

    The state schema must have a 'messages' key containing the conversation history.

    Args:
        state_schema: The state schema type for the graph
        model: The chat model to use for the agent
        tools: List of all available tools for the ToolNode
        system_prompt_builder: Function to build the system prompt from the state
                            Must take state dict and return a string.
        max_react_loops: Maximum number of React loops per conversation turn before stopping
        dynamic_tool_binder: Optional function to dynamically filter tools based on state.
                           Must take state dict and return subset of tools list.
        name: Name for the subgraph (used in logging)

    Returns:
        Compiled StateGraph ready to be used as a subgraph

    Example:
        ```python
        def my_tool_binder(state: dict) -> list[BaseTool]:
            # Only bind loan connection tool if loans aren't connected
            if state.get('connected_loans', False):
                return [tool for tool in all_tools if tool.name != 'connect_loans']
            return all_tools

        def system_prompt_builder(state: dict) -> str:
            if state.get('connected_loans', False):
                return "You should guide the user to the connect_loans tool."
            else:
                return "You should guide the user to the analyze_loans tool."

        agent_graph = create_react_agent_subgraph(
            state_schema=MyState,
            model=get_chat_model(),
            tools=[connect_loans_tool, analyze_loans_tool],
            system_prompt_builder=system_prompt_builder,
            dynamic_tool_binder=my_tool_binder
        )
        ```
    """
    logger.info(f"Creating React agent subgraph '{name}' with {'static tools' if not dynamic_tool_binder else 'a dynamic tool binder'}, max_react_loops={max_react_loops}")

    # Validate that state schema has react_loop_iterations field
    if not _has_react_loop_iterations_field(state_schema):
        logger.warning(
            f"State schema for '{name}' does not include 'react_loop_iterations' field. "
            f"React loop limiting functionality will not work properly. The agent will not respect "
            f"the max_react_loops={max_react_loops} limit. Add 'react_loop_iterations: int' to your "
            f"state schema to enable proper iteration control."
        )

    # Create agent node with configuration baked in
    agent_node_func = _create_agent_node_factory(
        model=model,
        tools=tools,
        system_prompt_builder=system_prompt_builder,
        max_react_loops=max_react_loops,
        dynamic_tool_binder=dynamic_tool_binder,
    )

    # Create ToolNode - handles InjectedState and InjectedToolCallId for Command usage
    # This is important for tools that need access to the current state or tool call ID
    tool_node = ToolNode(tools=tools, name="tool_node", handle_tool_errors=lambda err: str(err), messages_key="messages")

    # Build the subgraph
    subgraph = StateGraph(state_schema=state_schema)

    # Add nodes
    subgraph.add_node("agent_node", agent_node_func)
    subgraph.add_node("tool_node", tool_node)

    # Set entry point
    subgraph.set_entry_point("agent_node")

    # Tool node always goes back to agent for next iteration
    subgraph.add_edge("tool_node", "agent_node")

    logger.info(f"Successfully compiled React agent subgraph '{name}'")

    return subgraph.compile()


def _should_continue_react_loop(state: dict, max_react_loops: int) -> bool:
    """
    Determine whether the React loop should continue based on:
    1. Whether we've reached max loops (takes precedence)
    2. Whether the last AI message has tool calls

    Args:
        state: Current graph state
        max_react_loops: Maximum number of React loops allowed

    Returns:
        True to continue to tool_node, False to end the subgraph
    """
    # Check iteration limit first - this takes precedence
    current_iteration = state.get("react_loop_iterations", 0)
    if current_iteration >= max_react_loops:
        logger.info(f"Max React loops ({max_react_loops}) reached, ending agent loop")
        return False

    # Check if agent wants to continue (has tool calls)
    messages = state.get("messages", [])
    if not messages:
        logger.error("No messages found in state, ending agent loop")
        return False

    last_message = messages[-1]
    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        logger.debug(f"Agent has {len(last_message.tool_calls)} tool calls, continuing to tool execution")
        return True

    logger.debug("No tool calls found in last message, ending agent loop")
    return False


def _should_add_ai_message_to_state(message: AIMessage) -> bool:
    """
    Determine whether the AI message should be added to the state. If the
    content is an empty list or string, it is not added to the state.

    Args:
        message (AIMessage): The AI message to check

    Returns:
        (bool): True if the AI message should be added to the state, False otherwise
    """
    return bool(message.content) and not bool(message.tool_calls)


def _create_agent_node_factory(
    model: BaseChatModel,
    tools: list[BaseTool],
    system_prompt_builder: Callable,
    max_react_loops: int,
    dynamic_tool_binder: Optional[Callable[[dict], list[BaseTool]]] = None,
) -> Callable:
    """
    Factory function that creates an agent node with configuration baked in.

    This pattern allows us to configure the agent behavior while ensuring the
    returned function only takes the required (state, config) parameters that
    LangGraph expects for node functions.
    """

    async def agent_node(state: dict[str, Any], config: RunnableConfig) -> Command[Literal["tool_node", "__end__"]]:
        """
        Agent node that dynamically binds tools and calls the LLM.

        Args:
            state: Current graph state (must contain 'messages' key)
            config: LangGraph runnable configuration

        Returns:
            Command with state update and routing decision
        """
        # Convert Pydantic BaseModel to dict if present
        if isinstance(state, BaseModel):
            state = state.model_dump()

        # Get current iteration count
        current_iteration = state.get("react_loop_iterations", 0)

        # Determine which tools to bind to the model
        model_tools = tools
        if dynamic_tool_binder:
            # NOTE: Further testing needed to ensure tool subset binding works correctly
            # with ToolNode, but initial testing suggests this should be fine since
            # ToolNode will only execute tools that were actually called by the LLM
            model_tools = dynamic_tool_binder(state)
            logger.debug(
                f"Dynamic tool binding: {len(model_tools)}/{len(tools)} tools selected for iteration {current_iteration + 1}"
            )

        # Bind tools to model and disable parallel tool calls.
        model_with_tools = model.bind_tools(model_tools, parallel_tool_calls=False)

        # Configured system prompt
        system_prompt = system_prompt_builder(state)

        # Get redacted messages for the agent (removes blocked content)
        blocked_ids = state.get("blocked_message_ids", set())
        conversation_messages = create_redacted_messages(state["messages"], blocked_ids)

        # Prepare messages - system prompt + redacted conversation history
        messages = [SystemMessage(content=system_prompt)] + conversation_messages

        # Call the model
        response = await model_with_tools.ainvoke(messages, config=config)

        update = {}
        updated_state = {**state, "messages": state["messages"] + [response]}
        if _should_continue_react_loop(updated_state, max_react_loops):
            update["messages"] = [response]
            update["react_loop_iterations"] = current_iteration + 1
            goto = "tool_node"
        else:
            if isinstance(response, AIMessage) and _should_add_ai_message_to_state(response):
                update["messages"] = [response]
            update["react_loop_iterations"] = 0
            goto = "__end__"

        return Command(update=update, goto=goto)


    return agent_node
