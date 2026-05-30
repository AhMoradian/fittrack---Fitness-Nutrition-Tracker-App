'use client';

import { useActionState, useMemo, useState } from 'react';
import { CheckCircle2, Flame, Save } from 'lucide-react';
import { updateTaskProgress } from '@/lib/actions';
import type { DailyLog, Task } from '@/lib/types';
import { percentage } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const categoryStyles = {
  workout: 'bg-orange-100 text-orange-700',
  nutrition: 'bg-emerald-100 text-emerald-700',
  recovery: 'bg-sky-100 text-sky-700',
  habit: 'bg-violet-100 text-violet-700',
};

export function TaskCard({ task, log }: { task: Task; log?: DailyLog }) {
  const initialSetValues = task.set_targets?.map((_, index) => log?.set_values?.[index] ?? 0) ?? [];
  const [setValues, setSetValues] = useState(initialSetValues);
  const [singleValue, setSingleValue] = useState(log?.completed_value ?? 0);
  const [notes, setNotes] = useState(log?.notes ?? '');
  const [state, formAction, pending] = useActionState(updateTaskProgress, null);

  const completed = useMemo(() => (task.set_targets?.length ? setValues.reduce((sum, value) => sum + Number(value || 0), 0) : singleValue), [setValues, singleValue, task.set_targets?.length]);
  const progress = useMemo(() => percentage(completed, task.target_value), [completed, task.target_value]);
  const done = progress >= 100;
  const isWorkoutSets = task.category === 'workout' && Boolean(task.set_targets?.length);

  return (
    <Card className="touch-card p-4">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="taskId" value={task.id} />
        <input type="hidden" name="completedValue" value={completed} />
        <input type="hidden" name="setValues" value={JSON.stringify(setValues)} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black">{task.title}</h3>
              {done ? <CheckCircle2 className="h-5 w-5 fill-green-500 text-white" /> : null}
              {task.ai_configurable ? <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-600">AI-ready</span> : null}
            </div>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Target: {task.target_value} {task.target_unit}{task.meal_time ? ` · ${task.meal_time}` : ''}
            </p>
            {task.description ? <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{task.description}</p> : null}
          </div>
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-black capitalize ${categoryStyles[task.category]}`}>{task.category}</span>
        </div>

        {isWorkoutSets ? (
          <div className="rounded-3xl bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-black uppercase text-muted-foreground">Log each set</p>
              <p className="text-xs font-bold text-muted-foreground">One workout box</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {task.set_targets?.map((set, index) => (
                <label key={`${task.id}-${set.label}`} className="rounded-2xl border bg-white p-3">
                  <span className="flex items-center justify-between gap-2 text-xs font-black text-muted-foreground">
                    <span>{set.label}</span>
                    <span>{set.note ?? `${set.target_value} ${set.target_unit}`}</span>
                  </span>
                  <input
                    className="mt-2 w-full rounded-xl border px-3 py-2 text-base font-black outline-none focus:ring-2 focus:ring-green-500"
                    inputMode="decimal"
                    min="0"
                    name={`set-${index}`}
                    type="number"
                    value={setValues[index] ?? 0}
                    onChange={(event) => setSetValues((values) => values.map((value, valueIndex) => (valueIndex === index ? Number(event.target.value) : value)))}
                  />
                </label>
              ))}
            </div>
          </div>
        ) : (
          <label className="block">
            <span className="text-xs font-black uppercase text-muted-foreground">Completed count</span>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <input className="min-w-0 flex-1 bg-transparent text-lg font-black outline-none" inputMode="decimal" min="0" type="number" value={singleValue} onChange={(event) => setSingleValue(Number(event.target.value))} />
              <span className="text-sm font-black text-muted-foreground">{task.target_unit}</span>
            </div>
          </label>
        )}

        {task.category === 'nutrition' ? (
          <label className="block">
            <span className="text-xs font-black uppercase text-muted-foreground">Nutrition notes</span>
            <textarea className="mt-2 min-h-20 w-full rounded-2xl border px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-green-500" name="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Example: rice + chicken, 2 bananas in shake, extra honey..." />
          </label>
        ) : (
          <input type="hidden" name="notes" value={notes} />
        )}

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <Progress value={progress} indicatorClassName={done ? 'bg-green-500' : 'bg-yellow-400'} />
            <div className="mt-2 flex justify-between text-xs font-bold text-muted-foreground">
              <span>
                {completed} / {task.target_value} {task.target_unit}
              </span>
              <span>{progress}%</span>
            </div>
          </div>
          <Button type="submit" variant={done ? 'secondary' : 'default'} disabled={pending} aria-label={`Save progress for ${task.title}`}>
            {done ? <Flame className="h-5 w-5 text-orange-500" /> : <Save className="h-5 w-5" />}
            Save
          </Button>
        </div>
        {state?.message ? <p className="text-xs font-bold text-green-700">{state.message}</p> : null}
      </form>
    </Card>
  );
}
