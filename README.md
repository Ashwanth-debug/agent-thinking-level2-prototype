# Agent Thinking — Level 2 Prototype

A standalone prototype of the **Level 2 Agent Thinking** experience: watching an AI
agent work through a request in real time — discovering candidates, weighing them,
narrating its reasoning — before landing on a final response.

This is a self-contained demo running entirely on **sanitized, bundled demo data**.
It needs no VPN, no backend, no API keys, and no environment variables.

---

## How to run

**Requirements:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:5175](http://localhost:5175) — the Level 2 experience starts
immediately.

---

## Prototype controls

| Key | Action |
|---|---|
| `R` | Load another example of the current scenario type |
| `D` | Toggle Dev Mode |
| `Space` | Play / pause the thinking playback |
| `←` / `→` | Step backward / forward through thinking passes |
| `1`–`4` | Playback speed (0.5× / 1× / 1.5× / 2×) |
| `Shift+A`…`Shift+J` | Jump directly to a scenario type |

## Dev Mode (`D`)

- **Scenario Type selector** (right side) — choose from:
  Text-only answer · Candidate ranking · Single entity enrichment · Comparison ·
  Route / map · Structured / no-image · List without winner · Summary / synthesis ·
  Parallel-tool / hybrid · Memory Retrieval
- **Refresh** — another example within the same type
- **Timing mode** — Demo (curated cadence) / Real Timing (recorded trace clock, when
  the loaded scenario carries timing data)
- **Diagnostics panel** — scenario metadata, pass timeline, what the user-value
  filter hid, and the current runtime phase

## Optional deep link

```
/?scenario=candidate-ranking
/?scenario=route-map
/?scenario=memory-retrieval
```

---

## What you're looking at

The experience plays in phases:

1. **Thinking** — the agent narrates contextual reasoning in the center of the
   stage while candidates, comparisons, routes, or retrieved memories build up
   around it
2. **Consolidating → Resolving** — the working set compresses toward an answer
3. **Final response** — the agent moves to the top-left and the answer renders in
   one of four response patterns: Cards, Cards + Tabs, Text Only, or Text + Carousel

## Data

All scenario data is **local demo fixture data**, bundled with the app and clearly
labeled as such in Dev Mode. Route maps use public city-level coordinates and
render on CARTO/OpenStreetMap public basemap tiles. Source icons use Google's
public favicon service with a neutral glyph fallback. These are the only external
requests the app makes (plus Google Fonts).

## Build & deploy

```bash
npm run build     # → dist/
npm run preview   # serve the production build locally
```

The repo is Vercel-ready: import it as a Vite project, no configuration or
environment variables needed (`vercel.json` handles client-side route rewrites).

---

## Project structure

```
src/
  main.tsx                          # entry — renders the Level 2 shell directly
  components/
    AgentThinkingTrace/
      AgentExperience.tsx           # shell: keyboard, dev chrome, stage scale
      level2/                       # all Level 2 UI (canvas, renderers, map, dev panel)
    L1/                             # final-response templates (Cards, Tabs, Text, Carousel)
    Shared/                         # mascot (Rive), text reveal (GSAP)
  level2/
    runtime/                        # pass clock + scenario selection state
    scenarios/                      # demo fixtures + registry
    userValue/                      # "what does the viewer actually see" filters
    finalResponse/                  # final answer builder + L1 template adapter
    renderers/, classification/, normalization/, phoenix/, types/
  styles/
public/
  mascot.riv, glance-logo.png, images/
```
