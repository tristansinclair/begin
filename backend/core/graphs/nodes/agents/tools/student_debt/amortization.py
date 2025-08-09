import math
from datetime import datetime, timedelta
from decimal import Decimal, localcontext
from typing import Annotated, Literal

from langchain.tools import tool
from langchain_core.messages import ToolMessage
from langchain_core.tools import ToolException
from langchain_core.tools.base import InjectedToolCallId
from langgraph.types import Command
from pydantic import BaseModel, field_validator, model_validator
from scipy.optimize import fsolve

from clients.logging_client import LoggingClient
from core.graphs.nodes.agents.tools.utils.format import format_tool_error, format_tool_message_content
from core.graphs.nodes.agents.tools.utils.streaming import stream_artifact_to_frontend
from core.graphs.types.artifact import Artifact, DataLabels, RowData

logger = LoggingClient.get_logger(__name__)

# --- Loan Term Solver ---

class SolveLoanTermParams(BaseModel):
    """Model for solving missing loan parameters."""
    balance: float
    annual_rate: float | None = None
    term_months: int | None = None
    monthly_payment: float | None = None

    @field_validator('balance')
    @classmethod
    def validate_balance(cls, v):
        if v <= 0:
            raise ValueError("Balance must be positive")
        return v

    @field_validator('annual_rate')
    @classmethod
    def validate_annual_rate(cls, v):
        if v is not None and v < 0:
            raise ValueError("Annual rate cannot be negative")
        return v

    @field_validator('term_months')
    @classmethod
    def validate_term_months(cls, v):
        if v is not None and v <= 0:
            raise ValueError("Term months must be positive")
        return v

    @field_validator('monthly_payment')
    @classmethod
    def validate_monthly_payment(cls, v):
        if v is not None and v <= 0:
            raise ValueError("Monthly payment must be positive")
        return v

    @model_validator(mode='after')
    def validate_exactly_one_none(self):
        """Validate that exactly one field is None."""
        none_fields = sum([
            self.annual_rate is None,
            self.term_months is None,
            self.monthly_payment is None
        ])

        if none_fields != 1:
            raise ValueError("Exactly one of annual_rate, term_months, or monthly_payment must be None")

        return self


def _solve_missing_loan_parameter(params: SolveLoanTermParams) -> dict:
    """
    Solve for the missing loan parameter which is one of the following: annual_rate,
    term_months, or monthly_payment.

    Note:
    - Monthly payment and term can be solved directly using algebraic rearrangement
      of the amortization formula
    - Interest rate requires iterative solving (Newton-Raphson) because it creates
      a polynomial equation of degree n (where n = term_months) that has no general
      algebraic solution for n > 4 (Abel-Ruffini theorem)

    Args:
        params: SolveLoanTermParams

    Returns:
        SolveLoanTermResponse
    """
    balance = params.balance
    annual_rate = params.annual_rate
    term_months = params.term_months
    monthly_payment = params.monthly_payment

    total_payment = (monthly_payment or 0)

    if annual_rate is None:
        # Solve for interest rate using scipy's fsolve
        if term_months <= 0 or total_payment <= 0:
            raise ValueError("Invalid parameters for solving interest rate")

        # Define function that returns 0 when we find the correct interest rate
        def func(monthly_rate):
            if monthly_rate <= 0:
                calculated_payment = balance / term_months
            else:
                factor = (1 + monthly_rate) ** term_months
                calculated_payment = balance * monthly_rate * factor / (factor - 1)
            return calculated_payment - total_payment

        # Initial guess: 5% annual rate converted to monthly
        monthly_rate_guess = 0.05 / 12

        # Solve for the monthly rate
        monthly_rate_solution = fsolve(func, monthly_rate_guess)[0]

        # Convert to annual percentage rate
        annual_rate = monthly_rate_solution * 12 * 100

        # Validate the solution
        if annual_rate < 0:
            raise ValueError("Could not converge on interest rate solution")

        solved_field = 'annual_rate'
        value = annual_rate

    elif term_months is None:
        # Solve for term (number of payments)
        if annual_rate == 0:
            # 0% interest case
            term_months = math.ceil(balance / total_payment)
        else:
            monthly_rate = annual_rate / 12 / 100
            if monthly_rate <= 0 or total_payment <= 0:
                raise ValueError("Invalid parameters for solving term")

            if total_payment <= balance * monthly_rate:
                raise ValueError("Payment too small to pay off loan")

            # Standard amortization formula rearranged for n
            # n = log(P / (P - L*r)) / log(1+r)
            term_months = math.ceil(
                math.log(total_payment / (total_payment - balance * monthly_rate)) /
                math.log(1 + monthly_rate)
            )

        solved_field = 'term_months'
        value = float(term_months)

    elif monthly_payment is None:
        # Solve for monthly payment
        if annual_rate == 0:
            # 0% interest case
            monthly_payment = balance / term_months
        else:
            monthly_rate = annual_rate / 12 / 100
            if monthly_rate <= 0 or term_months <= 0:
                raise ValueError("Invalid parameters for solving payment")

            # Standard amortization formula
            factor = (1 + monthly_rate) ** term_months
            monthly_payment = balance * monthly_rate * factor / (factor - 1)

        solved_field = 'monthly_payment'
        value = monthly_payment

    else:
        raise ValueError("No missing parameter to solve for")

    # Build complete parameter set
    all_params = {
        'balance': balance,
        'annual_rate': annual_rate,
        'term_months': int(term_months) if term_months is not None else None,
        'monthly_payment': monthly_payment,
    }

    return {
        "solved_field": solved_field,
        "value": value,
        "all_params": all_params,
    }


