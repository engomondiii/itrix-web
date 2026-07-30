'use client';

import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * THE COMPOSER KEYBINDINGS (Surface 1 v6.0 §3.6, Architecture v2.7 §16.5, R39).
 *
 *   Enter          submits. Unchanged, and still the PRIMARY path.
 *   Shift + Enter  inserts a newline. Unchanged.
 *   Ctrl + X       submits — an accelerator, never the only way to send.
 *   Cmd + X        NEVER BOUND. On macOS this is Cut and must stay Cut.
 *
 * ── THE TWO GUARDS ON Ctrl + X, BOTH REQUIRED ───────────────────────────────
 *
 * 1. SELECTION GUARD. If the composer has a non-empty text selection, Ctrl + X
 *    performs the platform Cut and does NOT submit. On Windows and Linux Ctrl + X
 *    is the system Cut shortcut, and silently stealing it in the one field where a
 *    visitor may have typed for ten minutes would destroy work with no undo
 *    affordance. Note what this means in code: on the selection path we must NOT
 *    call preventDefault, or we would block the cut we are trying to protect.
 *
 * 2. MODIFIER GUARD. The binding tests the literal Control key and never
 *    `metaKey`. On macOS Ctrl + X is unbound by the platform, so the accelerator
 *    is free there; on Windows and Linux guard 1 keeps Cut intact.
 *
 * ── AND ONE THAT IS NOT ABOUT Ctrl + X ──────────────────────────────────────
 *
 * `isComposing` is checked before Enter submits. An IME commit fires an Enter
 * keydown, so without it a Korean or Japanese visitor would have a half-composed
 * sentence submitted for them — which is the same class of harm as guard 1, just
 * quieter.
 */
export interface UseSendKeysOptions {
  onSubmit: () => void;
  /** Set while a submit is in flight, so a second Enter cannot double-post. */
  disabled?: boolean;
}

export function useSendKeys({ onSubmit, disabled = false }: UseSendKeysOptions) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        /* React's synthetic event does not expose isComposing; the native one
           does, and it is the authoritative signal for an IME commit. */
        if ((e.nativeEvent as unknown as { isComposing?: boolean }).isComposing) return;
        e.preventDefault();
        if (!disabled) onSubmit();
        return;
      }

      /* Guard 2: literal Control only. metaKey is never bound. */
      const isCtrlX =
        (e.key === 'x' || e.key === 'X') && e.ctrlKey && !e.metaKey && !e.altKey;
      if (!isCtrlX) return;

      /* Guard 1: a live selection means the platform Cut wins. No preventDefault
         on this path — that is the whole point of the guard. */
      const el = e.currentTarget;
      if (el.selectionStart !== el.selectionEnd) return;

      e.preventDefault();
      if (!disabled) onSubmit();
    },
    [onSubmit, disabled],
  );

  return { onKeyDown };
}
