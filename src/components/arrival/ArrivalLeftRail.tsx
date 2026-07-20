import { ARRIVAL_LEFT_RAIL } from '@/lib/content/arrivalCopy';

/**
 * The left rail at arrival — the current stage, and nothing else.
 *
 * "At arrival, the left rail shows only the current relationship stage and the
 * principle that progression is voluntary." (DESIGN_DECISIONS.md)
 *
 * It is STATIC. It carries no history, no saved context, no inferred company and
 * no persona — there is no relationship yet, and a panel implying otherwise on a
 * first visit reads as surveillance. In v5.0 it never grows: the moment the
 * visitor speaks, the conversation replaces it.
 *
 * The route dots are decorative and aria-hidden; the caption carries the meaning.
 */
export function ArrivalLeftRail() {
  return (
    <aside
      className="arrival-rail arrival-rail--left arrival-glass"
      aria-label="Current relationship stage"
    >
      <p className="arrival-label">{ARRIVAL_LEFT_RAIL.label}</p>

      <div className="arrival-rail__stage">
        <span className="arrival-rail__stage-number" aria-hidden="true">
          {ARRIVAL_LEFT_RAIL.stageNumber}
        </span>
        <div>
          <strong>{ARRIVAL_LEFT_RAIL.stageTitle}</strong>
          <span>{ARRIVAL_LEFT_RAIL.stageBody}</span>
        </div>
      </div>

      <div className="arrival-rail__route" aria-hidden="true">
        <span className="arrival-rail__dot is-active" />
        <span className="arrival-rail__line" />
        <span className="arrival-rail__dot" />
        <span className="arrival-rail__line" />
        <span className="arrival-rail__dot" />
      </div>

      <p className="arrival-rail__caption">{ARRIVAL_LEFT_RAIL.caption}</p>
    </aside>
  );
}
