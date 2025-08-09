import os
from typing import Annotated, Literal

import requests
from dotenv import load_dotenv
from langchain.tools import tool
from langchain_core.messages import ToolMessage
from langchain_core.tools import ToolException
from langchain_core.tools.base import InjectedToolCallId
from langgraph.types import Command

from clients.logging_client import LoggingClient
from core.graphs.nodes.agents.tools.utils.format import format_tool_message_content
from core.graphs.nodes.agents.tools.utils.streaming import stream_artifact_to_frontend
from core.graphs.types.artifact import Artifact, RefinanceArtifactRow

logger = LoggingClient.get_logger(__name__)

load_dotenv()

COLLEGE_FINANCE_API_KEY = os.getenv("COLLEGE_FINANCE_API_KEY")
DEFAULT_OPEID = os.getenv("DEFAULT_OPEID")
COLLEGE_FINANCE_ENDPOINT = os.getenv("COLLEGE_FINANCE_ENDPOINT")

# Format the response to be more consumbale for final LLM output node.
RELEVANT_COLLEGE_FINANCE_FIELDS = [
    "name",
    "variable_apr",
    "fixed_apr",
    "bullets",
    "repayment_lengths",
    "minimum_credit_score",
    "tracking_url",
    "logo",
    "additional_info"
]


def _clean_offers(slr_offers: list[dict], fields: list[str]) -> list[dict]:
    """
    Given a list of json like loan offers present in the Refi table, clean each offer
    to only containt the keys specified in fields.

    Args:
        slr_offers (list[dict]): The list of json like loan offers from the Refi Table.
        fields (list[str]): The list of fields (keys in the loan offer) to keep.
    Returns:
        list[dict]: A list of offers with only the specified fields.
    """
    clean_offers = []
    for offer in slr_offers:
        clean_offers.append({key: offer[key] for key in fields if key in offer})

    return clean_offers


@tool
def get_refinance_offers(
    tool_call_id: Annotated[str, InjectedToolCallId],
    show_tool_visual: bool = True
) -> Command[Literal["student_debt_agent"]]:
    """
    Fetches refinance offers from the College Finance API.

    The visual for this tool is a table displaying the refinance offers row by row, showing
    lender information, APR rates, repayment terms, and other key details for comparison.

    Args:
        show_tool_visual (bool): Whether to show a visual table of the refinance offers.

    Returns:
        Command: A command to update the agent state with refinance offer results.
    """
    update_state = {}
    tool_message = None

    try:
        # Validate required environment variables
        if not COLLEGE_FINANCE_ENDPOINT:
            raise ToolException("College Finance API endpoint is not configured.")

        data = {"productType": "slr", "opeid": DEFAULT_OPEID, "accessToken": COLLEGE_FINANCE_API_KEY}
        response = requests.post(COLLEGE_FINANCE_ENDPOINT, json=data)
        response.raise_for_status()

        response_json = response.json()["offers"]
        cleaned_offers = _clean_offers(response_json, RELEVANT_COLLEGE_FINANCE_FIELDS)

        artifact_content = None
        if show_tool_visual:
            # Create artifact data from refinance offers
            artifact_rows = []
            for offer in cleaned_offers:
                row = RefinanceArtifactRow(
                    name=offer.get("name"),
                    variable_apr=offer.get("variable_apr"),
                    fixed_apr=offer.get("fixed_apr"),
                    bullets=offer.get("bullets"),
                    disclosure=offer.get("disclosure"),
                    repayment_lengths=offer.get("repayment_lengths"),
                    minimum_credit_score=offer.get("minimum_credit_score"),
                    tracking_url=offer.get("tracking_url"),
                    logo=offer.get("logo"),
                    additional_info=offer.get("additional_info"),
                )
                artifact_rows.append(row)

            artifact = Artifact(
                id=tool_call_id,
                name="Explore refinancing options with private lenders",
                description=("Comparison of available student loan refinance offers showing"
                             " lender details, APR rates, repayment terms, and application links."),
                type="REFINANCE_TABLE",
                data={
                    "rows": [row.model_dump() for row in artifact_rows],
                },
            )
            update_state["artifacts"] = [artifact]

            artifact_content = artifact.model_dump(mode="json")

            # stream artifact as SSE chunk to frontend
            stream_artifact_to_frontend(
                tool_call_id=tool_call_id,
                artifact=artifact
            )

        # Use standardized formatting
        content = format_tool_message_content(
            tool_call_id=tool_call_id,
            artifact_rendered=show_tool_visual,
            data_only=not show_tool_visual,
            artifact_name="Explore refinancing options with private lenders",
            artifact_description=("Comparison of available student loan refinance offers"
                                  " showing lender details, APR rates, repayment terms, and application links."),
            returned_data=str(cleaned_offers)
        )

        tool_message = ToolMessage(
            content=content,
            tool_call_id=tool_call_id,
            artifact=artifact_content,
        )

        update_state["messages"] = [tool_message]

        return Command(goto="student_debt_agent", update=update_state)

    except requests.exceptions.RequestException as e:
        logger.exception("Failed to fetch refinance offers from College Finance API.")
        raise ToolException("Unable to retrieve current refinance offers. Please try again later.") from e
    except KeyError as e:
        logger.exception("Unexpected response format from College Finance API.")
        raise ToolException("Unable to process refinance offers. Please try again later.") from e
    except Exception as e:
        logger.exception("Unexpected error in refinance offers tool.")
        raise ToolException("Unable to retrieve refinance offers. Please try again later.") from e
