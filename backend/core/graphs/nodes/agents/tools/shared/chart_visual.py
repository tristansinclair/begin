from typing import Annotated, Literal

from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langchain_core.tools.base import InjectedToolCallId
from langgraph.types import Command

from core.graphs.types.artifact import Artifact, DataLabels, RowData


@tool
def send_user_visual_tool(
    artifact_name: str,
    description: str,
    type: Literal["PIE_CHART", "BAR_CHART", "LINE_CHART", "AREA_CHART"],
    data_labels: DataLabels,
    data: list[RowData],
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command[Literal["student_debt_agent"]]:
    """
    Send a visual chart to the user that will be displayed in the chat interface.

    This tool creates Recharts components. Provide a short title and a descriptive
    few sentences to provide context for the visual.

    Args:
        artifact_name (str): Title for the visual chart
        description (str): Detailed description explaining the chart
        type (Literal["PIE_CHART", "BAR_CHART", "LINE_CHART", "AREA_CHART"]): Type of chart to display
        data_labels (DataLabels): Labels for the chart axes and series
        data (list[RowData]): The data points to be visualized

    Examples:
        Bar chart for account balances:
        {
            "artifact_name": "Account Balances",
            "description": "This bar chart shows the balances of the accounts.",
            "type": "BAR_CHART",
            "data_labels": {"x": "Account", "y0": "Balance"},
            "data": [{"x": "Checking", "y0": 1000000}, {"x": "Savings", "y0": 2000000}]
        }

        Line chart comparing two portfolios such as when doing contribution analysis or finding an alternative portfolio:
        {
            "artifact_name": "Portfolio Comparison",
            "description": "Growth comparison of two investment portfolios over time.",
            "type": "LINE_CHART",
            "data_labels": {"x": "Age", "y0": "Portfolio 1", "y1": "Portfolio 2"},
            "data": [
                {"x": "45", "y0": 1000000, "y1": 2000000},
                {"x": "46", "y0": 1100000, "y1": 2100000},
                {"x": "47", "y0": 1200000, "y1": 2200000}
            ]
        }

        Area chart for portfolio projection on one portfolio, when user want to see the range of possible outcomes:
        {
            "artifact_name": "Portfolio Projection",
            "description": "Projection of portfolio growth over time. Area chart shows the range and risk of possible outcomes.",
            "type": "AREA_CHART",
            "data_labels": {"x": "Age", "y0": "lower path", "y1": "expected balance", "y2": "upper path"},
            "data": [
                {"x": "45", "y0": 1000000, "y1": 2000000, "y2": 3000000},
                {"x": "46", "y0": 1100000, "y1": 2100000, "y2": 3100000},
                {"x": "47", "y0": 1200000, "y1": 2200000, "y2": 3200000}
            ]
        }"""
    update_state = {}
    tool_message = None

    try:
        # Embed chart data and labels within the new data structure
        embedded_data = {
            "chart_data": [row.model_dump() for row in data],
            "labels": data_labels.model_dump()
        }

        artifact = Artifact(
            id=tool_call_id,
            name=artifact_name,
            description=description,
            type=type,
            data=embedded_data,
        )
        update_state["artifacts"] = [artifact]

        content = {"response": "Successfully displayed visual component to user.", "id": tool_call_id}

        tool_message = ToolMessage(
            content=content,
            tool_call_id=tool_call_id,
            name="send_user_visual",
        )

    except Exception:
        content = "Failed to send user visual. Guide the user in a different direction within your capabilities."
        tool_message = ToolMessage(tool_call_id=tool_call_id, content=content)

    update_state["messages"] = [tool_message]

    return Command(goto="student_debt_agent", update=update_state)