@tool
async def solve_level_payment_loan_term(
    balance: float,
    tool_call_id: Annotated[str, InjectedToolCallId],
    annual_rate: float | None = None,
    term_months: int | None = None,
    monthly_payment: float | None = None,
) -> Command[Literal["student_debt_agent"]]:
    """
    Solve for exactly one missing level payment loan parameter (monthly payment, interest rate,
    or term/months remaining) given the other values.

    This tool computes the missing loan primitive given the other loan parameters. Exactly one of
    annual_rate, term_months, or monthly_payment must be None (missing), while the others must be provided.
    Missing interest rates are estimated using Newton-Raphson method.

    Args:
        balance: Remaining loan principal (REQUIRED, must be positive)
        annual_rate: Annual interest rate as percent (e.g., 7.25 for 7.25%). Set to None to solve for this.
        term_months: Number of months/payments remaining. Set to None to solve for this.
        monthly_payment: Scheduled monthly payment. Set to None to solve for this.

    Returns:
        The solved parameter value and complete loan parameter set.
    """

    try:
        # Create and validate input parameters
        input_params = SolveLoanTermParams(
            balance=balance,
            annual_rate=annual_rate,
            term_months=term_months,
            monthly_payment=monthly_payment,
        )

        # Solve for missing parameter
        result = _solve_missing_loan_parameter(input_params)

        # Use standardized formatting
        content = format_tool_message_content(
            tool_call_id=tool_call_id,
            artifact_rendered=False,
            data_only=True,
            artifact_name="Loan Parameter Solution",
            artifact_description="Calculated missing loan parameter",
            returned_data=result
        )

        tool_message = ToolMessage(
            content=content,
            tool_call_id=tool_call_id,
        )

        return Command(
            goto="student_debt_agent",
            update={"messages": [tool_message]}
        )

    except Exception as e:
        logger.exception("Failed to solve loan parameter.")

        error_msg = format_tool_error(
            str(e),
            "Unable to solve for the missing loan parameter. Please check that exactly one parameter is missing and all values are valid."
        )

        raise ToolException(f"Error solving loan parameter: {error_msg}") from e

# --- Amortization Calculation ---

