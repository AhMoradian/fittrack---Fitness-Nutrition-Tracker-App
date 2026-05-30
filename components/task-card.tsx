'use client';

import { useMemo, useState, useActionState } from 'react';
import { CheckCircle2, Flame, Plus } from 'lucide-react';
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
  const [completed, setCompleted] = useState(log?.completed_value ?? 0);
  const [state, formAction, pending] = useActionState(updateTaskProgress, null);
  const progress = useMemo(() => percentage(completed, task.target_value), [completed, task.target_value]);
  const done = progress >= 100;

  return (
    <Card className="touch-card p-4">
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="taskId" value={task.id} />
        <input type="hidden" name="completedValue" value={completed} />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black">{task.title}</h3>
              {done ? <CheckCircle2 className="h-5 w-5 fill-green-500 text-white" /> : null}
            </div>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Target: {task.target_value} {task.target_unit}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${categoryStyles[task.category]}`}>{task.category}</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div>
            <Progress value={progress} indicatorClassName={done ? 'bg-green-500' : 'bg-yellow-400'} />
            <div className="mt-2 flex justify-between text-xs font-bold text-muted-foreground">
              <span>
                {completed} / {task.target_value} {task.target_unit}
              </span>
              <span>{progress}%</span>
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            variant={done ? 'secondary' : 'default'}
            disabled={pending}
            onClick={() => setCompleted((value) => Math.min(task.target_value, value + Math.max(1, Math.ceil(task.target_value / 4))))}
            aria-label={`Add progress for ${task.title}`}
          >
            {done ? <Flame className="h-5 w-5 text-orange-500" /> : <Plus className="h-5 w-5" />}
          </Button>
        </div>
        {state?.message ? <p className="text-xs font-bold text-green-700">{state.message}</p> : null}
      </form>
    </Card>
  );
}
