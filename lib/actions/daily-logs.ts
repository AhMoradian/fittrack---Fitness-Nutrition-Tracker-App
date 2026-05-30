'use server';

import { createClient } from '@/lib/supabase/server';
import type { DailyLog } from '@/lib/types';

export async function logTaskCompletion(
  taskId: string,
  date: string,
  completedValue: number,
  completionPercentage: number,
  notes?: string,
  setValues?: number[]
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_logs')
    .upsert({
      user_id: user.id,
      task_id: taskId,
      date,
      completed_value: completedValue,
      completion_percentage: completionPercentage,
      notes,
      set_values: setValues,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,task_id,date',
    })
    .select()
    .single();

  if (error) throw error;
  return data as DailyLog;
}

export async function getDailyLogsForDate(date: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as DailyLog[];
}

export async function deleteDailyLog(logId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('daily_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', user.id);

  if (error) throw error;
  return true;
}