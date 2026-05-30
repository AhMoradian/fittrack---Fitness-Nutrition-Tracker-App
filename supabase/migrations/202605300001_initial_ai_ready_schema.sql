-- FitTrack AI-ready unified task tracking schema.
-- Critical invariant: all trackable behavior is represented by tasks + daily_logs.

create extension if not exists pgcrypto;

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.weekly_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

create type public.task_category as enum ('workout', 'nutrition', 'recovery', 'habit');

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.weekly_programs(id) on delete cascade,
  title text not null,
  category public.task_category not null,
  target_value numeric(10,2) not null check (target_value > 0),
  target_unit text not null,
  description text,
  guidance jsonb,
  meal_time text,
  set_targets jsonb,
  ai_configurable boolean not null default true,
  xp_reward integer not null default 0 check (xp_reward >= 0),
  day_index smallint not null default 1 check (day_index between 1 and 7),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  date date not null,
  completed_value numeric(10,2) not null default 0 check (completed_value >= 0),
  completion_percentage numeric(5,2) not null default 0 check (completion_percentage between 0 and 100),
  notes text,
  set_values jsonb,
  created_at timestamptz not null default now(),
  unique (task_id, date)
);

create table public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight numeric(6,2),
  body_fat numeric(5,2),
  waist numeric(6,2),
  chest numeric(6,2),
  arm numeric(6,2),
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create table public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  image_url text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.user_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  total_xp integer not null default 0,
  current_level integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.streak_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  daily_completion numeric(5,2) not null check (daily_completion between 0 and 100),
  successful boolean not null,
  streak_after_day integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null,
  xp_reward integer not null default 0 check (xp_reward >= 0),
  condition_type text not null,
  condition_value numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create table public.unlocked_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index daily_logs_user_date_idx on public.daily_logs (user_id, date);
create index daily_logs_task_date_idx on public.daily_logs (task_id, date);
create index tasks_program_sort_idx on public.tasks (program_id, day_index, sort_order);
create index achievements_condition_idx on public.achievements (condition_type, condition_value);

create or replace function public.set_daily_log_completion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  task_target numeric(10,2);
begin
  select target_value into task_target from public.tasks where id = new.task_id;
  if task_target is null or task_target <= 0 then
    new.completion_percentage := 0;
  else
    new.completion_percentage := least(100, round((new.completed_value / task_target) * 100, 2));
  end if;
  return new;
end;
$$;

create trigger daily_logs_completion_before_write
before insert or update of completed_value, task_id on public.daily_logs
for each row execute function public.set_daily_log_completion();

create or replace function public.level_from_xp(total_xp integer)
returns integer
language sql
immutable
as $$ select floor(greatest(total_xp, 0) / 100)::integer; $$;

alter table public.goals enable row level security;
alter table public.weekly_programs enable row level security;
alter table public.tasks enable row level security;
alter table public.daily_logs enable row level security;
alter table public.body_metrics enable row level security;
alter table public.progress_photos enable row level security;
alter table public.user_stats enable row level security;
alter table public.streak_history enable row level security;
alter table public.achievements enable row level security;
alter table public.unlocked_achievements enable row level security;

create policy "Users manage own goals" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own programs" on public.weekly_programs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own daily logs" on public.daily_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own body metrics" on public.body_metrics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own progress photos" on public.progress_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own stats" on public.user_stats for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own streak history" on public.streak_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Achievement definitions are readable" on public.achievements for select using (true);
create policy "Users read own unlocked achievements" on public.unlocked_achievements for select using (auth.uid() = user_id);
create policy "Users insert own unlocked achievements" on public.unlocked_achievements for insert with check (auth.uid() = user_id);

insert into public.achievements (title, description, icon, xp_reward, condition_type, condition_value) values
  ('First Workout', 'Complete your first workout task.', '💪', 25, 'completed_workout_tasks', 1),
  ('7 Day Streak', 'Maintain a successful day streak for one week.', '🔥', 100, 'streak_days', 7),
  ('30 Day Streak', 'Maintain a successful day streak for thirty days.', '🏆', 300, 'streak_days', 30),
  ('100 Completed Tasks', 'Complete one hundred tasks of any category.', '✅', 150, 'completed_tasks', 100),
  ('First Weight Gain', 'Record your first weight increase toward your goal.', '📈', 50, 'weight_gain_kg', 1),
  ('5kg Weight Gain', 'Gain five kilograms toward your goal.', '💚', 125, 'weight_gain_kg', 5),
  ('1000 XP Earned', 'Earn one thousand total XP.', '⚡', 150, 'total_xp', 1000);
