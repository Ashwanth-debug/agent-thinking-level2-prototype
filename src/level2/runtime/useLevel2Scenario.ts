import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { level2Registry } from '../scenarios/registry';
import { isMemoryRetrievalKind, type DevScenarioKind } from '../types/devScenario';
import type { Level2Scenario } from '../types/scenario';

/* ─────────────────────────────────────────────────────────────────────────────
   LEVEL 2 — Scenario selection state.

   Owns the two things the demo actually needs:

     selectArchetype(k)  switch selection -> load a scenario for it
     refresh()           same selection -> a DIFFERENT scenario for it

   Refresh never leaves the selected kind and never reloads the app. A stale
   in-flight load is discarded by run id, so switching selections twice
   quickly can't land the first result on top of the second.

   `selectedArchetype` is a `DevScenarioKind` — every real `ScenarioArchetype`
   PLUS the dedicated 'memory_retrieval' Dev Mode demo (see
   types/devScenario.ts for why that one isn't a real archetype). Loading
   branches on it: real archetypes go through `level2Registry.select()`
   exactly as before; 'memory_retrieval' goes through the registry's separate
   `selectMemoryRetrieval()`, which cycles the curated memory-pool fixtures
   instead of trying Phoenix. Everything else here — the run-id guard, the
   clear-before-load ordering, Refresh — is identical for both.
   ───────────────────────────────────────────────────────────────────────────── */

const DEFAULT_ARCHETYPE: DevScenarioKind = 'candidate_ranking';

export interface Level2ScenarioState {
  selectedArchetype: DevScenarioKind;
  scenario?: Level2Scenario;
  status: 'loading' | 'ready' | 'error';
  error?: string;
  /** What was tried and failed before landing here — dev panel only. */
  fallbackNotes: string[];
  usedFallback: boolean;
  selectArchetype: (kind: DevScenarioKind) => void;
  refresh: () => void;
  availability: ReturnType<typeof level2Registry.availability>;
  corpusMeta: ReturnType<typeof level2Registry.corpusMeta>;
}

export function useLevel2Scenario(): Level2ScenarioState {
  const [selectedArchetype, setSelectedArchetype] = useState<DevScenarioKind>(DEFAULT_ARCHETYPE);
  const [scenario, setScenario] = useState<Level2Scenario | undefined>();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | undefined>();
  const [fallbackNotes, setFallbackNotes] = useState<string[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const runIdRef = useRef(0);

  const load = useCallback((kind: DevScenarioKind) => {
    const runId = ++runIdRef.current;
    setStatus('loading');
    setError(undefined);

    const selection = isMemoryRetrievalKind(kind)
      ? level2Registry.selectMemoryRetrieval()
      : level2Registry.select(kind);

    Promise.resolve(selection)
      .then((selection) => {
        if (runIdRef.current !== runId) return; // superseded by a newer selection
        if (!selection) {
          setStatus('error');
          setError(`No scenario available for ${kind} — no real trace and no fixture.`);
          return;
        }
        setScenario(selection.scenario);
        setFallbackNotes(selection.fallbackNotes);
        setUsedFallback(selection.usedFallback);
        setStatus('ready');
      })
      .catch((e: Error) => {
        if (runIdRef.current !== runId) return;
        setStatus('error');
        setError(e.message);
      });
  }, []);

  useEffect(() => {
    load(DEFAULT_ARCHETYPE);
  }, [load]);

  const selectArchetype = useCallback(
    (kind: DevScenarioKind) => {
      if (kind === selectedArchetype) return;
      setSelectedArchetype(kind);
      // Clearing the scenario first puts the runtime into 'loading', which
      // stops playback — switching selections must never leave the previous
      // scenario's clock running underneath the new one.
      setScenario(undefined);
      load(kind);
    },
    [load, selectedArchetype]
  );

  const refresh = useCallback(() => {
    setScenario(undefined);
    load(selectedArchetype);
  }, [load, selectedArchetype]);

  // Both are derived from the generated corpus index and the fixture list,
  // neither of which changes at runtime — computing them per render would
  // hand the selector a new array on every frame of playback.
  const availability = useMemo(() => level2Registry.availability(), []);
  const corpusMeta = useMemo(() => level2Registry.corpusMeta(), []);

  return {
    selectedArchetype,
    scenario,
    status,
    error,
    fallbackNotes,
    usedFallback,
    selectArchetype,
    refresh,
    availability,
    corpusMeta,
  };
}
