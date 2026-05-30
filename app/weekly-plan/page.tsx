import { Bot, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { TaskEditor } from '@/components/task-editor';
import { Card } from '@/components/ui/card';
import { getProgramData } from '@/lib/data';
import { programRules } from '@/lib/sample-data';

const dayNames: Record<number, string> = {
  1: 'DAY 1 — PUSH (Chest, Shoulders, Triceps)',
  2: 'DAY 2 — BACK & POSTURE',
  3: 'DAY 3 — LEGS & CORE',
  4: 'DAY 4 — ACTIVE RECOVERY',
  5: 'DAY 5 — PUSH (Repeat)',
  6: 'DAY 6 — BACK (Repeat)',
  7: 'DAY 7 — REST',
};

const dayNotes: Record<number, string> = {
  1: 'Rest 60–90 sec between sets.',
  2: 'Focus: straight back, chest open, shoulder blades back.',
  3: 'Build legs and core with backpack loading where noted.',
  4: 'Stretch, hang, walk 20 min, open chest, and loosen hip flexors.',
  5: 'Try more reps, more control, or shorter rest.',
  6: 'Focus on pull-up progress, posture, and slow movements.',
  7: 'Sleep well and recover.',
};

export default async function WeeklyPlanPage() {
  const { tasks } = await getProgramData();
  const days = Array.from({ length: 7 }, (_, index) => index + 1);
  return (
    <div>
      <ScreenHeader eyebrow="Weekly Plan" title="Home muscle-building program" subtitle="Every workout, set target, nutrition item, and recovery habit remains a unified AI-ready task so a future coach can adjust exercises, sets, reps, and meals without redesigning the data model." />
      <section className="space-y-4 px-4 sm:px-5 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
          <Card className="bg-slate-950 text-white">
            <Bot className="h-8 w-8 text-green-300" />
            <h2 className="mt-3 text-xl font-black">AI-ready progression rules</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-300">Exercise type, daily order, set targets, units, and descriptions are structured fields. The next AI feature can safely change them per week.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {programRules.map((rule) => <span key={rule} className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold">{rule}</span>)}
            </div>
          </Card>
          <TaskEditor />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {days.map((day) => {
            const dayTasks = tasks.filter((task) => task.day_index === day && task.category === 'workout').sort((a, b) => a.sort_order - b.sort_order);
            return (
              <Card key={day} className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-black">{dayNames[day]}</h2>
                    <p className="mt-1 text-sm font-bold text-muted-foreground">{dayNotes[day]}</p>
                  </div>
                  <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-black">{dayTasks.length} tasks</span>
                </div>
                {dayTasks.length ? dayTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center">
                    <GripVertical className="hidden h-5 w-5 text-muted-foreground sm:block" />
                    <div className="min-w-0 flex-1">
                      <p className="font-black">{task.title}</p>
                      <p className="text-xs font-bold capitalize text-muted-foreground">{task.category} · {task.target_value} {task.target_unit} · {task.xp_reward} XP</p>
                      {task.description ? <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{task.description}</p> : null}
                      {task.set_targets?.length ? <p className="mt-1 text-xs font-black text-green-700">{task.set_targets.map((set) => `${set.label}: ${set.note ?? `${set.target_value} ${set.target_unit}`}`).join(' · ')}</p> : null}
                    </div>
                    <div className="flex gap-3 text-muted-foreground">
                      <Pencil className="h-4 w-4" />
                      <Trash2 className="h-4 w-4" />
                    </div>
                  </div>
                )) : <p className="rounded-2xl border border-dashed p-4 text-sm font-bold text-muted-foreground">No tasks yet. Add a task and assign it to this day.</p>}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
