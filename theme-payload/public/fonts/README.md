# Fonts

Mathematical Glass Intelligence (Brand Bible v1.2) uses four faces:

- **Space Grotesk** — Display (Hero / Page / Section headings) → `--font-space-grotesk`
- **Inter** — Primary UI + body text → `--font-inter` (composed into `--font-sans`)
- **IBM Plex Mono** — technical labels, code, IDs, KPI numerals → `--font-mono`
- **Pretendard** — Korean body + heading fallback → `--font-korean`

Space Grotesk is Latin-only, so Korean glyphs inside a Display heading fall back
to Pretendard automatically (Brand Bible §4.1).

## How they load
- Space Grotesk, Inter, and IBM Plex Mono load through `next/font/google` in
  `src/app/layout.tsx`, so the app boots with no binary files committed and no
  layout shift. The CSS variables they expose (`--font-space-grotesk`,
  `--font-inter`, `--font-mono`) are consumed by the token layer.
- **Pretendard** loads from CDN via the first `@import` in `src/app/globals.css`.

## Optional: self-host instead
For offline builds / stricter CSP, drop woff2 files here:

    SpaceGrotesk-Medium.woff2  SpaceGrotesk-SemiBold.woff2  SpaceGrotesk-Bold.woff2
    Inter-Regular.woff2  Inter-Medium.woff2  Inter-SemiBold.woff2  Inter-Bold.woff2
    IBMPlexMono-Regular.woff2  IBMPlexMono-Medium.woff2
    Pretendard (static or variable woff2)

then swap the `next/font/google` calls in `layout.tsx` for `next/font/local`
pointing at these files, and replace the Pretendard CDN `@import` in
`globals.css` with a local `@font-face`. The CSS variable names stay identical,
so nothing else changes.
