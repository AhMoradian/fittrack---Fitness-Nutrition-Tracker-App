import { Award, Camera, Flame, Trophy, Zap } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { ProgressCharts } from '@/components/charts/progress-charts';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { achievements, bodyMetrics, getDailySummary } from '@/lib/sample-data';
import { xpIntoLevel } from '@/lib/utils';

export default function ProgressPage() {
  const summary = getDailySummary();
  return (
    <div>
      <ScreenHeader eyebrow="Progress" title="Proof you are changing" subtitle="Trends, photos, measurements, achievements, and scoring all roll up from the unified daily_logs table." />
      <section className="space-y-4 px-5 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4"><Flame className="h-6 w-6 text-orange-500" /><p className="mt-2 text-2xl font-black">{summary.stats.current_streak}</p><p className="text-xs font-black uppercase text-muted-foreground">Current Streak</p></Card>
          <Card className="p-4"><Trophy className="h-6 w-6 text-yellow-500" /><p className="mt-2 text-2xl font-black">{summary.stats.best_streak}</p><p className="text-xs font-black uppercase text-muted-foreground">Best Streak</p></Card>
          <Card className="p-4"><Zap className="h-6 w-6 text-yellow-500" /><p className="mt-2 text-2xl font-black">{summary.stats.total_xp}</p><p className="text-xs font-black uppercase text-muted-foreground">Total XP</p></Card>
          <Card className="p-4"><Award className="h-6 w-6 text-green-600" /><p className="mt-2 text-2xl font-black">{achievements.filter((achievement) => achievement.unlocked_at).length}</p><p className="text-xs font-black uppercase text-muted-foreground">Badges</p></Card>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-black uppercase text-muted-foreground">Weekly Score</p><h2 className="text-2xl font-black">86 / 100</h2></div>
            <div className="text-right"><p className="text-xs font-black uppercase text-muted-foreground">Monthly Score</p><h2 className="text-2xl font-black">82 / 100</h2></div>
          </div>
          <Progress value={xpIntoLevel(summary.stats.total_xp)} className="mt-5 h-4" indicatorClassName="bg-yellow-400" />
          <p className="mt-2 text-sm font-bold text-muted-foreground">Level {summary.stats.current_level} · {100 - xpIntoLevel(summary.stats.total_xp)} XP until next level</p>
        </Card>
        <ProgressCharts />
        <Card>
          <h2 className="text-xl font-black">Achievement History</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`rounded-2xl p-4 ${achievement.unlocked_at ? 'bg-yellow-50' : 'bg-slate-50 opacity-70'}`}>
                <div className="flex items-center gap-3"><span className="text-3xl">{achievement.icon}</span><div><p className="font-black">{achievement.title}</p><p className="text-xs font-bold text-muted-foreground">{achievement.description}</p></div></div>
                <p className="mt-3 text-xs font-black text-muted-foreground">{achievement.unlocked_at ? `Unlocked ${achievement.unlocked_at}` : `${achievement.condition_type}: ${achievement.condition_value}`}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Progress Photos Timeline</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((photo) => <div key={photo} className="grid aspect-[3/4] place-items-center rounded-3xl bg-gradient-to-br from-green-100 to-yellow-100"><Camera className="h-8 w-8 text-green-700" /></div>)}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Body Measurement History</h2>
          <div className="mt-4 space-y-3">
            {bodyMetrics.slice(-4).map((metric) => (
              <div key={metric.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm font-bold">
                <span>{metric.date}</span><span>{metric.weight} kg</span><span>{metric.waist?.toFixed(1)} cm waist</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
