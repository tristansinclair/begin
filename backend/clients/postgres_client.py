import os
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer
from psycopg import AsyncConnection
from psycopg.rows import DictRow, dict_row
from psycopg_pool import AsyncConnectionPool
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
import logging

logger = logging.getLogger(__name__)


class AsyncPostgresClient:
    def __init__(self):
        user = os.getenv("POSTGRES_USERNAME")
        password = os.getenv("POSTGRES_PASS")
        host = os.getenv("POSTGRES_HOST")
        port = os.getenv("POSTGRES_PORT", "5432")
        database = os.getenv("POSTGRES_DB")

        self._skip_pings = os.getenv("POSTGRES_HOST") in (None, "localhost", '')

        if self._skip_pings:
            logger.info("running with postgres client in local mode, skipping pings")
            self.psycopg_pool = None
            self.checkpointer = MemorySaver()
            self.engine = None
            return

        alchemy_connection_string = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{database}"

        self.engine = create_async_engine(
            url=alchemy_connection_string,
            pool_size=5,
            max_overflow=10,
            pool_timeout=30,
            pool_recycle=1800,
            pool_pre_ping=True,
        )

        logger.info("initialized sqlalchemy database engine")

        psycopg_connection_string = f"postgresql://{user}:{password}@{host}:{port}/{database}"

        self.psycopg_pool: AsyncConnectionPool[AsyncConnection[DictRow]] = AsyncConnectionPool(
            conninfo=psycopg_connection_string,
            min_size=5,
            max_size=15,
            timeout=30,
            open=False,
            check=AsyncConnectionPool.check_connection,
            kwargs={
                "autocommit": True,
                "prepare_threshold": None,
                "row_factory": dict_row,
            },
        )

        self.checkpointer = AsyncPostgresSaver(
            conn=self.psycopg_pool,
            serde=JsonPlusSerializer(),
        )

        logger.info("initialized psycopg database connection pool")

    def get_engine(self) -> AsyncEngine:
        return self.engine

    def get_checkpointer(self) -> AsyncPostgresSaver | MemorySaver:
        return self.checkpointer

    async def dispose_engine(self) -> None:
        logger.info("closing sqlalchemy database engine...")

        try:
            if self.engine is not None:
                await self.engine.dispose()

        except Exception:
            logger.exception("error closing sqlalchemy database engine")
            raise

        else:
            self.engine = None
            logger.info("closed sqlalchemy database engine")

    async def dispose_checkpointer_pool(self) -> None:
        logger.info("closing psycopg connection pool...")

        try:
            if self.psycopg_pool is not None:
                await self.psycopg_pool.close()
        except Exception:
            logger.exception("error closing psycopg connection pool")
            raise

        else:
            self.psycopg_pool = None
            logger.info("closed psycopg connection pool")

    async def ping_engine(self) -> None:
        if self._skip_pings:
            return

        try:
            async with self.engine.connect() as conn:
                result = await conn.execute(text("select 1;"))
                value = result.scalar()
                logger.info(f"database ping successful, value: {value}")

        except Exception as e:
            logger.exception("database engine ping failed")
            raise e

    async def open_checkpointer_pool(self) -> None:
        if self._skip_pings:
            return

        try:
            await self.psycopg_pool.open()
            logger.info("checkpointer pool connection opened")

        except Exception as e:
            logger.exception("checkpointer pool connection failed")
            raise e

    async def ping_checkpointer_pool(self) -> None:
        if self._skip_pings:
            return

        try:
            async with self.psycopg_pool.connection() as conn:
                result = await conn.execute("select 1 as ping;")
                row = await result.fetchone()
                value = row["ping"]
                logger.info(f"checkpointer pool ping successful, value: {value}")

        except Exception as e:
            logger.exception("checkpointer pool ping failed")
            raise e