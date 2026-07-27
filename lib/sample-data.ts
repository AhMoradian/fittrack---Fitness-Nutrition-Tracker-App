import { levelFromXp, percentage } from '@/lib/utils';
import type { BodyMetric, DailyLog, Task, UserStats } from '@/lib/types';

const seedDate = '2026-07-27';

export const COACH_PROGRAM_ID = 'personal-calisthenics-coach-plan';
export const COACH_PLAN_VERSION = 2;

export const coachPlan = {
  version: COACH_PLAN_VERSION,
  updatedAt: seedDate,
  phase: 'Foundation · Week 1',
  focus: 'Muscle first, then balance skills, flexibility, and fitness',
  nutrition: '2,400–2,500 kcal · 90–110 g protein · milk optional',
};

const workout = (
  task: Omit<Task, 'program_id' | 'category' | 'created_at' | 'ai_configurable'>,
): Task => ({
  ...task,
  program_id: COACH_PROGRAM_ID,
  category: 'workout',
  created_at: seedDate,
  ai_configurable: true,
});

const nutrition = (
  task: Omit<
    Task,
    'program_id' | 'category' | 'created_at' | 'ai_configurable' | 'day_index'
  >,
): Task => ({
  ...task,
  program_id: COACH_PROGRAM_ID,
  category: 'nutrition',
  day_index: 1,
  created_at: seedDate,
  ai_configurable: true,
});

const setTargets = (values: number[], unit: string, note: string) =>
  values.map((value, index) => ({
    label: `Set ${index + 1}`,
    target_value: value,
    target_unit: unit,
    note,
  }));

const strengthA = (dayIndex: number, suffix: string): Task[] => [
  workout({
    id: `pull-ups-${suffix}`,
    title: 'Controlled pull-ups',
    target_value: 6,
    target_unit: 'reps',
    xp_reward: 25,
    sort_order: 1,
    day_index: dayIndex,
    description:
      'Accumulate clean reps without grinding. Stop with 1 rep in reserve and rest 2–3 minutes.',
    set_targets: setTargets([2, 1, 1, 1, 1], 'reps', '1–2 clean reps'),
  }),
  workout({
    id: `push-ups-${suffix}`,
    title: 'Push-ups',
    target_value: 20,
    target_unit: 'reps',
    xp_reward: 20,
    sort_order: 2,
    day_index: dayIndex,
    description:
      'Straight body line, controlled depth, and 1–2 good reps left in reserve.',
    set_targets: setTargets([5, 5, 5, 5], 'reps', '4–6 reps'),
  }),
  workout({
    id: `split-squats-${suffix}`,
    title: 'Bulgarian split squats',
    target_value: 30,
    target_unit: 'reps/side',
    xp_reward: 20,
    sort_order: 3,
    day_index: dayIndex,
    description:
      'Use bodyweight first. Each logged value is the reps completed on each side.',
    set_targets: setTargets([10, 10, 10], 'reps/side', '8–12 each side'),
  }),
  workout({
    id: `backpack-rows-${suffix}`,
    title: 'Backpack rows',
    target_value: 30,
    target_unit: 'reps',
    xp_reward: 20,
    sort_order: 4,
    day_index: dayIndex,
    description:
      'Brace the torso and squeeze the shoulder blades. Add books only after all sets are clean.',
    set_targets: setTargets([10, 10, 10], 'reps', '8–12 reps'),
  }),
  workout({
    id: `hollow-hold-${suffix}`,
    title: 'Hollow-body hold',
    target_value: 60,
    target_unit: 'sec',
    xp_reward: 15,
    sort_order: 5,
    day_index: dayIndex,
    description: 'Keep the lower back gently pressed into the floor.',
    set_targets: setTargets([20, 20, 20], 'sec', '15–25 sec'),
  }),
];

