import json
import re
from typing import Any, Literal, Tuple
from json_repair import repair_json

from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langchain_core.messages import AnyMessage
from langgraph.types import Command

from core.graphs.types.guardrail_validation import ValidationResult
from core.graphs.types.state import CandidlyAgentState
from core.graphs.utils.model import get_guardrail_model
from core.graphs.nodes.utils.conversation_context import extract_conversation_context
from core.prompts.loader import render_template

model = get_guardrail_model()

def pre_filter_validation(user_input: str) -> ValidationResult:
    """Pre-filter validation combining length check and high-risk pattern detection.

    This combines length limits and sophisticated pattern matching.
    Returns ValidationResult with blocked=True if input should be blocked, blocked=False if it passes pre-filtering.

    Args:
        user_input (str): The user input to validate.
    Returns:
        ValidationResult
    """
    # Length check
    if len(user_input) > 2000:
        return ValidationResult(
            reasoning="Input exceeds maximum allowed length of 2000 characters",
            blocked=True
        )

    # High-risk pattern detection
    high_risk_patterns = [
        "ignore previous", "ignore all", "act as", "pretend you are",
        "you are now", "new instructions", "override", "jailbreak",
        "your training", "system prompt", "internal instructions"
    ]

    input_lower = user_input.lower()
    for pattern in high_risk_patterns:
        if pattern in input_lower:
            return ValidationResult(
                reasoning=f"Detected prompt injection pattern: '{pattern}'",
                blocked=True
            )

    # SQL injection patterns
    sql_patterns = [
        r"\bselect\s+[\w\*]+(?:\s*,\s*[\w\*]+)*\s+from\s+\w+",  # SELECT x FROM y
        r"\binsert\s+into\s+\w+\s+(?:values|select)",  # INSERT INTO x VALUES/SELECT
        r"\bupdate\s+\w+\s+set\s+\w+\s*=",  # UPDATE x SET y=
        r"\bdelete\s+from\s+\w+\s+where",  # DELETE FROM x WHERE - requires WHERE clause for SQL
        r"\bdrop\s+(?:table|database)\s+\w+",  # DROP TABLE/DATABASE x
        r"\balter\s+table\s+\w+",  # ALTER TABLE x
        r"\btruncate\s+table\s+\w+",  # TRUNCATE TABLE x
        r"\bgrant\s+[\w\s]+privileges",  # GRANT ... PRIVILEGES
        r"--\s*;\s*select",  # SQL comment + injection
    ]

    if any(re.search(pattern, user_input, re.IGNORECASE) for pattern in sql_patterns):
        return ValidationResult(
            reasoning="Detected SQL injection pattern in input",
            blocked=True
        )

    # Code execution patterns
    code_patterns = [
        r"\bimport\s+(?:os|sys|subprocess|shutil)\b",
        r"\bos\s*\.\s*(?:system|popen|environ)\s*\(",
        r"\bsubprocess\s*\.\s*(?:run|call|Popen)\s*\(",
        r"\beval\s*\(",
        r"\bexec\s*\(",
        r"\b__import__\s*\(",
        r"\bwith\s+open\s*\(",
        r"\bopen\s*\(\s*['\"](?:/|\\)",
        r"^def\s+\w+\s*\(.*\):",  # Function definition at start of line
        r"^class\s+\w+\s*:",  # Class definition at start of line
    ]

    if any(re.search(pattern, user_input, re.IGNORECASE) for pattern in code_patterns):
        return ValidationResult(
            reasoning="Detected code execution pattern in input",
            blocked=True
        )

    return ValidationResult(
        reasoning="Input passed pre-filtering checks",
        blocked=False
    )

async def input_guardrail_node(state: CandidlyAgentState) -> Command[Literal["merge"]]:
    """Given a user chat input, determines if it is acceptable according
    to the guardrail guidelines defined in the system prompt. Based on this
    result, the state is routed to the proper next node with a response to
    non-acceptable inputs if needed.
    Uses pre-filtering and JSON-structured LLM validation with conversation context.
    Args:
        state (CandidlyAgentState): The current state of the agent.
    Returns:
        Command[Literal["student_debt_agent", "__end__"]]: The next node to route to.
    """
    # Extract the latest (human) message, its content, id, and the conversation context

    latest_message = state.messages[-1]
    latest_message_id = getattr(latest_message, 'id', None)

    latest_message_content, conversation_context = extract_conversation_context(state.messages, max_human_messages=2)

    # Step 0: Validate that the latest message has an ID
    if latest_message_id is None:
        # Fail secure - if message has no ID, block the input
        validation_error_assessment = ValidationResult(
            reasoning="Message missing required ID field",
            blocked=True
        )
        return Command(
            goto="merge_node",
            update={"guardrail_assessment": validation_error_assessment}
        )

    # Step 1: Pre-filter validation on the latest message content
    pre_filter_result = pre_filter_validation(latest_message_content)
    if pre_filter_result.blocked:
        # Track this message as blocked
        updated_blocked_ids = state.blocked_message_ids.copy()
        updated_blocked_ids.add(latest_message_id)

        return Command(
            goto="merge_node",
            update={
                "guardrail_assessment": pre_filter_result,
                "blocked_message_ids": updated_blocked_ids,
            }
        )

    # Step 2: LLM validation with context
    system_role = render_template("candidly/input_guardrail_role.j2", {}).strip()
    validation_prompt = render_template("candidly/input_guardrail_prompt.j2", {
        "user_input": latest_message_content,
        "conversation_context": conversation_context
    }).strip()

    try:
        messages = [
            SystemMessage(content=system_role),
            HumanMessage(content=validation_prompt),
        ]

        response = await model.ainvoke(messages)

        # Parse JSON response
        result_dict = json.loads(repair_json(response.content.strip()))

        # Create ValidationResult from dict
        result = ValidationResult(**result_dict)

        # Track blocked message if LLM validation blocks it
        update_dict: dict[str, Any] = {"guardrail_assessment": result}
        if result.blocked:
            updated_blocked_ids = state.blocked_message_ids.copy()
            updated_blocked_ids.add(latest_message_id)
            update_dict["blocked_message_ids"] = updated_blocked_ids

        return Command(
            goto="merge_node",
            update=update_dict,
        )

    except (json.JSONDecodeError, ValueError, Exception) as e:
        # Fail secure - if validator has issues, block the input
        validation_error_assessment = ValidationResult(
            reasoning=f"Validation system error: {str(e)[:50]}",
            blocked=True
        )

        # Track this message as blocked due to validation error
        updated_blocked_ids = state.blocked_message_ids.copy()
        updated_blocked_ids.add(latest_message_id)

        return Command(
            goto="merge_node",
            update={
                "guardrail_assessment": validation_error_assessment,
                "blocked_message_ids": updated_blocked_ids,
            }
        )
