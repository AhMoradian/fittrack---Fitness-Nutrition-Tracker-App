'use client';

import { useMemo, useState } from 'react';
import { CalendarCheck2, Clipboard, Save, Send } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NumberStepper } from '@/components/ui/number-stepper';
import { useFitTrack } from '@/lib/fittrack-store';
import { localDateKey } from '@/lib/tracking';
import type { WeeklyCheckIn } from '@/lib/types';

const optionalNumber = (value: FormDataEntryValue | null) => {
  const text = String(value ?? '').trim();
  return text ? Number(text) : undefined;
};

const fieldClass =
  'mt-2 w-full rounded-xl border bg-white px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-green-500';

function coachSummary(checkIn: WeeklyCheckIn) {
  return [
    `FitTrack weekly check-in — week ending ${checkIn.week_ending}`,
    `Average weight: ${checkIn.average_weight ?? 'not recorded'} kg`,
    `Strength sessions: ${checkIn.strength_sessions}/3`,
    `Skill sessions: ${checkIn.skill_sessions}/2`,
    `Nutrition target days: ${checkIn.nutrition_days}/7`,
    `Average sleep: ${checkIn.average_sleep ?? 'not recorded'} hours`,
    `Energy: ${checkIn.energy}/5`,
    `Current bests — push-ups ${checkIn.pushups_max ?? '—'}, pull-ups ${checkIn.pullups_max ?? '—'}, dips ${checkIn.dips_max ?? '—'}`,
    `Skill holds — handstand ${checkIn.handstand_seconds ?? '—'} sec, tuck L-sit ${checkIn.l_sit_seconds ?? '—'} sec`,
    `Pain or discomfort: ${checkIn.pain_notes || 'none'}`,
    `Wins: ${checkIn.wins || 'none recorded'}`,
    `Challenges: ${checkIn.challenges || 'none recorded'}`,
    'Please review my results and update the next FitTrack coach-plan version.',
  ].join('\n');
}

