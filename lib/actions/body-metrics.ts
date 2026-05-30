'use server';

import { createClient } from '@/lib/supabase/server';
import type { BodyMetric } from '@/lib/types';

export async function recordBodyMetric(
  date: string,
  weight?: number,
  bodyFat?: number,
  waist?: number,
  chest?: number,
  arm?: number
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('body_metrics')
    .upsert({
      user_id: user.id,
      date,
      weight,
      body_fat: bodyFat,
      waist,
      chest,
      arm,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,date',
    })
    .select()
    .single();

  if (error) throw error;
  return data as BodyMetric;
}

export async function getBodyMetrics(
  startDate?: string,
  endDate?: string,
  limit = 100
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  let query = supabase
    .from('body_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit);

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as BodyMetric[];
}

export async function getLatestBodyMetric() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('body_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return (data || null) as BodyMetric | null;
}

export async function deleteBodyMetric(metricId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('body_metrics')
    .delete()
    .eq('id', metricId)
    .eq('user_id', user.id);

  if (error) throw error;
  return true;
}