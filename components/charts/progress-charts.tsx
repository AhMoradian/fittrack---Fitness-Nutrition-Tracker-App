'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import type { BodyMetric, DailySummary } from '@/lib/types';

export function ProgressCharts({
  summaries,
  metrics,
}: {
  summaries: DailySummary[];
  metrics: BodyMetric[];
}) {
  const trendData = summaries.map((day) => ({
    ...day,
    label: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
      new Date(`${day.date}T12:00:00`),
    ),
  }));
  const weightData = metrics
    .filter((metric) => typeof metric.weight === 'number')
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((metric) => ({
      ...metric,
      label: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
        new Date(`${metric.date}T12:00:00`),
      ),
    }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="min-h-72">
        <h2 className="mb-4 text-lg font-black">Completion trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="completion" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#007173" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#007173" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="completion" stroke="#16a34a" strokeWidth={3} fill="url(#completion)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card className="min-h-72">
        <h2 className="mb-4 text-lg font-black">Weight trend</h2>
        {weightData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-[220px] place-items-center text-sm font-bold text-muted-foreground">Add your first weight entry.</div>
        )}
      </Card>
      <Card className="min-h-72 md:col-span-2">
        <h2 className="mb-4 text-lg font-black">Workout vs nutrition adherence</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="workout" fill="#fb923c" radius={[12, 12, 0, 0]} />
            <Bar dataKey="nutrition" fill="#34d399" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