export default function CheckInPage() {
  const { data, saveWeeklyCheckIn } = useFitTrack();
  const [message, setMessage] = useState('');
  const latest = data.weekly_check_ins[0];
  const history = useMemo(
    () =>
      [...data.weekly_check_ins].sort((a, b) =>
        b.week_ending.localeCompare(a.week_ending),
      ),
    [data.weekly_check_ins],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveWeeklyCheckIn({
      week_ending: String(form.get('weekEnding')),
      average_weight: optionalNumber(form.get('averageWeight')),
      strength_sessions: Number(form.get('strengthSessions')),
      skill_sessions: Number(form.get('skillSessions')),
      nutrition_days: Number(form.get('nutritionDays')),
      average_sleep: optionalNumber(form.get('averageSleep')),
      energy: Number(form.get('energy')),
      pushups_max: optionalNumber(form.get('pushupsMax')),
      pullups_max: optionalNumber(form.get('pullupsMax')),
      dips_max: optionalNumber(form.get('dipsMax')),
      handstand_seconds: optionalNumber(form.get('handstandSeconds')),
      l_sit_seconds: optionalNumber(form.get('lSitSeconds')),
      pain_notes: String(form.get('painNotes')).trim() || undefined,
      wins: String(form.get('wins')).trim() || undefined,
      challenges: String(form.get('challenges')).trim() || undefined,
    });
    setMessage('Weekly check-in saved.');
  };

  const copyLatest = async () => {
    if (!latest) return;
    try {
      await navigator.clipboard.writeText(coachSummary(latest));
      setMessage('Coach summary copied. Paste it into this coaching chat.');
    } catch {
      setMessage('Copy failed. Select the latest check-in details manually.');
    }
  };

  return (
    <div>
      <ScreenHeader
        eyebrow="Weekly Check-in"
        title="Fill the gaps from your daily logs"
        subtitle="Complete this once each Sunday. Your scheduled coach reads the synced week, analyzes it, and publishes the next plan automatically."
      />
      <section className="space-y-4 px-4 sm:px-5 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <div className="flex items-start gap-3">
              <CalendarCheck2 className="mt-1 h-7 w-7 text-green-600" />
              <div>
                <h2 className="text-xl font-black">Sunday review</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Use your seven-day weight average. Do not test maximum reps every
                  week; enter a best only when it happened naturally in training.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-sm font-black">
                  Week ending
                  <input
                    className={fieldClass}
                    type="date"
                    name="weekEnding"
                    defaultValue={localDateKey()}
                    max={localDateKey()}
                    required
                  />
                </label>
                <label className="text-sm font-black">
                  Average weight (kg)
                  <NumberStepper
                    wrapperClassName="mt-2"
                    name="averageWeight"
                    min="30"
                    max="200"
                    step="0.1"
                    placeholder="55.0"
                  />
                </label>
                <label className="text-sm font-black">
                  Average sleep (hours)
                  <NumberStepper
                    wrapperClassName="mt-2"
                    name="averageSleep"
                    min="0"
                    max="16"
                    step="0.1"
                    placeholder="8.0"
                  />
                </label>
                <label className="text-sm font-black">
                  Strength sessions
                  <NumberStepper
                    wrapperClassName="mt-2"
                    name="strengthSessions"
                    min="0"
                    max="3"
                    defaultValue="0"
                    required
                  />
                </label>
                <label className="text-sm font-black">
                  Skill sessions
                  <NumberStepper
                    wrapperClassName="mt-2"
                    name="skillSessions"
                    min="0"
                    max="2"
                    defaultValue="0"
                    required
                  />
                </label>
                <label className="text-sm font-black">
                  Nutrition target days
                  <NumberStepper
                    wrapperClassName="mt-2"
                    name="nutritionDays"
                    min="0"
                    max="7"
                    defaultValue="0"
                    required
                  />
                </label>
                <label className="text-sm font-black">
                  Energy (1–5)
                  <NumberStepper
                    wrapperClassName="mt-2"
                    name="energy"
                    min="1"
                    max="5"
                    defaultValue="3"
                    required
                  />
                </label>
              </div>

              <div>
                <h3 className="font-black">Strength and skill snapshots</h3>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    ['Push-ups', 'pushupsMax'],
                    ['Pull-ups', 'pullupsMax'],
                    ['Dips', 'dipsMax'],
                    ['Handstand sec', 'handstandSeconds'],
                    ['Tuck L-sit sec', 'lSitSeconds'],
                  ].map(([label, name]) => (
                    <label key={name} className="text-xs font-black">
                      {label}
                      <NumberStepper
                        wrapperClassName="mt-2"
                        name={name}
                        min="0"
                        step="1"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {[
                ['Pain or discomfort', 'painNotes'],
                ['Biggest win', 'wins'],
                ['Main challenge', 'challenges'],
              ].map(([label, name]) => (
                <label key={name} className="block text-sm font-black">
                  {label}
                  <textarea
                    className={`${fieldClass} min-h-20`}
                    name={name}
                    placeholder={
                      name === 'painNotes'
                        ? 'Location, movement, and severity—or write none'
                        : undefined
                    }
                  />
                </label>
              ))}

              <Button type="submit" className="w-full">
                <Save className="h-5 w-5" /> Save weekly check-in
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="bg-slate-950 text-white">
              <Send className="h-7 w-7 text-green-300" />
              <h2 className="mt-3 text-xl font-black">Automatic coach review</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
                Your Sunday task reads the synced daily logs and this check-in.
                Use the copy button only as a manual backup.
              </p>
              <Button
                type="button"
                className="mt-4 w-full"
                disabled={!latest}
                onClick={copyLatest}
              >
                <Clipboard className="h-5 w-5" /> Copy backup summary
              </Button>
              {message ? (
                <p className="mt-3 text-sm font-bold text-green-200">{message}</p>
              ) : null}
            </Card>

            <Card>
              <h2 className="text-lg font-black">Check-in history</h2>
              <div className="mt-3 space-y-2">
                {history.slice(0, 8).map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="rounded-2xl bg-slate-50 p-3 text-sm font-bold"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{checkIn.week_ending}</span>
                      <span className="text-green-700">
                        {checkIn.average_weight ?? '—'} kg
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Strength {checkIn.strength_sessions}/3 · Skill{' '}
                      {checkIn.skill_sessions}/2 · Nutrition{' '}
                      {checkIn.nutrition_days}/7 · Energy {checkIn.energy}/5
                    </p>
                  </div>
                ))}
                {!history.length ? (
                  <p className="rounded-2xl border border-dashed p-4 text-sm font-bold text-muted-foreground">
                    No weekly check-ins yet.
                  </p>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
