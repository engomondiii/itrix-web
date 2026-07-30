'use client';

import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * `Show all five` — the reason a carousel is acceptable here at all.
 *
 * Rotation hides four of five prompts at any moment. R38 requires that ALL FIVE
 * remain reachable WITHOUT WAITING, and this is how: one tab stop from the group,
 * one activation, and the static list replaces the rotating one.
 *
 * It is a plain toggle rather than a modal or an expanding accordion, because the
 * thing being revealed is the same five buttons in a different arrangement.
 */
export interface ShowAllPromptsDisclosureProps {
  showAll: boolean;
  onToggle: () => void;
  controls: string;
}

export function ShowAllPromptsDisclosure({ showAll, onToggle, controls }: ShowAllPromptsDisclosureProps) {
  return (
    <button
      type="button"
      className="prompt-carousel__showall"
      aria-expanded={showAll}
      aria-controls={controls}
      onClick={onToggle}
    >
      {showAll ? CENTER_COPY.hideAllPrompts : CENTER_COPY.showAllPrompts}
    </button>
  );
}
