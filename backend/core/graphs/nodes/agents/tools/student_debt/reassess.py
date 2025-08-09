from datetime import datetime
from enum import Enum
from typing import Annotated, Literal, Optional, override

from langchain.tools import tool
from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import ToolException
from langchain_core.tools.base import InjectedToolCallId
from langgraph.types import Command

from clients.candidly_api_client import CandidlyAPIClient
from clients.logging_client import LoggingClient
from core.graphs.nodes.agents.tools.utils.format import format_tool_error, format_tool_message_content
from core.graphs.nodes.agents.tools.utils.streaming import stream_artifact_to_frontend
from core.graphs.types.artifact import Artifact, ReassessArtifactRow
from core.graphs.types.candidly import ReassessRepaymentPlanInfo

logger = LoggingClient.get_logger(__name__)


def format_loans(loans: list[dict]) -> str:
    loan_details = []
    for loan in loans:
        # Handle origination date - convert from Unix timestamp if present
        origination_date = loan.get('origination_date')
        if origination_date:
            try:
                # Convert from milliseconds to seconds and format
                date_obj = datetime.fromtimestamp(origination_date / 1000)
                origination_date_display = date_obj.strftime('%Y-%m-%d')
            except (ValueError, TypeError):
                origination_date_display = str(origination_date)
        else:
            origination_date_display = "N/A"

        loan_details.append(
            f"- Name: {loan.get('loan_type', 'N/A')}\n"
            f"- Origination Date: {origination_date_display}"
        )
    return "\n".join(loan_details)


def format_repayment_plan_info(plans: list[ReassessRepaymentPlanInfo]) -> str:
    """
    Formats a list of repayment plan information into a markdown string.

    This function processes a list of ReassessRepaymentPlanInfo objects, filtering out
    the "Standard" plan if both "Original" and "Standard" are marked as current plans.
    It then formats each plan's details, including loan information, into a markdown
    string that highlights key attributes such as monthly payments, loan term, and
    amounts forgiven.

    Args:
        plans (List[ReassessRepaymentPlanInfo]): A list of repayment plan information.

    Returns:
        str: A markdown-formatted string representing the repayment plan details.
    """
    # Filter out "Standard" if both "Original" and "Standard" are current plans
    current_plans = [p for p in plans if p.is_current_repayment_plan]
    original_and_standard = [
        p.name for p in current_plans if p.name in ("Original", "Standard")
    ]
    if "Original" in original_and_standard and "Standard" in original_and_standard:
        plans = [p for p in plans if p.name != "Standard"]

    markdown_strings = []
    for plan in plans:
        # Highlight if it's the current repayment plan
        title_prefix = "**Current Plan:** " if plan.is_current_repayment_plan else ""
        if plan.eligible_loans:
            markdown_strings.append(
                f"### {title_prefix}{plan.name or 'Unknown Plan'}\n"
                f"- **New Starting Monthly Payment**: ${plan.new_plan_starting_monthly_payment or 0:.2f}\n"
                f"- **Loan Term (Months)**: {plan.loan_term_in_months or 'N/A'}\n"
                f"- **Total Amount Paid Over Loan Term**: ${plan.total_amount_paid_over_loan_term or 0:.2f}\n"
                f"- **Amount Forgiven**: ${plan.amount_forgiven or 0:.2f}\n"
            )

            if plan.ineligible_loans:
                markdown_strings.append(
                    f"#### Ineligible Loans:\n{format_loans(plan.ineligible_loans)}"
                )

        else:
            markdown_strings.append(
                f"### {title_prefix}{plan.name or 'Unknown Plan'}\n"
                "#### Ineligibility Notice:\n"
                f"You are currently not eligible for this repayment plan: {plan.ineligible_reasons or 'N/A'}. "
                "Please review the eligibility criteria or consider other available plans. "
                "For further assistance, schedule a call with one of Candidly's coaches."
            )

    result_string = "\n".join(markdown_strings)

    return result_string


class RepaymentPlanType(str, Enum):
    """Used by the agent reassess tool"""
    EXTENDED_FIXED = "Extended Fixed"
    EXTENDED_GRADUATED = "Extended Graduated"
    GRADUATED = "Graduated"
    INCOME_BASED_REPAYMENT_2009 = "Income Based Repayment 2009"
    INCOME_BASED_REPAYMENT_2014 = "Income Based Repayment 2014"
    INCOME_CONTINGENT_REPAYMENT = "Income Contingent Repayment"
    PAY_AS_YOU_EARN = "Pay As You Earn"
    STANDARD = "Standard"

    # Cait-specific placeholder for plans we do not show on platform
    NOT_CURRENTLY_AVAILABLE = "Not Currently Available"

    @override
    @classmethod
    def _missing_(cls, value):
        return cls.NOT_CURRENTLY_AVAILABLE


def _check_valid_repayment_plan(repayment_plan: ReassessRepaymentPlanInfo) -> bool:
    """
    Check if the repayment plan is valid. Valid plans are ones shown on the platform.

    Args:
        repayment_plan (ReassessRepaymentPlanInfo): The repayment plan to check.

    Returns:
        bool: True if the repayment plan is valid, False otherwise.
    """
    return RepaymentPlanType(repayment_plan.name) != RepaymentPlanType.NOT_CURRENTLY_AVAILABLE


