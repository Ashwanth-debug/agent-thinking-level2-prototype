import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './styles/motion.css'
import './styles/tv.css'
import './styles/animations.css'
import './styles/premium.css'
import './styles/agentThinkingTrace.css'
// Level 2 scenario-system baseline styles — loaded after the main sheet so a
// UI pass can override anything there without fighting specificity.
import './styles/level2Scenario.css'
import AgentExperience from './components/AgentThinkingTrace/AgentExperience'

/**
 * Agent Thinking — Level 2 Prototype (standalone share build).
 * The default route opens the Level 2 experience directly.
 *
 * Controls: R new example · D dev mode · Space play/pause · ←/→ step ·
 * 1-4 speed · Shift+A..J scenario type.
 * Optional deep-link: ?scenario=candidate-ranking
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgentExperience />
  </StrictMode>,
)
