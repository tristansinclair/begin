from datetime import date
from typing import Any, Literal, Optional

from pydantic import BaseModel, field_validator


# Classes for generic visual chart types: LINE_CHART, BAR_CHART, AREA_CHART, PIE_CHART
class RowData(BaseModel):
    x: str | float | int
    y0: str | float | int
    y1: Optional[str | float | int] = None
    y2: Optional[str | float | int] = None


class DataLabels(BaseModel):
    x: str
    y0: str
    y1: Optional[str] = None
    y2: Optional[str] = None


# Class for the REASSESS_TABLE type
class ReassessArtifactRow(BaseModel):
    repayment_plan_name: str | None = None
    new_starting_monthly_payment: float | None = None
    new_final_monthly_payment: float | None = None
    loan_term_in_months: int | None = None
    total_amount_paid_over_loan_term: float | None = None
    amount_forgiven: float | None = None
    is_original: bool | None = False
    updated_at: date | None = None


# Class for the REFINANCE_TABLE type
class RefinanceArtifactRow(BaseModel):
    name: str | None = None
    variable_apr: str | None = None
    fixed_apr: str | None = None
    bullets: list[str] | None = None
    disclosure: str | None = None
    repayment_lengths: str | None = None
    minimum_credit_score: str | None = None
    tracking_url: str | None = None
    logo: str | None = None  # Logo URL for the lender
    additional_info: str | None = None

    _safe_str_fields = (
        "name", "variable_apr", "fixed_apr", "disclosure",
        "repayment_lengths", "minimum_credit_score", "tracking_url",
        "logo", "additional_info",
    )

    @field_validator(*_safe_str_fields, mode='before')
    @classmethod
    def safe_str_conversion(cls, v) -> str | None:
        """
        Safely convert a value to string, preserving None values.

        Args:
            v: The value to convert

        Returns:
            str | None: String representation of the value, or None if value is None
        """
        return str(v) if v is not None else None

    @field_validator('bullets', mode='before')
    @classmethod
    def safe_list_conversion(cls, v) -> list[str] | None:
        """
        Safely convert a value to list of strings, preserving None values.
        This is specifically for fields like bullets and highlights that should be lists.

        Args:
            v: The value to convert (can be list, string, or None)

        Returns:
            list[str] | None: The value as a list of strings, or None if value is None
        """
        if v is None:
            return None
        if isinstance(v, list):
            return [str(item) for item in v]
        return [str(v)]


# Class for the PRODUCT_RECOMMENDATION type
class ProductRecommendationArtifactData(BaseModel):
    product_name: str
    product_slug: str
    description: str
    cta_text: str = "Learn more"
    cta_link: str | None = None
    client_name: str


# Generic Artifact class
class Artifact(BaseModel):
    id: str  # tool_call_id
    name: str | None = None
    description: str | None = None
    type: Literal["PIE_CHART", "BAR_CHART", "LINE_CHART", "AREA_CHART", "REASSESS_TABLE",
                  "REFINANCE_TABLE", "MSD_UPLOAD", "PRODUCT_RECOMMENDATION"]
    data: Any


# Artifact Class for Streaming Messages
class StreamingArtifact(BaseModel):
    id: str  # tool_call_id
    type: Literal["artifact"] = 'artifact'
    artifact: Artifact


def artifact_reducer(left: list[Artifact], right: list[Artifact]) -> list[Artifact]:
    """
    Custom reducer for the artifact type. Collpases two lists of artifacts, ensuring no
    duplicates are created during the process using the Artifacts `id` attribute.

    Args:
        left (list[Artifact]): First list of artifacts to combine.
        right (list[Artifact]): Second list of artifacts to combine.

    Returns:
        list[Artifact]: A list of unique artifacts.
    """
    ids_so_far = set()
    result = []

    # Process left list first
    for artifact in left:
        if artifact.id not in ids_so_far:
            ids_so_far.add(artifact.id)
            result.append(artifact)

    # Then process right list
    for artifact in right:
        if artifact.id not in ids_so_far:
            ids_so_far.add(artifact.id)
            result.append(artifact)

    return result
