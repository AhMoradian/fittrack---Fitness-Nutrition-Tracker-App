'use client';

import { useState } from 'react';
import { Bot, Pencil, Trash2 } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { TaskEditor } from '@/components/task-editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFitTrack } from '@/lib/fittrack-store';
import { coachPlan, programRules } from '@/lib/sample-data';
import type { Task } from '@/lib/types';

const dayNames: Record<number, string> = {
  1: 'DAY 1 — STRENGTH A',
  2: 'DAY 2 — HANDSTAND, L-SIT & MOBILITY',
  3: 'DAY 3 — STRENGTH B',
  4: 'DAY 4 — ACTIVE RECOVERY',
  5: 'DAY 5 — STRENGTH A',
  6: 'DAY 6 — HANDSTAND, L-SIT & MOBILITY',
  7: 'DAY 7 — REST',
};

const dayNotes: Record<number, string> = {
  1: 'Full body with controlled pull-ups and push-ups.',
  2: 'Low-fatigue balance practice and comfortable flexibility.',
  3: 'Full body with slow pulling, dips, squats, and overhead strength.',
  4: 'Move gently and restore.',
  5: 'Repeat Strength A without testing maximum reps.',
  6: 'Repeat short skill holds with clean technique.',
  7: 'Recover and complete the weekly check-in.',
};

function TaskRow({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-black">{task.title}</p>
        <p className="text-xs font-bold capitalize text-muted-foreground">
          {task.category} · {task.target_value} {task.target_unit} · {task.xp_reward} XP
        </p>
        {task.description ? (
          <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{task.description}</p>
        ) : null}
        {task.set_targets?.length ? (
          <p className="mt-1 text-xs font-black text-green-700">{task.set_targets.length} sets</p>
        ) : null}
      </div>
      <div className="flex gap-1">
        <Button type="button" size="icon" variant="ghost" onClick={onEdit} aria-label={`Edit ${task.title}`}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={onDelete} aria-label={`Delete ${task.title}`}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}

export default function WeeklyPlanPage() {
  const { data, saveTask, deleteTask } = useFitTrack();
  const [editingTask, setEditingTask] = useState<Task>();
  const days = Array.from({ length: 7 }, (_, index) => index + 1);
  const dailyTasks = data.tasks
    .filter((task) => task.category !== 'workout')
    .sort((a, b) => a.sort_order - b.sort_order);

  const confirmDelete = (task: Task) => {
    if (window.confirm(`Delete "${task.title}" and its saved history?`)) {
      deleteTask(task.id);
      if (editingTask?.id === task.id) setEditingTask(undefined);
    }
  };

  return (
    <div>
      <ScreenHeader
        eyebrow="Weekly Plan"
        title="Your home program"
        subtitle="Edit the plan whenever your exercises, equipment, or nutrition routine changes."
      />
      <section className="space-y-4 px-4 sm:px-5 md:px-8">
        <Card className="border-green-200 bg-green-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-green-700">
                Coach plan v{coachPlan.version} · Updated {coachPlan.updatedAt}
              </p>
              <h2 className="mt-1 text-xl font-black">{coachPlan.phase}</h2>
              <p className="mt-1 text-sm font-bold text-slate-600">
                {coachPlan.focus}
              </p>
            </div>
            <span className="w-fit rounded-2xl bg-white px-4 py-3 text-sm font-black text-green-800 shadow-sm">
              {coachPlan.nutrition}
            </span>
          </div>
          <p className="mt-3 text-xs font-bold text-muted-foreground">
            New coach-plan versions install automatically while your logs,
            measurements, photos, check-ins, and custom tasks stay intact.
          </p>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
          <Card className="bg-slate-950 text-white">
            <Bot className="h-8 w-8 text-green-300" />
            <h2 className="mt-3 text-xl font-black">Progression rules</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
              Keep the plan simple enough to follow, then increase reps or quality gradually.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {programRules.map((rule) => (
                <span key={rule} className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold">{rule}</span>
              ))}
            </div>
          </Card>
          <TaskEditor
            task={editingTask}
            onSave={(task) => {
              saveTask(task);
              setEditingTask(undefined);
            }}
            onCancel={() => setEditingTask(undefined)}
          />
        </div>

        <Card>
          <h2 className="text-lg font-black">Daily nutrition, recovery & habits</h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">These tasks appear every day.</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {dailyTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={() => {
                  setEditingTask(task);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDelete={() => confirmDelete(task)}
              />
            ))}
          </div>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          {days.map((day) => {
            const dayTasks = data.tasks
              .filter((task) => task.day_index === day && task.category === 'workout')
              .sort((a, b) => a.sort_order - b.sort_order);
            return (
              <Card key={day} className="space-y-3">
                <div>
                  <h2 className="text-lg font-black">{dayNames[day]}</h2>
                  <p className="mt-1 text-sm font-bold text-muted-foreground">{dayNotes[day]}</p>
                </div>
                {dayTasks.length ? (
                  dayTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onEdit={() => {
                        setEditingTask(task);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onDelete={() => confirmDelete(task)}
                    />
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed p-4 text-sm font-bold text-muted-foreground">No workout tasks.</p>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
