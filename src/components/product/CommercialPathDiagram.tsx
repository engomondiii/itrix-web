'use client';

import { useLocaleStore } from '@/store/localeStore';

const STEPS = [
  { en: 'Review', ko: '검토' },
  { en: 'Agreement if needed', ko: '필요 시 계약' },
  { en: 'Controlled evaluation', ko: '통제된 평가' },
  { en: 'PoC if separately selected', ko: '별도 선택 시 PoC' },
  { en: 'Commercial discussion if warranted', ko: '근거가 있을 때 상업 논의' },
];

/** Illustrative possibilities only. No step is automatic and an NDA is not content authorization. */
export function CommercialPathDiagram() {
  const locale = useLocaleStore((state) => state.locale);
  return (
    <div className="rounded-lg border border-border-medium bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
        {STEPS.map((step, i) => (
          <div key={step.en} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-md bg-surface px-3 py-3 text-center text-secondary font-medium text-ink-primary">
              {locale === 'ko' ? step.ko : step.en}
            </div>
            {i < STEPS.length - 1 ? <span aria-hidden className="hidden text-ink-muted md:inline">→</span> : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-caption text-ink-secondary">
        {locale === 'ko'
          ? '이 단계는 가능한 진행 경로를 보여줄 뿐 자동 순서가 아닙니다. 각 단계는 별도의 선택과 해당 권한이 필요하며, NDA 자체가 제한 자료 접근 권한을 만들지는 않습니다.'
          : 'These are possible stages, not an automatic sequence. Each later step requires its own decision and applicable authorization; an NDA protects an authorized disclosure but does not itself grant access.'}
      </p>
    </div>
  );
}
