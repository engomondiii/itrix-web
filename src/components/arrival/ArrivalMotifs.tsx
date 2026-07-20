/**
 * The structural motifs behind the arrival screen.
 *
 * A layered grid and two low-opacity X marks (Brand Manual §5.2, §5.4). They are
 * STRUCTURE, not wallpaper: no formula patterns, no neon, no network imagery, no
 * robot, no AI brain. Opacity stays at .14 for the X and .32 for the grid, and
 * both are masked so they fade rather than ending at a hard edge.
 *
 * Entirely decorative and aria-hidden. They are also hidden below 768px, where
 * they would crowd the composer rather than frame it.
 */
export function ArrivalMotifs() {
  return (
    <>
      <div className="arrival-grid" aria-hidden="true" />
      <div className="arrival-x arrival-x--left" aria-hidden="true">
        <i />
        <b />
      </div>
      <div className="arrival-x arrival-x--right" aria-hidden="true">
        <i />
        <b />
      </div>
    </>
  );
}
