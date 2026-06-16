'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatusDot } from '@/components/ui/StatusDot';
import { useEmailCapture } from '@/hooks/useEmailCapture';

export function EmailCaptureSection() {
  const cap = useEmailCapture('homepage');
  return (
    <section className="section bg-canvas">
      <div className="container-page max-w-3xl rounded-lg border border-line bg-surface p-10 shadow-1">
        {cap.submitted ? (
          <div className="flex items-center gap-3">
            <StatusDot status="success" />
            <p className="text-web-body text-ink-900">Thanks — we’ll be in touch from the iTrix Assessment Team.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <SectionLabel>Stay close to the work</SectionLabel>
              <h2 className="mt-3 text-web-h2 text-indigo-950">No newsletter noise. Just the team, when it’s relevant.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-1">
                <Input type="email" value={cap.email} onChange={(e) => cap.setEmail(e.target.value)} error={cap.errors.email} placeholder="you@company.com" aria-label="Email" />
              </div>
              <Button variant="primary" size="md" onClick={() => void cap.submit()} disabled={cap.submitting}>
                {cap.submitting ? 'Sending…' : 'Keep me posted'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
