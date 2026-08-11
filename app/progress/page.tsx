'use client';

import { useState } from 'react';
import { Award, Camera, Flame, Trash2, Trophy, Upload, Zap } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { ProgressCharts } from '@/components/charts/progress-charts';
import { WeightTracker } from '@/components/weight-tracker';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFitTrack } from '@/lib/fittrack-store';
import {
  averageScore,
  getAchievements,
  getPeriodSummaries,
  getTrackingSummaries,
  getUserStats,
  localDateKey,
} from '@/lib/tracking';
import { xpIntoLevel } from '@/lib/utils';

async function resizeImage(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = dataUrl;
  });
  const scale = Math.min(1, 700 / image.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.72);
}

export default function ProgressPage() {
  const { data, saveMetric, addPhoto, deletePhoto } = useFitTrack();
  const [photoMessage, setPhotoMessage] = useState('');
  const today = localDateKey();
  const summaries = getTrackingSummaries(data.tasks, data.daily_logs, data.started_at, today);
  const recentSummaries = getPeriodSummaries(summaries, 30);
  const stats = getUserStats(data.tasks, data.daily_logs, data.started_at, today);
  const achievements = getAchievements(
    data.tasks,
    data.daily_logs,
    data.body_metrics,
    data.started_at,
    today,
  );
  const weeklyScore = averageScore(getPeriodSummaries(summaries, 7));
  const monthlyScore = averageScore(recentSummaries);
  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await resizeImage(file);
      addPhoto({ date: today, image_url: imageUrl });
      setPhotoMessage('Photo saved.');
    } catch {
      setPhotoMessage('Could not process that photo.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div>
      <ScreenHeader
        eyebrow="Progress"
        title="Proof you are changing"
        subtitle="Every number below is calculated from the tasks and measurements you actually save."
      />
      <section className="space-y-4 px-4 sm:px-5 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4"><Flame className="h-6 w-6 text-orange-500" /><p className="mt-2 text-2xl font-black">{stats.current_streak}</p><p className="text-xs font-black uppercase text-muted-foreground">Current streak</p></Card>
          <Card className="p-4"><Trophy className="h-6 w-6 text-yellow-500" /><p className="mt-2 text-2xl font-black">{stats.best_streak}</p><p className="text-xs font-black uppercase text-muted-foreground">Best streak</p></Card>
          <Card className="p-4"><Zap className="h-6 w-6 text-yellow-500" /><p className="mt-2 text-2xl font-black">{stats.total_xp}</p><p className="text-xs font-black uppercase text-muted-foreground">Total XP</p></Card>
          <Card className="p-4"><Award className="h-6 w-6 text-teal-700" /><p className="mt-2 text-2xl font-black">{achievements.filter((achievement) => achievement.unlocked_at).length}</p><p className="text-xs font-black uppercase text-muted-foreground">Badges</p></Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-black uppercase text-muted-foreground">7-day score</p><h2 className="text-2xl font-black">{weeklyScore} / 100</h2></div>
            <div className="text-right"><p className="text-xs font-black uppercase text-muted-foreground">30-day score</p><h2 className="text-2xl font-black">{monthlyScore} / 100</h2></div>
          </div>
          <Progress value={xpIntoLevel(stats.total_xp)} className="mt-5 h-4" indicatorClassName="bg-yellow-400" />
          <p className="mt-2 text-sm font-bold text-muted-foreground">Level {stats.current_level} · {100 - xpIntoLevel(stats.total_xp)} XP until the next level</p>
        </Card>

        <ProgressCharts summaries={recentSummaries} metrics={data.body_metrics} />

        <div className="grid gap-4 lg:grid-cols-2">
          <WeightTracker onSave={saveMetric} />
          <Card>
            <Camera className="h-7 w-7 text-teal-700" />
            <h2 className="mt-2 text-xl font-black">Progress photos</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">Photos are compressed and included in your private saved progress.</p>
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 font-black text-white">
              <Upload className="h-5 w-5" /> Add today’s photo
              <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
            </label>
            {photoMessage ? <p className="mt-2 text-sm font-bold text-teal-800">{photoMessage}</p> : null}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {data.progress_photos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-2xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.image_url} alt={`Progress from ${photo.date}`} className="aspect-[3/4] w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-slate-950/70 p-2 text-xs font-bold text-white">
                    <span>{photo.date}</span>
                    <button type="button" onClick={() => deletePhoto(photo.id)} aria-label="Delete photo"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            {!data.progress_photos.length ? <p className="mt-6 text-center text-sm font-bold text-muted-foreground">No photos yet.</p> : null}
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-black">Achievement history</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`rounded-2xl p-4 ${achievement.unlocked_at ? 'bg-yellow-50' : 'bg-slate-50 opacity-70'}`}>
                <div className="flex items-center gap-3"><span className="text-3xl">{achievement.icon}</span><div><p className="font-black">{achievement.title}</p><p className="text-xs font-bold text-muted-foreground">{achievement.description}</p></div></div>
                <p className="mt-3 text-xs font-black text-muted-foreground">{achievement.unlocked_at ? `Unlocked ${achievement.unlocked_at}` : `Goal: ${achievement.condition_value} ${achievement.condition_type}`}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Measurement history</h2>
          <div className="mt-4 space-y-3">
            {[...data.body_metrics].sort((a, b) => b.date.localeCompare(a.date)).map((metric) => (
              <div key={metric.id} className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold sm:grid-cols-4">
                <span>{metric.date}</span>
                <span>{metric.weight !== undefined ? `${metric.weight} kg` : '— weight'}</span>
                <span>{metric.waist !== undefined ? `${metric.waist} cm waist` : '— waist'}</span>
                <span>{metric.arm !== undefined ? `${metric.arm} cm arm` : '— arm'}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
