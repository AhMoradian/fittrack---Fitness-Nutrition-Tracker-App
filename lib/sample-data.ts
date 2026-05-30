import { levelFromXp, percentage } from '@/lib/utils';
import type { Achievement, BodyMetric, DailyLog, Task, UserStats } from '@/lib/types';

const today = '2026-05-30';

export const tasks: Task[] = [
  { id: 'push-ups', program_id: 'program-1', title: 'Push Ups', category: 'workout', target_value: 48, target_unit: 'reps', xp_reward: 20, sort_order: 1, day_index: 1, created_at: today },
  { id: 'decline-push-ups', program_id: 'program-1', title: 'Decline Push Ups', category: 'workout', target_value: 30, target_unit: 'reps', xp_reward: 20, sort_order: 2, day_index: 1, created_at: today },
  { id: 'chair-dips', program_id: 'program-1', title: 'Chair Dips', category: 'workout', target_value: 36, target_unit: 'reps', xp_reward: 20, sort_order: 3, day_index: 1, created_at: today },
  { id: 'shoulder-press', program_id: 'program-1', title: 'Shoulder Press', category: 'workout', target_value: 40, target_unit: 'reps', xp_reward: 20, sort_order: 4, day_index: 1, created_at: today },
  { id: 'plank', program_id: 'program-1', title: 'Plank', category: 'workout', target_value: 120, target_unit: 'sec', xp_reward: 20, sort_order: 5, day_index: 1, created_at: today },
  { id: 'eggs', program_id: 'program-1', title: 'Eggs', category: 'nutrition', target_value: 4, target_unit: 'eggs', xp_reward: 10, sort_order: 6, day_index: 1, created_at: today },
  { id: 'milk', program_id: 'program-1', title: 'Milk', category: 'nutrition', target_value: 2, target_unit: 'glasses', xp_reward: 10, sort_order: 7, day_index: 1, created_at: today },
  { id: 'protein', program_id: 'program-1', title: 'Protein Intake', category: 'nutrition', target_value: 140, target_unit: 'g', xp_reward: 10, sort_order: 8, day_index: 1, created_at: today },
  { id: 'sleep', program_id: 'program-1', title: 'Sleep', category: 'recovery', target_value: 8, target_unit: 'hours', xp_reward: 10, sort_order: 9, day_index: 1, created_at: today },
  { id: 'stretching', program_id: 'program-1', title: 'Stretching', category: 'recovery', target_value: 10, target_unit: 'min', xp_reward: 10, sort_order: 10, day_index: 1, created_at: today },
  { id: 'creatine', program_id: 'program-1', title: 'Creatine', category: 'habit', target_value: 1, target_unit: 'serving', xp_reward: 5, sort_order: 11, day_index: 1, created_at: today },
  { id: 'water', program_id: 'program-1', title: 'Water Intake', category: 'habit', target_value: 3, target_unit: 'liters', xp_reward: 5, sort_order: 12, day_index: 1, created_at: today },
  { id: 'pull-ups', program_id: 'program-1', title: 'Pull Ups', category: 'workout', target_value: 25, target_unit: 'reps', xp_reward: 20, sort_order: 1, day_index: 2, created_at: today },
  { id: 'rows', program_id: 'program-1', title: 'Rows', category: 'workout', target_value: 45, target_unit: 'reps', xp_reward: 20, sort_order: 2, day_index: 2, created_at: today },
  { id: 'superman', program_id: 'program-1', title: 'Superman Hold', category: 'workout', target_value: 90, target_unit: 'sec', xp_reward: 20, sort_order: 3, day_index: 2, created_at: today },
];

const completed: Record<string, number> = {
  'push-ups': 35,
  'decline-push-ups': 30,
  'chair-dips': 18,
  'shoulder-press': 40,
  plank: 100,
  eggs: 4,
  milk: 2,
  protein: 112,
  sleep: 7,
  stretching: 10,
  creatine: 1,
  water: 2,
};

export const dailyLogs: DailyLog[] = tasks
  .filter((task) => task.day_index === 1)
  .map((task) => ({
    id: `log-${task.id}`,
    task_id: task.id,
    date: today,
    completed_value: completed[task.id] ?? 0,
    completion_percentage: percentage(completed[task.id] ?? 0, task.target_value),
    created_at: today,
  }));

export const trendData = [
  { date: 'Mon', completion: 81, workout: 75, nutrition: 88, score: 84, weight: 72.1 },
  { date: 'Tue', completion: 68, workout: 58, nutrition: 82, score: 69, weight: 72.4 },
  { date: 'Wed', completion: 91, workout: 96, nutrition: 90, score: 92, weight: 72.5 },
  { date: 'Thu', completion: 74, workout: 70, nutrition: 78, score: 75, weight: 72.8 },
  { date: 'Fri', completion: 86, workout: 88, nutrition: 84, score: 87, weight: 73.0 },
  { date: 'Sat', completion: 79, workout: 76, nutrition: 81, score: 80, weight: 73.1 },
  { date: 'Sun', completion: 94, workout: 100, nutrition: 90, score: 96, weight: 73.2 },
];

export const bodyMetrics: BodyMetric[] = trendData.map((day, index) => ({
  id: `metric-${index}`,
  date: `2026-05-${24 + index}`,
  weight: day.weight,
  body_fat: 15.4 - index * 0.1,
  waist: 82 - index * 0.15,
  chest: 101 + index * 0.2,
  arm: 34 + index * 0.08,
  created_at: today,
}));

export const achievements: Achievement[] = [
  { id: 'first-workout', title: 'First Workout', description: 'Complete your first workout task.', icon: '💪', xp_reward: 25, condition_type: 'completed_workout_tasks', condition_value: 1, created_at: today, unlocked_at: '2026-05-24' },
  { id: 'streak-7', title: '7 Day Streak', description: 'Keep a successful streak for 7 days.', icon: '🔥', xp_reward: 100, condition_type: 'streak_days', condition_value: 7, created_at: today, unlocked_at: '2026-05-30' },
  { id: 'xp-1000', title: '1000 XP Earned', description: 'Earn 1000 total XP.', icon: '⚡', xp_reward: 150, condition_type: 'total_xp', condition_value: 1000, created_at: today },
  { id: 'weight-gain-5kg', title: '5kg Weight Gain', description: 'Gain five kilograms toward your goal.', icon: '📈', xp_reward: 125, condition_type: 'weight_gain_kg', condition_value: 5, created_at: today },
];

export function getDailySummary() {
  const todayTasks = tasks.filter((task) => task.day_index === 1);
  const completion = Math.round(dailyLogs.reduce((sum, log) => sum + log.completion_percentage, 0) / dailyLogs.length);
  const earnedXp = todayTasks.reduce((sum, task) => {
    const log = dailyLogs.find((entry) => entry.task_id === task.id);
    return sum + ((log?.completion_percentage ?? 0) >= 100 ? task.xp_reward : 0);
  }, 0);
  const totalXp = 1235 + earnedXp;
  const stats: UserStats = { current_streak: 7, best_streak: 18, total_xp: totalXp, current_level: levelFromXp(totalXp) };
  return {
    date: today,
    dailyCompletion: completion,
    dailyScore: Math.round(completion * 0.75 + earnedXp * 0.25),
    earnedXp,
    stats,
    successfulDay: completion >= 70,
  };
}
