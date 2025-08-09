from typing import Annotated, Literal

from langchain_core.messages import ToolMessage
from langchain_core.tools import ToolException, tool
from langchain_core.tools.base import InjectedToolCallId
from langgraph.prebuilt import InjectedState
from langgraph.types import Command

from clients.local_data.candidly_api_data import CANDIDLY_PRODUCT_DICT
from clients.logging_client import LoggingClient
from core.graphs.nodes.agents.tools.utils.format import format_tool_message_content
from core.graphs.nodes.agents.tools.utils.streaming import stream_artifact_to_frontend
from core.graphs.types.artifact import Artifact
from core.graphs.types.state import CandidlyAgentState

logger = LoggingClient.get_logger(__name__)


@tool
def recommend_candidly_product(
    product_key: str,
    state: Annotated[CandidlyAgentState, InjectedState],
    tool_call_id: Annotated[str, InjectedToolCallId],
    ) -> Command[Literal["student_debt_agent"]]:
    """
    Display an interactive product recommendation component to help users optimize
    their student debt management and financial savings through relevant Candidly features.

    Use this tool when the conversation reveals opportunities to help the user through
    features provided by Candidly's platform.

    IMPORTANT:
    - Pass the exact product key
    - Match products to user's specific debt/savings situation when it is contextually relevant
    - Only recommend products the user has access to

    The tool creates an interactive UI component where users can click to learn more about
    the recommended product.
    """
    update_state = {}
    tool_message = None

    # Additional fail-safe to ensure state is a CandidlyAgentState object
    if isinstance(state, dict):
        state = CandidlyAgentState(**state)

    user_products = state.user_info.product_combination

    try:
        # Validate that the product exists in our catalog
        if not user_products or (user_products and product_key not in user_products):
            logger.warning(f"Invalid product key requested: {product_key}")
            raise ToolException(f"You can only recommend products the user has access to: {user_products}")

        # Get the product data which is already strutcured like ProductRecommendationArtifactData.
        product_info = CANDIDLY_PRODUCT_DICT[product_key]

        # Create the artifact
        artifact = Artifact(
            id=tool_call_id,
            type="PRODUCT_RECOMMENDATION",
            data=product_info
        )

        # Update state with artifact
        update_state["artifacts"] = [artifact]

        # Use standardized formatting
        content = format_tool_message_content(
            tool_call_id=tool_call_id,
            artifact_rendered=True,
            data_only=False,
            artifact_name=product_info["product_name"],
            artifact_description=(f"Product recommendation component for {product_info['product_name']}"
                                  " with CTA button that links out to the Candidly feature."),
        )

        tool_message = ToolMessage(
            content=content,
            tool_call_id=tool_call_id,
            artifact=artifact.model_dump(mode="json"),
        )

        # stream artifact as SSE chunk to frontend
        stream_artifact_to_frontend(
            tool_call_id=tool_call_id,
            artifact=artifact
        )

    except KeyError as e:
        logger.exception("Product key not found in product dictionary.")
        raise ToolException("Unable to load product information. Please try again later.") from e
    except Exception as e:
        logger.exception("Unexpected error in product recommendation tool.")
        raise ToolException("Unable to load product recommendation. Please try again later.") from e

    update_state["messages"] = [tool_message]
    return Command(goto="student_debt_agent", update=update_state)
