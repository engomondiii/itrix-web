'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useShellStore, type MobileRail } from '@/store/shellStore';

export interface RailSheetProps {
  left: ReactNode;
  right: ReactNode;
  /** Hide the triggers entirely when neither rail has content. */
  hasLeft: boolean;
  hasRight: boolean;
}

const TABS: { key: Exclude<MobileRail, null>; label: string }[] = [
  { key: 'context', label: 'Context' },
  { key: 'next', label: 'Next step' },
];

/**
 * Tablet and mobile rails: Context / Work / Next step.
 *
 *   "Tablet 768–1023px: center first; rails become slide-over panels or tabs
 *    labeled Context / Work / Next step. Mobile <768px: single column."
 *    — Surface 1 v4.0 §3.5
 *
 * "Work" is the centre itself and is always present behind the sheet, which is
 * why only two triggers are rendered: the third tab is the thing you return to
 * by closing one of these.
 *
 * The sheet never gates content. It is a presentation of the same authorized
 * sections the desktop rails render, so a section unavailable on desktop is
 * unavailable here too — and a section authorized on desktop is always reachable
 * here, which is what stops small screens quietly losing the next best action.
 *
 * A trigger with nothing behind it is not rendered at all, matching the desktop
 * rule that an empty rail does not mount.
 */
export function RailSheet({ left, right, hasLeft, hasRight }: RailSheetProps) {
  const open = useShellStore((s) => s.mobileRail);
  const openRail = useShellStore((s) => s.openMobileRail);
  const closeRail = useShellStore((s) => s.closeMobileRail);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  // Escape closes, and focus returns to the trigger that opened it.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeRail();
        lastTrigger.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeRail]);

  const available = TABS.filter((t) => (t.key === 'context' ? hasLeft : hasRight));
  if (available.length === 0) return null;

  return (
    <>
      {/* Triggers — a quiet bar, below the centre, above the fold on mobile. */}
      <div className="rail-sheet__triggers" role="group" aria-label="Rail panels">
        {available.map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-expanded={open === tab.key}
            aria-controls="rail-sheet-panel"
            onClick={(e) => {
              lastTrigger.current = e.currentTarget;
              if (open === tab.key) closeRail();
              else openRail(tab.key);
            }}
            className="rail-sheet__trigger"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {open ? (
        <>
          <div
            className="rail-sheet__scrim"
            onClick={() => {
              closeRail();
              lastTrigger.current?.focus();
            }}
            aria-hidden="true"
          />
          <div
            id="rail-sheet-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={open === 'context' ? 'Context' : 'Next step'}
            tabIndex={-1}
            className="rail-sheet__panel"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">
                {open === 'context' ? 'Context' : 'Next step'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  closeRail();
                  lastTrigger.current?.focus();
                }}
                className="button-text text-caption"
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">{open === 'context' ? left : right}</div>
          </div>
        </>
      ) : null}
    </>
  );
}
