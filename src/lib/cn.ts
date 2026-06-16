/**
 * cn — minimal, dependency-free className combiner.
 * Every primitive needs one; the Phase 1 file list has no utility module,
 * so this is the single helper added to make the component layer compile.
 * Swap for clsx + tailwind-merge later if call sites start composing
 * conflicting utilities.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
