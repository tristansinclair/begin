##########
# ### Import Packages

# import packages for db
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

##########
# ### Modular ServiceConsent Methods for Postgres Client

class ServiceConsentMethodsMixin:

    # _skip_pings is always True when AsyncEngine=None
    engine: AsyncEngine | None
    _skip_pings: bool

    # method to upsert service consent rows
    async def upsert_service_consents(self, candidly_uuid: str, services: list) -> None:
        # skip for local tests
        if self._skip_pings:
            return

        # sql query to batch insert service consents
        service_consent_insert_query = '''
            insert into public.user_service_consents
                (candidly_uuid, service_id)
            select :candidly_uuid as candidly_uuid,
                   s.id as service_id
            from unnest(cast(:services as text[])) as svc(name)
                 join public.consent_services s
                      on svc.name = s.name
            on conflict (candidly_uuid, service_id)
            do update
                set updated_at = now(),
                    deleted_at = null;
        '''

        # allow exceptions to surface to route
        try:
            # begin transaction
            async with self.engine.begin() as conn:
                # passing in {...} prevents sql injection
                result = await conn.execute(
                    statement=text(service_consent_insert_query),
                    parameters={
                        'candidly_uuid': candidly_uuid,
                        'services': services
                    }
                )

                # should not occur, but raise if no row was inserted
                if result.rowcount < 1:
                    raise RuntimeError("service consent insertion failed")

        except Exception as e:
            raise e

    # method to list all service consents for a candidly_uuid
    async def list_service_consents(self, candidly_uuid: str) -> list:
        # skip for local tests
        if self._skip_pings:
            return []

        # sql query to list all service consents for a candidly_uuid
        service_consent_query = '''
            select date_trunc('second', u.created_at)::timestamptz(0) as created_at,
                   date_trunc('second', u.updated_at)::timestamptz(0) as updated_at,
                   s.name as service
            from public.user_service_consents u
            left join public.consent_services s
                      on u.service_id = s.id
            where u.candidly_uuid = :candidly_uuid and
                  u.deleted_at is null
            order by u.created_at desc;
        '''.strip()

        # allow exceptions to surface to route
        try:
            async with self.engine.connect() as conn:
                # passing in {...} prevents sql injection
                result = await conn.execute(
                    statement=text(service_consent_query),
                    parameters={
                        'candidly_uuid': candidly_uuid
                    }
                )
                rows = result.mappings().all()

            return [dict(r) for r in rows]

        except Exception as e:
            raise e
