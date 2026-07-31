'use client';

import { Button } from '@/components/ui/Button';

/**
 * "VIEW YOUR PAGE" — the affordance shown in the conversation once the backend has
 * revealed the personalised client page for this thread.
 *
 * It replaces the earlier auto-navigation: rather than forwarding the visitor the
 * instant the reveal event lands, the conversation shows this button so the visitor
 * finishes reading the reply and opens the page when they are ready. The click is the
 * only thing that navigates (to /c/<token>, via the hook's `open`), which keeps the
 * transcript's "never navigate on a turn" invariant intact.
 */
export function ViewYourPageButton({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="view-your-page">
      <Button type="button" variant="primary" size="md" onClick={onOpen}>
        View your page
      </Button>
    </div>
  );
}
