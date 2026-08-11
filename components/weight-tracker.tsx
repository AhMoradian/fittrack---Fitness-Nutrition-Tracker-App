'use client';

import { useState } from 'react';
import { Ruler, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NumberStepper } from '@/components/ui/number-stepper';
import { localDateKey } from '@/lib/tracking';
import type { BodyMetric } from '@/lib/types';

export function WeightTracker({
  onSave,
}: {
  onSave: (metric: Omit<BodyMetric, 'id' | 'created_at'>) => void;
}) {
  const [date, setDate] = useState(localDateKey());
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [arm, setArm] = useState('');
  const [saved, setSaved] = useState(false);

  const optionalNumber = (value: string) =>
    value.trim() === '' ? undefined : Number(value);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({
      date,
      weight: optionalNumber(weight),
      body_fat: optionalNumber(bodyFat),
      waist: optionalNumber(waist),
      chest: optionalNumber(chest),
      arm: optionalNumber(arm),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <Card>
      <div className="mb-5">
        <Ruler className="h-7 w-7 text-teal-700" />
        <h2 className="mt-2 text-xl font-black">Body metrics</h2>
        <p className="text-sm font-medium text-muted-foreground">Record measurements weekly under similar conditions.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Date</span>
          <input
            type="date"
            value={date}
            max={localDateKey()}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Weight (kg)', weight, setWeight],
            ['Body fat (%)', bodyFat, setBodyFat],
            ['Waist (cm)', waist, setWaist],
            ['Chest (cm)', chest, setChest],
            ['Arm (cm)', arm, setArm],
          ].map(([label, value, setter]) => (
            <label key={label as string}>
              <span className="mb-2 block text-sm font-bold">{label as string}</span>
              <NumberStepper
                min="0"
                step="0.1"
                value={value as string}
                aria-label={label as string}
                onValueChange={(nextValue) =>
                  (setter as React.Dispatch<React.SetStateAction<string>>)(nextValue)
                }
                onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)}
              />
            </label>
          ))}
        </div>
        <Button className="w-full" type="submit">
          <Save className="h-5 w-5" /> Save measurements
        </Button>
        {saved ? <p className="text-sm font-bold text-teal-800">Measurements saved.</p> : null}
      </form>
    </Card>
  );
}
