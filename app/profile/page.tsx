'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cloud, CloudOff, Download, HardDrive, LogOut, Save, Upload } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberStepper } from '@/components/ui/number-stepper';
import { useFitTrack } from '@/lib/fittrack-store';
import { adhdTips, programRules } from '@/lib/sample-data';
import { latestMetric } from '@/lib/tracking';
import type { FitTrackData, UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const {
    data,
    saveProfile,
    importData,
    cloudConfigured,
    userEmail,
    syncStatus,
    signOut,
  } = useFitTrack();
  const [message, setMessage] = useState('');
  const currentMetric = latestMetric(data.body_metrics);

  const handleProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextProfile: UserProfile = {
      name: String(form.get('name')).trim(),
      age: String(form.get('age')).trim(),
      height: String(form.get('height')).trim(),
      goal: String(form.get('goal')).trim(),
      weekly_goal: String(form.get('weeklyGoal')).trim(),
      equipment: String(form.get('equipment'))
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    saveProfile(nextProfile);
    setMessage('Profile saved.');
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fittrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Backup exported.');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as FitTrackData;
      importData(parsed);
      setMessage('Backup restored.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not import this backup.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div>
      <ScreenHeader
        eyebrow="Profile"
        title={data.profile.name ? `${data.profile.name}'s setup` : 'Your setup'}
        subtitle={
          userEmail
            ? 'Your private progress is backed up and synced across your signed-in devices.'
            : 'Your progress is private and currently stored on this device.'
        }
      />
      <section className="space-y-4 px-4 sm:px-5 md:px-8">
        <Card className={userEmail ? 'border-green-200 bg-green-50' : undefined}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              {userEmail ? (
                <Cloud className="mt-1 h-7 w-7 text-green-600" />
              ) : (
                <CloudOff className="mt-1 h-7 w-7 text-slate-500" />
              )}
              <div>
                <h2 className="text-xl font-black">
                  {userEmail ? 'Cloud sync connected' : 'Connect your devices'}
                </h2>
                <p className="mt-1 text-sm font-bold text-muted-foreground">
                  {userEmail
                    ? `${userEmail} · ${syncStatus === 'saving' ? 'Saving changes…' : syncStatus === 'error' ? 'Sync needs attention' : 'All changes synced'}`
                    : cloudConfigured
                      ? 'Sign in with the same email on your phone and computer.'
                      : 'Cloud sync is not configured yet; local saving still works.'}
                </p>
              </div>
            </div>
            {userEmail ? (
              <Button type="button" variant="secondary" onClick={() => void signOut()}>
                <LogOut className="h-5 w-5" /> Sign out
              </Button>
            ) : cloudConfigured ? (
              <Button asChild>
                <Link href="/login">
                  <Cloud className="h-5 w-5" /> Enable sync
                </Link>
              </Button>
            ) : null}
          </div>
        </Card>

        <Card className="bg-slate-950 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-green-400 text-4xl">💪</div>
            <div>
              <p className="text-sm font-black uppercase text-green-300">Home muscle building</p>
              <h2 className="text-2xl font-black">{data.profile.goal}</h2>
              <p className="text-sm font-bold text-slate-300">{data.profile.weekly_goal}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Personal settings</h2>
          <form
            key={`${JSON.stringify(data.profile)}-${currentMetric?.weight ?? ''}`}
            onSubmit={handleProfile}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            {[
              ['Name', 'name', data.profile.name, 'text'],
              ['Age', 'age', data.profile.age, 'number'],
              ['Height (cm)', 'height', data.profile.height, 'number'],
              ['Current weight', 'currentWeight', currentMetric?.weight?.toString() ?? 'Not recorded', 'text'],
            ].map(([label, name, value, type]) => (
              <label key={name}>
                <span className="mb-2 block text-sm font-bold">{label}</span>
                {type === 'number' ? (
                  <NumberStepper
                    name={name}
                    step="0.1"
                    min="0"
                    defaultValue={value}
                    aria-label={label}
                    required
                  />
                ) : (
                  <input
                    className="w-full rounded-xl border bg-white px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-100"
                    name={name}
                    type={type}
                    defaultValue={value}
                    disabled={name === 'currentWeight'}
                    required={name !== 'currentWeight'}
                  />
                )}
              </label>
            ))}
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Main goal</span>
              <input className="w-full rounded-xl border px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-green-500" name="goal" defaultValue={data.profile.goal} required />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Weekly goal</span>
              <input className="w-full rounded-xl border px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-green-500" name="weeklyGoal" defaultValue={data.profile.weekly_goal} required />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Equipment, separated by commas</span>
              <textarea className="min-h-24 w-full rounded-xl border px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-green-500" name="equipment" defaultValue={data.profile.equipment.join(', ')} />
            </label>
            <Button className="sm:col-span-2"><Save className="h-5 w-5" /> Save profile</Button>
          </form>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="text-xl font-black">Muscle-gain rules</h2>
            <div className="mt-4 space-y-3">
              {programRules.map((rule) => <div key={rule} className="rounded-2xl bg-slate-50 p-3 font-bold">{rule}</div>)}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Consistency tips</h2>
            <div className="mt-4 space-y-3">
              {adhdTips.map((tip) => <div key={tip} className="rounded-2xl bg-yellow-50 p-3 font-bold">{tip}</div>)}
            </div>
          </Card>
        </div>

        <Card>
          <HardDrive className="h-7 w-7 text-green-600" />
          <h2 className="mt-2 text-xl font-black">Your data</h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {userEmail
              ? 'Cloud sync protects your progress, and a downloadable backup gives you an extra copy.'
              : 'Browser storage is private and simple, but clearing browser data removes it. Export a backup regularly.'}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button type="button" size="lg" onClick={exportData}>
              <Download className="h-5 w-5" /> Export backup
            </Button>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-bold text-slate-900">
              <Upload className="h-5 w-5" /> Restore backup
              <input type="file" accept="application/json,.json" className="sr-only" onChange={handleImport} />
            </label>
          </div>
          {message ? <p className="mt-3 text-sm font-bold text-green-700">{message}</p> : null}
        </Card>
      </section>
    </div>
  );
}
