from typing import List
from langchain_core.documents import Document

from clients.logging_client import LoggingClient
from langchain_postgres.v2.async_vectorstore import  AsyncPGVectorStore
from langchain_core.runnables import RunnableConfig


logger = LoggingClient.get_logger(__name__)

    

def format_chunks(chunks: List[Document]) -> str:
    '''
    Renders list of Langchain Documents/Chunks into a readable string for LLM.

    chunks: List[Document]

    Returns:
        str: The formatted chunks.
    '''

    formatted_str = """"""
    for i, chunk in enumerate(chunks):
        formatted_str += f"ID: {chunk.id}\n"
        formatted_str += f"Name: {chunk.metadata.get('name', 'Unknown')}\n"
        formatted_str += f"Last Updated: {chunk.metadata.get('first_published_at', 'N/A')}\n"
        formatted_str += f"Content: {chunk.page_content}\n\n"
        formatted_str += "\n\n--------------------------------\n"

    return formatted_str

async def perform_similarity_search(query: str, k: int, config: RunnableConfig) -> List[Document]:
    logger.debug("performing similarity search")
    vector_store = config.get('configurable', {}).get('pg_vectorstore', None)
    if type(vector_store) == AsyncPGVectorStore:
        chunks = await vector_store.asimilarity_search(query, k=k)
    else:
        logger.info(f"Vector store not found in config: {config}")
        chunks = []
    return chunks

# TODO: Kia Make a flexible multi-retriever interface 
async def retrieve_relevant_chunks(query: str, config: RunnableConfig) -> List[Document]:
    '''
    Perform RAG on the knowledgebase using a query. This performs a similarity search on the vector store of articles on student loands and repayment and returns the most relevant documents.
    
    Args:
        query (str): The query to perform RAG on.
        config (RunnableConfig): The Langgraph config object.

    Returns:
        List[Document]: The most relevant documents.
    '''
    logger.info(f"Searching for relevant chunks for query: {query}")
    if not config["configurable"].get("pg_vectorstore", None):
        return []
    
    chunks = await perform_similarity_search(query, k=5, config=config)        
    # logger.info(f"\n\nRetrieved Chunks:{format_chunks(chunks)}")
    return chunks
