import { SectionLabel } from '@/components/ui/SectionLabel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { APPROVED_CLAIM_FRAMING } from '@/constants/disclosure';

export function BriefingPreviewSection() {
  return (
    <section className="section border-b border-line bg-canvas">
      <div className="container-page grid gap-8 md:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionLabel>What you get at the end</SectionLabel>
          <h2 className="mt-4 text-web-h2 text-indigo-950">A briefing that reads like a diagnosis.</h2>
          <p className="reading mt-4">
            Not a brochure — a structural read of your workload, the ALPHA path that fits, and conservative,
            conditional figures. The deep numbers stay behind an NDA; the shape of the answer doesn’t.
          </p>
        </div>
        <Card variant="warm" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-400">Sample briefing</span>
            <Badge tone="tier-2">Qualified</Badge>
          </div>
          <p className="text-secondary text-ink-700">
            “Pressure on cost and data movement, running on a numerical stack — a representation problem.
            ALPHA Compute first; {APPROVED_CLAIM_FRAMING.conservative}, {APPROVED_CLAIM_FRAMING.validation}.”
          </p>
          <div className="grid grid-cols-3 gap-2 border-t border-line-subtle pt-4">
            <div><span className="block text-micro uppercase text-ink-400">Arithmetic</span><span className="text-secondary text-ink-900">~3–4×</span></div>
            <div><span className="block text-micro uppercase text-ink-400">Accuracy</span><span className="text-secondary text-ink-900">Preserved</span></div>
            <div><span className="block text-micro uppercase text-ink-400">Proof</span><span className="text-secondary text-ink-900">arXiv + NDA</span></div>
          </div>
        </Card>
      </div>
    </section>
  );
}
