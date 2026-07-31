# itrix-web - "View Your Page" Button + No Content Pane on Client Page + itriX Logo Label

Supersedes `itrix-web-instant-page-and-logo-v1` (which you had not installed). Three
changes:

1. **"View your page" button** instead of auto-navigation - the visitor chooses when to
   open their personalised page.
2. **No content pane on the client page** - the right sidebar that kept popping on
   `/c/<token>` is suppressed there.
3. **itriX logo turn label** - itriX turns show the wordmark, not a CSS-uppercased
   "ITRIX".

## 1. "View your page" button (replaces auto-navigation)

The earlier approach forwarded the visitor to `/c/<token>` the instant the reveal event
arrived. That was jarring and took the choice away. Now:

- `useClientPageReveal` listens for the `journey.reveal` event (surface `client_page`)
  on the thread socket and exposes the token instead of navigating.
- `ConversationColumn` shows a **"View your page"** button (the shared `Button`
  primitive) above the composer once the reveal has arrived.
- Navigation happens only when the visitor clicks it. This also keeps the hook clear of
  the transcript's "never navigate on a turn" invariant (`useComposer`;
  `tests/e2e/no-navigation-on-submit.spec.ts`) - the click is the only navigation
  trigger.
- The link appended to the reply remains the fallback if realtime is off.

## 2. No content pane on the client page

### What was happening
The right-hand content pane ("WHAT ITRIX HAS PREPARED" - Explore / Legal / Products /
Technology / Licensing) is rendered by `WorkingShell`, which wraps almost every route
via `ShellModeGate`. The `/c/<token>` page is wrapped by it too. The pane becomes
"available" whenever the journey payload carries sections (`sections.length > 0` in
`useContentPane`), and on the client page the reveal delivers sections - so the pane
popped in, uninvited, beside a page that is already its own content surface.

### The fix
`WorkingShell` now suppresses the content pane on `/c/` routes: it skips both the
desktop `ContentPane` column and the mobile `PaneSheet`, and it drops the `data-pane`
layout flag so the grid does not reserve the third column. The **left conversation
rail is kept** (the visitor still needs "New chat" and their history) - only the right
pane is removed, and only on `/c/`.

This is presentation scope, not authorization: nothing about what the backend
authorized changes, and the pane still behaves normally on every other route. The
"Open content" toggle in the conversation header is gated on `pane.available` and lives
on the conversation surface, not the client page, so it is unaffected.

## 3. itriX logo turn label

The label text was already correct (`itrixTurn: 'itriX'`), but the CSS rule
`.turn__label { text-transform: uppercase }` forced it to render as "ITRIX" - in both
the settled turn label and the rotating "working" indicator. A small `ItrixTurnLabel`
component renders the supplied logo (`public/brand/itrix-logo-primary.png`, via the
existing `ItrixLogo`) in both spots, and a `.turn__label--brand` CSS modifier drops the
uppercase transform. The generic "YOU" label is untouched.

## Files in this change set

New (3):
- `src/components/transcript/ItrixTurnLabel.tsx` - the inline logo label.
- `src/hooks/useClientPageReveal.ts` - listens for the reveal and exposes the token +
  an `open()` navigate function (no longer auto-navigates).
- `src/components/shell/ViewYourPageButton.tsx` - the button shown on reveal.

Modified (5):
- `src/components/shell/ConversationColumn.tsx` - shows the "View your page" button on
  reveal.
- `src/components/shell/WorkingShell.tsx` - suppresses the content pane on `/c/` routes.
- `src/components/transcript/StreamingTurn.tsx` - uses the logo label (settled turn).
- `src/components/transcript/PendingTransferIndicator.tsx` - uses the logo label
  ("working" indicator).
- `src/styles/shell.css` - `.turn__label--brand` (drops uppercase) and `.view-your-page`
  (button spacing).

**No new dependencies.** Uses the logo asset already in `public/brand/`.

## How to install

Unzip inside the root of your `itrix-web` repo (the folder with `package.json`):

```powershell
powershell -ExecutionPolicy Bypass -File .\itrix-web-instant-page-and-logo-v2\INSTALL.ps1
npx tsc --noEmit
npm run build
git add -A
git commit -m "View your page button; no content pane on client page; itriX logo label"
git push
```

## Verification performed

- **TypeScript: clean** (`npx tsc --noEmit`, zero errors).
- **ESLint on the changed files: clean** (zero errors, zero warnings).
- **Production build: `next build` compiled successfully** ("Compiled successfully"),
  route table includes `/c/[token]`. Verified with the Google-Fonts network fetch
  stubbed locally, because this sandbox cannot reach fonts.googleapis.com; that font
  fetch is the ONLY thing that fails offline and is unrelated to these changes (the font
  import in `layout.tsx` was not touched, and `layout.tsx` in this package is byte-
  identical to your repo). On your machine with network, `npm run build` runs clean end
  to end.
- All shipped files verified pure CRLF, matching the repo convention.

## Pairs with the backend

This is the frontend half of the "instant page" experience. The backend package
(`itrix-backend-instant-client-page-v1`) creates the Lead, advances to CLIENT_PAGE,
mints the token, broadcasts the reveal, and appends the link. This package shows the
"View your page" button in response to that reveal. Deploy the backend first or
together; with only the frontend, there is no reveal event to act on yet.
