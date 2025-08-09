from typing import Annotated, Literal

from langchain_core.messages import ToolMessage
from langchain_core.tools import ToolException, tool
from langchain_core.tools.base import InjectedToolCallId
from langgraph.types import Command

from clients.logging_client import LoggingClient
from core.graphs.nodes.agents.tools.utils.format import format_tool_message_content
from core.graphs.nodes.agents.tools.utils.streaming import stream_artifact_to_frontend
from core.graphs.types.artifact import Artifact

logger = LoggingClient.get_logger(__name__)


@tool
def upload_msd(
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command[Literal["student_debt_agent"]]:
    """
    Displays an upload interface with instructions for the user's My Student Data (MSD)
    file from https://studentaid.gov/.

    This tool can be used to upload a user's federal loan data to or update their existing
    federal loan data on the Candidly platform.

    After the user uploads their MSD file:
    - Their federal loan data will be parsed and stored
    - Available repayment plans will be calculated and displayed
    - The system can provide personalized loan advice based on their actual data

    This tool only displays the upload interface - no backend processing occurs until file upload.
    """

    update_state = {}

    try:
        # Create artifact for MSD upload interface
        artifact = Artifact(
            id=tool_call_id,
            name="Upload your MyStudentData file",
            description=("A component with step by step instructions for"
                         " uploading your MyStudentData file and a file upload button."),
            type="MSD_UPLOAD",
            data={},
        )

        update_state["artifacts"] = [artifact]

        content = format_tool_message_content(
            tool_call_id=tool_call_id,
            artifact_rendered=True,
            data_only=False,
            artifact_name="Upload your MyStudentData file",
            artifact_description="Upload interface for My Student Data file from studentaid.gov",
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

    except Exception as e:
        logger.exception("Failed to display MSD upload interface")
        raise ToolException("Unable to display upload interface. Please try again later.") from e

    update_state["messages"] = [tool_message]
    update_state['refresh_user_info'] = 5

    return Command(goto="student_debt_agent", update=update_state)
