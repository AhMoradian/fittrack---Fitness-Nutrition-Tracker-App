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
      <h2 className="text-xl font-black">Add AI-ready task</h2>
      <p className="mt-1 text-sm font-medium text-muted-foreground">Use this for workouts, nutrition, recovery, supplements, or future AI-generated activities. Set details can be expanded by AI in the next feature.</p>
      <form action={action} className="mt-4 grid gap-3 md:grid-cols-6">
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500 md:col-span-2" name="title" placeholder="Task name" required />
        <select className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="category" defaultValue="workout">
          <option value="workout">Workout</option>
          <option value="nutrition">Nutrition</option>
          <option value="recovery">Recovery</option>
          <option value="habit">Habit</option>
        </select>
        <select className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="dayIndex" defaultValue="1" aria-label="Day index">
          {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => <option key={day} value={day}>Day {day}</option>)}
        </select>
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="targetValue" type="number" min="1" placeholder="Target" required />
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" name="targetUnit" placeholder="Unit" required />
        <input className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500 md:col-span-2" name="xpReward" type="number" min="0" defaultValue="10" aria-label="XP reward" />
        <textarea className="min-h-24 rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500 md:col-span-4" name="description" placeholder="Details, meal ingredients, posture cues, or progression notes" />
        <Button className="md:col-span-6" disabled={pending}><PlusCircle className="h-5 w-5" /> Save task</Button>
        {state?.message ? <p className="text-sm font-bold text-green-700 md:col-span-6">{state.message}</p> : null}
      </form>
    </Card>
  );
}
