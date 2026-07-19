'use client';

import Link from 'next/link';
import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailText, RailEmpty } from './_primitives';

/** The link to the personalized brief, once one exists (State 3 → 4). */
export function OpenBriefSection({ href }: RailSectionRenderProps & { href?: string }) {
  if (!href) return <RailEmpty />;
  return (
    <RailPanel title="Your brief">
      <RailText>A short read on your situation, prepared for you.</RailText>
      <Link href={href} className="text-caption text-ink-primary underline underline-offset-2">
        Open my personalized brief
      </Link>
    </RailPanel>
  );
}
