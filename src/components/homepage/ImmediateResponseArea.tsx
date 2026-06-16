'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { NDAWarningBanner } from '@/components/review/NDAWarningBanner';
import { useImmediateResponse } from '@/hooks/useImmediateResponse';
import { pressureLabel } from '@/lib/content/pressureSignals';

/** Live, on-message acknowledgement that appears as the visitor describes their workload. */
export function ImmediateResponseArea() {
  const { response, hasInput } = useImmediateResponse();
  if (!hasInput) return null;

  return (
    <div className="flex flex-col gap-3">
      <Card variant="warm" className="flex flex-col gap-3">
        <span className="flex items-center gap-2 text-micro font-semibold uppercase tracking-[0.1em] text-sapphire-600">
          <StatusDot status="online" pulse /> Immediate read
        </span>
        <p className="text-web-body text-ink-900">{response.acknowledgement}</p>
        {response.recognizedPressures.length ? (
          <div className="flex flex-wrap gap-2">
            {response.recognizedPressures.map((p) => (
              <Badge key={p} tone="info">{pressureLabel(p)}</Badge>
            ))}
          </div>
        ) : null}
      </Card>
      <NDAWarningBanner />
    </div>
  );
}
