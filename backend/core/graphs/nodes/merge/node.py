from core.graphs.types.state import CandidlyAgentState


def merge_node(state: CandidlyAgentState) -> CandidlyAgentState:
    """
    Ensures states merge from concurrent input nodes before proceeding.
    """
    return state


def chat_router(state: CandidlyAgentState) -> str:
    """
    Determines the next node to route to based on the guardrail assessment in the state.

    Args:
        state (CandidlyAgentState): The current state containing guardrail assessment.

    Returns:
        str: Either "safe_response" or "student_debt_agent"
    """
    assessment = state.guardrail_assessment

    if not assessment.blocked:
        return "student_debt_agent"

    return "safe_response"
