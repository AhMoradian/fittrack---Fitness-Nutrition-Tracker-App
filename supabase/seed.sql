-- Seed after creating a Supabase Auth user. Replace :user_id with that user's UUID.
-- This seed intentionally creates tasks across workout, nutrition, recovery, and habit categories
-- while preserving a single tasks + daily_logs analytics model.

insert into public.goals (user_id, title, type, description)
values (:user_id, 'Lean muscle gain', 'body_composition', 'Build strength, gain lean weight, and keep nutrition consistent');
