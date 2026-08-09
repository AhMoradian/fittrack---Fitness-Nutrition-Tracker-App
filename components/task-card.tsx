'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Flame, Save } from 'lucide-react';
import type { DailyLog, Task } from '@/lib/types';
import { createDailyLog } from '@/lib/tracking';
import { percentage } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { NumberStepper } from '@/components/ui/number-stepper';

const categoryStyles = {
  workout: 'bg-orange-100 text-orange-700',
  nutrition: 'bg-emerald-100 text-emerald-700',
  recovery: 'bg-sky-100 text-sky-700',
  habit: 'bg-violet-100 text-violet-700',
};

export function TaskCard({
  task,
  log,
  date,
  onSave,
}: {
  task: Task;
  log?: DailyLog;
  date: string;
  onSave: (log: DailyLog) => void;
}) {
  const initialSetValues =
    task.set_targets?.map((_, index) => log?.set_values?.[index] ?? 0) ?? [];
  const [setValues, setSetValues] = useState(initialSetValues);
  const [singleValue, setSingleValue] = useState(log?.completed_value ?? 0);
  const [notes, setNotes] = useState(log?.notes ?? '');
  const [saved, setSaved] = useState(false);

  const completed = useMemo(
    () =>
      task.set_targets?.length
        ? setValues.reduce((sum, value) => sum + Number(value || 0), 0)
        : singleValue,
    [setValues, singleValue, task.set_targets?.length],
  );
  const progress = useMemo(
    () => percentage(completed, task.target_value),
    [completed, task.target_value],
  );
  const done = progress >= 100;
  const isWorkoutSets =
    task.category === 'workout' && Boolean(task.set_targets?.length);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(createDailyLog(task, date, completed, setValues, notes, log));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <Card className="touch-card min-w-0 max-w-full overflow-hidden p-4">
      <form onSubmit={handleSave} className="min-w-0 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black">{task.title}</h3>
              {done ? (
                <CheckCircle2 className="h-5 w-5 fill-green-500 text-white" />
              ) : null}
            </div>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Target: {task.target_value} {task.target_unit}
              {task.meal_time ? ` · ${task.meal_time}` : ''}
            </p>
            {task.description ? (
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                {task.description}
              </p>
            ) : null}
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-black capitalize ${categoryStyles[task.category]}`}
          >
            {task.category}
          </span>
        </div>

        {isWorkoutSets ? (
          <div className="min-w-0 overflow-hidden rounded-3xl bg-slate-50 p-3">
            <p className="mb-2 text-xs font-black uppercase text-muted-foreground">
              Log each set
            </p>
            <div className="min-w-0 grid gap-2 sm:grid-cols-2">
              {task.set_targets?.map((set, index) => (
                <label
                  key={`${task.id}-${set.label}`}
                  className="min-w-0 overflow-hidden rounded-2xl border bg-white p-3"
                >
                  <span className="flex items-center justify-between gap-2 text-xs font-black text-muted-foreground">
                    <span>{set.label}</span>
                    <span>
                      {set.note ?? `${set.target_value} ${set.target_unit}`}
                    </span>
                  </span>
                  <NumberStepper
                    wrapperClassName="mt-2"
                    className="text-base"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    aria-label={`${set.label} completed`}
                    value={setValues[index] ?? 0}
                    onValueChange={(nextValue) =>
                      setSetValues((values) =>
                        values.map((value, valueIndex) =>
                          valueIndex === index ? Number(nextValue) : value,
                        ),
                      )
                    }
                    onChange={(event) =>
                      setSetValues((values) =>
                        values.map((value, valueIndex) =>
                          valueIndex === index
                            ? Number(event.target.value)
                            : value,
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        ) : (
          <label className="block">
            <span className="text-xs font-black uppercase text-muted-foreground">
              Completed count
            </span>
            <NumberStepper
              wrapperClassName="mt-2 rounded-2xl"
              className="text-lg"
              inputMode="decimal"
              min="0"
              step={task.target_value < 10 ? '0.1' : '1'}
              value={singleValue}
              suffix={task.target_unit}
              aria-label={`Completed ${task.target_unit}`}
              onValueChange={(nextValue) => setSingleValue(Number(nextValue))}
              onChange={(event) => setSingleValue(Number(event.target.value))}
            />
          </label>
        )}

        <label className="block">
          <span className="text-xs font-black uppercase text-muted-foreground">
            Optional quick note
          </span>
          <textarea
            className="mt-2 min-h-16 w-full rounded-2xl border px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-green-500"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={
              task.category === 'nutrition'
                ? 'Food, appetite, or digestion...'
                : task.category === 'workout'
                  ? 'Difficulty, reps left, pain, or substitution...'
                  : 'Energy, sleep, pain, steps, or anything unusual...'
            }
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <Progress
              value={progress}
              indicatorClassName={done ? 'bg-green-500' : 'bg-yellow-400'}
            />
            <div className="mt-2 flex justify-between text-xs font-bold text-muted-foreground">
              <span>
                {completed} / {task.target_value} {task.target_unit}
              </span>
              <span>{progress}%</span>
            </div>
          </div>
          <Button
            type="submit"
            variant={done ? 'secondary' : 'default'}
            aria-label={`Save progress for ${task.title}`}
          >
            {done ? (
              <Flame className="h-5 w-5 text-orange-500" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Save
          </Button>
        </div>
        {saved ? (
          <p className="text-xs font-bold text-green-700">
            Progress saved.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
