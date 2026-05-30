'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, Bar, BarChart } from 'recharts';
import { Card } from '@/components/ui/card';
import { trendData } from '@/lib/sample-data';

export function ProgressCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="min-h-72">
        <h2 className="mb-4 text-lg font-black">Completion Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="completion" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="completion" stroke="#16a34a" strokeWidth={3} fill="url(#completion)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card className="min-h-72">
        <h2 className="mb-4 text-lg font-black">Weight Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card className="min-h-72 md:col-span-2">
        <h2 className="mb-4 text-lg font-black">Workout vs Nutrition Adherence</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="workout" fill="#fb923c" radius={[12, 12, 0, 0]} />
            <Bar dataKey="nutrition" fill="#34d399" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
