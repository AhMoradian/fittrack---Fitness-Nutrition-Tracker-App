import { createClient } from '@/lib/supabase/server';
import { getDailySummary, tasks, dailyLogs, bodyMetrics } from '@/lib/sample-data';
import type { Task, DailyLog, UserStats, BodyMetric } from '@/lib/types';

export async function getProgramData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If no user, return sample data
  if (!user) {
    return {
      tasks,
      dailyLogs,
      summary: getDailySummary(),
      bodyMetrics,
      source: 'sample' as const,
    };
  }

  try {
    // Fetch tasks for the user's active program
    const { data: userTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });

    if (tasksError) throw tasksError;

    // Fetch today's daily logs
    const today = new Date().toISOString().split('T')[0];
    const { data: userDailyLogs, error: logsError } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today);

    if (logsError) throw logsError;

    // Fetch user stats
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError && statsError.code !== 'PGRST116') throw statsError;

    // Fetch body metrics
    const { data: userBodyMetrics, error: metricsError } = await supabase
      .from('body_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30);

    if (metricsError) throw metricsError;

    // Calculate daily summary
    const todayTasks = (userTasks as Task[]).filter(
      (task) => task.day_index === 1 || task.category === 'nutrition' || task.category === 'recovery'
    );

    const completion = todayTasks.length > 0
      ? Math.round(
        (userDailyLogs as DailyLog[]).reduce((sum, log) => sum + (log.completion_percentage || 0), 0) /
          todayTasks.length
      )
      : 0;

    const earnedXp = todayTasks.reduce((sum, task) => {
      const log = (userDailyLogs as DailyLog[]).find((entry) => entry.task_id === task.id);
      return sum + ((log?.completion_percentage ?? 0) >= 100 ? task.xp_reward : 0);
    }, 0);

    const totalXp = (userStats?.total_xp || 0) + earnedXp;
    const stats: UserStats = {
      current_streak: userStats?.current_streak || 0,
      best_streak: userStats?.best_streak || 0,
      total_xp: totalXp,
      current_level: Math.floor(totalXp / 100),
    };

    return {
      tasks: userTasks as Task[],
      dailyLogs: userDailyLogs as DailyLog[],
      bodyMetrics: userBodyMetrics as BodyMetric[],
      summary: {
        date: today,
        dailyCompletion: completion,
        dailyScore: Math.round(completion * 0.75 + earnedXp * 0.25),
        earnedXp,
        stats,
        successfulDay: completion >= 70,
      },
      source: 'supabase' as const,
    };
  } catch (error) {
    console.error('Error fetching Supabase data:', error);
    // Fallback to sample data on error
    return {
      tasks,
      dailyLogs,
      summary: getDailySummary(),
      bodyMetrics,
      source: 'sample' as const,
    };
  }
}

export async function getUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data || null;
}