# itriX-web — Theme swap: Atelier Indigo → Mathematical Glass Intelligence (Brand Bible v1.2)

This archive reskins `itrix-web` to the **Brand Bible v1.2 "Mathematical Glass
Intelligence"** system. **Only theme-layer files change** — colors, fonts,
tokens, and additive glass utility classes. No routes, components, hooks, API
proxies, state machine, or business logic are touched.

## Why this is safe (the approach)
Every component styles itself through **token names** (Tailwind color names like
`bg-canvas`, `text-ink-900`, `border-line`, `bg-sapphire-600`, and CSS variables
like `var(--canvas)`, `var(--ink-900)`). A codebase scan confirmed **162 files**
reference these names and **only one** hardcoded a brand hex (the `themeColor`
meta, updated here). So the whole surface is reskinned by **re-pointing token
values** while keeping every name identical — the robust, low-risk path that
honours "architecture stays the same, only colors/fonts change."

## Role mapping (old Atelier → v1.2)
| Token name (unchanged) | Was (Atelier Indigo) | Now (Glass v1.2) |
|---|---|---|
| `canvas` | warm paper `#FAF8F5` | cool paper `#F8FAFC` |
| `canvas.deep` | `#F4F1EC` | `#EAF0FF` |
| `indigo-950…700` | deep indigo | `#1F2937` ink ramp (structure) |
| `sapphire-*` | royal blue action | cool blue-white → ink scale |
| `gold-*` | brushed gold | holographic soft-blue accent |
| `ink-*` | warm ink | `#1F2937 / #4B5563 / #94A3B8` |
| `line` | warm hairline | slate glass borders |
| shadows | warm umber | cool ink-tinted glass shadows |
| radius | 6/8/12 | 10/14/20 (+28 panel) |
| fonts | Inter + JetBrains Mono | Space Grotesk (display) + Inter + IBM Plex Mono + Pretendard (KR) |

## Files in this archive (14)
All paths are relative to the `itrix-web` project root:

- `tailwind.config.ts` — color literals, fonts, sizes, radius, shadow, ring remapped
- `src/app/globals.css` — Pretendard CDN import + new `glass.css` import
- `src/app/layout.tsx` — next/font swap (Space Grotesk + Inter + IBM Plex Mono), `themeColor`
- `src/context/ThemeContext.tsx` — theme name → `mathematical-glass`
- `src/styles/base.css` — headings use Display face; slate focus ring
- `src/styles/chat.css` — sender-wash fallbacks retuned (agent/team distinction kept)
- `src/styles/glass.css` — **NEW** Brand Bible §8 component classes (`.glass-surface`, `.prompt-box`, `.button-primary/secondary/text/gated`, `.input-field`, `.chip`, `.nav`, `.diagram-*`, `.hero-title`/`.section-heading`, glass `@supports` fallback + `-webkit-` prefix)
- `src/styles/tokens/colors.css` — full v1.2 palette + raw glass/border/text tokens
- `src/styles/tokens/typography.css` — font families + v1.2 size/spacing scale
- `src/styles/tokens/spacing.css` — v1.2 8pt scale + retuned layout helpers
- `src/styles/tokens/borders.css` — slate glass borders + v1.2 radius + blur levels
- `src/styles/tokens/shadows.css` — cool glass shadows
- `src/styles/tokens/motion.css` — 180ms ease standard
- `public/fonts/README.md` — updated font notes

## Apply
Place `itrix-web-theme-v1.2.zip` in the `itrix-web` project root, then:

```bash
unzip -o itrix-web-theme-v1.2.zip && bash apply-theme.sh
```

`apply-theme.sh` backs up every overwritten file to `.theme-backup-<timestamp>/`
and prints a one-line restore command. Afterward:

```bash
rm -rf .next && npm run dev
```

## Notes
- Space Grotesk is Latin-only; Korean glyphs in headings fall back to Pretendard
  automatically (Brand Bible §4.1).
- Glass surfaces follow §8.7: background + border + blur together, `-webkit-`
  prefix always present, and an `@supports` opaque fallback so text stays legible.
- Semantic status colors (error/success/warning) are limited to lines, icons, and
  short message text per §8.6 — never full background fills.
- `src/styles/glass.css` is a NEW file; `globals.css` already imports it, so it
  must be applied together with the others (the script handles this).
