import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { routes } from '@/constants/routes';

/**
 * Names the paid Alpha Compute Assessment — the first paid step the public sees
 * (Playbook §00E). Its deliverable is the Boundary Waste Map. No fee is ever shown;
 * terms and pricing are handled privately by the team.
 */
export function AssessmentOfferCard() {
  return (
    <Card variant="featured" className="flex flex-col gap-3">
      <SectionLabel tone="gold">Alpha Compute Assessment</SectionLabel>
      <h3 className="text-web-h3 text-indigo-950">A focused study of one real workload</h3>
      <p className="reading text-ink-700">
        A paid engineering study that looks at where your computation crosses unnecessary boundaries
        and produces a Boundary Waste Map — a prioritised view of where ALPHA Compute may help, and a
        recommendation on a proof of concept. You receive a clear engineering result even if you
        choose not to go further. It is arranged after an NDA; details are discussed privately.
      </p>
      <ul className="flex flex-col gap-1.5 text-secondary text-ink-700">
        <li className="flex items-start gap-2"><span aria-hidden className="mt-1 text-sapphire-600">•</span> A Boundary Waste Map of one workload</li>
        <li className="flex items-start gap-2"><span aria-hidden className="mt-1 text-sapphire-600">•</span> A prioritised view of where the waste sits</li>
        <li className="flex items-start gap-2"><span aria-hidden className="mt-1 text-sapphire-600">•</span> A recommendation on whether a PoC is worth it</li>
      </ul>
      <div className="pt-1">
        <Link href={routes.review}>
          <Button variant="gold" size="md">Request an Alpha Compute Assessment</Button>
        </Link>
      </div>
    </Card>
  );
}
