/**
 * "Under review" state — shown when a reply is held for human approval. Uses a
 * warning-soft pill (never a hard error color) with the EXACT Playbook wording
 * (§10 / §63). The frontend never shows an unapproved draft.
 */
export function UnderReviewPill() {
  return (
    <div className="flex items-start gap-2 rounded-md border-l-[3px] border-warning bg-warning-soft px-4 py-3">
      <span aria-hidden className="mt-0.5 text-warning-text">◍</span>
      <p className="text-secondary text-warning-text">
        The itriX team is reviewing this before it reaches you. You’ll see the response here shortly.
      </p>
    </div>
  );
}