const strengthB = (dayIndex: number): Task[] => [
  workout({
    id: 'negative-pull-ups-b1',
    title: 'Slow negative pull-ups',
    target_value: 8,
    target_unit: 'reps',
    xp_reward: 25,
    sort_order: 1,
    day_index: dayIndex,
    description:
      'Start at the top and lower for 5–8 seconds. Stop if shoulder or elbow pain appears.',
    set_targets: setTargets([2, 2, 2, 2], 'reps', '5–8 sec lowering'),
  }),
  workout({
    id: 'full-dips-b1',
    title: 'Full dips',
    target_value: 16,
    target_unit: 'reps',
    xp_reward: 20,
    sort_order: 2,
    day_index: dayIndex,
    description:
      'Use stable parallel bars. Keep shoulders down and stop 1–2 reps before failure.',
    set_targets: setTargets([4, 4, 4, 4], 'reps', '3–5 reps'),
  }),
  workout({
    id: 'backpack-squats-b1',
    title: 'Backpack squats',
    target_value: 48,
    target_unit: 'reps',
    xp_reward: 20,
    sort_order: 3,
    day_index: dayIndex,
    description: 'Use a secure backpack and controlled depth. Add load gradually.',
    set_targets: setTargets([12, 12, 12, 12], 'reps', '10–15 reps'),
  }),
  workout({
    id: 'pike-push-ups-b1',
    title: 'Pike push-ups',
    target_value: 18,
    target_unit: 'reps',
    xp_reward: 20,
    sort_order: 4,
    day_index: dayIndex,
    description:
      'Build overhead strength for the handstand. Keep the head path controlled.',
    set_targets: setTargets([6, 6, 6], 'reps', '5–8 reps'),
  }),
  workout({
    id: 'single-leg-bridge-b1',
    title: 'Single-leg glute bridge',
    target_value: 36,
    target_unit: 'reps/side',
    xp_reward: 15,
    sort_order: 5,
    day_index: dayIndex,
    description: 'Each logged value is the reps completed on each side.',
    set_targets: setTargets([12, 12, 12], 'reps/side', '10–15 each side'),
  }),
  workout({
    id: 'reverse-crunch-b1',
    title: 'Reverse crunch',
    target_value: 30,
    target_unit: 'reps',
    xp_reward: 15,
    sort_order: 6,
    day_index: dayIndex,
    description: 'Curl the pelvis gently instead of swinging the legs.',
    set_targets: setTargets([10, 10, 10], 'reps', '8–15 reps'),
  }),
];

const skillDay = (dayIndex: number, suffix: string): Task[] => [
  workout({
    id: `wall-handstand-${suffix}`,
    title: 'Chest-to-wall handstand',
    target_value: 100,
    target_unit: 'sec',
    xp_reward: 20,
    sort_order: 1,
    day_index: dayIndex,
    description:
      'Warm up wrists first. Never practise balance when dizzy, sleepy, or sedated.',
    set_targets: setTargets([20, 20, 20, 20, 20], 'sec', '15–25 sec'),
  }),
  workout({
    id: `support-hold-${suffix}`,
    title: 'Straight-arm support hold',
    target_value: 48,
    target_unit: 'sec',
    xp_reward: 15,
    sort_order: 2,
    day_index: dayIndex,
    description:
      'Use stable equal-height supports on a non-slip floor and push the shoulders down.',
    set_targets: setTargets([12, 12, 12, 12], 'sec', '10–20 sec'),
  }),
  workout({
    id: `tuck-l-sit-${suffix}`,
    title: 'Tuck L-sit',
    target_value: 30,
    target_unit: 'sec',
    xp_reward: 20,
    sort_order: 3,
    day_index: dayIndex,
    description:
      'Keep knees tucked and shoulders pressed down. Short clean holds count.',
    set_targets: setTargets([6, 6, 6, 6, 6], 'sec', '5–10 sec'),
  }),
  workout({
    id: `mobility-${suffix}`,
    title: 'Shoulder, wrist, hip & hamstring mobility',
    target_value: 12,
    target_unit: 'min',
    xp_reward: 15,
    sort_order: 4,
    day_index: dayIndex,
    description:
      'Move gently through comfortable ranges; flexibility work should not feel sharp.',
  }),
];

export const profile = {
  age: '24',
  height: '176.5 cm',
  weight: '55 kg',
  goal: 'Muscle gain, balance skills, flexibility, and fitness',
  weeklyGoal: 'Gain 0.15–0.30 kg per week',
  equipment: [
    'Pull-up bar',
    'Backpack',
    'Sturdy chairs',
    'Wall',
    '2kg dumbbells',
    'Park dip bars',
  ],
};

export const programRules = [
  'Leave 1–2 good reps in reserve',
  'Rest 2–3 minutes on hard sets',
  'Add reps before adding backpack weight',
  'No maximum-rep testing until week 4',
  'Use the Sunday check-in for coach updates',
];

export const adhdTips = [
  'Start with only 5 minutes',
  'Use music',
  'Track records',
  'Take progress photos',
  'Focus on consistency, not perfection',
];

