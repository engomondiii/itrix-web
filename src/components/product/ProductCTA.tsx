'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CLOSING_LINE, CTA } from '@/lib/content/ctaCopy';
import { useLocaleStore } from '@/store/localeStore';

export function ProductCTA({ heading, headingKo }: { heading?: string; headingKo?: string }) {
  const locale = useLocaleStore((state) => state.locale);
  return (
    <section className="section bg-canvas">
      <div className="container-page max-w-3xl rounded-lg border border-border-medium bg-surface p-10 text-center shadow-1">
        <h2 className="text-web-h2 text-structure-900">
          {locale === 'ko' ? (headingKo ?? '영업 통화가 아니라 워크로드에서 시작하세요.') : (heading ?? 'Start with the workload, not a sales call.')}
        </h2>
        <p className="reading mx-auto mt-3 text-center">
          {locale === 'ko' ? '질문에서 시작하세요. 근거가 허용하는 범위까지만 함께 검토합니다.' : CLOSING_LINE}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={CTA.beginReview.href}><Button variant="primary" size="lg">{locale === 'ko' ? '검토 시작하기' : CTA.beginReview.label}</Button></Link>
          <Link href={CTA.licensing.href}><Button variant="secondary" size="lg">{locale === 'ko' ? '라이선싱 알아보기' : CTA.licensing.label}</Button></Link>
        </div>
      </div>
    </section>
  );
}
