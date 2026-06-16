# Fonts

Atelier Indigo uses **Inter** (UI + display) and **JetBrains Mono** (code / IDs / KPI numerals).
Space Grotesk from the original spec is intentionally dropped (Atelier Indigo §6).

Phase 1 loads both faces through `next/font/google` in `src/app/layout.tsx`, so the app
boots with no binary files committed and no layout-shift.

## Optional: self-host instead
If you prefer self-hosted woff2 (offline builds, stricter CSP), drop these here:

    Inter-Regular.woff2  Inter-Medium.woff2  Inter-SemiBold.woff2  Inter-Bold.woff2
    JetBrainsMono-Regular.woff2  JetBrainsMono-Medium.woff2

then swap the `next/font/google` calls in `layout.tsx` for `next/font/local` pointing at
these files. The CSS variables (`--font-sans`, `--font-mono`) stay identical, so nothing
else changes.
