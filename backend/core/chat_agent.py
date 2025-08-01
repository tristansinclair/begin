import os
from typing import Dict, Any, List, Literal
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from typing_extensions import Annotated, TypedDict

from .tools import AVAILABLE_TOOLS


class State(TypedDict):
    messages: Annotated[List[Dict[str, Any]], add_messages]


class ReActChatAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Bind tools to the LLM
        self.llm_with_tools = self.llm.bind_tools(AVAILABLE_TOOLS)
        
        # Create tool node for executing tools
        self.tool_node = ToolNode(AVAILABLE_TOOLS)
        
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        workflow = StateGraph(State)
        
        # Add nodes
        workflow.add_node("agent", self._agent_node)
        workflow.add_node("tools", self.tool_node)
        
        # Add edges
        workflow.add_edge(START, "agent")
        workflow.add_conditional_edges(
            "agent",
            self._should_continue,
            {
                "continue": "tools",
                "end": END
            }
        )
        workflow.add_edge("tools", "agent")
        
        return workflow.compile()
    
    def _agent_node(self, state: State) -> Dict[str, Any]:
        """Main agent reasoning node."""
        response = self.llm_with_tools.invoke(state["messages"])
        return {"messages": [response]}
    
    def _should_continue(self, state: State) -> Literal["continue", "end"]:
        """Determine if we should continue to tool execution or end."""
        last_message = state["messages"][-1]
        
        # Check if the last message has tool calls
        if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
            return "continue"
        else:
            return "end"
    
    async def chat(self, message: str, thread_id: str = "default") -> str:
        """Main chat interface that uses ReAct pattern with tools."""
        from .langsmith_config import create_run_name
        
        # Create a descriptive run name for LangSmith tracing
        run_name = create_run_name(message, thread_id)
        
        result = await self.graph.ainvoke(
            {"messages": [{"role": "user", "content": message}]},
            config={
                "configurable": {"thread_id": thread_id},
                "run_name": run_name,
                "tags": ["ReAct-Agent", "Chat", f"Thread-{thread_id}"],
                "metadata": {
                    "thread_id": thread_id,
                    "user_message": message[:100] + "..." if len(message) > 100 else message,
                    "agent_type": "ReAct",
                    "tools_available": len(AVAILABLE_TOOLS)
                }
            }
        )
        
        return result["messages"][-1].content
    
    def get_available_tools(self) -> List[str]:
        """Get list of available tool names and descriptions."""
        tools_info = []
        for tool in AVAILABLE_TOOLS:
            tools_info.append(f"- {tool.name}: {tool.description}")
        return tools_info


# Keep backward compatibility
ChatAgent = ReActChatAgent