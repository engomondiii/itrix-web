/**
 * Reinvention · Rigor · Relevance (Playbook §10 trust value badges). Quiet,
 * qualitative reassurance beneath the prompt window — no numbers, no claims.
 */
const BADGES: { title: string; body: string }[] = [
  { title: 'Reinvention', body: 'We change the form of a computation before it runs, not just the hardware it runs on.' },
  { title: 'Rigor', body: 'Any benefit is validated through evaluation on your workload — never promised up front.' },
  { title: 'Relevance', body: 'The review is prepared around your problem, in your terms, not a generic pitch.' },
];

export function TrustValueBadges() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {BADGES.map((b) => (
        <div key={b.title} className="flex flex-col gap-1.5">
          <span className="text-micro font-semibold uppercase tracking-[0.1em] text-gold-600">{b.title}</span>
          <p className="text-secondary text-ink-500">{b.body}</p>
        </div>
      ))}
    </div>
  );
}
