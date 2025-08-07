# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Next.js)
**CRITICAL: Always use pnpm for all package operations, NOT npm or yarn**
**NEVER run servers - all servers are already running**

```bash
cd frontend
pnpm add <package>     # Add new dependencies
pnpm add -D <package>  # Add dev dependencies
pnpm remove <package>  # Remove dependencies

# DO NOT RUN THESE - servers already running:
# pnpm dev, pnpm build, pnpm start, pnpm lint, pnpm storybook
```

### Backend (Python/FastAPI)
**NEVER run servers - all servers are already running**

```bash
cd backend
uv add <package>  # Add new dependencies

# DO NOT RUN THESE - servers already running:
# uv run server.py, uv run demo.py
```

### Infrastructure
**NEVER run infrastructure - all services are already running**

```bash
# DO NOT RUN THESE - services already running:
# docker compose up -d
```

## Architecture

This is a full-stack fitness tracking application called "BEGIN" with:

### Frontend
- **Framework**: Next.js 15.4.4 with App Router and Turbopack
- **UI**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS 4
- **State**: Zustand with persist middleware
- **Database**: Prisma ORM with PostgreSQL
- **Auth**: Supabase SSR
- **Charts**: Recharts for data visualization

### Backend  
- **Framework**: FastAPI with async PostgreSQL
- **AI/Chat**: LangGraph with OpenAI GPT-4o-mini
- **Database**: PostgreSQL with AsyncPG and SQLAlchemy
- **Tracing**: LangSmith integration
- **Checkpointing**: LangGraph checkpoint persistence

### Database Architecture
- **Primary DB**: PostgreSQL (port 5432) for application data
- **Phoenix DB**: PostgreSQL (port 5433) for observability
- **Prisma**: Schema management in `frontend/prisma/schema.prisma`
- **Backend**: Direct SQL queries in `backend/clients/postgres_client/`

## Key Directory Structure

```
├── frontend/           # Next.js application
│   ├── src/app/       # App Router pages (dashboard, plan, profile, etc.)
│   ├── src/components/# React components (ui/, features/, common/)
│   ├── src/types/     # TypeScript type definitions
│   └── prisma/        # Database schema
├── backend/           # FastAPI application  
│   ├── core/          # Chat agent, tools, prompts
│   ├── clients/       # Database clients and queries
│   └── server.py      # FastAPI entry point
└── infra/            # Docker Compose services
```

## Development Patterns

### Frontend
1. **File Imports**: Use `@/*` alias for src imports (e.g., `@/components/ui/button`)
2. **State Management**: Zustand stores with persist middleware in `src/store/`
3. **Components**: Server/Client component separation following Next.js App Router
4. **Styling**: Tailwind CSS with shadcn/ui design system
5. **Mock Data**: Located in `src/data/mock/` for development

### Backend
1. **Chat Agent**: ReActChatAgent using LangGraph with tool calling
2. **Database**: Async patterns with connection pooling
3. **API Structure**: FastAPI with automatic OpenAPI documentation
4. **Error Handling**: Database connection lifecycle managed in app startup
5. **Tools**: Custom tools defined in `core/tools.py`

### Database Operations
- **Frontend**: Use Prisma Client for type-safe database operations
- **Backend**: Direct SQL queries via AsyncPostgresClient
- **Migrations**: Prisma migrations in frontend, manual setup in backend

## Important Notes

- **CRITICAL**: ALL SERVERS ARE ALREADY RUNNING - never execute `pnpm dev`, `pnpm start`, `uv run`, `docker compose up`, or any server startup commands
- **Package Management**: Always use `pnpm add/remove` for frontend dependencies, `uv add` for backend
- Frontend has existing CLAUDE.md with additional frontend-specific guidance
- Backend uses LangGraph for conversational AI with checkpointing
- Phoenix service (port 6006) provides AI observability and tracing
- Both frontend and backend connect to the same PostgreSQL instance
- Environment variables required for database connections and OpenAI API