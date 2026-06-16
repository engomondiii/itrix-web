'use client';

import { Select } from '@/components/ui/Select';
import { useReviewStore } from '@/store/reviewStore';
import { PLATFORM_ENVIRONMENTS } from '@/lib/content/platformEnvironments';

export function PlatformEnvironmentSelector() {
  const environment = useReviewStore((s) => s.environment);
  const setEnvironment = useReviewStore((s) => s.setEnvironment);
  return (
    <Select
      label="Where does it run today?"
      placeholder="Select an environment (optional)"
      options={PLATFORM_ENVIRONMENTS.map((e) => ({ value: e.value, label: e.label }))}
      value={environment ?? ''}
      onChange={(e) => setEnvironment(e.target.value || null)}
    />
  );
}
