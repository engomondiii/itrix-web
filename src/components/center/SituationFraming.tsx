import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The H1 framing line of the approved center.
 *
 *   "You already know computation is holding you back."
 *
 * It states the visitor's situation before we ask anything. It is the first of
 * the seven center elements (Surface 1 v4.0 §2.1) and must remain recognisable:
 * Display face, 56px desktop / 32px mobile, ink-primary, tight leading.
 *
 * There is exactly one visually dominant message per screen (Brand Manual §6),
 * and on the first screen this is it.
 */
export function SituationFraming() {
  return (
    <>
      <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">
        {CENTER_COPY.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-web-h1 text-ink-primary">
        {CENTER_COPY.situationFraming}
      </h1>
    </>
  );
}
