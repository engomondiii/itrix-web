'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { QualificationFlow } from '@/components/review/QualificationFlow';

export default function QualifyPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <SectionLabel>Step 2 · A few questions</SectionLabel>
        <h1 className="mt-3 text-web-h1 text-indigo-950">Help us read the fit.</h1>
        <p className="reading mt-3">Nine quick questions. They shape the diagnosis and route you to the right path.</p>
      </header>
      <QualificationFlow />
    </div>
  );
}
