/**
 * The two shell modes (Architecture v2.7 §2.6, Surface 1 v6.0 §3.1).
 *
 *   arrival   one centred column. No conversation rail, no content pane, no
 *             navigation. The question and nothing else.
 *   working   rail + conversation column + content pane. Mounted the moment a
 *             thread exists, and never unmounted again.
 *
 * MODE IS DERIVED BY THE BACKEND AND RENDERED HERE. `shell.for_subject` returns
 * `shell_mode`; a client that decided its own mode could render a rail to a
 * visitor the backend has not authorized one for.
 *
 * The local predicate below is a PRE-BACKEND FALLBACK, used only while the
 * backend has not answered (Backend v7.0 Phase 1 is what makes it answer). It is
 * deliberately the honest threshold — the visitor's own first sentence — and it
 * fails toward `arrival`, which is the state that reveals least.
 */

export const SHELL_MODES = ['arrival', 'working'] as const;

export type ShellMode = (typeof SHELL_MODES)[number];

const KNOWN: ReadonlySet<string> = new Set(SHELL_MODES);

export function isShellMode(value: unknown): value is ShellMode {
  return typeof value === 'string' && KNOWN.has(value);
}

/**
 * Normalise a wire value. Anything unrecognised — including `undefined` — returns
 * null rather than guessing, so the caller can fall back explicitly instead of
 * silently inheriting a mode nobody chose.
 */
export function shellModeFromContract(value: unknown): ShellMode | null {
  return isShellMode(value) ? value : null;
}
