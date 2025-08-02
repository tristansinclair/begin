# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm storybook    # Start Storybook on port 6006
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
- `/dashboard` - Main dashboard view
- `/plan/create` - Workout plan creation
- `/profile` - User profile management
- `/settings` - Application settings
- `/stats` - Analytics and progress tracking
- `/today` - Today's workout view

**`/src/components/`** - React components:
- `ui/` - shadcn/ui base components
- `dashboard/` - Dashboard-specific components
- `plan/` - Plan creation and chat interface
- `workout/` - Workout tracking components
- `AppSidebar.tsx` - Main navigation

**`/src/store/`** - Zustand state management:
- `workoutStore.ts` - Workout data and operations
- `dashboardStore.ts` - Dashboard state
- `planStore.ts` - Workout plans
- Each store exports hooks for component consumption

**`/src/data/`** - Static data and mock data files

### Key Patterns

1. **State Management**: Zustand stores are feature-scoped with persist middleware for local storage persistence. Access via hooks exported from store files.

2. **Component Structure**: Functional components with TypeScript. Server/Client component separation following Next.js App Router patterns.

3. **Styling**: Tailwind CSS with shadcn/ui theming. Design tokens via CSS custom properties support dark mode.

4. **File Imports**: Use `@/*` alias for src imports (e.g., `@/components/ui/button`).

5. **No Testing Framework**: Currently no test setup. Consider Jest or Vitest if tests are needed.