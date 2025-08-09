from pathlib import Path

from jinja2 import ChainableUndefined, Environment, FileSystemLoader, TemplateError

from clients.logging_client import LoggingClient

logger = LoggingClient.get_logger(__name__)

# Directory where templates are stored
TEMPLATE_DIR = Path(__file__).parent

# Configure Jinja2 environment
env = Environment(
    loader=FileSystemLoader(str(TEMPLATE_DIR)),
    undefined=ChainableUndefined,
    autoescape=False,
)


def render_template(
    template_name: str, context: dict, fallback: str = "The information was unable to be retrieved."
) -> str:
    """
    Render a Jinja2 template with the given context.
    Returns the rendered string or a fallback message if rendering fails.

    Args:
        template_name (str): Name of the template file to render
        context (dict): Context variables to pass to the template
        fallback (str): Fallback message if rendering fails

    Returns:
        str: Rendered template content or fallback message
    """
    try:
        template = env.get_template(template_name)
        return template.render(**context)
    except TemplateError:
        logger.exception(f"Error rendering template '{template_name}' with context keys: {list(context.keys())}")
        # TODO: we will need stronger fallback logic here.
        return fallback
    except Exception:
        logger.exception(
            f"Unexpected error rendering template '{template_name}' with context keys: {list(context.keys())}"
        )
        return fallback
