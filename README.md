# FitTrack — Personal Fitness Tracker

FitTrack is a private, mobile-first workout, nutrition, recovery, and habit tracker for one user. It ships with a personalized home muscle-building plan and stores all records in the browser, so no account or backend setup is required.

## What works

- Real weekday-based workout selection (Monday is Plan Day 1)
- Daily workout, nutrition, recovery, and habit logging
- Set-by-set workout entries and nutrition notes
- Automatic completion percentages, XP, levels, and streaks
- Live 7-day and 30-day scores
- Workout, nutrition, and weight trend charts
- Body weight and measurement history
- Compressed progress photos stored on the device
- Weekly-plan task creation, editing, and deletion
- Editable personal profile, goals, and equipment
- JSON backup export and restore
- Cross-tab synchronization in the same browser

## Data storage

All active application data is stored in browser `localStorage` under `fittrack-single-user-v1`.

This makes the app simple and private, but clearing browser/site data will remove the records. Use **Profile → Export backup** regularly. A backup contains the profile, plan, daily logs, measurements, and progress photos.

Data does not automatically synchronize between different browsers or devices. The old Supabase schema remains in the repository for a possible future migration, but it is not required by the current single-user app.

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
lib/fittrack-store.tsx     Browser persistence and mutations
lib/tracking.ts            Dates, scoring, streaks, XP, and achievements
lib/sample-data.ts         Personalized starter plan
supabase/                  Legacy/future multi-device backend schema
```
