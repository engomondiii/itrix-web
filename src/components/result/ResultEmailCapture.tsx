'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatusDot } from '@/components/ui/StatusDot';
import { useEmailCapture } from '@/hooks/useEmailCapture';

export function ResultEmailCapture() {
  const cap = useEmailCapture('result');

  if (cap.submitted) {
    return (
      <Card variant="default" className="flex items-center gap-3">
        <StatusDot status="success" />
        <p className="text-secondary text-ink-700">Thanks — the iTrix Assessment Team has your details and will be in touch.</p>
      </Card>
    );
  }

  return (
    <Card variant="default" className="flex flex-col gap-4">
      <div>
        <SectionLabel withRule={false}>Get the full briefing</SectionLabel>
        <p className="mt-2 text-secondary text-ink-700">
          Leave an email and a person from the team will follow up with the detail this page can’t show publicly.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Email" type="email" value={cap.email} onChange={(e) => cap.setEmail(e.target.value)} error={cap.errors.email} placeholder="you@company.com" />
        <Input label="Company (optional)" value={cap.company} onChange={(e) => cap.setCompany(e.target.value)} placeholder="Company" />
      </div>
      <div>
        <Button variant="primary" size="md" onClick={() => void cap.submit()} disabled={cap.submitting}>
          {cap.submitting ? 'Sending…' : 'Send me the briefing'}
        </Button>
      </div>
    </Card>
  );
}
