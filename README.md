# itrix-web — Surface 1

The public surface of the **itriX AI Sales Engine**: one continuous conversation,
from a visitor's first sentence to the tenth relationship state.

Implements **Surface 1 Structure v5.0** (Master Technical Architecture v2.6,
Playbook v1.6). Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · Zustand.

## Getting started

```bash
yarn install
yarn dev          # http://localhost:3000   (the dashboard uses 3001)
yarn build
yarn lint         # includes itrix/no-atelier-tokens
```

Copy the environment block from `src/config/site.config.ts` into `.env.local`.
Every capability is flag-gated and defaults **off**, so a build with no flags set
renders the approved minimal centre and nothing more.

## What this surface is

Not a brochure, and not a visible chatbot. The visitor types one sentence and
**never navigates again** — the ten journey states render as turns, artifacts and
cards inside a single thread.

- **Submitting never navigates.** The composer posts, a turn appends, and the
  assistant turn streams in above it. The URL is soft-updated with
  `history.replaceState`; the transcript is never unmounted. A component that
  routes in response to a turn or a state change is a defect.
- **The landing stops at the example prompts.** Nothing renders below the pathway
  hint at any breakpoint. The narrative, the drawers and the marketing routes live
  in the sidebar's Explore group.
- **The composer is invariant.** One component at every state; only its label
  changes. There is no button labelled "Begin review" and no character counter.
- **Sidebar only.** The right value rail is retired. `sidebar_sections`,
  `conversation_header` and `composer_label` come from the backend — the sidebar is
  rendered, never decided here.

## Rules that outrank convenience

- **The backend owns state.** `useJourney` subscribes; no frontend code sets journey
  state or self-reveals a surface.
- **Never render an unapproved turn.** `message.under_review` replaces streamed text
  with the approved wording; `message.halted` discards the partial text.
- **Nothing internal reaches the client.** `persona_id`, tier, score, license-out
  probability, coverage maps and attachment risk flags are absent from client-plane
  payloads — the UI has nothing to leak.
- **An attachment can never raise a disclosure ceiling.**
- **A named human is reachable in one action at every state** (R30). If the
  conversation header collapses, quick help moves into the thread actions menu — it
  never disappears.

## Design system

**itriX Brand Manual v1.5 EN.** Atelier Indigo is retired by name as well as by
value; `eslint-rules/no-atelier-tokens.mjs` fails the build if a retired name
reappears. `src/styles/tokens/brand.css` is the source of truth for colour, and
`tailwind.config.ts` mirrors it.

`ink-muted` (#94A3B8) fails contrast on light grounds — placeholders, disabled
states and dividers only, never information-bearing text.

## Repository notes

See `../CLAUDE.md` for how this repo relates to `itrix-dashboard` (Surface 2), and
`AGENTS.md` for the Next.js 16 caveat.
