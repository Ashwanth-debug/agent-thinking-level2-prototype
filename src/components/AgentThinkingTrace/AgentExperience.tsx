import { useEffect, useState } from 'react';
import ExperienceLevelSwitcher from './ExperienceLevelSwitcher';
import Level2ScenarioExperience from './level2/Level2ScenarioExperience';
import Level2Diagnostics from './level2/Level2Diagnostics';
import { useLevel2Scenario } from '../../level2/runtime/useLevel2Scenario';
import { useLevel2Runtime } from '../../level2/runtime/useLevel2Runtime';
import { DEV_SCENARIO_KINDS, type DevScenarioKind } from '../../level2/types/devScenario';
import { useStageScale } from './useStageScale';

const SPEED_KEYS: Record<string, number> = { '1': 0.5, '2': 1, '3': 1.5, '4': 2 };

/** Optional deep-link: ?scenario=candidate_ranking (or candidate-ranking). */
function readScenarioFromUrl(): DevScenarioKind | undefined {
  const raw = new URLSearchParams(window.location.search).get('scenario');
  if (!raw) return undefined;
  const normalized = raw.toLowerCase().replace(/-/g, '_') as DevScenarioKind;
  return DEV_SCENARIO_KINDS.includes(normalized) ? normalized : undefined;
}

/** Top-level shell — standalone Level 2 share build.
 *
 *  This is the internal AgentExperience with the Level 1 / Level 3
 *  subsystems removed: this repository demonstrates the Level 2 agent
 *  thinking experience only. The level switcher stays as part of the
 *  composition (Level 2 pinned active); the other two levels are shown
 *  but not interactive.
 *
 *  Keyboard: D dev mode · R/N new scenario (same type) · Space play/pause ·
 *  ←/→ step passes · 1-4 speed · Shift+A..J select scenario type. */
export default function AgentExperience() {
  useStageScale();
  const [devOpen, setDevOpen] = useState(false);

  const level2Source = useLevel2Scenario();
  const level2Runtime = useLevel2Runtime(
    level2Source.scenario,
    level2Source.selectedArchetype,
    level2Source.status === 'loading'
  );

  // Apply ?scenario= deep-link once on mount.
  useEffect(() => {
    const fromUrl = readScenarioFromUrl();
    if (fromUrl) level2Source.selectArchetype(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      switch (e.key.toLowerCase()) {
        case 'd':
          setDevOpen((v) => !v);
          break;
        case ' ':
          e.preventDefault();
          level2Runtime.isPlaying ? level2Runtime.pause() : level2Runtime.play();
          break;
        case 'r':
        case 'n':
          // R = REFRESH SCENARIO, staying inside the selected scenario type.
          level2Source.refresh();
          break;
        case 'arrowleft':
          level2Runtime.prevPass();
          break;
        case 'arrowright':
          level2Runtime.nextPass();
          break;
        default:
          if (SPEED_KEYS[e.key]) level2Runtime.setSpeed(SPEED_KEYS[e.key]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [level2Runtime, level2Source]);

  // Shift+A..J selects a scenario type directly — a demo shortcut for the
  // same operation the Scenario Type selector performs.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.shiftKey || !e.code.startsWith('Key')) return;
      const index = 'ABCDEFGHIJ'.indexOf(e.code.slice(3));
      if (index < 0 || index >= DEV_SCENARIO_KINDS.length) return;
      e.preventDefault();
      level2Source.selectArchetype(DEV_SCENARIO_KINDS[index]);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [level2Source]);

  return (
    <div id="scaler" className="att-scaler">
      {/* The stage is a FIXED 1920×1080 box scaled to fit the viewport — see
          useStageScale. Everything inside is authored against those exact
          coordinates. */}
      <div id="stage" className="att-stage att-stage--fit">
        <div className="att-bg" />
        <div className="att-bg-glow" />
        <div className="att-bg-vignette" />

        {/* Level 2 is pinned in this standalone build — the switcher is part
            of the composition, the other levels are not included. */}
        <ExperienceLevelSwitcher level="level2" onChange={() => {}} />

        <Level2ScenarioExperience source={level2Source} runtime={level2Runtime} showDevChrome={devOpen} />

        {devOpen && <Level2Diagnostics source={level2Source} runtime={level2Runtime} />}
      </div>
    </div>
  );
}
