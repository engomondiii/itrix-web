'use client';

import { RailPanel, RailText, RailEmpty } from './_primitives';
import { useSuccessOverview } from '@/hooks/useSuccessOverview';

/** When we next sit down together, and where the agenda lives. */
export function NextSuccessReviewSection() {
  const { data } = useSuccessOverview();
  if (!data?.nextSuccessReviewAt) return <RailEmpty />;

  return (
    <RailPanel title="Next review">
      <RailText>{new Date(data.nextSuccessReviewAt).toLocaleString()}</RailText>
      <a href="/workspace/success/meetings" className="text-caption text-ink-primary underline underline-offset-2">
        See the agenda
      </a>
    </RailPanel>
  );
}