@tool
async def get_federal_loan_repayment_plans(
    tool_call_id: Annotated[str, InjectedToolCallId],
    config: RunnableConfig,
    show_tool_visual: bool = True,
    selected_repayment_plans: Optional[list[RepaymentPlanType]] = None,
) -> Command[Literal["student_debt_agent"]]:
    """
    Retrieve and federal loan repayment plans for the user, providing insights into various options. If no
    repayment plans are specified, information is returned for all repayment plans.

    The visual for this tool is a table displaying the repayment plans row by row. It does not show which
    loans are eligible for each plan, but does show the new monthly payment, loan term, and total amount paid
    over the life of the loan for each plan.

    Args:
        show_tool_visual (bool): Whether to show a visual chart of the repayment plans.
        selected_repayment_plans (Optional[List[RepaymentPlanType]]): List of repayment plan types of interest.
            If provided, returns info for these plans only, otherwise returns info for all plans.

    Returns:
        str: A markdown-formatted string representing the repayment plan details.
    """
    # Validate and extract configurable values with proper error handling
    try:
        configurable = config.get("configurable", {})
        candidly_api: CandidlyAPIClient = configurable["candidly_api"]
        candidly_token = configurable["candidly_token"]
        candidly_uuid = configurable["user_id"]
    except KeyError as e:
        logger.exception("Missing required configuration values.")
        raise ToolException("Unable to access user data. Please try again later.") from e

    update_state = {}
    tool_message = None

    try:
        # refresh reassess results from candidly api (errors must be caught)
        reassess_results: list[ReassessRepaymentPlanInfo] = await candidly_api.get_user_reassess_info(
            candidly_token=candidly_token,
            candidly_uuid=candidly_uuid
        )

        # Filter repayment plans - first by validity, then optionally by selection
        repayment_plans = [
            repayment_plan
            for repayment_plan in reassess_results
            if _check_valid_repayment_plan(repayment_plan) and (
                not selected_repayment_plans or repayment_plan.name in selected_repayment_plans
            )
        ]

        # Generate the formatted markdown string - ineligible plans are intentionally
        # included for context to the agent
        formatted_plans = format_repayment_plan_info(repayment_plans)

        # Filter out ineligible plans for artifact display
        artifact_display_plans = [plan for plan in repayment_plans if not plan.ineligible_reasons]

        # Determine scenario for standardized formatting
        artifact_rendered = show_tool_visual and bool(artifact_display_plans)
        artifact_content = None
        has_reassess_results = bool(reassess_results)

        # Agent wants to show visual AND there are eligible plans to display
        if artifact_rendered:
            artifact_rows = []
            for plan in artifact_display_plans:
                row = ReassessArtifactRow(
                    repayment_plan_name=plan.name,
                    new_starting_monthly_payment=plan.new_plan_starting_monthly_payment,
                    loan_term_in_months=plan.loan_term_in_months,
                    total_amount_paid_over_loan_term=plan.total_amount_paid_over_loan_term,
                    amount_forgiven=plan.amount_forgiven,
                    is_original=plan.is_current_repayment_plan, # key is changed here for FE.
                    updated_at=plan.updated_at,
                )
                artifact_rows.append(row)

            artifact = Artifact(
                id=tool_call_id,
                name="Your federal repayment options",
                description=("Comparison of available federal loan repayment plans showing"
                             " monthly payments, loan terms, and total amounts paid."),
                type="REASSESS_TABLE",
                data={
                    "rows": [row.model_dump() for row in artifact_rows],
                },
            )
            update_state["artifacts"] = [artifact]
            artifact_content = artifact.model_dump(mode='json')

            # stream artifact as SSE chunk to frontend
            stream_artifact_to_frontend(
                tool_call_id=tool_call_id,
                artifact=artifact
            )

        # Use standardized formatting for all scenarios
        if has_reassess_results:
            # Scenarios 1 & 2: Has results (with or without artifact)
            content = format_tool_message_content(
                tool_call_id=tool_call_id,
                artifact_rendered=artifact_rendered,
                data_only=not artifact_rendered,
                artifact_name="Your federal repayment options",
                artifact_description=("Comparison of available federal loan repayment"
                                      " plans showing monthly payments, loan terms, and total amounts paid."),
                returned_data=formatted_plans
            )
        else:
            # Scenario 3: No results
            content = format_tool_message_content(
                tool_call_id=tool_call_id,
                artifact_rendered=False,
                data_only=True,
                artifact_name="Your federal repayment options",
                artifact_description=("Comparison of available federal loan repayment plans"
                                      " showing monthly payments, loan terms, and total amounts paid."),
                returned_data="[]",
            )

        tool_message = ToolMessage(
            content=content,
            tool_call_id=tool_call_id,
            artifact=artifact_content,
        )

        update_state["messages"] = [tool_message]

        return Command(goto="student_debt_agent", update=update_state)

    except Exception as e:
        logger.exception("Failed to process federal loan repayment plans.")

        # Format the error message for the LLM using tool-specific fallback
        error_msg = format_tool_error(
            str(e),
            "An unexpected error occurred while fetching federal loan repayment plans."
        )

        raise ToolException(error_msg) from e
