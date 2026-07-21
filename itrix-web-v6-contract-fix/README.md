# itrix-web — v6.0 Backend Contract Fix

Two Next.js BFF routes called backend endpoints that **do not exist**. Both failed
*quietly*, which is why nothing looked broken.

## Install

```bash
unzip itrix-web-v6-contract-fix.zip
bash itrix-web-v6-contract-fix/APPLY.sh
```

Two files. No components, no types, no styling.

## What I checked

I diffed your frontend against the deployed backend on every Phase 3 removal.
**Your frontend is already v6.0-aware** — this is a much better starting position
than I expected:

| Phase 3 removal | Frontend status |
|---|---|
| `left_rail` / `right_rail` | ✅ Already gone. Only referenced in comments explaining their removal. |
| `ENGAGED` / `CLIENT` states | ✅ Handled as `LegacyJourneyState` with a forward mapping in `journeyStates.ts`. |
| `tier` / `scoreBreakdown` on the result page | ✅ Not affected — the visitor path uses `/client-page/{token}/`, not the serializer I changed. |

## The two real bugs

**1. `/api/shell` called an endpoint that doesn't exist.**

It fetched `{API_BASE}/shell/`. Django mounts the contract at
`/threads/{id}/shell/`. Every call 404'd.

The failure was silent by design — `shellApi` falls back to the five base
sections, which is the correct restrictive default. So the symptom wasn't an
error; it was **a sidebar that never grew past State 1**.

Two further mismatches had to be closed in the same place:

- **Casing.** Django emits `journey_state`, `state_key`, `sidebar_sections`.
  `ShellContract` is camelCase. Unnormalised, every field reads `undefined`.
- **State key vocabulary.** Django's `state_key` is the enum name (`ARRIVED`,
  `NDA_REVIEW`); the frontend `StateKey` type is the slug (`arrival`, `nda`).

**2. `/api/artifacts/[id]` called an endpoint that doesn't exist.**

And that one is *correct backend behaviour*. Backend v6.0 §2.5 is explicit:

> The in-thread rendering is PRIMARY. A dedicated route is an ALTERNATIVE view.

The risk register names the failure if that inverts: *"deep-linked artifacts
become the real interface and the thread decays."* So artifacts arrive embedded
in the thread detail, and the route now reads them from there.

It requires `?thread=` because an artifact is scoped to its thread and the backend
authorizes by **thread ownership**. Fetching by id alone would treat the id as a
secret — and URL obscurity is never authorization (§11.9).

## Why the fix goes in the BFF layer

`src/app/api/*` is exactly the boundary for this, and
`api/client-page/[token]/route.ts` already normalises the same way for the same
reason. The backend is the single source of truth; the BFF absorbs wire-shape
differences so no component knows the backend's field casing.

The failure mode is unchanged: on any error, an empty payload → base sections.
If the vocabularies drift, the visitor sees **less** than they were entitled to,
never more.