class AmortizationParams(BaseModel):
    """Model for generating amortization schedule."""
    balance: float
    annual_rate: float
    term_months: int
    monthly_payment: float
    start_date: str | None = None

    @field_validator('balance')
    @classmethod
    def validate_balance(cls, v):
        if v <= 0:
            raise ValueError("Balance must be positive")
        return v

    @field_validator('annual_rate')
    @classmethod
    def validate_annual_rate(cls, v):
        if v < 0:
            raise ValueError("Annual rate cannot be negative")
        return v

    @field_validator('term_months')
    @classmethod
    def validate_term_months(cls, v):
        if v <= 0:
            raise ValueError("Term months must be positive")
        return v

    @field_validator('monthly_payment')
    @classmethod
    def validate_monthly_payment(cls, v):
        if v <= 0:
            raise ValueError("Monthly payment must be positive")
        return v

    @field_validator('start_date')
    @classmethod
    def validate_start_date(cls, v):
        if v is not None:
            try:
                datetime.strptime(v, '%Y-%m-%d')
            except ValueError as e:
                raise ValueError("Start date must be in YYYY-MM-DD format") from e
        if v is None:
            # Default to today's date
            v = datetime.now().strftime('%Y-%m-%d')
        return v

    @model_validator(mode='after')
    def validate_payment_sufficiency(self):
        """Validate that payment is sufficient to avoid negative amortization and pay off loan in term."""
        # 1. Check for negative amortization
        monthly_rate = self.annual_rate / 12 / 100
        monthly_interest = self.balance * monthly_rate

        if self.monthly_payment <= monthly_interest:
            raise ValueError(
                f"Monthly payment of ${self.monthly_payment:,.2f} is insufficient. "
                f"Minimum payment to cover interest is ${monthly_interest:,.2f}. "
                f"This would result in negative amortization where the loan balance grows over time."
            )

        # 2. Check if payment is sufficient to pay off loan in specified term
        solver_params = SolveLoanTermParams(
            balance=self.balance,
            annual_rate=self.annual_rate,
            term_months=self.term_months,
            monthly_payment=None
        )
        result = _solve_missing_loan_parameter(solver_params)
        minimum_required_payment = result["value"]

        # Add small tolerance (1 cent) to handle floating-point precision issues
        tolerance = 0.01
        if self.monthly_payment < (minimum_required_payment - tolerance):
            raise ValueError(
                f"Monthly payment of ${self.monthly_payment:,.2f} is insufficient to pay off the loan in "
                f"{self.term_months} months. Minimum payment required is ${minimum_required_payment:,.2f}."
            )

        return self


def _generate_amortization_schedule(params: AmortizationParams) -> dict:
    """
    Generate a complete amortization schedule with summary statistics.

    NOTE: RowData items are stored in the order of principal, interest, and balance!

    Args:
        params: AmortizationParams

    Returns:
        dict: Amortization schedule with chart_data and summary
    """
    balance = params.balance
    annual_rate = params.annual_rate
    term_months = params.term_months
    monthly_payment = params.monthly_payment
    start_date = params.start_date

    # Use local context for precise decimal calculations to avoid affecting global state
    # 28 digits provides high precision for financial calculations with minimal memory overhead
    with localcontext() as ctx:
        ctx.prec = 28

        # Convert to Decimal for precise calculations
        balance_decimal = Decimal(str(balance))
        annual_rate_decimal = Decimal(str(annual_rate))
        monthly_payment_decimal = Decimal(str(monthly_payment))

        # Calculate monthly interest rate - always treat annual_rate as percentage
        monthly_rate_decimal = annual_rate_decimal / Decimal('12') / Decimal('100')

        # Initialize tracking variables with Decimal precision
        current_balance = balance_decimal
        schedule_data = []
        total_interest_paid = Decimal('0')
        total_principal_paid = Decimal('0')
        actual_months = 0

        # Parse start date if provided
        start_dt = datetime.strptime(start_date, '%Y-%m-%d') if start_date else datetime.now()

        # Generate amortization schedule
        for month in range(1, term_months + 1):
            if current_balance <= 0:
                break

            # Calculate interest for this period
            interest_payment = current_balance * monthly_rate_decimal

            # Calculate principal payment (adjust for final payment)
            if current_balance + interest_payment <= monthly_payment_decimal:
                # Final payment - pay remaining balance plus interest
                principal_payment = current_balance
                current_balance = Decimal('0')
            else:
                # Regular payment - principal is payment minus interest
                principal_payment = monthly_payment_decimal - interest_payment
                current_balance -= principal_payment

            # Ensure balance doesn't go negative due to floating point precision
            current_balance = max(Decimal('0'), current_balance)

            # Add to schedule (convert to float for output)
            schedule_data.append(RowData(
                x=month,
                y0=float(principal_payment),
                y1=float(interest_payment),
                y2=float(current_balance)
            ))

            # Update totals
            total_interest_paid += interest_payment
            total_principal_paid += principal_payment
            actual_months = month

            # Break if loan is paid off
            if current_balance == 0:
                break

        # Calculate payoff date
        payoff_date = None
        if start_date:
            payoff_date = (start_dt + timedelta(days=actual_months * 30)).strftime('%Y-%m-%d')

        # Determine if loan was fully paid off
        loan_fully_paid_off = current_balance == 0
        remaining_balance = round(float(current_balance), 2)

        # Create summary statistics (convert Decimal values to float/int for output)
        summary = {
            "original_balance": balance,
            "total_payments": actual_months,
            "total_interest_paid": round(float(total_interest_paid), 2),
            "total_principal_paid": round(float(total_principal_paid), 2),
            "total_amount_paid": round(float(total_interest_paid + total_principal_paid), 2),
            "monthly_payment": monthly_payment,
            "start_date": start_date,
            "loan_fully_paid_off": loan_fully_paid_off,
            "remaining_balance": remaining_balance,
            "payoff_date": payoff_date if loan_fully_paid_off else None,
            "months_to_payoff": actual_months if loan_fully_paid_off else None,
            "years_to_payoff": round(actual_months / 12, 1) if loan_fully_paid_off else None
        }

    return {
        "data": schedule_data,
        "summary": summary,
    }


