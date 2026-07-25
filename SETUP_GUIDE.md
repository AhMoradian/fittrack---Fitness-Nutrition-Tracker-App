# FitTrack Setup Guide

FitTrack currently runs as a single-user, local-first application. No login, Supabase project, or environment variables are needed.

## Start the app

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## First use

1. Open **Profile** and confirm your personal goal, height, and equipment.
2. Open **Weekly Plan** and adjust the starter program if needed.
3. Use **Today** to record each task.
4. Add weight and measurements under **Progress**.
5. Export a JSON backup from **Profile** regularly.

## Where the data lives

Records are saved in the current browser's local storage. They remain after refreshes and browser restarts, but they are specific to that browser and device.

To move to another browser or protect against accidental clearing:

1. Choose **Profile → Export backup**.
2. Keep the downloaded JSON file somewhere safe.
3. Choose **Profile → Restore backup** on the destination browser.

## Production build

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

The repository still contains a Supabase schema from the earlier multi-user architecture. It is not used by the current app.
