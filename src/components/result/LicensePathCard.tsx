import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { getLicensePathway } from '@/lib/content/licensePathways';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';
import type { LicensePathway } from '@/types/product.types';

export function LicensePathCard({ pathway }: { pathway: LicensePathway | null }) {
  const info = pathway ? getLicensePathway(pathway) : null;
  return (
    <Card variant="default" className="flex flex-col gap-3">
      <SectionLabel withRule={false}>Licensing signal</SectionLabel>
      {info ? (
        <>
          <div className="flex items-center gap-2">
            <h3 className="text-card-title text-indigo-950">{info.label}</h3>
            {pathway !== 'non_exclusive' ? <Badge tone="special">Premium</Badge> : null}
          </div>
          <p className="text-secondary text-ink-700">{info.summary}</p>
          <Link href={info.href} className="text-secondary text-sapphire-600 underline-offset-2 hover:underline">
            See this pathway →
          </Link>
        </>
      ) : (
        <p className="text-secondary text-ink-700">
          Licensing isn’t the focus yet — we’ll start with product fit. Terms are always handled by the team.
        </p>
      )}
      <p className="border-t border-line-subtle pt-3 text-caption text-ink-400">{NDA_WARNINGS.pricing}</p>
    </Card>
  );
}