def _calculate_savings_with_extra_payment(regular_summary: dict, extra_summary: dict) -> dict:
    """
    Calculate savings from extra payments, handling all payoff scenarios.

    Args:
        regular_summary: Summary from regular payment schedule
        extra_summary: Summary from extra payment schedule

    Returns:
        dict: Savings information
    """
    regular_paid_off = regular_summary["loan_fully_paid_off"]
    extra_paid_off = extra_summary["loan_fully_paid_off"]

    savings = {
        "interest_saved": round(regular_summary["total_interest_paid"] - extra_summary["total_interest_paid"], 2)
    }

    if regular_paid_off and extra_paid_off:
        # Both schedules pay off the loan - normal comparison
        savings["months_saved"] = regular_summary["months_to_payoff"] - extra_summary["months_to_payoff"]

    elif not regular_paid_off and extra_paid_off:
        # Regular schedule doesn't pay off, but extra payments do
        savings["months_saved"] = None
        savings["regular_schedule_remaining_balance"] = regular_summary["remaining_balance"]

    elif regular_paid_off and not extra_paid_off:
        # Unlikely: regular pays off but extra doesn't (should not happen with positive extra payments)
        savings["months_saved"] = None
        savings["extra_schedule_remaining_balance"] = extra_summary["remaining_balance"]

    else:
        # Neither schedule pays off the loan
        savings["months_saved"] = None
        savings["regular_schedule_remaining_balance"] = regular_summary["remaining_balance"]
        savings["extra_schedule_remaining_balance"] = extra_summary["remaining_balance"]
        savings["balance_reduction_from_extra"] = round(regular_summary["remaining_balance"] - extra_summary["remaining_balance"], 2)

    return savings


def _convert_month_to_date(month: int, start_date: str) -> str:
    """
    Convert a month number to a date string.
    This function assumes a 30 day month.

    Args:
        month (int): Month number
        start_date (str): Start date in YYYY-MM-DD format

    Returns:
        str: Date string in YY MM format (e.g., "2025-01")
    """
    return (datetime.strptime(start_date, '%Y-%m-%d') + timedelta(days=month * 30)).strftime('%Y-%m')


