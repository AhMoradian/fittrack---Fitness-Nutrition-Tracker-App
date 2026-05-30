# FitTrack — AI-Ready Fitness & Nutrition Tracker

FitTrack is a mobile-first personal fitness, nutrition, recovery, and habit tracker designed for long-term daily use. The product intentionally feels closer to Duolingo, Habitica, Apple Fitness, and modern habit apps than to a corporate dashboard.

## Architectural Decisions

### 1. Unified Task Tracking Model

The critical product decision is that every trackable behavior is a **Task**:

- Workout: push ups, pull ups, plank
- Nutrition: eggs, milk, protein intake
- Recovery: sleep, stretching
- Supplements: creatine
- Future behaviors: water intake, reading, language learning

The application does **not** create separate workout log or meal log systems. All completion data lands in `daily_logs`, making future AI coaching and analytics straightforward because one table describes adherence across every category.

### 2. Supabase-First Backend

The database schema is built for Supabase PostgreSQL with Auth row-level security. The initial migration includes:

- `goals`
- `weekly_programs`
- `tasks`
- `daily_logs`
- `body_metrics`
- `progress_photos`
- `user_stats`
- `streak_history`
- `achievements`
- `unlocked_achievements`

The schema keeps achievement definitions flexible in the database instead of hardcoding them in application logic.

### 3. Gamification From Day One

The UI and schema support:

- Successful-day threshold: daily completion >= 70%
- Current streak and best streak
- Streak history
- XP reward per task
- Level formula: `floor(total_xp / 100)`
- Database-defined achievements

### 4. AI-Ready Data Layer

AI is intentionally not implemented yet. However, the data model stores enough structured information for future coaching to analyze:

- Daily adherence
- Weekly adherence
- Workout performance
- Nutrition consistency
- Recovery and sleep consistency
- Weight and body measurement trends
- Progress photo timelines
- Streak and XP progression

Future AI features can generate workout plans, progressive overload changes, nutrition recommendations, recovery advice, and habit suggestions without redesigning the schema.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible primitives
- Supabase Auth, Database, and Storage
- Recharts
- Vercel deployment

## Project Structure

```text
app/                    Next.js App Router screens
components/             Shared UI, navigation, charts, task cards
components/ui/          shadcn/ui-style primitives
lib/                    Types, sample data, utilities, server actions, Supabase clients
supabase/migrations/    PostgreSQL schema and RLS policies
supabase/seed.sql       Seed starter notes
```

## Main Screens

Bottom navigation includes:

1. Today
2. Weekly Plan
3. Progress
4. Profile

### Today

Primary daily-use screen showing:

- Current streak
- Best streak
- Daily completion percentage
- XP progress
- Daily score
- Workout, nutrition, recovery, and habit task sections
- Instant progress calculation per task

### Weekly Plan

Editable weekly program view with day-based grouping, sort-order affordances, and a unified task editor.

### Progress

Trend and motivation screen with:

- Weight trend
- Completion trend
- Workout adherence
- Nutrition adherence
- Weekly/monthly score
- Current/best streak
- XP progress
- Achievement history
- Progress photos timeline
- Body measurements

### Profile

Personal setup, equipment, settings, and AI-ready export entry point.

## Local Development

```bash
npm install
npm run dev
```

Optional Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The UI can be viewed with sample data before connecting Supabase. Server actions currently document the write path and revalidation points; connecting them to Supabase RPCs is the next implementation step.

## Database Setup

Apply the migration in `supabase/migrations/202605300001_initial_ai_ready_schema.sql` to a Supabase project. It creates the AI-ready unified schema, row-level security policies, indexes, completion calculation trigger, level helper, and starter achievement definitions.

## Deployment

Deploy to Vercel and configure the Supabase environment variables in the Vercel project settings. Supabase Storage should be used for `progress_photos.image_url` assets.
