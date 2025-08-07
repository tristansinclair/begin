# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**CRITICAL: Always use pnpm for all package operations, NOT npm or yarn**
**NEVER run servers - all servers are already running**

```bash
pnpm add <package>     # Add new dependencies
pnpm add -D <package>  # Add dev dependencies  
pnpm remove <package>  # Remove dependencies

# DO NOT RUN THESE - servers already running:
# pnpm dev, pnpm build, pnpm start, pnpm lint, pnpm storybook
```

## Architecture

This is a Next.js 15 fitness tracking application called "BEGIN" using:
- **Framework**: Next.js 15.4.4 with App Router and Turbopack
- **UI**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **State**: Zustand stores with persist middleware
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Directory Structure

**`/src/app/`** - Next.js App Router pages:
- `/(protected)/` - Protected routes requiring auth
- `/plan/` - Workout plan management and creation
- `/profile/` - User profile and stats  
- `/sessions/` - Individual workout sessions
- `/today/` - Today's workout view
- `/auth/` - Authentication pages
- `/login/` - Login page

**`/src/components/`** - React components:
- `ui/` - shadcn/ui base components (button, card, input, etc.)
- `features/dashboard/` - Dashboard and stats components
- `features/user/` - User profile components  
- `features/workout/` - Workout tracking components
- `workout/` - Session cards and workout components
- `common/` - Shared components (AppSidebar, Breadcrumbs, etc.)

**Other key directories:**
- `/src/types/` - TypeScript definitions (workouts, exercises, etc.)
- `/src/data/mock/` - Mock data for development
- `/src/examples/` - Sample workout plans and sessions
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions and configurations
- `/src/utils/` - Helper functions and Supabase client

### Key Patterns

1. **Authentication**: Supabase SSR with protected routes in `(protected)` folder

2. **Database**: Prisma ORM with PostgreSQL, schema in `/prisma/schema.prisma`

3. **Component Structure**: Functional components with TypeScript, Server/Client separation

4. **Styling**: Tailwind CSS 4 with shadcn/ui design system and CSS custom properties

5. **File Imports**: Use `@/*` alias for src imports (e.g., `@/components/ui/button`)

6. **Mock Data**: Use files in `/src/data/mock/` and `/src/examples/` for development

7. **Storybook**: Component stories available for UI components

## Important Notes

- **CRITICAL**: ALL SERVERS ARE ALREADY RUNNING - never run `pnpm dev`, `pnpm start`, etc.
- **Package Management**: Always use `pnpm add/remove` for dependencies
- Components follow shadcn/ui patterns with Radix UI primitives
- Prisma client available for database operations
- Supabase handles authentication and some data operations