from langgraph.graph import END, START, StateGraph

from core.graphs.nodes.agents.student_debt.react import react_student_debt_agent
from core.graphs.nodes.guardrails.node import input_guardrail_node
from core.graphs.nodes.initialize.node import initialize_node
from core.graphs.nodes.merge.node import chat_router, merge_node
from core.graphs.nodes.safe_response.node import safe_response_node
from core.graphs.types.state import CandidlyAgentState

graph = StateGraph(CandidlyAgentState)

graph.add_node("initialize", initialize_node)
graph.add_node("input_guardrail", input_guardrail_node)
graph.add_node("merge", merge_node)
graph.add_node("student_debt_agent", react_student_debt_agent)
graph.add_node("safe_response", safe_response_node)

graph.add_edge(START, "initialize")
graph.add_edge("initialize", "input_guardrail")

graph.add_edge("input_guardrail", "merge")

graph.add_conditional_edges(
    "merge",
    chat_router,
    {
        "safe_response": "safe_response",
        "student_debt_agent": "student_debt_agent"
    }
)

graph.add_edge("safe_response", END)
graph.add_edge("student_debt_agent", END)
