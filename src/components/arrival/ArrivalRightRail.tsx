'use client';

import { ARRIVAL_RIGHT_RAIL } from '@/lib/content/arrivalCopy';

/**
 * The right rail at arrival — disclosure and control.
 *
 * "At arrival, the right rail communicates disclosure and control."
 * (DESIGN_DECISIONS.md)
 *
 * NEVER A SALES PANEL. Every line here is about what the VISITOR controls: what
 * they share, that nothing confidential is needed, that an NDA appears only when
 * it is useful. There is no next-best-action, no offer and no call to book
 * anything — the visitor has not spoken yet, so there is nothing to recommend.
 *
 * This is also why v5.0 could retire the right rail from the conversation
 * without losing anything: at arrival it says "you are in control", and once the
 * conversation starts, the composer's confidentiality notice says the same thing
 * in the place it actually matters.
 */
export function ArrivalRightRail({ onOpenNda }: { onOpenNda: () => void }) {
  return (
    <aside
      className="arrival-rail arrival-rail--right arrival-glass"
      aria-label="Disclosure and control"
    >
      <p className="arrival-label">{ARRIVAL_RIGHT_RAIL.label}</p>

      <div className="arrival-rail__status">
        <span className="arrival-rail__status-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3 5.5 6v5.5c0 4.2 2.7 7.6 6.5 9.5 3.8-1.9 6.5-5.3 6.5-9.5V6L12 3Z" />
          </svg>
        </span>
        <div>
          <strong>{ARRIVAL_RIGHT_RAIL.statusTitle}</strong>
          <span>{ARRIVAL_RIGHT_RAIL.statusBody}</span>
        </div>
      </div>

      <ul className="arrival-rail__list">
        {ARRIVAL_RIGHT_RAIL.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <button type="button" className="arrival-button-text" onClick={onOpenNda}>
        {ARRIVAL_RIGHT_RAIL.ndaLink}
      </button>
    </aside>
  );
}
