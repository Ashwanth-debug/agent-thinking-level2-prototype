import { DEV_SCENARIO_KINDS, DEV_SCENARIO_LABEL, isMemoryRetrievalKind, type DevScenarioKind } from '../../../level2/types/devScenario';
import { MEMORY_RETRIEVAL_SCENARIOS } from '../../../level2/scenarios/memoryRetrievalScenarios';
import type { ArchetypeAvailability } from '../../../level2/scenarios/registry';

/* ─────────────────────────────────────────────────────────────────────────────
   LEVEL 2 — Scenario type selector.

   A DEMO/DEVELOPER control, on the right, deliberately separate from the
   leadership-facing Level 1 / Level 2 / Level 3 switch — it changes what KIND
   of answer Level 2 is demonstrating, not which level you are looking at.

   Selecting an option stops the current playback, loads a scenario for it and
   replays from the start; Refresh stays on the current selection and picks a
   different scenario. Both are engineering operations owned by
   useLevel2Scenario — this component only calls them.

   The real-trace count next to each option is honest signal: an archetype with
   no real corpus coverage says so rather than quietly serving a fixture as if
   it were live output. Memory Retrieval always reads 'fixture' — see
   memoryRetrievalScenarios.ts for why it deliberately never tries Phoenix. */

export function ScenarioTypeSelector({
  selected,
  onSelect,
  onRefresh,
  availability,
  source,
  isLoading,
}: {
  selected: DevScenarioKind;
  onSelect: (kind: DevScenarioKind) => void;
  onRefresh: () => void;
  availability: ArchetypeAvailability[];
  source?: string;
  isLoading: boolean;
}) {
  const byArchetype = new Map(availability.map((a) => [a.archetype, a]));

  return (
    <div className="att-l2-scenario-selector">
      <div className="att-l2-scenario-selector-head">
        <span className="att-l2-scenario-selector-title">Scenario Type</span>
        <button type="button" className="att-l2-scenario-refresh" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? '…' : 'Refresh'}
        </button>
      </div>

      <div className="att-l2-scenario-options">
        {DEV_SCENARIO_KINDS.map((kind, i) => {
          const isMemory = isMemoryRetrievalKind(kind);
          const info = isMemory ? undefined : byArchetype.get(kind);
          const realCount = info?.realTraceCount ?? 0;
          return (
            <button
              key={kind}
              type="button"
              className={`att-l2-scenario-option${kind === selected ? ' att-l2-scenario-option--active' : ''}`}
              onClick={() => onSelect(kind)}
            >
              <span className="att-l2-scenario-option-index">{i + 1}</span>
              <span className="att-l2-scenario-option-label">{DEV_SCENARIO_LABEL[kind]}</span>
              <span
                className="att-l2-scenario-option-count"
                title={isMemory ? `${MEMORY_RETRIEVAL_SCENARIOS.length} curated fixture(s) — never a real trace, see dev notes` : `${realCount} real trace(s) in the corpus`}
              >
                {isMemory ? 'fixture' : realCount > 0 ? realCount : 'fixture'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dev-only explanation — never shown in the leadership/consumer view
          (this whole selector is dev chrome). Only Memory Retrieval gets one:
          the other nine options are self-explanatory answer shapes. */}
      {isMemoryRetrievalKind(selected) && (
        <div className="att-l2-scenario-explainer">
          Demonstrates how relevant remembered context is surfaced before the agent continues.
        </div>
      )}

      {source && <div className="att-l2-scenario-source">{source}</div>}
    </div>
  );
}
