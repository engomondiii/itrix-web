'use client';

import { Textarea } from '@/components/ui/Textarea';
import { useReviewStore } from '@/store/reviewStore';
import { useCommonCopy } from '@/lib/i18n/commonLocale';
import { useLocaleStore } from '@/store/localeStore';

export interface PromptInputProps {
  label?: string;
  error?: string;
}

export function PromptInput({ label, error }: PromptInputProps) {
  const copy = useCommonCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const prompt = useReviewStore((s) => s.prompt);
  const setPrompt = useReviewStore((s) => s.setPrompt);
  return (
    <Textarea
      label={label ?? (ko ? '비용 부담이 커지는 워크로드를 설명해 주세요' : 'Describe the workload that’s getting expensive')}
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      rows={4}
      placeholder={copy.workloadPlaceholder}
      hint={ko ? '쉬운 말로 설명해도 됩니다. 키워드보다 구조를 봅니다.' : 'Plain language is fine. We read the structure, not the keywords.'}
      error={error}
    />
  );
}
