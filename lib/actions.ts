'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const taskProgressSchema = z.object({
  taskId: z.string().min(1),
  completedValue: z.coerce.number().min(0),
});

const taskSchema = z.object({
  title: z.string().min(2),
  category: z.enum(['workout', 'nutrition', 'recovery', 'habit']),
  targetValue: z.coerce.number().positive(),
  targetUnit: z.string().min(1),
  xpReward: z.coerce.number().int().min(0),
  dayIndex: z.coerce.number().int().min(1).max(7),
});

export async function updateTaskProgress(_: unknown, formData: FormData) {
  const parsed = taskProgressSchema.safeParse({
    taskId: formData.get('taskId'),
    completedValue: formData.get('completedValue'),
  });

  if (!parsed.success) return { ok: false, message: 'Enter a valid completed value.' };

  // In production this writes one row to daily_logs via Supabase and recomputes
  // completion_percentage, XP, streaks, and achievements in a single transaction/RPC.
  revalidatePath('/');
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
  });

  if (!parsed.success) return { ok: false, message: 'Check the task details and try again.' };

  // In production this upserts into tasks using sort_order for drag-and-drop ordering.
  revalidatePath('/weekly-plan');
  return { ok: true, message: 'Task saved to the unified plan.' };
}
