'use client';

import { PANE_COPY, PANE_COPY_KO } from '@/lib/content/paneCopy';
import { useLocaleStore } from '@/store/localeStore';
import { PaneCollapseControl } from './PaneCollapseControl';

/**
 * The pane's header.
 *
 * It names what the pane holds and claims nothing about it. What it must NOT carry
 * is any of the rows Architecture v2.6 §11.6A re-homed when the old right value rail
 * was retired — quick help, the confidentiality notice, the next-best-action, the
 * specialist card, the scheduling offer, the satisfaction pulse. v2.7 §2.7 restates
 * that re-homing as a prohibition, and this header is the most tempting place to
 * break it: a "Get help" button here would look natural and would quietly move the
 * visitor's route to a human out of the conversation.
 */
export function ContentPaneHeader({ onClose }: { onClose?: () => void }) {
  const paneCopy = useLocaleStore((state) => state.locale) === 'ko' ? PANE_COPY_KO : PANE_COPY;

  return (
    <header className="pane__header">
      <h2 className="pane__title">{paneCopy.header}</h2>
      {onClose ? (
        <button type="button" className="pane__close" onClick={onClose}>
          {paneCopy.close}
        </button>
      ) : (
        <PaneCollapseControl />
      )}
    </header>
  );
}
