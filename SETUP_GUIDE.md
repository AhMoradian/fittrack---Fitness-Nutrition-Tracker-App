# FitTrack Setup Guide

## 🚀 Quick Start

### 1. **Configure Environment Variables**

Create a `.env.local` file in your project root with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hfzixcfyuqqnnvpqxtcu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_cAchU0-kjuVO4uZ8xjZpgA_Qu3CkdDJ
```

### 2. **Set Up Supabase Database Schema**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Create a new query and copy-paste the entire contents of:
   ```
   supabase/migrations/202605300001_initial_ai_ready_schema.sql
   ```
4. Click **Run** to execute the schema
5. Wait for confirmation that all tables and policies were created

### 3. **Enable Realtime Features in Supabase**

1. Go to **Replication** in your Supabase project
2. Enable replication for these tables:
   - `daily_logs`
   - `body_metrics`
   - `user_stats`
   - `achievements`
   - `unlocked_achievements`

3. In **Realtime**, toggle **ON** for:
   - Postgres changes (INSERT, UPDATE, DELETE)
   - Broadcast (for cross-device sync)

### 4. **Install Dependencies**

```bash
npm install
# or
yarn install
```

### 5. **Run Development Server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features Now Enabled

### ✅ **Real-Time Data Sync**
- Weight changes sync across all your devices instantly
- Task completions update live
- Streaks and XP update in real-time
- Achievements unlock with notifications

### ✅ **Weight Tracking**
- Log daily weight and body metrics
- View weight trend chart
- Track body fat %, waist, chest, arm measurements
- Real-time weight history

### ✅ **Data Persistence**
- All data saved to Supabase PostgreSQL
- Secure row-level security (RLS) for privacy
- Automatic backups

### ✅ **Offline Support**
- Falls back to sample data if Supabase unavailable
- Works on slower connections

---

## 📱 Main Screens

### **1. Today** (Home)
- Daily completion percentage
- Current and best streaks
- Daily score and XP earned
- Task sections: Workout, Nutrition, Recovery, Habits
- Real-time task logging with increment buttons

### **2. Weekly Plan**
- View all tasks for each day
- Edit tasks and programs
- Organize by day of week

### **3. Progress**
- Weight trend chart (live updates)
- Completion trends
- Workout & nutrition adherence
- Streaks and XP progress
- Achievement history

### **4. Profile** ✨ **NEW**
- Personal info: age, height, weight, goal
- **Weight tracker form** - log new measurements
- **Live weight chart** - trending data with real-time updates
- Equipment list
- Weekly goals

---

## 🔧 Server Actions Available

### Daily Logs (Task Completion)
```typescript
import { logTaskCompletion, getDailyLogsForDate } from '@/lib/actions/daily-logs';

// Save task completion
await logTaskCompletion(taskId, date, completedValue, completionPercentage);

// Get all logs for a date
const logs = await getDailyLogsForDate('2026-05-30');
```

### Body Metrics (Weight Tracking)
```typescript
import { 
  recordBodyMetric, 
  getBodyMetrics, 
  getLatestBodyMetric 
} from '@/lib/actions/body-metrics';

// Save weight and measurements
await recordBodyMetric(date, weight, bodyFat, waist, chest, arm);

// Get metrics (with optional date range)
const allMetrics = await getBodyMetrics();
const recent = await getBodyMetrics('2026-05-20', '2026-05-30', 30);

// Get latest entry
const latest = await getLatestBodyMetric();
```

---

## 🎯 Real-Time Hooks

Use these in your client components:

```typescript
import { 
  useDailyLogsRealtime,
  useBodyMetricsRealtime,
  useUserStatsRealtime,
  useAchievementsRealtime,
  usePresenceChannel
} from '@/lib/supabase/realtime';

// Subscribe to weight updates
const { isConnected } = useBodyMetricsRealtime(() => {
  // Refresh data when weight changes
  console.log('Weight updated!');
});

// See online users
const { usersOnline } = usePresenceChannel(userId);
```

---

## 🔐 Security

- **Row-Level Security (RLS)**: Users can only access their own data
- **Authentication**: Supabase Auth manages user sessions
- **Environment Variables**: Keep keys in `.env.local` (never commit!)

---

## 📊 Database Schema

### Main Tables
- `tasks` - Workout, nutrition, recovery, habit tasks
- `daily_logs` - Task completion records
- `body_metrics` - Weight and measurements
- `user_stats` - Streaks, XP, levels
- `weekly_programs` - Program definitions
- `achievements` - Achievement definitions
- `unlocked_achievements` - User achievements

All tables have:
- ✅ Row-level security (RLS) policies
- ✅ Unique indexes for performance
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ User isolation

---

## 🚨 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` has correct URL and publishable key
- Restart dev server after adding env vars

### Real-time updates not working
- Verify Replication is **enabled** in Supabase
- Check browser console for connection errors
- Ensure you're authenticated

### Data not saving
- Check Network tab in browser dev tools
- Verify RLS policies are enabled
- Check Supabase logs for errors

### Weight tracker form not working
- Ensure user is authenticated
- Check browser console for errors
- Verify body_metrics table has RLS enabled

---

## 🎉 Next Steps

1. **Set up authentication** (Supabase Auth UI)
2. **Create welcome onboarding** for new users
3. **Add progress photos** to timeline
4. **Implement AI coaching** based on data
5. **Add social features** (leaderboards, challenges)
6. **Mobile app version** (React Native)

---

## 📞 Support

For issues:
1. Check Supabase dashboard logs
2. Review browser console errors
3. Verify all environment variables
4. Check database connection in Supabase SQL editor

Happy tracking! 💪  🎯 🚀
