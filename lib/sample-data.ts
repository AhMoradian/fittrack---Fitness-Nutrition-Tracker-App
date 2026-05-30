import { levelFromXp, percentage } from '@/lib/utils';
import type { Achievement, BodyMetric, DailyLog, Task, UserStats } from '@/lib/types';

const today = '2026-05-30';

const workout = (task: Omit<Task, 'program_id' | 'category' | 'created_at' | 'ai_configurable'>): Task => ({
  ...task,
  program_id: 'home-muscle-building-program',
  category: 'workout',
  created_at: today,
  ai_configurable: true,
});

const nutrition = (task: Omit<Task, 'program_id' | 'category' | 'created_at' | 'ai_configurable' | 'day_index'>): Task => ({
  ...task,
  program_id: 'home-muscle-building-program',
  category: 'nutrition',
  day_index: 1,
  created_at: today,
  ai_configurable: true,
});

export const profile = {
  age: '24.5',
  height: '177 cm',
  weight: '55 kg',
  goal: 'Muscle Gain + Better Posture',
  weeklyGoal: 'Gain 0.3–0.6 kg per week',
  equipment: ['Pull-up bar', 'Backpack', 'Chair', '2kg dumbbells'],
};

export const programRules = [
  'Train consistently',
  'Eat more calories',
  'Sleep 7.5–9 hours',
  'Track progress weekly',
  'Add reps every week',
];

export const adhdTips = ['Start with only 5 minutes', 'Use music', 'Track records', 'Take progress photos', 'Focus on consistency, not perfection'];

