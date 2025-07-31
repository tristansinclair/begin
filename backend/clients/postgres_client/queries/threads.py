from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy import text


class ThreadMethodsMixin:
    """Mixin class providing thread-related database methods."""
    
    async def get_thread(self, thread_id: str) -> Optional[Dict[str, Any]]:
        """Get a thread by ID."""
        engine: AsyncEngine = self.get_engine()
        
        async with engine.connect() as conn:
            result = await conn.execute(
                text("SELECT * FROM threads WHERE id = :thread_id"),
                {"thread_id": thread_id}
            )
            row = result.fetchone()
            return dict(row) if row else None
    
    async def create_thread(self, thread_data: Dict[str, Any]) -> str:
        """Create a new thread."""
        engine: AsyncEngine = self.get_engine()
        
        async with engine.connect() as conn:
            result = await conn.execute(
                text("""
                    INSERT INTO threads (title, created_at) 
                    VALUES (:title, NOW()) 
                    RETURNING id
                """),
                thread_data
            )
            await conn.commit()
            return result.scalar()
    
    async def list_threads(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """List threads with pagination."""
        engine: AsyncEngine = self.get_engine()
        
        async with engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT * FROM threads 
                    ORDER BY created_at DESC 
                    LIMIT :limit OFFSET :offset
                """),
                {"limit": limit, "offset": offset}
            )
            return [dict(row) for row in result.fetchall()]