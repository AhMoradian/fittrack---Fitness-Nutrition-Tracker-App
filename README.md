# FitTrack — Personal Fitness Tracker

FitTrack is a private, mobile-first workout, nutrition, recovery, and habit tracker for one user. It ships with a personalized home muscle-building plan, works locally without an account, and can optionally sync through Supabase.

## What works

- Real weekday-based workout selection (Monday is Plan Day 1)
- Daily workout, nutrition, recovery, and habit logging
- Set-by-set workout entries and nutrition notes
- Touch-friendly minus and plus controls on numeric fields
- Automatic completion percentages, XP, levels, and streaks
- Live 7-day and 30-day scores
- Workout, nutrition, and weight trend charts
- Body weight and measurement history
- Compressed progress photos
- Sunday check-ins for weight averages, adherence, recovery, strength, and skills
- Copyable coach summaries for updating the next training week in chat
- Versioned coach-plan upgrades that preserve history and custom tasks
- Weekly-plan task creation, editing, and deletion
- Editable personal profile, goals, and equipment
- JSON backup export and restore
- Cross-tab synchronization in the same browser
- Secure cross-device sync with email magic-link authentication

## Data storage

All active application data is stored in browser `localStorage` under `fittrack-single-user-v1`, so the tracker keeps working without a backend.

When Supabase is configured, choose **Profile → Enable sync** and sign in with the same email on each device. The app uploads one private snapshot to `fittrack_data`, updates it after each change, and listens for realtime updates. Row-level security limits that snapshot to its authenticated owner.

If cloud sync is not configured or is temporarily unavailable, local saving and JSON backup export/restore continue to work. A backup contains the profile, plan, daily logs, measurements, progress photos, and weekly check-ins.

## Daily scoring

- Tasks completed up to their target contribute up to 100%.
- Daily completion is the average completion of all scheduled tasks.
- A day at 70% or higher counts toward the streak.
- XP is awarded once per date when a task reaches 100%.
- Workout tasks follow their selected plan day.
- Nutrition, recovery, and habit tasks appear every day.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Verification commands:

```bash
npm run typecheck
npm run lint
npm run build
```

## Main structure

```text
app/                       Next.js screens
components/                Forms, cards, navigation, and charts
lib/fittrack-store.tsx     Local persistence, cloud sync, and mutations
lib/tracking.ts            Dates, scoring, streaks, XP, and achievements
lib/sample-data.ts         Versioned personal coach plan
supabase/                  Database schema and cloud-sync migration
```
