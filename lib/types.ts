export type TaskCategory = 'workout' | 'nutrition' | 'recovery' | 'habit';

export type Goal = {
  id: string;
  title: string;
  type: string;
  description: string;
  created_at: string;
};

export type TaskSetTarget = {
  label: string;
  target_value: number;
  target_unit: string;
  note?: string;
};

export type Task = {
  id: string;
  program_id: string;
  title: string;
  category: TaskCategory;
  target_value: number;
  target_unit: string;
  xp_reward: number;
  sort_order: number;
  day_index: number;
  created_at: string;
  description?: string;
  guidance?: string[];
  meal_time?: string;
  set_targets?: TaskSetTarget[];
  ai_configurable?: boolean;
};

export type DailyLog = {
  id: string;
  task_id: string;
  date: string;
  completed_value: number;
  completion_percentage: number;
  notes?: string;
  set_values?: number[];
  created_at: string;
};

export type UserStats = {
  current_streak: number;
  best_streak: number;
  total_xp: number;
  current_level: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  condition_type: string;
  condition_value: number;
  created_at: string;
  unlocked_at?: string;
};

export type BodyMetric = {
  id: string;
  date: string;
  weight: number;
  body_fat?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  created_at: string;
};
