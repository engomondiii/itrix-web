# itriX Web Fix — qualify proxy normalizes the backend response

## What this fixes
Even once the backend returns the token, the qualify proxy passed the backend body
through verbatim. The backend sends **snake_case** with a nested `score` object
(`lead_id`, `score.total`, `product_route`, …) while the browser reads **camelCase**
(`leadId`, `totalScore`, `scoreBreakdown`, `capabilityToken`, `journeyState`). This
mapping was missing, so scoring silently fell back to the local estimate and the token
never reached the client.

## The change (1 file)
`src/app/api/review/qualify/route.ts`
- Normalizes the backend body → the exact camelCase contract `reviewApi.qualify`
  expects. Accepts **both** casings and even extracts the token from a `reveal` /
  `reveals` descriptor, so it is robust to future backend shape tweaks.
- On backend 2xx-without-token it still returns the mapped scoring with
  `capabilityToken: null`; `/review/preparing` then falls back to polling
  `GET /journey/{token}` rather than dead-ending.
- Pair with the backend fix (which supplies the token); together they resolve the
  stuck `/review/preparing` state.

## How to apply
From the `itrix-web` root (the folder with `package.json`):
```bash
unzip -o itrix-web-fix.zip -d _fix
bash _fix/APPLY_WEB_FIX.sh
```
The script backs up each file it overwrites (`*.bak-<timestamp>`), then rebuild/redeploy.

## Verified
`tsc --noEmit` passes for the whole project with this file applied (0 errors).
