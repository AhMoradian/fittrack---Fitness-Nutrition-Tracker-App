'use client';

import { Zap } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { ProgressRing } from '@/components/progress-ring';
import { TaskCard } from '@/components/task-card';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFitTrack } from '@/lib/fittrack-store';
import {
  getDailySummary,
  getUserStats,
  localDateKey,
  planDayForDate,
  tasksForDate,
} from '@/lib/tracking';
import { xpIntoLevel } from '@/lib/utils';
import type { TaskCategory } from '@/lib/types';

const sections: {
  key: TaskCategory;
  title: string;
  emoji: string;
  note: string;
}[] = [
  { key: 'workout', title: 'Workout Tasks', emoji: '💪', note: 'Strength and performance' },
  { key: 'nutrition', title: 'Nutrition Tasks', emoji: '🥗', note: 'Fuel the plan' },
  { key: 'recovery', title: 'Recovery Tasks', emoji: '🧘', note: 'Sleep and mobility' },
  { key: 'habit', title: 'Habit Tasks', emoji: '✨', note: 'Small daily wins' },
];

const planDayNames: Record<number, string> = {
  1: 'Push',
  2: 'Back & posture',
  3: 'Legs & core',
  4: 'Active recovery',
  5: 'Push progression',
  6: 'Back progression',
  7: 'Rest',
};

export default function TodayPage() {
  const { data, saveLog, ready } = useFitTrack();
  const today = localDateKey();
  const todayTasks = tasksForDate(data.tasks, today);
  const summary = getDailySummary(data.tasks, data.daily_logs, today);
  const stats = getUserStats(data.tasks, data.daily_logs, data.started_at, today);
  const planDay = planDayForDate(today);
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div>
      <ScreenHeader
        eyebrow={dateLabel}
        title="Win the day"
        subtitle={`Plan Day ${planDay}: ${planDayNames[planDay]}. Your progress is private and saved on this device.`}
      />

      {!ready ? (
        <p className="px-5 text-sm font-bold text-muted-foreground">Loading your tracker…</p>
      ) : null}

      <section className="grid gap-4 px-4 sm:px-5 md:grid-cols-[1.1fr_1fr] md:px-8">
        <Card className="confetti-bg overflow-hidden border-green-200 bg-green-50/90">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-green-700">Daily Completion</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                {summary.successful ? 'Successful day!' : 'Keep going!'}
              </h2>
              <p className="mt-2 text-sm font-bold text-green-800">Reach 70% to keep your streak alive.</p>
            </div>
            <ProgressRing value={summary.completion} label="done" />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-xs font-black uppercase text-muted-foreground">Current Streak</p>
            <p className="mt-2 text-3xl font-black">🔥 {stats.current_streak}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-black uppercase text-muted-foreground">Best Streak</p>
            <p className="mt-2 text-3xl font-black">🏆 {stats.best_streak}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-black uppercase text-muted-foreground">Daily Score</p>
            <p className="mt-2 text-3xl font-black">{summary.completion}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-black uppercase text-muted-foreground">XP Earned</p>
            <p className="mt-2 flex items-center gap-1 text-3xl font-black">
              <Zap className="h-7 w-7 fill-yellow-400 text-yellow-500" />
              {summary.earned_xp}
            </p>
          </Card>
        </div>

        <Card className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-muted-foreground">Level {stats.current_level}</p>
              <h3 className="text-xl font-black">{stats.total_xp.toLocaleString()} total XP</h3>
            </div>
            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
              {100 - xpIntoLevel(stats.total_xp)} XP to next
            </span>
          </div>
          <Progress value={xpIntoLevel(stats.total_xp)} className="mt-4 h-4" indicatorClassName="bg-yellow-400" />
        </Card>
      </section>

      <section className="mt-6 space-y-7 px-4 sm:px-5 md:px-8">
        {ready ? sections.map((section) => {
          const groupedTasks = todayTasks.filter((task) => task.category === section.key);
          if (!groupedTasks.length) return null;
          return (
            <div key={section.key} className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-black">{section.emoji} {section.title}</h2>
                  <p className="text-sm font-bold text-muted-foreground">{section.note}</p>
                </div>
                <span className="text-xs font-black text-muted-foreground">{groupedTasks.length} tasks</span>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {groupedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    date={today}
                    log={data.daily_logs.find(
                      (log) => log.task_id === task.id && log.date === today,
                    )}
                    onSave={saveLog}
                  />
                ))}
              </div>
            </div>
          );
        }) : null}
      </section>
    </div>
  );
}
