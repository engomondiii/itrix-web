# itriX Web Fix v4.0.2 — the /c/[token] page "We hit an unexpected error" crash

## Symptom
After the hang was fixed, the review reached `/c/<token>` but the page threw:
`TypeError: Cannot read properties of undefined (reading 'label')` and showed
"We hit an unexpected error".

## Root cause
The backend `build_client_page` and the frontend `ClientPage` contract are different
shapes, and the client-page proxy passed the backend body through unchanged:
- Backend diagnosis rows: `{pressure, observation, itrixInterpretation, alphaRole}`
- Frontend `ClientPageShell` reads: `row.label` and `row.relevance`
So `page.diagnosis` was a non-empty array whose rows had **no `.label`** →
`<li key={row.label}>` + `relevanceTone[row.relevance]` crashed the whole page.
(The backend also nests the pitch under `pitch:{pitchType,headline,slides}` and omits
`token`/`visitorPain`/`conversationId` that the components expect at top level.)

## The fix (2 files)
- `src/app/api/client-page/[token]/route.ts`
  - Normalizes the backend payload into the exact `ClientPage` shape: maps diagnosis rows
    to `{label, relevance}` (label from the pressure's human name / observation; relevance
    from the visitor's own selected pressures first), flattens `pitch` → top-level
    `pitchType`/`slides`, and fills `token`/`visitorPain`/`conversationId`. Tolerant of
    both the old and new shapes so it can't drift again.
- `src/components/client-page/ClientPageShell.tsx`
  - Belt-and-braces: coerces each list to an array and filters malformed rows, and reads
    `relevance` through a safe accessor, so no single missing field can ever white-screen
    the page again.

## Apply
From the `itrix-web` root (folder with `package.json`):
```bash
unzip -o itrix-web-fix.zip -d _fix
bash _fix/web_fix/APPLY_WEB_FIX.sh
```
Backs up every file it touches (`*.bak-<timestamp>`). Then rebuild/redeploy (`next build`).

## Verified
- `tsc --noEmit` passes for the whole project (0 errors).
- The transform was run against the **real** backend `build_client_page` payload: the
  `{pressure, observation, …}` rows become clean `{label, relevance}` rows
  (e.g. "Compute cost growth"/high, "Stability or accuracy drift"/medium), and every field
  `ClientPageShell` / `PersonalizedHero` / `PitchSlideDeck` reads is present and typed —
  no undefined `.label` / `.relevance`.
