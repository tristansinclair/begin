# Custom React Agent Implementation

This module provides a custom React agent implementation that offers more control and flexibility than LangGraph's prebuilt `create_react_agent`.

## Why Custom Implementation?

1. **Transparency**: Full visibility into the agent's execution flow for better debugging and understanding
2. **Dynamic Tool Binding**: Ability to conditionally bind tools based on current agent state
3. **Performance**: Avoid binding unnecessary tools when we know they shouldn't be called
4. **Flexibility**: Easy to extend and customize for specific use cases

## Basic Usage

```python
from core.graphs.utils.react.agent_subgraph import create_react_agent_subgraph
from core.graphs.utils.model import get_chat_model

# Define your state schema
class MyState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    # Add any other fields you need

# Create the agent
agent = create_react_agent_subgraph(
    state_schema=MyState,
    model=get_chat_model(),
    tools=[tool1, tool2, tool3],
    system_prompt="You are a helpful assistant.",
    max_iterations=3
)
```

## Dynamic Tool Binding

The key advantage of this implementation is dynamic tool binding:

```python
def smart_tool_binder(state: dict) -> list[BaseTool]:
    """Only provide relevant tools based on current state."""
    all_tools = [connect_account_tool, analyze_account_tool, export_tool]
    
    # Don't offer connection tool if already connected
    if state.get('account_connected', False):
        return [analyze_account_tool, export_tool]
    
    return all_tools

agent = create_react_agent_subgraph(
    state_schema=MyState,
    model=get_chat_model(),
    tools=[connect_account_tool, analyze_account_tool, export_tool],
    system_prompt="You are a financial assistant.",
    dynamic_tool_binder=smart_tool_binder
)
```

## Max Iterations

The agent automatically tracks iterations and stops when the limit is reached for a single conversation turn:

```python
agent = create_react_agent_subgraph(
    # ... other parameters
    max_iterations=5  # Agent will stop after 5 iterations
)
```

The iteration count is stored in `state["agent_iterations"]` and is automatically managed.

TODO: Investigate behavior when not included in the state by default.

## Logging

The module includes comprehensive logging:

- Agent creation and compilation
- Tool binding decisions
- Iteration tracking
- Tool call requests
- Error conditions

Logs use the project's standard `LoggingClient` for consistent formatting.

## Error Handling

WIP.

## Important Notes

### Tool Node Compatibility

We use LangGraph's prebuilt `ToolNode` because:
- It handles `InjectedState` and `InjectedToolCallId` for tools that use `Command`
- It provides robust error handling for tool execution
- It integrates seamlessly with the message-based flow

### Dynamic Tool Binding Testing

The dynamic tool binding feature needs further testing to ensure that:
- Tool subsets work correctly with `ToolNode`
- All edge cases are handled properly
- Performance is optimal

Initial testing suggests this approach works fine since `ToolNode` only executes tools that were actually called by the LLM.
