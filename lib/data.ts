import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { dailyLogs as sampleDailyLogs, getDailySummary, tasks as sampleTasks } from '@/lib/sample-data';
import type { DailyLog, Task, UserStats } from '@/lib/types';
import { levelFromXp } from '@/lib/utils';

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function buildSummary(tasks: Task[], dailyLogs: DailyLog[]) {
  const relevantTasks = tasks.filter((task) => task.day_index === 1 || task.category === 'nutrition' || task.category === 'recovery');
  const completion = dailyLogs.length ? Math.round(dailyLogs.reduce((sum, log) => sum + log.completion_percentage, 0) / dailyLogs.length) : 0;
  const earnedXp = relevantTasks.reduce((sum, task) => {
    const log = dailyLogs.find((entry) => entry.task_id === task.id);
    return sum + ((log?.completion_percentage ?? 0) >= 100 ? task.xp_reward : 0);
  }, 0);
  const totalXp = earnedXp;
  const stats: UserStats = { current_streak: completion >= 70 ? 1 : 0, best_streak: completion >= 70 ? 1 : 0, total_xp: totalXp, current_level: levelFromXp(totalXp) };
  return {
    date: new Date().toISOString().slice(0, 10),
    dailyCompletion: completion,
    dailyScore: Math.round(completion * 0.75 + earnedXp * 0.25),
    earnedXp,
    stats,
    successfulDay: completion >= 70,
  };
}

function normalizeTask(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    program_id: String(row.program_id ?? 'supabase-program'),
    title: String(row.title),
    category: row.category as Task['category'],
    target_value: Number(row.target_value),
    target_unit: String(row.target_unit),
    xp_reward: Number(row.xp_reward ?? 0),
    sort_order: Number(row.sort_order ?? 0),
    day_index: Number(row.day_index ?? 1),
    created_at: String(row.created_at),
    description: typeof row.description === 'string' ? row.description : undefined,
    guidance: Array.isArray(row.guidance) ? row.guidance.map(String) : undefined,
    meal_time: typeof row.meal_time === 'string' ? row.meal_time : undefined,
    set_targets: Array.isArray(row.set_targets) ? (row.set_targets as Task['set_targets']) : undefined,
    ai_configurable: Boolean(row.ai_configurable ?? true),
  };
}

function normalizeLog(row: Record<string, unknown>): DailyLog {
  return {
    id: String(row.id),
    task_id: String(row.task_id),
    date: String(row.date),
    completed_value: Number(row.completed_value ?? 0),
    completion_percentage: Number(row.completion_percentage ?? 0),
    notes: typeof row.notes === 'string' ? row.notes : undefined,
    set_values: Array.isArray(row.set_values) ? row.set_values.map(Number) : undefined,
    created_at: String(row.created_at),
  };
}

export async function getProgramData() {
  noStore();

  if (!hasSupabaseEnv()) {
    return { tasks: sampleTasks, dailyLogs: sampleDailyLogs, summary: getDailySummary(), source: 'sample' as const };
  }

  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { tasks: sampleTasks, dailyLogs: sampleDailyLogs, summary: getDailySummary(), source: 'sample' as const };
    }

    const today = new Date().toISOString().slice(0, 10);
    const [{ data: taskRows, error: taskError }, { data: logRows, error: logError }] = await Promise.all([
      supabase.from('tasks').select('*').order('day_index', { ascending: true }).order('sort_order', { ascending: true }),
      supabase.from('daily_logs').select('*').eq('date', today),
    ]);

    if (taskError || logError || !taskRows?.length) {
      return { tasks: sampleTasks, dailyLogs: sampleDailyLogs, summary: getDailySummary(), source: 'sample' as const };
    }

    const liveTasks = taskRows.map((row) => normalizeTask(row));
    const liveDailyLogs = (logRows ?? []).map((row) => normalizeLog(row));

    return {
      tasks: liveTasks,
      dailyLogs: liveDailyLogs,
      summary: buildSummary(liveTasks, liveDailyLogs),
      source: 'supabase' as const,
    };
  } catch {
    return { tasks: sampleTasks, dailyLogs: sampleDailyLogs, summary: getDailySummary(), source: 'sample' as const };
  }
}
