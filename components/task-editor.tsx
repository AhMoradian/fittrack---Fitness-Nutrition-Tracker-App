'use client';

import { useActionState } from 'react';
import { PlusCircle } from 'lucide-react';
import { upsertProgramTask } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TaskEditor() {
  const [state, action, pending] = useActionState(upsertProgramTask, null);
  return (
    <Card>
      <h2 className="text-xl font-black">Add unified task</h2>
      <p className="mt-1 text-sm font-medium text-muted-foreground">Workouts, nutrition, recovery, supplements, and future activities all use the same task table.</p>
      <form action={action} className="mt-4 grid gap-3 md:grid-cols-6">
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500 md:col-span-2" name="title" placeholder="Task name" required />
        <select className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="category" defaultValue="workout">
          <option value="workout">Workout</option>
          <option value="nutrition">Nutrition</option>
          <option value="recovery">Recovery</option>
          <option value="habit">Habit</option>
        </select>
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="targetValue" type="number" min="1" placeholder="Target" required />
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="targetUnit" placeholder="Unit" required />
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="xpReward" type="number" min="0" defaultValue="10" aria-label="XP reward" />
        <input type="hidden" name="dayIndex" value="1" />
        <Button className="md:col-span-6" disabled={pending}><PlusCircle className="h-5 w-5" /> Save task</Button>
        {state?.message ? <p className="text-sm font-bold text-green-700 md:col-span-6">{state.message}</p> : null}
      </form>
    </Card>
  );
}
