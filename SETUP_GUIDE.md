# FitTrack Setup Guide

FitTrack is local-first. No account is required for one-device use; Supabase enables private sync between a phone and computer.

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

Records are always saved in the current browser's local storage. They remain after refreshes and browser restarts.

## Enable cross-device sync

1. Create a Supabase project.
2. Run `supabase/migrations/202608070001_fittrack_cloud_sync.sql` in the Supabase SQL editor. If this is a new project and you want the legacy relational tables too, run the initial migration first.
3. Copy `.env.example` to `.env.local` and add the project URL and anonymous key.
4. In **Supabase → Authentication → URL Configuration**, add the deployed site URL and `http://localhost:3000/auth/callback` while developing.
5. Restart FitTrack, open **Profile → Enable sync**, and request a magic link.
6. Sign in with the same email on the phone and computer.

The first signed-in device uploads its existing local progress. Later devices load that cloud copy and receive realtime changes. Row-level security ensures each account can access only its own snapshot.

When the project-scoped coaching automation is connected, it reads the synced seven-day records and Sunday check-in, publishes the next versioned plan, verifies it, and reports the coaching analysis in the linked thread. **Check-in → Copy backup summary** remains available as a fallback.

## Manual backup

To move data without cloud sync or keep an extra backup:

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
