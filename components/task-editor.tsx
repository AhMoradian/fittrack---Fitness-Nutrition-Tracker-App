'use client';

import { PlusCircle, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NumberStepper } from '@/components/ui/number-stepper';
import type { Task, TaskCategory } from '@/lib/types';

export function TaskEditor({
  task,
  onSave,
  onCancel,
}: {
  task?: Task;
  onSave: (task: Task) => void;
  onCancel?: () => void;
}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const targetValue = Number(form.get('targetValue'));
    const targetUnit = String(form.get('targetUnit'));
    const category = String(form.get('category')) as TaskCategory;
    const setCount = Math.max(0, Number(form.get('setCount') || 0));
    const perSetTarget = setCount ? Math.max(1, Math.round(targetValue / setCount)) : 0;
    const nextTask: Task = {
      id: task?.id ?? crypto.randomUUID(),
      program_id: task?.program_id ?? 'custom-user-program',
      title: String(form.get('title')).trim(),
      category,
      target_value: targetValue,
      target_unit: targetUnit.trim(),
      xp_reward: Number(form.get('xpReward')),
      sort_order: task?.sort_order ?? Date.now(),
      day_index: Number(form.get('dayIndex')),
      created_at: task?.created_at ?? new Date().toISOString(),
      description: String(form.get('description')).trim() || undefined,
      meal_time: String(form.get('mealTime')).trim() || undefined,
      ai_configurable: true,
      set_targets:
        category === 'workout' && setCount
          ? Array.from({ length: setCount }, (_, index) => ({
              label: `Set ${index + 1}`,
              target_value: perSetTarget,
              target_unit: targetUnit.trim(),
            }))
          : undefined,
    };
    onSave(nextTask);
    if (!task) event.currentTarget.reset();
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">{task ? 'Edit task' : 'Add a task'}</h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Workout tasks follow their selected plan day. Nutrition, recovery, and habit tasks appear every day.
          </p>
        </div>
        {task && onCancel ? (
          <Button type="button" size="icon" variant="ghost" onClick={onCancel} aria-label="Cancel editing">
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>
      <form key={task?.id ?? 'new'} onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-6">
        <input
          className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-teal-600 md:col-span-2"
          name="title"
          placeholder="Task name"
          defaultValue={task?.title}
          required
        />
        <select
          className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-teal-600"
          name="category"
          defaultValue={task?.category ?? 'workout'}
        >
          <option value="workout">Workout</option>
          <option value="nutrition">Nutrition</option>
          <option value="recovery">Recovery</option>
          <option value="habit">Habit</option>
        </select>
        <select
          className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-teal-600"
          name="dayIndex"
          defaultValue={String(task?.day_index ?? 1)}
          aria-label="Plan day"
        >
          {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => (
            <option key={day} value={day}>Plan Day {day}</option>
          ))}
        </select>
        <NumberStepper
          wrapperClassName="rounded-2xl"
          name="targetValue"
          min="0.1"
          step="0.1"
          placeholder="Total target"
          defaultValue={task?.target_value}
          required
        />
        <input
          className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-teal-600"
          name="targetUnit"
          placeholder="Unit"
          defaultValue={task?.target_unit}
          required
        />
        <NumberStepper
          wrapperClassName="rounded-2xl"
          name="xpReward"
          min="0"
          defaultValue={task?.xp_reward ?? 10}
          aria-label="XP reward"
        />
        <NumberStepper
          wrapperClassName="rounded-2xl"
          name="setCount"
          min="0"
          max="10"
          defaultValue={task?.set_targets?.length ?? 0}
          placeholder="Workout sets"
          aria-label="Number of workout sets"
        />
        <input
          className="rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-teal-600 md:col-span-2"
          name="mealTime"
          placeholder="Meal time (optional)"
          defaultValue={task?.meal_time}
        />
        <textarea
          className="min-h-24 rounded-2xl border bg-white px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-teal-600 md:col-span-4"
          name="description"
          placeholder="Exercise cues, meal details, or progression notes"
          defaultValue={task?.description}
        />
        <Button className="md:col-span-6">
          {task ? <Save className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
          {task ? 'Save changes' : 'Add task'}
        </Button>
      </form>
    </Card>
  );
}
