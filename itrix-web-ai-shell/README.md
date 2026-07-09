# itriX — AI-App Shell for Surface 1 (v3.1)

This package converts the **public site (Surface 1)** from a traditional
header + page layout into a **modern AI-application interface** — a collapsible
left rail (carrying what used to be the top header) and a wide content canvas
whose centre of gravity is a large prompt composer, in the spirit of an AI chat
interface but styled entirely in itriX's own **Atelier Indigo** identity.

It changes **only presentation/chrome**. It does **not** touch the backend, the
review/journey machinery, the disclosure rules, the portal, or the dashboard.
The composer feeds the exact same `useReviewStore → /review` flow the old prompt
window used, so nothing downstream changes.

---

## What changed (behaviour)

- **No traditional top header on public routes.** The header's contents — logo,
  navigation (Products, Technology, Use Cases, Licensing, Resources, About), the
  single primary action (*Begin Compute Review*), and the positioning line — now
  live in a **left rail**.
- **Collapsible rail.** On desktop the rail collapses to a thin **icon rail** and
  a **Focus mode** button on the landing hides it entirely so the composer goes
  full-bleed. The chosen width is remembered across visits.
- **Mobile.** The rail is hidden and opens as a full-height overlay (with a scrim)
  from a compact top trigger bar. Closes on route change, backdrop tap, or Escape.
- **Landing = a big AI composer.** One question, one large input (Enter to begin,
  Shift+Enter for a newline), soft example prompts, and the exact pre-NDA
  confidentiality line. The calm narrative + the pulled-not-pushed drawers remain
  **below the fold**, anchored at `#learn-more`.
- **Spec-safe.** Prompt-first, pulled-not-pushed, value-first, one CTA vocabulary,
  and the confidentiality wording are all preserved. `/review` and the `(portal)`
  route group keep their own chrome (they are never wrapped by the shell).

---

## Files in this package (`files/`, mirrored to the repo)

**New**

- `src/store/shellStore.ts` — rail collapse/hide/mobile state (persisted width).
- `src/components/shell/AppShell.tsx` — the two-pane shell (rail + canvas), mobile overlay.
- `src/components/shell/SidebarRail.tsx` — the left rail (logo, nav, learn-more, CTA, footer).
- `src/components/shell/ShellLanding.tsx` — the big AI composer landing canvas.
- `src/components/shell/ShellIcons.tsx` — dependency-free inline icon set.
- `src/config/shellNav.config.tsx` — icon-aware nav model for the rail.
- `src/styles/shell.css` — shell motion/keyframes (reduced-motion safe).

**Replaced**

- `src/components/layout/SiteChrome.tsx` — routes public pages through `AppShell`
  instead of `Header`/`Footer`; keeps `/review` + portal bare.
- `src/app/page.tsx` — renders `ShellLanding` first; narrative moved to `#learn-more`.
- `src/app/globals.css` — adds the `shell.css` import (one line).

> `Header.tsx` / `Footer.tsx` are left in place (unused by the shell) so nothing
> else that references them breaks and you can revert instantly.

No new npm dependencies are added. Verified: `tsc --noEmit` = 0 errors,
ESLint = 0 problems.

---

## How to install

1. **Unzip this package inside the itrix-web root** (the folder containing
   `package.json`). You should get:

   ```
   itrix-web/
   ├── package.json
   ├── src/…
   └── itrix-web-ai-shell/
       ├── apply.sh
       ├── README.md
       └── files/…
   ```

2. **Run the apply script from the itrix-web root:**

   ```bash
   bash itrix-web-ai-shell/apply.sh
   ```

   It copies every file in `files/` to the same path in the repo, **replacing**
   existing files, and **backs up** each replaced file to a folder **outside** the
   repo: `../itrix-web-shell-backups/backup-<timestamp>/` (kept outside so the
   TypeScript compiler never scans the old copies).

3. **Preview it first (optional):**

   ```bash
   bash itrix-web-ai-shell/apply.sh --dry-run
   ```

4. **Start the dev server** (your usual command, e.g. `npm run dev`) and open `/`.

### If the package sits somewhere else
Point the script at the repo explicitly:

```bash
ITRIX_WEB_ROOT=/absolute/path/to/itrix-web bash itrix-web-ai-shell/apply.sh
```

---

## Rolling back

Every replaced file is backed up to `../itrix-web-shell-backups/backup-<timestamp>/`
(a sibling of the repo). To revert, copy those files back over the repo, or use
`git checkout` on the three replaced files (`src/app/page.tsx`,
`src/app/globals.css`, `src/components/layout/SiteChrome.tsx`) and delete the new
files: `src/components/shell/*`, `src/store/shellStore.ts`,
`src/config/shellNav.config.tsx`, and `src/styles/shell.css`.
