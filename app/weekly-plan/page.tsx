import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { TaskEditor } from '@/components/task-editor';
import { Card } from '@/components/ui/card';
import { tasks } from '@/lib/sample-data';

const dayNames: Record<number, string> = {
  1: 'DAY 1 — PUSH',
  2: 'DAY 2 — BACK',
  3: 'DAY 3 — LEGS',
  4: 'DAY 4 — RECOVERY',
  5: 'DAY 5 — UPPER',
  6: 'DAY 6 — CONDITIONING',
  7: 'DAY 7 — RESTORE',
};

export default function WeeklyPlanPage() {
  const days = Array.from({ length: 7 }, (_, index) => index + 1);
  return (
    <div>
      <ScreenHeader eyebrow="Weekly Plan" title="Your program" subtitle="Editable weekly programming uses one tasks table with categories, target values, XP rewards, and sort order." />
      <section className="space-y-4 px-5 md:px-8">
        <TaskEditor />
        <div className="grid gap-4 md:grid-cols-2">
          {days.map((day) => {
            const dayTasks = tasks.filter((task) => task.day_index === day).sort((a, b) => a.sort_order - b.sort_order);
            return (
              <Card key={day} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">{dayNames[day]}</h2>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black">{dayTasks.length} tasks</span>
                </div>
                {dayTasks.length ? dayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="font-black">{task.title}</p>
                      <p className="text-xs font-bold capitalize text-muted-foreground">{task.category} · {task.target_value} {task.target_unit} · {task.xp_reward} XP</p>
                    </div>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
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
