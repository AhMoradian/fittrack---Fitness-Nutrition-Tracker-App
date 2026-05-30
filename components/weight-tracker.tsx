'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { recordBodyMetric } from '@/lib/actions/body-metrics';
import type { BodyMetric } from '@/lib/types';

interface WeightTrackerProps {
  currentMetric?: BodyMetric;
  onMetricSaved?: (metric: BodyMetric) => void;
}

export function WeightTracker({ currentMetric, onMetricSaved }: WeightTrackerProps) {
  const [weight, setWeight] = useState(currentMetric?.weight?.toString() || '');
  const [bodyFat, setBodyFat] = useState(currentMetric?.body_fat?.toString() || '');
  const [waist, setWaist] = useState(currentMetric?.waist?.toString() || '');
  const [chest, setChest] = useState(currentMetric?.chest?.toString() || '');
  const [arm, setArm] = useState(currentMetric?.arm?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      const metric = await recordBodyMetric(
        today,
        weight ? parseFloat(weight) : undefined,
        bodyFat ? parseFloat(bodyFat) : undefined,
        waist ? parseFloat(waist) : undefined,
        chest ? parseFloat(chest) : undefined,
        arm ? parseFloat(arm) : undefined
      );

      setMessage({ type: 'success', text: 'Weight and metrics saved successfully!' });
      onMetricSaved?.(metric);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save metrics';
      setMessage({ type: 'error', text: errorMessage });
      console.error('Error saving metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold">📏 Body Metrics</h3>
        <p className="text-sm text-muted-foreground">Track your weight and measurements daily</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-semibold mb-2">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 75.5"
            />
          </div>

          {/* Body Fat */}
          <div>
            <label htmlFor="bodyFat" className="block text-sm font-semibold mb-2">
              Body Fat (%)
            </label>
            <input
              id="bodyFat"
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 15.5"
            />
          </div>

          {/* Waist */}
          <div>
            <label htmlFor="waist" className="block text-sm font-semibold mb-2">
              Waist (cm)
            </label>
            <input
              id="waist"
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 80"
            />
          </div>

          {/* Chest */}
          <div>
            <label htmlFor="chest" className="block text-sm font-semibold mb-2">
              Chest (cm)
            </label>
            <input
              id="chest"
              type="number"
              step="0.1"
              value={chest}
              onChange={(e) => setChest(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 95"
            />
          </div>

          {/* Arm */}
          <div>
            <label htmlFor="arm" className="block text-sm font-semibold mb-2">
              Arm (cm)
            </label>
            <input
              id="arm"
              type="number"
              step="0.1"
              value={arm}
              onChange={(e) => setArm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 32"
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Metrics'}
        </Button>

        {currentMetric && (
          <p className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(currentMetric.created_at).toLocaleDateString()}
          </p>
        )}
      </form>
    </Card>
  );
}