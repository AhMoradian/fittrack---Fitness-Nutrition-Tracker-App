'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  COACH_PLAN_VERSION,
  COACH_PROGRAM_ID,
  coachPlan,
  profile as starterProfile,
  tasks as starterTasks,
} from '@/lib/sample-data';
import { localDateKey } from '@/lib/tracking';
import { createClient } from '@/lib/supabase/client';
import type {
  BodyMetric,
  DailyLog,
  FitTrackData,
  ProgressPhoto,
  Task,
  UserProfile,
  WeeklyCheckIn,
} from '@/lib/types';

const STORAGE_KEY = 'fittrack-single-user-v1';
const CLOUD_TABLE = 'fittrack_data';
const cloudConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
);

export type SyncStatus =
  | 'loading'
  | 'local'
  | 'saving'
  | 'synced'
  | 'error';

function createStarterData(): FitTrackData {
  const today = localDateKey();
  const weight = Number.parseFloat(starterProfile.weight);
  const starterCoachTasks = starterTasks.map((task) => ({ ...task }));
  return {
    version: 1,
    started_at: today,
    coach_plan_version: COACH_PLAN_VERSION,
    coach_plan: { ...coachPlan },
    coach_plan_history: [
      {
        ...coachPlan,
        tasks: starterCoachTasks.map((task) => ({ ...task })),
      },
    ],
    tasks: starterCoachTasks,
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
    weekly_check_ins: [],
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

function normalizeData(parsed: FitTrackData): FitTrackData {
  const parsedTasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
  const parsedCoachVersion = Number.isFinite(parsed.coach_plan_version)
    ? parsed.coach_plan_version
    : 0;
  const needsBaselineUpdate = parsedCoachVersion < COACH_PLAN_VERSION;
  const nonCoachTasks = parsedTasks.filter(
    (task) =>
      task.program_id !== COACH_PROGRAM_ID &&
      task.program_id !== 'home-muscle-building-program',
  );
  const tasks = needsBaselineUpdate
    ? [...nonCoachTasks, ...starterTasks.map((task) => ({ ...task }))]
    : parsedTasks;
  const coachPlanVersion = needsBaselineUpdate
    ? COACH_PLAN_VERSION
    : parsedCoachVersion;
  const activeCoachPlan = needsBaselineUpdate
    ? { ...coachPlan }
    : parsed.coach_plan ?? {
        ...coachPlan,
        version: coachPlanVersion,
        phase: `Coach plan v${coachPlanVersion}`,
      };
  const history = Array.isArray(parsed.coach_plan_history)
    ? [...parsed.coach_plan_history]
    : [];

  if (!history.some((entry) => entry.version === activeCoachPlan.version)) {
    history.push({
      ...activeCoachPlan,
      tasks: tasks
        .filter((task) => task.program_id === COACH_PROGRAM_ID)
        .map((task) => ({ ...task })),
    });
  }

  return {
    ...parsed,
    coach_plan_version: coachPlanVersion,
    coach_plan: activeCoachPlan,
    coach_plan_history: history.sort((a, b) => a.version - b.version),
    tasks,
    weekly_check_ins: parsed.weekly_check_ins ?? [],
  };
}

type StoreValue = {
  data: FitTrackData;
  ready: boolean;
  cloudConfigured: boolean;
  userEmail: string | null;
  syncStatus: SyncStatus;
  signOut: () => Promise<void>;
  saveLog: (log: DailyLog) => void;
  saveMetric: (metric: Omit<BodyMetric, 'id' | 'created_at'>) => void;
  saveProfile: (profile: UserProfile) => void;
  saveTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addPhoto: (photo: Omit<ProgressPhoto, 'id' | 'created_at'>) => void;
  deletePhoto: (photoId: string) => void;
  saveWeeklyCheckIn: (
    checkIn: Omit<WeeklyCheckIn, 'id' | 'created_at'>,
  ) => void;
  importData: (data: FitTrackData) => void;
};

const FitTrackContext = createContext<StoreValue | null>(null);

export function FitTrackProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FitTrackData>(createStarterData);
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const userIdRef = useRef<string | null>(null);
  const cloudUpdatedAtRef = useRef<string | null>(null);
  const skipNextCloudSaveRef = useRef(false);

  useEffect(() => {
    let active = true;
    let channel: RealtimeChannel | undefined;

    const loadLocalData = () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as FitTrackData;
          if (parsed.version === 1 && Array.isArray(parsed.tasks)) {
            return normalizeData(parsed);
          }
        }
      } catch (error) {
        console.error('Could not load FitTrack data.', error);
      }
      return createStarterData();
    };

    const bootstrap = async () => {
      const localData = loadLocalData();

      if (!cloudConfigured) {
        if (!active) return;
        setData(localData);
        setSyncStatus('local');
        setReady(true);
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;
        if (!user) {
          setData(localData);
          setSyncStatus('local');
          setReady(true);
          return;
        }

        userIdRef.current = user.id;
        setUserEmail(user.email ?? null);

        const { data: cloudRow, error } = await supabase
          .from(CLOUD_TABLE)
          .select('data, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        if (
          cloudRow?.data &&
          cloudRow.data.version === 1 &&
          Array.isArray(cloudRow.data.tasks)
        ) {
          cloudUpdatedAtRef.current = cloudRow.updated_at;
          setData(normalizeData(cloudRow.data as FitTrackData));
        } else {
          const updatedAt = new Date().toISOString();
          const { error: saveError } = await supabase.from(CLOUD_TABLE).upsert({
            user_id: user.id,
            data: localData,
            updated_at: updatedAt,
          });
          if (saveError) throw saveError;
          cloudUpdatedAtRef.current = updatedAt;
          setData(localData);
        }

        channel = supabase
          .channel(`fittrack-sync-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: CLOUD_TABLE,
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const row = payload.new as {
                data?: FitTrackData;
                updated_at?: string;
              };
              if (
                !row.data ||
                row.data.version !== 1 ||
                !Array.isArray(row.data.tasks) ||
                row.updated_at === cloudUpdatedAtRef.current
              ) {
                return;
              }
              cloudUpdatedAtRef.current = row.updated_at ?? null;
              skipNextCloudSaveRef.current = true;
              setData(normalizeData(row.data));
              setSyncStatus('synced');
            },
          )
          .subscribe();

        setSyncStatus('synced');
      } catch (error) {
        console.error('Could not sync FitTrack data with Supabase.', error);
        if (!active) return;
        setData(localData);
        setSyncStatus('error');
      } finally {
        if (active) setReady(true);
      }
    };

    void bootstrap();

    return () => {
      active = false;
      if (channel) void channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    if (!cloudConfigured || !userIdRef.current) return;
    if (skipNextCloudSaveRef.current) {
      skipNextCloudSaveRef.current = false;
      return;
    }

    setSyncStatus('saving');
    const timeout = window.setTimeout(async () => {
      const updatedAt = new Date().toISOString();
      cloudUpdatedAtRef.current = updatedAt;
      try {
        const supabase = createClient();
        const { error } = await supabase.from(CLOUD_TABLE).upsert({
          user_id: userIdRef.current,
          data,
          updated_at: updatedAt,
        });
        if (error) throw error;
        setSyncStatus('synced');
      } catch (error) {
        console.error('Could not save FitTrack data to Supabase.', error);
        setSyncStatus('error');
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [data, ready]);

  useEffect(() => {
    const syncTabs = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        skipNextCloudSaveRef.current = true;
        setData(normalizeData(JSON.parse(event.newValue) as FitTrackData));
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

  const saveWeeklyCheckIn = useCallback(
    (checkIn: Omit<WeeklyCheckIn, 'id' | 'created_at'>) => {
      setData((current) => {
        const existing = current.weekly_check_ins.find(
          (entry) => entry.week_ending === checkIn.week_ending,
        );
        const next: WeeklyCheckIn = {
          ...checkIn,
          id: existing?.id ?? crypto.randomUUID(),
          created_at: existing?.created_at ?? new Date().toISOString(),
        };
        return {
          ...current,
          weekly_check_ins: [
            ...current.weekly_check_ins.filter(
              (entry) => entry.week_ending !== checkIn.week_ending,
            ),
            next,
          ].sort((a, b) => b.week_ending.localeCompare(a.week_ending)),
        };
      });
    },
    [],
  );

  const importData = useCallback((nextData: FitTrackData) => {
    if (nextData.version !== 1 || !Array.isArray(nextData.tasks)) {
      throw new Error('This is not a valid FitTrack backup.');
    }
    setData(normalizeData(nextData));
  }, []);

  const signOut = useCallback(async () => {
    if (cloudConfigured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    userIdRef.current = null;
    setUserEmail(null);
    setSyncStatus('local');
  }, []);

  const value = useMemo(
    () => ({
      data,
      ready,
      cloudConfigured,
      userEmail,
      syncStatus,
      signOut,
      saveLog,
      saveMetric,
      saveProfile,
      saveTask,
      deleteTask,
      addPhoto,
      deletePhoto,
      saveWeeklyCheckIn,
      importData,
    }),
    [
      addPhoto,
      data,
      deletePhoto,
      deleteTask,
      importData,
      ready,
      signOut,
      syncStatus,
      userEmail,
      saveLog,
      saveMetric,
      saveProfile,
      saveTask,
      saveWeeklyCheckIn,
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
