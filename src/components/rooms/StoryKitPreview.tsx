import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { brand } from '@/constants/brand';

/**
 * Story / media kit preview (Playbook §69 media, Part XIII). Shows the approved,
 * public-safe framing a journalist or storyteller can use — one-liner, paragraph,
 * and the disclosure boundary. Strictly public; no numbers, no mechanism.
 */
export function StoryKitPreview() {
  return (
    <div className="mx-auto flex max-w-reading flex-col gap-4">
      <Card variant="default" className="flex flex-col gap-2">
        <SectionLabel>One-line framing</SectionLabel>
        <p className="text-web-lead text-indigo-950">{brand.positioning}.</p>
      </Card>

      <Card variant="default" className="flex flex-col gap-2">
        <SectionLabel>Paragraph framing</SectionLabel>
        <p className="reading text-ink-900">
          itriX builds computational AI infrastructure for sustainable AI. Instead of scaling
          inefficient computation, it asks whether a workload can be reconstructed into a more
          efficient form before it runs — with any benefit validated through evaluation rather than
          promised. ALPHA Compute proposes the better form; ALPHA Core runs it on real hardware.
        </p>
      </Card>

      <Card variant="warm" className="flex flex-col gap-2">
        <SectionLabel tone="gold">What stays public vs confidential</SectionLabel>
        <p className="reading text-ink-700">
          Public: what itriX does and why, the thesis, and the published FQNM method. Not public:
          benchmark numbers, mechanism detail, pricing, and patent specifics — these are shared only
          under NDA. Please avoid implying guaranteed improvements; the careful words are “may,”
          “potential,” and “evaluated.”
        </p>
      </Card>

      <p className="text-caption italic text-ink-400">“{brand.thesis}”</p>
    </div>
  );
}