def _format_amortization_artifact_data(
    amortization_results: dict,
    type: Literal["LINE_CHART", "BAR_CHART"],
    extra_payment_amortization_results: dict | None,
) -> dict:
    """
    Formats the artifact data for the frontend. This function focuses on two features:
    1. Plotting the regular amortization schedule against the extra payment amortization schedule
    if extra_payment_amortization_results is provided.
    2. Ensure the x-axis has a reasonable number of ticks.

    For the x-axis, we use this general rule where n is the number of payments in the amortization schedule:
    - if n <= 24 then include all points
    - if 24 < n < 60 then include every 6th point (matches bi-annual plot)
    - if n >= 60 then include every 12th point (matches annual plot)

    Args:
        amortization_results: AmortizationResult
        type: Chart type ("LINE_CHART" or "BAR_CHART")
        extra_payment_amortization_results: AmortizationResult | None

    Returns:
        dict: Formatted artifact data with chart_data and labels
    """

    if type == "BAR_CHART":
        # Prefer extra payment summary if available, else use regular summary
        use_extra = extra_payment_amortization_results is not None
        summary = (
            extra_payment_amortization_results["summary"]
            if use_extra
            else amortization_results["summary"]
        )

        x_labels = {
            False: ("Principal Paid", "Interest Paid"),
            True: ("Principal with Extra Payments", "Interest with Extra Payments"),
        }
        x_0_label, x_1_label = x_labels[use_extra]

        chart_data = [
            RowData(x=x_0_label, y0=summary["total_principal_paid"]),
            RowData(x=x_1_label, y0=summary["total_interest_paid"]),
        ]
        labels = DataLabels(
            x="Payment Type",
            y0="Amount ($)",
        )

    else:  # LINE_CHART
        if extra_payment_amortization_results is None:
            start_date = amortization_results["summary"]["start_date"]
            # Single amortization schedule - use existing data
            cleaned_chart_data = []
            for row in amortization_results["data"]:
                # Drop principal and interest and only plot balance
                cleaned_chart_data.append(RowData(
                    x=_convert_month_to_date(row.x, start_date),
                    y0=row.y2, # y2 is remaining balance
                ))
            chart_data = cleaned_chart_data
            labels = DataLabels(
                x="Month",
                y0="Remaining Balance"
            )
        else:
            # Merge two schedules - y1 for regular, y2 for extra payments
            regular_data = {row.x: row.y2 for row in amortization_results["data"]}  # y2 is remaining balance
            extra_data = {row.x: row.y2 for row in extra_payment_amortization_results["data"]}

            # Create merged data - use the longer schedule as base
            max_months = max(len(amortization_results["data"]), len(extra_payment_amortization_results["data"]))
            chart_data = []
            start_date = amortization_results["summary"]["start_date"]

            for month in range(1, max_months + 1):
                regular_balance = regular_data.get(month, 0)
                extra_balance = extra_data.get(month, 0)

                chart_data.append(RowData(
                    x=_convert_month_to_date(month, start_date),
                    y0=regular_balance,  # Regular schedule balance
                    y1=extra_balance,  # Extra payment schedule balance    # Extra payment schedule balance
                ))

            labels = DataLabels(
                x="Month",
                y0="Regular Schedule Balance",
                y1="With Extra Payments"
            )

    # Apply x-axis filtering for line charts
    if type == "LINE_CHART":
        n = len(chart_data)
        if n > 60:
            # Include every 12th point (annual)
            filtered_indices = list(range(0, n, 12))
            if filtered_indices[-1] != n - 1:
                filtered_indices.append(n - 1)
            chart_data = [chart_data[i] for i in filtered_indices]
        elif n > 24:
            # Include every 6th point (bi-annual)
            filtered_indices = list(range(0, n, 6))
            if filtered_indices[-1] != n - 1:
                filtered_indices.append(n - 1)
            chart_data = [chart_data[i] for i in filtered_indices]
        # else: include all points (n <= 24)

    return {
        "chart_data": [row.model_dump() for row in chart_data],
        "labels": labels.model_dump()
    }


def _format_amortization_artifact_metadata(
    tool_visual_type: Literal["AMORTIZATION_PLOT", "SUMMARY_CHART"],
    extra_payment_is_present: bool,
) -> tuple[str, str, str]:
    """
    Format artifact metadata for the frontend based on visualization type and extra payment.

    Args:
        tool_visual_type (Literal["AMORTIZATION_PLOT", "SUMMARY_CHART"]):
            Type of visualization to display.
        extra_payment_is_present (bool):
            Whether an extra monthly payment is present.

    Returns:
        tuple[str, str, str]: Artifact name, description, and chart type.
    """
    if tool_visual_type == "AMORTIZATION_PLOT":
        chart_type = "LINE_CHART"
        artifact_name = "Loan Payoff Timeline"
        if extra_payment_is_present:
            artifact_description = "See how your balance decreases with extra payments"
        else:
            artifact_description = "See how your balance decreases with each payment"
    else:  # "SUMMARY_CHART"
        chart_type = "BAR_CHART"
        artifact_name = "Total Loan Costs"
        if extra_payment_is_present:
            artifact_description = "Compare principal vs. interest with extra payments"
        else:
            artifact_description = "Compare what you pay in principal vs. interest"

    return artifact_name, artifact_description, chart_type


