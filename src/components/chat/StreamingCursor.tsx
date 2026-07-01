/** A blinking caret shown while an agent reply is streaming (Phase 3) or pending. */
export function StreamingCursor() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-sapphire-600 align-middle"
    />
  );
}
