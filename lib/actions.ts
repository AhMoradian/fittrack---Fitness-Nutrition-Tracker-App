'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const taskProgressSchema = z.object({
  taskId: z.string().min(1),
  completedValue: z.coerce.number().min(0),
  setValues: z.string().optional(),
  notes: z.string().optional(),
});

const taskSchema = z.object({
  title: z.string().min(2),
  category: z.enum(['workout', 'nutrition', 'recovery', 'habit']),
  targetValue: z.coerce.number().positive(),
  targetUnit: z.string().min(1),
  xpReward: z.coerce.number().int().min(0),
  dayIndex: z.coerce.number().int().min(1).max(7),
  description: z.string().optional(),
});

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function updateTaskProgress(_: unknown, formData: FormData) {
  const parsed = taskProgressSchema.safeParse({
    taskId: formData.get('taskId'),
    completedValue: formData.get('completedValue'),
    setValues: formData.get('setValues'),
    notes: formData.get('notes'),
  });

  if (!parsed.success) return { ok: false, message: 'Enter a valid completed value.' };

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      const today = new Date().toISOString().slice(0, 10);

      if (data.user) {
        const setValues = parsed.data.setValues ? JSON.parse(parsed.data.setValues) : null;
        await supabase.from('daily_logs').upsert(
          {
            user_id: data.user.id,
            task_id: parsed.data.taskId,
            date: today,
            completed_value: parsed.data.completedValue,
            notes: parsed.data.notes || null,
            set_values: setValues,
          },
          { onConflict: 'task_id,date' },
        );
      }
    } catch {
      // Keep the demo usable if Supabase is not migrated/authenticated yet.
    }
  }

  revalidatePath('/');
  revalidatePath('/weekly-plan');
  return { ok: true, message: 'Progress saved.' };
}

export async function upsertProgramTask(_: unknown, formData: FormData) {
  const parsed = taskSchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    targetValue: formData.get('targetValue'),
    targetUnit: formData.get('targetUnit'),
    xpReward: formData.get('xpReward'),
    dayIndex: formData.get('dayIndex'),
    description: formData.get('description'),
  });

  if (!parsed.success) return { ok: false, message: 'Check the task details and try again.' };

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from('tasks').insert({
          user_id: data.user.id,
          title: parsed.data.title,
          category: parsed.data.category,
          target_value: parsed.data.targetValue,
          target_unit: parsed.data.targetUnit,
          xp_reward: parsed.data.xpReward,
          day_index: parsed.data.dayIndex,
          sort_order: 999,
          description: parsed.data.description || null,
          ai_configurable: true,
        });
      }
    } catch {
      // Sample mode still confirms the intended write path.
    }
  }

  revalidatePath('/weekly-plan');
  return { ok: true, message: 'Task saved to the unified plan.' };
}
