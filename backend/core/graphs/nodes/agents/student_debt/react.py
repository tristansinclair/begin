from datetime import datetime
from typing import Callable

# from clients.local_data.candidly_api_data import CANDIDLY_PRODUCT_DICT
# from core.graphs.nodes.agents.tools.student_debt.amortization import (
#     generate_amortization,
#     solve_level_payment_loan_term,
# )
# from core.graphs.nodes.agents.tools.student_debt.reassess import get_federal_loan_repayment_plans
# from core.graphs.nodes.agents.tools.student_debt.recommend_product import recommend_candidly_product
# from core.graphs.nodes.agents.tools.student_debt.refinance import get_refinance_offers
# from core.graphs.nodes.agents.tools.student_debt.upload_msd import upload_msd
from core.graphs.nodes.agents.utils.agent_subgraph import create_react_agent_subgraph
# from core.graphs.types.candidly import LoanPortfolio
from core.graphs.types.state import CandidlyAgentState
from core.graphs.utils.model import get_chat_model
from core.prompts.loader import render_template

# Define all possible tools in one place for better maintainability
ALL_TOOLS = [
    # get_refinance_offers,
    # upload_msd,
    # recommend_candidly_product,
    # get_federal_loan_repayment_plans,
    # generate_amortization,
    # solve_level_payment_loan_term,
]

# Tools that are always available to the user
CORE_TOOLS = [
    # get_refinance_offers,
    # upload_msd,
    # recommend_candidly_product,
    # generate_amortization,
    # solve_level_payment_loan_term,
]

# Tools that are conditionally available based on user state
CONDITIONAL_TOOLS = {
    # "reassess_results": get_federal_loan_repayment_plans,
}


def render_dynamic_prompt(state: CandidlyAgentState) -> str:
    """
    Render a dynamic system prompt for the student debt agent.

    Args:
        state (dict): The current state of the agent.

    Returns:
        str: A system prompt to be used as input to the LLM.
    """
    # Additional fail-safe to ensure state is a CandidlyAgentState object
    if isinstance(state, dict):
        state = CandidlyAgentState(**state)

    # Handle case where user_info doesn't exist or is just a string (user_id)
    # This is a temporary fix for the fitness app context
    user_info = getattr(state, 'user_info', None)
    
    # Build context for template rendering with safe defaults
    context = {
        "current_date": datetime.now().strftime("%Y-%m-%d"),
        "user_name": getattr(user_info, 'first_name', 'User') if hasattr(user_info, 'first_name') else 'User',
        # Handle references safely as well
        "rag_query": getattr(getattr(state, 'references', None), 'rag_query', None) if hasattr(state, 'references') else None,
        "retrieved_chunks": getattr(getattr(state, 'references', None), 'retrieved_chunks', []) if hasattr(state, 'references') else [],
        "perform_rag": getattr(getattr(state, 'references', None), 'perform_rag', False) if hasattr(state, 'references') else False,
    }

    # Render the system prompt using the Jinja2 template
    system_prompt = render_template("candidly/single_student_debt_2.j2", context)

    return system_prompt


def dynamic_tool_binder(state: CandidlyAgentState) -> list[Callable]:
    """
    Dynamic tool binder that returns core tools plus conditionally available tools.

    Args:
        state: Current agent state containing user information

    Returns:
        List of tools available to the user based on current state
    """
    # Ensure we can access user_info correctly
    if isinstance(state, dict):
        state = CandidlyAgentState(**state)

    # Start with core tools that are always available
    available_tools = CORE_TOOLS.copy()

    # Add conditional tools based on user state
    # TODO: Now that reassess is removed from the state, we need a better way to dynamically bind this.
    # For now, we are just adding it back in.
    # available_tools.append(CONDITIONAL_TOOLS["reassess_results"])

    return available_tools


react_student_debt_agent = create_react_agent_subgraph(
    state_schema=CandidlyAgentState,
    model=get_chat_model(),
    tools=ALL_TOOLS,  # ToolNode needs access to all possible tools
    dynamic_tool_binder=dynamic_tool_binder,
    system_prompt_builder=render_dynamic_prompt,
    name="student_debt_agent",
)
