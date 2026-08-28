'use client';

import { Select } from '@/components/ui/Select';
import { useReviewStore } from '@/store/reviewStore';
import { PLATFORM_ENVIRONMENTS } from '@/lib/content/platformEnvironments';
import { useCommonCopy } from '@/lib/i18n/commonLocale';
import { useLocaleStore } from '@/store/localeStore';

export function PlatformEnvironmentSelector() {
  const copy = useCommonCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const environment = useReviewStore((s) => s.environment);
  const setEnvironment = useReviewStore((s) => s.setEnvironment);
  return (
    <Select
      label={ko ? '현재 어디에서 실행되나요?' : 'Where does it run today?'}
      placeholder={copy.environmentPlaceholder}
      options={PLATFORM_ENVIRONMENTS.map((e) => ({ value: e.value, label: e.label }))}
      value={environment ?? ''}
      onChange={(e) => setEnvironment(e.target.value || null)}
    />
  );
}