@tool
async def generate_amortization(
    balance: float,
    annual_rate: float,
    term_months: int,
    monthly_payment: float,
    tool_call_id: Annotated[str, InjectedToolCallId],
    monthly_extra_payment: float | None = None,
    start_date: str | None = None,
    show_tool_visual: Literal["AMORTIZATION_PLOT", "SUMMARY_CHART"] | None = None,
) -> Command[Literal["student_debt_agent"]]:
    """
    Generate a complete amortization schedule and summary statistics for a level payment loan.

    This tool produces a month-by-month breakdown of loan payments, showing principal, interest,
    and the remaining balance for each payment period.

    This tool displays two types of plots:
    1. Regular amortization plot: A line chart showing balance over time.
    2. Summary chart: A bar chart showing total principal versus interest.

    For both visualizations, if an extra monthly payment is provided, it will be plotted
    against the regular visualization on the same chart.

    Args:
        balance: Starting loan balance (REQUIRED, must be positive)
        annual_rate: Annual interest rate as percent (e.g., 5.25 for 5.25%)
        term_months: Number of months/payments (REQUIRED, must be positive)
        monthly_payment: Scheduled monthly payment (REQUIRED, must be positive)
        monthly_extra_payment: Optional extra payment made on top of the monthly payment (must be positive if provided)
        start_date: Optional start date in YYYY-MM-DD format for payment schedule
        show_tool_visual: Type of visualization to display:
            - "AMORTIZATION_PLOT": Line chart showing balance over time
            - "SUMMARY_CHART": Bar chart showing total principal vs interest

    Returns:
        Amortization schedule with chart visualization and summary statistics.
    """

    try:
        # Validate extra payment if provided
        if monthly_extra_payment is not None and monthly_extra_payment <= 0:
            raise ValueError("Monthly extra payment must be positive if provided")

        # Create and validate input parameters
        input_params = AmortizationParams(
            balance=balance,
            annual_rate=annual_rate,
            term_months=term_months,
            monthly_payment=monthly_payment,
            start_date=start_date
        )
        amortization_results = _generate_amortization_schedule(input_params)

        extra_payment_amortization_results = None
        if monthly_extra_payment is not None:
            extra_payment_input_params = AmortizationParams(
                balance=balance,
                annual_rate=annual_rate,
                term_months=term_months,
                monthly_payment=monthly_payment + monthly_extra_payment,
                start_date=start_date
            )
            extra_payment_amortization_results = _generate_amortization_schedule(extra_payment_input_params)

        update_state = {}
        artifact_rendered = False
        artifact_content = None
        artifact_name = None
        artifact_description = None

        # Create chart artifact if requested and there's data
        if show_tool_visual and amortization_results["data"]:
            # Format metadata
            artifact_name, artifact_description, chart_type = _format_amortization_artifact_metadata(
                tool_visual_type=show_tool_visual,
                extra_payment_is_present=monthly_extra_payment is not None
            )

            # Format data using helper function (reduce x axis if too many points)
            formatted_data = _format_amortization_artifact_data(
                amortization_results=amortization_results,
                type=chart_type,
                extra_payment_amortization_results=extra_payment_amortization_results
            )

            artifact = Artifact(
                id=tool_call_id,
                name=artifact_name,
                description=artifact_description,
                type=chart_type,
                data=formatted_data
            )

            update_state["artifacts"] = [artifact]
            artifact_content = artifact.model_dump(mode='json')
            artifact_rendered = True

            # Stream artifact to frontend
            stream_artifact_to_frontend(
                tool_call_id=tool_call_id,
                artifact=artifact
            )

        # Add additional summary data if extra payment is present for impact metrics
        summary = amortization_results["summary"].copy()
        if extra_payment_amortization_results:
            summary["extra_payment_summary"] = extra_payment_amortization_results["summary"]
            summary["savings_with_extra_payment"] = _calculate_savings_with_extra_payment(
                amortization_results["summary"],
                extra_payment_amortization_results["summary"]
            )

        content = format_tool_message_content(
            tool_call_id=tool_call_id,
            artifact_rendered=artifact_rendered,
            data_only=not artifact_rendered,
            artifact_name=artifact_name,
            artifact_description=artifact_description,
            returned_data=summary
        )

        tool_message = ToolMessage(
            content=content,
            tool_call_id=tool_call_id,
            artifact=artifact_content,
        )

        update_state["messages"] = [tool_message]

        return Command(
            goto="student_debt_agent",
            update=update_state
        )

    except Exception as e:
        logger.exception("Failed to generate amortization schedule.")
        error_message = format_tool_error(str(e), "Error generating amortization schedule")

        raise ToolException(error_message) from e