export const tasks: Task[] = [
  workout({ id: 'push-ups', title: 'Push-ups', target_value: 48, target_unit: 'reps', xp_reward: 20, sort_order: 1, day_index: 1, description: 'Chest, shoulders, and triceps. Keep a straight body line.', set_targets: [1, 2, 3, 4].map((set) => ({ label: `Set ${set}`, target_value: 12, target_unit: 'reps', note: '6–12 reps' })) }),
  workout({ id: 'decline-push-ups', title: 'Decline Push-ups', target_value: 30, target_unit: 'reps', xp_reward: 20, sort_order: 2, day_index: 1, description: 'Feet elevated for upper chest and shoulder control.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 10, target_unit: 'reps', note: '6–10 reps' })) }),
  workout({ id: 'chair-dips', title: 'Chair Dips', target_value: 36, target_unit: 'reps', xp_reward: 20, sort_order: 3, day_index: 1, description: 'Triceps focus. Keep shoulders down and elbows controlled.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 12, target_unit: 'reps', note: '8–12 reps' })) }),
  workout({ id: 'shoulder-press', title: 'Dumbbell Shoulder Press', target_value: 45, target_unit: 'reps', xp_reward: 20, sort_order: 4, day_index: 1, description: 'Use 2kg dumbbells. Slow tempo and full control.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 15, target_unit: 'reps', note: '12–15 reps' })) }),
  workout({ id: 'plank', title: 'Plank', target_value: 135, target_unit: 'sec', xp_reward: 20, sort_order: 5, day_index: 1, description: 'Brace core and glutes. Rest 60–90 seconds between push-day sets.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 45, target_unit: 'sec', note: '45 sec' })) }),

  workout({ id: 'pull-ups', title: 'Pull-ups', target_value: 25, target_unit: 'reps', xp_reward: 25, sort_order: 1, day_index: 2, description: 'Five sets to failure. Record every set separately.', guidance: ['Straight back', 'Chest open', 'Shoulder blades back'], set_targets: [1, 2, 3, 4, 5].map((set) => ({ label: `Set ${set}`, target_value: 5, target_unit: 'reps', note: 'to failure' })) }),
  workout({ id: 'negative-pull-ups', title: 'Negative Pull-ups', target_value: 9, target_unit: 'reps', xp_reward: 20, sort_order: 2, day_index: 2, description: 'Jump to the top and lower slowly.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 3, target_unit: 'reps', note: 'slow negatives' })) }),
  workout({ id: 'backpack-rows', title: 'Backpack Rows', target_value: 48, target_unit: 'reps', xp_reward: 20, sort_order: 3, day_index: 2, description: 'Load backpack safely. Pull elbows back and squeeze shoulder blades.', set_targets: [1, 2, 3, 4].map((set) => ({ label: `Set ${set}`, target_value: 12, target_unit: 'reps' })) }),
  workout({ id: 'ytw-shoulders', title: 'Y-T-W Shoulder Movements', target_value: 9, target_unit: 'rounds', xp_reward: 15, sort_order: 4, day_index: 2, description: 'Posture drill for rear shoulders and upper back.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 3, target_unit: 'rounds', note: 'Y + T + W' })) }),
  workout({ id: 'superman-hold', title: 'Superman Hold', target_value: 45, target_unit: 'reps', xp_reward: 15, sort_order: 5, day_index: 2, description: 'Back extension control. Follow the plan target of 3 × 15.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 15, target_unit: 'reps' })) }),

  workout({ id: 'bodyweight-squats', title: 'Bodyweight Squats', target_value: 80, target_unit: 'reps', xp_reward: 20, sort_order: 1, day_index: 3, set_targets: [1, 2, 3, 4].map((set) => ({ label: `Set ${set}`, target_value: 20, target_unit: 'reps' })) }),
  workout({ id: 'backpack-squats', title: 'Backpack Squats', target_value: 48, target_unit: 'reps', xp_reward: 20, sort_order: 2, day_index: 3, set_targets: [1, 2, 3, 4].map((set) => ({ label: `Set ${set}`, target_value: 12, target_unit: 'reps' })) }),
  workout({ id: 'lunges', title: 'Lunges', target_value: 60, target_unit: 'reps', xp_reward: 20, sort_order: 3, day_index: 3, description: '10 reps each leg per set.', set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 20, target_unit: 'reps', note: '10 each leg' })) }),
  workout({ id: 'calf-raises', title: 'Calf Raises', target_value: 80, target_unit: 'reps', xp_reward: 15, sort_order: 4, day_index: 3, set_targets: [1, 2, 3, 4].map((set) => ({ label: `Set ${set}`, target_value: 20, target_unit: 'reps' })) }),
  workout({ id: 'leg-raises', title: 'Leg Raises', target_value: 45, target_unit: 'reps', xp_reward: 15, sort_order: 5, day_index: 3, set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 15, target_unit: 'reps' })) }),
  workout({ id: 'side-plank', title: 'Side Plank', target_value: 90, target_unit: 'sec', xp_reward: 15, sort_order: 6, day_index: 3, set_targets: [1, 2, 3].map((set) => ({ label: `Set ${set}`, target_value: 30, target_unit: 'sec', note: 'each side as able' })) }),

  workout({ id: 'stretching', title: 'Stretching', target_value: 10, target_unit: 'min', xp_reward: 10, sort_order: 1, day_index: 4, description: 'Easy active recovery mobility.' }),
  workout({ id: 'hang-bar', title: 'Hanging from Pull-up Bar', target_value: 3, target_unit: 'rounds', xp_reward: 10, sort_order: 2, day_index: 4, description: 'Relax shoulders and decompress.' }),
  workout({ id: 'walking', title: 'Walking', target_value: 20, target_unit: 'min', xp_reward: 10, sort_order: 3, day_index: 4, description: 'Low-intensity recovery walk.' }),
  workout({ id: 'chest-openers', title: 'Chest Opener Stretches', target_value: 5, target_unit: 'min', xp_reward: 10, sort_order: 4, day_index: 4 }),
  workout({ id: 'hip-flexors', title: 'Hip Flexor Stretches', target_value: 5, target_unit: 'min', xp_reward: 10, sort_order: 5, day_index: 4 }),

  workout({ id: 'push-repeat', title: 'PUSH Repeat — more reps/control', target_value: 1, target_unit: 'session', xp_reward: 35, sort_order: 1, day_index: 5, description: 'Repeat Day 1. Try more reps, more control, or shorter rest.' }),
  workout({ id: 'back-repeat', title: 'BACK Repeat — posture focus', target_value: 1, target_unit: 'session', xp_reward: 35, sort_order: 1, day_index: 6, description: 'Repeat Day 2. Focus on pull-up progress, better posture, and slow movements.' }),
  workout({ id: 'rest-day', title: 'Full Rest', target_value: 1, target_unit: 'day', xp_reward: 10, sort_order: 1, day_index: 7, description: 'Sleep well and recover.' }),

  nutrition({ id: 'breakfast-eggs', title: 'Breakfast eggs', meal_time: 'Breakfast', target_value: 4, target_unit: 'eggs', xp_reward: 10, sort_order: 101, description: 'Eat 4 eggs with bread plus peanut butter or cheese.' }),
  nutrition({ id: 'breakfast-banana', title: 'Breakfast banana', meal_time: 'Breakfast', target_value: 1, target_unit: 'banana', xp_reward: 5, sort_order: 102, description: 'Add fruit early so calories start easy.' }),
  nutrition({ id: 'breakfast-milk', title: 'Breakfast milk', meal_time: 'Breakfast', target_value: 1, target_unit: 'glass', xp_reward: 5, sort_order: 103, description: 'One glass of milk with breakfast.' }),
  nutrition({ id: 'mass-shake', title: 'Mass gain shake', meal_time: 'Snack 1', target_value: 1, target_unit: 'shake', xp_reward: 15, sort_order: 104, description: 'Blend 2 bananas, 2 glasses milk, 4 tbsp oats, 2 tbsp peanut butter, and honey.' }),
  nutrition({ id: 'lunch-rice', title: 'Large rice lunch', meal_time: 'Lunch', target_value: 1, target_unit: 'large plate', xp_reward: 10, sort_order: 105, description: 'Large amount of rice with chicken, meat, or eggs. Add yogurt and potatoes when possible.' }),
  nutrition({ id: 'pre-workout-carbs', title: 'Pre-workout carbs', meal_time: 'Pre-workout', target_value: 1, target_unit: 'serving', xp_reward: 10, sort_order: 106, description: 'Banana plus coffee or tea and dates before training.' }),
  nutrition({ id: 'post-workout-food', title: 'Post-workout nutrition', meal_time: 'Post-workout', target_value: 1, target_unit: 'serving', xp_reward: 15, sort_order: 107, description: 'Within 1 hour: milk, banana, eggs, or the mass gainer shake.' }),
  nutrition({ id: 'dinner-protein', title: 'Dinner protein meal', meal_time: 'Dinner', target_value: 1, target_unit: 'plate', xp_reward: 10, sort_order: 108, description: 'Rice or potatoes with a protein source and vegetables.' }),
  nutrition({ id: 'before-sleep-calories', title: 'Before-sleep calories', meal_time: 'Before sleep', target_value: 1, target_unit: 'serving', xp_reward: 10, sort_order: 109, description: 'Milk, yogurt, or peanut butter before bed.' }),
  nutrition({ id: 'water', title: 'Water intake', meal_time: 'All day', target_value: 8, target_unit: 'glasses', xp_reward: 10, sort_order: 110, description: 'Track water by glasses, not liters.' }),
  nutrition({ id: 'creatine', title: 'Creatine monohydrate', meal_time: 'Optional supplement', target_value: 5, target_unit: 'g', xp_reward: 5, sort_order: 111, description: 'Optional: 3–5g daily to help strength and muscle gain.' }),
  { id: 'sleep', program_id: 'home-muscle-building-program', title: 'Sleep', category: 'recovery', target_value: 8, target_unit: 'hours', xp_reward: 10, sort_order: 112, day_index: 1, created_at: today, description: 'Aim for 7.5–9 hours for muscle gain and recovery.', ai_configurable: true },
];

const completed: Record<string, number | number[]> = {
  'push-ups': [8, 9, 8, 10],
  'decline-push-ups': [8, 7, 8],
  'chair-dips': [8, 7, 6],
  'shoulder-press': [15, 15, 12],
  plank: [45, 35, 30],
  'breakfast-eggs': 4,
  'breakfast-banana': 1,
  'breakfast-milk': 1,
  'mass-shake': 1,
  water: 5,
  creatine: 5,
  sleep: 7,
};

const todayTaskIds = new Set([...tasks.filter((task) => task.day_index === 1).map((task) => task.id), ...tasks.filter((task) => task.category === 'nutrition' || task.category === 'recovery').map((task) => task.id)]);

export const dailyLogs: DailyLog[] = tasks
  .filter((task) => todayTaskIds.has(task.id))
  .map((task) => {
    const value = completed[task.id] ?? 0;
    const total = Array.isArray(value) ? value.reduce((sum, item) => sum + item, 0) : value;
    return {
      id: `log-${task.id}`,
      task_id: task.id,
      date: today,
      completed_value: total,
      completion_percentage: percentage(total, task.target_value),
      set_values: Array.isArray(value) ? value : undefined,
      created_at: today,
    };
  });

export const trendData = [
  { date: 'Mon', completion: 68, workout: 62, nutrition: 72, score: 70, weight: 55.0 },
  { date: 'Tue', completion: 74, workout: 70, nutrition: 77, score: 76, weight: 55.1 },
  { date: 'Wed', completion: 82, workout: 84, nutrition: 80, score: 84, weight: 55.2 },
  { date: 'Thu', completion: 71, workout: 65, nutrition: 78, score: 73, weight: 55.2 },
  { date: 'Fri', completion: 86, workout: 88, nutrition: 84, score: 88, weight: 55.4 },
  { date: 'Sat', completion: 79, workout: 76, nutrition: 82, score: 81, weight: 55.5 },
  { date: 'Sun', completion: 90, workout: 92, nutrition: 88, score: 92, weight: 55.6 },
];

export const bodyMetrics: BodyMetric[] = trendData.map((day, index) => ({
  id: `metric-${index}`,
  date: `2026-05-${24 + index}`,
  weight: day.weight,
  body_fat: 14.5 + index * 0.05,
  waist: 72 + index * 0.08,
  chest: 87 + index * 0.12,
  arm: 27 + index * 0.05,
  created_at: today,
}));

export const achievements: Achievement[] = [
  { id: 'first-workout', title: 'First Workout', description: 'Complete your first workout task.', icon: '💪', xp_reward: 25, condition_type: 'completed_workout_tasks', condition_value: 1, created_at: today, unlocked_at: '2026-05-24' },
  { id: 'streak-7', title: '7 Day Streak', description: 'Keep a successful streak for 7 days.', icon: '🔥', xp_reward: 100, condition_type: 'streak_days', condition_value: 7, created_at: today, unlocked_at: '2026-05-30' },
  { id: 'xp-1000', title: '1000 XP Earned', description: 'Earn 1000 total XP.', icon: '⚡', xp_reward: 150, condition_type: 'total_xp', condition_value: 1000, created_at: today },
  { id: 'weight-gain-5kg', title: '5kg Weight Gain', description: 'Gain five kilograms toward your goal.', icon: '📈', xp_reward: 125, condition_type: 'weight_gain_kg', condition_value: 5, created_at: today },
];

export function getDailySummary() {
  const todayTasks = tasks.filter((task) => todayTaskIds.has(task.id));
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
