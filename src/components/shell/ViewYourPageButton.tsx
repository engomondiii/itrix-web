'use client';

import { Button } from '@/components/ui/Button';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';

/**
 * "VIEW YOUR PAGE" — the affordance shown in the conversation once the backend has
 * revealed the personalised client page for this thread.
 *
 * It replaces the earlier auto-navigation: rather than forwarding the visitor the
 * instant the reveal event lands, the conversation shows this button so the visitor
 * finishes reading the reply and opens the page when they are ready. The click is the
 * only thing that navigates (to tokenless `/c`, after a one-time BFF exchange), which keeps the
 * transcript's "never navigate on a turn" invariant intact.
 */
export function ViewYourPageButton({ onOpen, disabled = false }: { onOpen: () => void; disabled?: boolean }) {
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  return (
    <div className="view-your-page">
      <Button type="button" variant="primary" size="md" onClick={onOpen} disabled={disabled}>
        {copy.viewReview}
      </Button>
    </div>
  );
}
