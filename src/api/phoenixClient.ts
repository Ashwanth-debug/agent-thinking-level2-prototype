import type { PhoenixSpan } from '../types/phoenix';

/* ─────────────────────────────────────────────────────────────────────────────
   Trace client — standalone share build.

   The internal build fetches real agent traces from a backend through a dev
   proxy. This external build is fully offline: the corpus index is empty, so
   the scenario registry never has a trace id to fetch, and this stub exists
   only so the registry's import resolves. If it were ever called it returns
   no spans, which the registry treats as "fall back to fixtures".
   ───────────────────────────────────────────────────────────────────────────── */

export async function fetchSpansForTrace(_traceId: string): Promise<PhoenixSpan[]> {
  return [];
}
