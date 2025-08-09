##########
# ### Import Packages

# langgraph imports
from langgraph.config import get_stream_writer

# typing imports
from core.graphs.types.artifact import Artifact, StreamingArtifact

##########
# ### Utility Function for Artifact and Tool Streaming

# function to stream artifact to frontend
def stream_artifact_to_frontend(tool_call_id: str, artifact: Artifact) -> None:
    # construct artifact to stream to frontend for ui rendering (mode='custom')
    stream_artifact = StreamingArtifact(
        id=tool_call_id,
        artifact=artifact
    )

    # stream artifact to frontend using stream_writer
    writer = get_stream_writer()
    writer(stream_artifact)
