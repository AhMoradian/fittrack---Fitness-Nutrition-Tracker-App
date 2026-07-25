'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { profile as starterProfile, tasks as starterTasks } from '@/lib/sample-data';
import { localDateKey } from '@/lib/tracking';
import type {
  BodyMetric,
  DailyLog,
  FitTrackData,
  ProgressPhoto,
  Task,
  UserProfile,
} from '@/lib/types';

const STORAGE_KEY = 'fittrack-single-user-v1';

function createStarterData(): FitTrackData {
  const today = localDateKey();
  const weight = Number.parseFloat(starterProfile.weight);
  return {
    version: 1,
    started_at: today,
    tasks: starterTasks.map((task) => ({ ...task })),
    daily_logs: [],
    body_metrics: Number.isFinite(weight)
      ? [
          {
            id: 'starting-weight',
            date: today,
            weight,
            created_at: new Date().toISOString(),
          },
        ]
      : [],
    progress_photos: [],
    profile: {
      name: 'Amir',
      age: starterProfile.age,
      height: starterProfile.height.replace(' cm', ''),
      goal: starterProfile.goal,
      weekly_goal: starterProfile.weeklyGoal,
      equipment: [...starterProfile.equipment],
    },
  };
}

type StoreValue = {
  data: FitTrackData;
  ready: boolean;
  saveLog: (log: DailyLog) => void;
  saveMetric: (metric: Omit<BodyMetric, 'id' | 'created_at'>) => void;
  saveProfile: (profile: UserProfile) => void;
  saveTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addPhoto: (photo: Omit<ProgressPhoto, 'id' | 'created_at'>) => void;
  deletePhoto: (photoId: string) => void;
  importData: (data: FitTrackData) => void;
};

const FitTrackContext = createContext<StoreValue | null>(null);

export function FitTrackProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FitTrackData>(createStarterData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FitTrackData;
        // Loading persisted browser state after hydration is intentional.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.version === 1 && Array.isArray(parsed.tasks)) setData(parsed);
      }
    } catch (error) {
      console.error('Could not load FitTrack data.', error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    const syncTabs = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setData(JSON.parse(event.newValue) as FitTrackData);
      } catch {
        // Ignore malformed values written outside FitTrack.
      }
    };
    window.addEventListener('storage', syncTabs);
    return () => window.removeEventListener('storage', syncTabs);
  }, []);

  const saveLog = useCallback((log: DailyLog) => {
    setData((current) => ({
      ...current,
      daily_logs: [
        ...current.daily_logs.filter(
          (entry) => !(entry.task_id === log.task_id && entry.date === log.date),
        ),
        log,
      ],
    }));
  }, []);

  const saveMetric = useCallback(
    (metric: Omit<BodyMetric, 'id' | 'created_at'>) => {
      setData((current) => {
        const existing = current.body_metrics.find(
          (entry) => entry.date === metric.date,
        );
        const next: BodyMetric = {
          ...metric,
          id: existing?.id ?? crypto.randomUUID(),
          created_at: existing?.created_at ?? new Date().toISOString(),
        };
        return {
          ...current,
          body_metrics: [
            ...current.body_metrics.filter((entry) => entry.date !== metric.date),
            next,
          ].sort((a, b) => a.date.localeCompare(b.date)),
        };
      });
    },
    [],
  );

  const saveProfile = useCallback((profile: UserProfile) => {
    setData((current) => ({ ...current, profile }));
  }, []);

  const saveTask = useCallback((task: Task) => {
    setData((current) => ({
      ...current,
      tasks: [...current.tasks.filter((entry) => entry.id !== task.id), task],
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
      daily_logs: current.daily_logs.filter((log) => log.task_id !== taskId),
    }));
  }, []);

  const addPhoto = useCallback(
    (photo: Omit<ProgressPhoto, 'id' | 'created_at'>) => {
      setData((current) => ({
        ...current,
        progress_photos: [
          {
            ...photo,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
          },
          ...current.progress_photos,
        ],
      }));
    },
    [],
  );

  const deletePhoto = useCallback((photoId: string) => {
    setData((current) => ({
      ...current,
      progress_photos: current.progress_photos.filter(
        (photo) => photo.id !== photoId,
      ),
    }));
  }, []);

  const importData = useCallback((nextData: FitTrackData) => {
    if (nextData.version !== 1 || !Array.isArray(nextData.tasks)) {
      throw new Error('This is not a valid FitTrack backup.');
    }
    setData(nextData);
  }, []);

  const value = useMemo(
    () => ({
      data,
      ready,
      saveLog,
      saveMetric,
      saveProfile,
      saveTask,
      deleteTask,
      addPhoto,
      deletePhoto,
      importData,
    }),
    [
      addPhoto,
      data,
      deletePhoto,
      deleteTask,
      importData,
      ready,
      saveLog,
      saveMetric,
      saveProfile,
      saveTask,
    ],
  );

  return (
    <FitTrackContext.Provider value={value}>
      {children}
    </FitTrackContext.Provider>
  );
}

export function useFitTrack() {
  const context = useContext(FitTrackContext);
  if (!context) throw new Error('useFitTrack must be used inside FitTrackProvider.');
  return context;
}
