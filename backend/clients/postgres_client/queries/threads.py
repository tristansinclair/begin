##########
# ### Import Packages

# import packages for db
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

##########
# ### Modular Thread Methods for Postgres Client

class ThreadMethodsMixin:

    # _skip_pings is always True when AsyncEngine=None
    engine: AsyncEngine | None
    _skip_pings: bool

    # method to insert thread_id candidly_uuid pair into db
    async def insert_thread_id(self, candidly_uuid: str, thread_id: str) -> None:
        # skip for local tests
        if self._skip_pings:
            return

        # sql query to insert
        thread_id_insert_query = '''
            insert into public.conversations (thread_id, candidly_uuid)
            values (:thread_id, :candidly_uuid)
        '''.strip()

        # allow exceptions to surface to route
        try:
            # begin transaction to write thread_id candidly_uuid pair
            async with self.engine.begin() as conn:
                # passing in {...} prevents sql injection
                result = await conn.execute(
                    statement=text(thread_id_insert_query),
                    parameters={
                        'thread_id': thread_id,
                        'candidly_uuid': candidly_uuid
                    }
                )

                # should not occur, but raise if no row was inserted
                if result.rowcount != 1:
                    raise RuntimeError("thread insertion failed")

        except Exception as e:
            raise e

    # method to list all thread(s) for a candidly_uuid
    async def list_threads(self, candidly_uuid: str) -> list:
        # empty list for local tests
        if self._skip_pings:
            return []

        # sql query to retrieve all thread(s) for a given candidly_uuid
        threads_query = '''
            select thread_id,
                   date_trunc('second', created_at)::timestamptz(0) as created_at,
                   title
            from public.conversations
            where candidly_uuid = :candidly_uuid and
                  deleted_at is null
            order by created_at desc;
        '''.strip()

        # allow exceptions to surface to route
        try:
            # query for all thread(s) belonging to user
            async with self.engine.connect() as conn:
                # passing in {...} prevents sql injection
                result = await conn.execute(
                    statement=text(threads_query),
                    parameters={
                        'candidly_uuid': candidly_uuid
                    }
                )
                rows = result.mappings().all()

            return [dict(r) for r in rows]

        except Exception as e:
            raise e

    # method to confirm whether a thread_id belongs to a candidly_uuid
    async def confirm_thread_id(self, candidly_uuid: str, thread_id: str) -> bool:
        # default true for local tests
        if self._skip_pings:
            return True

        # sql query to check existence of thread_id candidly_uuid pair
        check_thread_id_query = '''
            select 1
            from public.conversations
            where candidly_uuid = :candidly_uuid and
                  thread_id = :thread_id and
                  deleted_at is null;
        '''

        # allow exceptions to surface to route
        try:
            # begin transaction to write thread_id candidly_uuid pair
            async with self.engine.begin() as conn:
                # passing in {...} prevents sql injection
                result = await conn.execute(
                    statement=text(check_thread_id_query),
                    parameters={
                        'thread_id': thread_id,
                        'candidly_uuid': candidly_uuid
                    }
                )

                # retrieve the first row and check
                row = result.first()
                thread_id_exists = row is not None

                return thread_id_exists

        except Exception as e:
            raise e

    # method to update title for a thread
    async def update_thread_title(self, title: str, candidly_uuid: str, thread_id: str) -> None:
        # basic return for local tests
        if self._skip_pings:
            return

        # sql query to update title for a thread
        # language=SQL
        update_thread_title_query = '''
            update public.conversations
                set title = :title,
                    updated_at = now()
            where candidly_uuid = :candidly_uuid and
                  thread_id = :thread_id and
                  deleted_at is null;
        '''

        # allow exceptions to surface to route
        try:
            # begin transaction to soft delete thread_id
            async with self.engine.begin() as conn:
                # passing in {...} prevents sql injection
                result = await conn.execute(
                    statement=text(update_thread_title_query),
                    parameters={
                        "title": title,
                        'thread_id': thread_id,
                        'candidly_uuid': candidly_uuid
                    }
                )

                # should not occur, but raise if no row was updated
                if result.rowcount < 1:
                    raise RuntimeError("thread title update failed")

                return

        except Exception as e:
            raise e

    # method to delete a thread_id
    async def delete_thread_id(self, candidly_uuid: str, thread_id: str) -> None:
        # basic return for local tests
        if self._skip_pings:
            return

        # sql query to delete thread_id
        # language=SQL
        delete_thread_id_query = '''
            update public.conversations
                set deleted_at = now(),
                    updated_at = now()
            where candidly_uuid = :candidly_uuid and
                  thread_id = :thread_id and
                  deleted_at is null;
        '''

        # allow exceptions to surface to route
        try:
            # begin transaction to soft delete thread_id
            async with self.engine.begin() as conn:
                # passing in {...} prevents sql injection
                result = await conn.execute(
                    statement=text(delete_thread_id_query),
                    parameters={
                        'thread_id': thread_id,
                        'candidly_uuid': candidly_uuid
                    }
                )

                # should not occur, but raise if no row was deleted
                if result.rowcount < 1:
                    raise RuntimeError("thread deletion failed")

                return

        except Exception as e:
            raise e
