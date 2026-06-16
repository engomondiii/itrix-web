const STEPS = ['Review', 'NDA', 'Evaluation', 'Proof-of-concept', 'License'];

/** The path from a structural review to a commercial license. */
export function CommercialPathDiagram() {
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
        {STEPS.map((step, i) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-md bg-surface-warm px-3 py-3 text-center text-secondary font-medium text-ink-900">
              {step}
            </div>
            {i < STEPS.length - 1 ? <span aria-hidden className="hidden text-ink-300 md:inline">→</span> : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-caption text-ink-400">
        The AI surface only ever takes you to the start of this path. Everything past the review is led by a person.
      </p>
    </div>
  );
}
