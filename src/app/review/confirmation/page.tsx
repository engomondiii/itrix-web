'use client';

import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { ResultEmailCapture } from '@/components/result/ResultEmailCapture';
import { useLeadStore } from '@/store/leadStore';
import { tierLabel, tierTone, tierSla } from '@/lib/formatting/formatTier';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';

export default function ConfirmationPage() {
  const tier = useLeadStore((s) => s.tier);
  const emailCaptured = useLeadStore((s) => s.emailCaptured);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <SectionLabel>Step 3 · You’re in good hands</SectionLabel>
        <h1 className="mt-3 text-web-h1 text-indigo-950">Thank you — this is read by a person.</h1>
        <p className="reading mt-3">
          Every qualified review is picked up by the {brand.assessmentTeam}. No bot closes the loop.
        </p>
      </header>

      {tier ? (
        <Card variant="warm" className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-secondary text-ink-700">
            <StatusDot status="online" pulse /> Assessment tier
            <Badge tone={tierTone(tier)}>{tierLabel(tier)}</Badge>
          </span>
          <span className="text-caption text-ink-500">{tierSla(tier)}</span>
        </Card>
      ) : null}

      {!emailCaptured ? <ResultEmailCapture /> : (
        <Card variant="default" className="flex items-center gap-3">
          <StatusDot status="success" />
          <p className="text-secondary text-ink-700">Your details are with the team — expect to hear back per the timing above.</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 border-t border-line-subtle pt-6">
        <Link href={routes.technology}><Button variant="secondary" size="md">Read the technology</Button></Link>
        <Link href={routes.home}><Button variant="ghost" size="md">Back to home</Button></Link>
      </div>
    </div>
  );
}
