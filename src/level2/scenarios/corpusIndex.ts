import type { CorpusIndex } from './corpusIndexTypes';

/* ─────────────────────────────────────────────────────────────────────────────
   Corpus index — standalone share build.

   The internal build generates this file by sweeping a live trace corpus.
   This external build ships with an EMPTY index on purpose: the scenario
   registry then always lands on the bundled demo fixtures, which are the
   sanitized, self-contained scenario data this prototype runs on. No live
   backend is contacted.
   ───────────────────────────────────────────────────────────────────────────── */

export const CORPUS_INDEX: CorpusIndex = {
  version: 1,
  generatedAt: '2026-07-28',
  project: 'demo',
  tracesInspected: 0,
  pools: {
    text_only: [],
    candidate_ranking: [],
    single_entity: [],
    comparison: [],
    route_map: [],
    structured_no_image: [],
    list: [],
    summary: [],
    hybrid: [],
  },
};
