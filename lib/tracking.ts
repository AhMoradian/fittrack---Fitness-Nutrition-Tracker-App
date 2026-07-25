import type {
  Achievement,
  BodyMetric,
  DailyLog,
  DailySummary,
  Task,
  TaskCategory,
  UserStats,
} from '@/lib/types';
import { levelFromXp, percentage } from '@/lib/utils';

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function planDayForDate(value: string) {
  const jsDay = parseLocalDate(value).getDay();
  return ((jsDay + 6) % 7) + 1;
}

export function addDays(value: string, amount: number) {
  const date = parseLocalDate(value);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}

export function tasksForDate(tasks: Task[], date: string) {
  const planDay = planDayForDate(date);
  return tasks.filter(
    (task) =>
      task.category === 'nutrition' ||
      task.category === 'recovery' ||
      task.category === 'habit' ||
      task.day_index === planDay,
  );
}

function categoryCompletion(
  category: TaskCategory,
  tasks: Task[],
  logs: DailyLog[],
) {
  const categoryTasks = tasks.filter((task) => task.category === category);
  if (!categoryTasks.length) return 0;
  return Math.round(
    categoryTasks.reduce((sum, task) => {
      const log = logs.find((entry) => entry.task_id === task.id);
      return sum + (log ? percentage(log.completed_value, task.target_value) : 0);
    }, 0) / categoryTasks.length,
  );
}

export function getDailySummary(
  allTasks: Task[],
  allLogs: DailyLog[],
  date: string,
): DailySummary {
  const tasks = tasksForDate(allTasks, date);
  const logs = allLogs.filter((log) => log.date === date);
  const completion = tasks.length
    ? Math.round(
        tasks.reduce((sum, task) => {
          const log = logs.find((entry) => entry.task_id === task.id);
          return sum + (log ? percentage(log.completed_value, task.target_value) : 0);
        }, 0) / tasks.length,
      )
    : 0;
  const earnedXp = tasks.reduce((sum, task) => {
    const log = logs.find((entry) => entry.task_id === task.id);
    const completion = log
      ? percentage(log.completed_value, task.target_value)
      : 0;
    return sum + (completion >= 100 ? task.xp_reward : 0);
  }, 0);

  return {
    date,
    completion,
    workout: categoryCompletion('workout', tasks, logs),
    nutrition: categoryCompletion('nutrition', tasks, logs),
    recovery: categoryCompletion('recovery', tasks, logs),
    habit: categoryCompletion('habit', tasks, logs),
    earned_xp: earnedXp,
    successful: completion >= 70,
  };
}

export function getDateRange(start: string, end: string) {
  const dates: string[] = [];
  for (let date = start; date <= end; date = addDays(date, 1)) dates.push(date);
  return dates;
}

export function getTrackingSummaries(
  tasks: Task[],
  logs: DailyLog[],
  startedAt: string,
  end = localDateKey(),
) {
  const safeStart = startedAt > end ? end : startedAt;
  return getDateRange(safeStart, end).map((date) =>
    getDailySummary(tasks, logs, date),
  );
}

export function getUserStats(
  tasks: Task[],
  logs: DailyLog[],
  startedAt: string,
  today = localDateKey(),
): UserStats {
  const summaries = getTrackingSummaries(tasks, logs, startedAt, today);
  const totalXp = summaries.reduce((sum, day) => sum + day.earned_xp, 0);
  let bestStreak = 0;
  let running = 0;

  summaries.forEach((day) => {
    running = day.successful ? running + 1 : 0;
    bestStreak = Math.max(bestStreak, running);
  });

  let currentStreak = 0;
  let cursor = summaries.length - 1;
  if (cursor >= 0 && !summaries[cursor].successful) cursor -= 1;
  while (cursor >= 0 && summaries[cursor].successful) {
    currentStreak += 1;
    cursor -= 1;
  }

  return {
    current_streak: currentStreak,
    best_streak: bestStreak,
    total_xp: totalXp,
    current_level: levelFromXp(totalXp),
  };
}

export function averageScore(summaries: DailySummary[]) {
  if (!summaries.length) return 0;
  return Math.round(
    summaries.reduce((sum, day) => sum + day.completion, 0) /
      summaries.length,
  );
}

export function getPeriodSummaries(
  summaries: DailySummary[],
  days: number,
) {
  return summaries.slice(Math.max(0, summaries.length - days));
}

export function createDailyLog(
  task: Task,
  date: string,
  completedValue: number,
  setValues: number[],
  notes: string,
  existing?: DailyLog,
): DailyLog {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    task_id: task.id,
    date,
    completed_value: completedValue,
    completion_percentage: percentage(completedValue, task.target_value),
    set_values: setValues.length ? setValues : undefined,
    notes: notes.trim() || undefined,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
}

export function latestMetric(metrics: BodyMetric[]) {
  return [...metrics].sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function getAchievements(
  tasks: Task[],
  logs: DailyLog[],
  metrics: BodyMetric[],
  startedAt: string,
  today = localDateKey(),
): Achievement[] {
  const stats = getUserStats(tasks, logs, startedAt, today);
  const completedWorkout = logs.find((log) => {
    const task = tasks.find((entry) => entry.id === log.task_id);
    return (
      task?.category === 'workout' &&
      percentage(log.completed_value, task.target_value) >= 100
    );
  });
  const successfulDays = getTrackingSummaries(tasks, logs, startedAt, today)
    .filter((day) => day.successful);
  const sortedMetrics = [...metrics]
    .filter((metric) => typeof metric.weight === 'number')
    .sort((a, b) => a.date.localeCompare(b.date));
  const weightGain =
    sortedMetrics.length > 1
      ? (sortedMetrics.at(-1)?.weight ?? 0) - (sortedMetrics[0]?.weight ?? 0)
      : 0;

  return [
    {
      id: 'first-workout',
      title: 'First Workout',
      description: 'Complete your first workout task.',
      icon: '💪',
      xp_reward: 25,
      condition_type: 'workout completed',
      condition_value: 1,
      created_at: startedAt,
      unlocked_at: completedWorkout?.date,
    },
    {
      id: 'streak-7',
      title: '7 Day Streak',
      description: 'Reach the 70% daily target for seven days in a row.',
      icon: '🔥',
      xp_reward: 100,
      condition_type: 'best streak',
      condition_value: 7,
      created_at: startedAt,
      unlocked_at:
        stats.best_streak >= 7 ? successfulDays[Math.min(6, successfulDays.length - 1)]?.date : undefined,
    },
    {
      id: 'xp-1000',
      title: '1000 XP Earned',
      description: 'Earn 1000 XP from completed tasks.',
      icon: '⚡',
      xp_reward: 150,
      condition_type: 'total XP',
      condition_value: 1000,
      created_at: startedAt,
      unlocked_at: stats.total_xp >= 1000 ? today : undefined,
    },
    {
      id: 'weight-gain-5kg',
      title: '5 kg Weight Gain',
      description: 'Gain five kilograms toward your muscle-building goal.',
      icon: '📈',
      xp_reward: 125,
      condition_type: 'weight gained (kg)',
      condition_value: 5,
      created_at: startedAt,
      unlocked_at: weightGain >= 5 ? sortedMetrics.at(-1)?.date : undefined,
    },
  ];
}