export const tasks: Task[] = [
  ...strengthA(1, 'a1'),
  ...skillDay(2, 's1'),
  ...strengthB(3),
  workout({
    id: 'recovery-walk',
    title: 'Easy walk',
    target_value: 20,
    target_unit: 'min',
    xp_reward: 10,
    sort_order: 1,
    day_index: 4,
    description: 'Easy pace only. Your normal daily walking can count.',
  }),
  workout({
    id: 'recovery-mobility',
    title: 'Gentle full-body mobility',
    target_value: 15,
    target_unit: 'min',
    xp_reward: 10,
    sort_order: 2,
    day_index: 4,
    description:
      'Focus on wrists, shoulders, hips, and hamstrings without forcing range.',
  }),
  workout({
    id: 'recovery-hang',
    title: 'Relaxed dead hang',
    target_value: 60,
    target_unit: 'sec',
    xp_reward: 10,
    sort_order: 3,
    day_index: 4,
    description: 'Use comfortable short holds and stop for shoulder pain.',
    set_targets: setTargets([20, 20, 20], 'sec', 'comfortable hold'),
  }),
  ...strengthA(5, 'a2'),
  ...skillDay(6, 's2'),
  workout({
    id: 'full-rest',
    title: 'Full recovery day',
    target_value: 1,
    target_unit: 'day',
    xp_reward: 10,
    sort_order: 1,
    day_index: 7,
    description:
      'No hard training. Walk gently if you want and complete the weekly check-in.',
  }),
  nutrition({
    id: 'first-meal',
    title: 'First complete meal',
    meal_time: 'After waking',
    target_value: 1,
    target_unit: 'meal',
    xp_reward: 10,
    sort_order: 101,
    description:
      'Economical option: 2–3 eggs, bread, and a banana or dates. Follow your prescribed medication timing.',
  }),
  nutrition({
    id: 'daily-feedings',
    title: 'Regular meals and snack',
    meal_time: 'All day',
    target_value: 4,
    target_unit: 'feedings',
    xp_reward: 15,
    sort_order: 102,
    description:
      'Aim for 3 meals plus 1 calorie-dense snack instead of relying on two meals.',
  }),
  nutrition({
    id: 'protein-target',
    title: 'Protein target',
    meal_time: 'All day',
    target_value: 95,
    target_unit: 'g',
    xp_reward: 20,
    sort_order: 103,
    description:
      'Aim for 90–110 g. Budget choices: eggs, soy, lentils, beans, chickpeas, yogurt, and chicken legs.',
  }),
  nutrition({
    id: 'economic-snack',
    title: 'Calorie-dense snack',
    meal_time: 'Afternoon',
    target_value: 1,
    target_unit: 'serving',
    xp_reward: 15,
    sort_order: 104,
    description:
      'Yogurt + banana + peanuts + dates. If dairy feels bad, use oats, banana, peanuts or tahini, dates, and water; add eggs separately.',
  }),
  nutrition({
    id: 'calorie-target',
    title: 'Daily calorie target',
    meal_time: 'All day',
    target_value: 2450,
    target_unit: 'kcal',
    xp_reward: 20,
    sort_order: 105,
    description:
      'Starting range: 2,400–2,500 kcal. Adjust only from the 7-day weight average.',
  }),
  nutrition({
    id: 'water',
    title: 'Water intake',
    meal_time: 'All day',
    target_value: 7,
    target_unit: 'glasses',
    xp_reward: 10,
    sort_order: 106,
    description:
      'Use thirst, urine colour, and Tehran heat as guides; drink more around training.',
  }),
  {
    id: 'sleep',
    program_id: COACH_PROGRAM_ID,
    title: 'Sleep',
    category: 'recovery',
    target_value: 8,
    target_unit: 'hours',
    xp_reward: 15,
    sort_order: 107,
    day_index: 1,
    created_at: seedDate,
    description:
      'Target 8–9 hours and keep wake time within the same 60-minute window. Review persistent major sleep swings with your prescriber.',
    ai_configurable: true,
  },
  {
    id: 'wake-consistency',
    program_id: COACH_PROGRAM_ID,
    title: 'Consistent wake time',
    category: 'habit',
    target_value: 1,
    target_unit: 'day',
    xp_reward: 10,
    sort_order: 108,
    day_index: 1,
    created_at: seedDate,
    description:
      'Start with 11:00, within 30 minutes, and get outdoor light after waking.',
    ai_configurable: true,
  },
];

export const dailyLogs: DailyLog[] = [];

export const bodyMetrics: BodyMetric[] = [
  {
    id: 'starting-weight',
    date: seedDate,
    weight: 55,
    created_at: seedDate,
  },
];

export function getDailySummary() {
  const totalXp = 0;
  const stats: UserStats = {
    current_streak: 0,
    best_streak: 0,
    total_xp: totalXp,
    current_level: levelFromXp(totalXp),
  };
  return {
    date: seedDate,
    dailyCompletion: 0,
    dailyScore: percentage(0, 1),
    earnedXp: 0,
    stats,
    successfulDay: false,
  };
}
