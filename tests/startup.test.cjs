/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS VM harness loads the transpiled provider with mocked dependencies. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync('lib/fittrack-store.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = () => new Promise((resolve) => setImmediate(resolve));

function harness() {
  const auth = deferred(), query = deferred();
  const effects = [], states = [], timers = new Map();
  let reads = 0, subscriptions = 0;
  const local = {
    version: 1, coach_plan_version: 2,
    coach_plan: { version: 2 }, coach_plan_history: [{ version: 2 }],
    tasks: [{ id: 'saved-day-one', program_id: 'custom-user-program' }],
    daily_logs: [{ id: 'saved-log' }], profile: { name: 'Local fixture' },
  };
  const react = {
    createContext: () => ({ Provider: 'provider' }),
    useState: (value) => {
      const state = { value: typeof value === 'function' ? value() : value };
      states.push(state);
      return [state.value, (next) => { state.value = typeof next === 'function' ? next(state.value) : next; }];
    },
    useRef: (value) => ({ current: value }), useEffect: (fn) => effects.push(fn),
    useCallback: (fn) => fn, useMemo: (fn) => fn(),
  };
  let signal;
  const builder = {
    select() { return this; }, eq() { return this; },
    abortSignal(value) { signal = value; return this; },
    maybeSingle() { return query.promise; },
  };
  const supabase = {
    auth: { getUser: () => auth.promise },
    from: () => { reads++; return builder; },
    channel: () => ({ on() { return this; }, subscribe() { subscriptions++; return this; }, unsubscribe() {} }),
  };
  const exports = {};
  vm.runInNewContext(source, {
    exports, AbortController,
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.invalid', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fixture' } },
    console: { error() {} },
    setTimeout: (fn, ms) => { timers.set(ms, fn); return ms; },
    clearTimeout: (id) => timers.delete(id),
    window: { localStorage: { getItem: () => JSON.stringify(local) } },
    require: (name) => {
      if (name === 'react') return react;
      if (name === '@/lib/supabase/client') return { createClient: () => supabase };
      if (name === '@/lib/tracking') return { localDateKey: () => '2026-11-20' };
      if (name === '@/lib/sample-data') return {
        COACH_PLAN_VERSION: 2, COACH_PROGRAM_ID: 'coach', coachPlan: { version: 2 }, tasks: [],
        profile: { height: '170 cm', weight: '60 kg', equipment: [] },
      };
      return require(name);
    },
  });
  exports.FitTrackProvider({ children: null });
  const cleanup = effects[0]();
  return { auth, query, states, timers, cleanup, local,
    timeout: () => timers.get(4000)(),
    reads: () => reads, subscriptions: () => subscriptions, signal: () => signal };
}

test('hanging authentication opens the saved local plan after four seconds; late auth cannot overwrite edits', async () => {
  const h = harness();
  assert.equal(h.states[1].value, false);
  h.timeout();
  assert.equal(h.states[1].value, true);
  assert.equal(h.states[3].value, 'error');
  assert.equal(h.states[0].value.tasks[0].id, 'saved-day-one');
  assert.equal(h.states[0].value.daily_logs[0].id, 'saved-log');
  h.states[0].value.profile.name = 'Edited after fallback';
  h.auth.resolve({ data: { user: { id: 'fixture-user' } } });
  await flush();
  assert.equal(h.reads(), 0);
  assert.equal(h.states[0].value.profile.name, 'Edited after fallback');
});

test('slow cloud read is aborted and its late response cannot replace local data', async () => {
  const h = harness();
  h.auth.resolve({ data: { user: { id: 'fixture-user' } } });
  await flush();
  h.timeout();
  assert.equal(h.signal().aborted, true);
  h.query.resolve({ data: { data: { ...h.local, profile: { name: 'Late remote' } }, updated_at: 'remote' }, error: null });
  await flush();
  assert.equal(h.states[0].value.profile.name, 'Local fixture');
  assert.equal(h.subscriptions(), 0);
  assert.equal(h.states[2].value, null);
});

test('fast cloud sync still loads the remote plan and cancels the fallback', async () => {
  const h = harness();
  h.auth.resolve({ data: { user: { id: 'fixture-user', email: 'fixture@example.invalid' } } });
  await flush();
  h.query.resolve({ data: { data: { ...h.local, profile: { name: 'Remote fixture' } }, updated_at: 'remote' }, error: null });
  await flush();
  assert.equal(h.states[0].value.profile.name, 'Remote fixture');
  assert.equal(h.states[1].value, true);
  assert.equal(h.states[3].value, 'synced');
  assert.equal(h.subscriptions(), 1);
  assert.equal(h.timers.size, 0);
});

test('authentication failure immediately falls back without deleting saved tasks', async () => {
  const h = harness();
  h.auth.reject(new Error('offline'));
  await flush();
  assert.equal(h.states[1].value, true);
  assert.equal(h.states[0].value.tasks[0].id, 'saved-day-one');
  assert.equal(h.timers.size, 0);
});

test('unmount cancels startup and prevents late state changes', async () => {
  const h = harness();
  h.cleanup();
  h.auth.resolve({ data: { user: { id: 'fixture-user' } } });
  await flush();
  assert.equal(h.timers.size, 0);
  assert.equal(h.reads(), 0);
  assert.equal(h.states[1].value, false);
});
