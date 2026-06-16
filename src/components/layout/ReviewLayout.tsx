import type { ReactNode } from 'react';
import Link from 'next/link';
import { routes } from '@/constants/routes';
import { REVIEW_STEPS } from '@/config/review.config';
import type { ReviewStep } from '@/types/review.types';
import { cn } from '@/lib/cn';

export interface ReviewLayoutProps {
  children: ReactNode;
  currentStep?: ReviewStep;
}

/**
 * Minimal chrome for the Compute Bottleneck Review — wordmark + step progress,
 * no marketing nav. In Phase 3 the /review segment should become a (review)
 * route group whose layout renders this, replacing the global Header/Footer.
 */
export function ReviewLayout({ children, currentStep }: ReviewLayoutProps) {
  const activeIndex = currentStep ? REVIEW_STEPS.indexOf(currentStep) : -1;

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="border-b border-line bg-surface">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href={routes.home} className="text-base font-bold tracking-tight text-indigo-950">
            iTri<span className="text-gold-500">X</span>
          </Link>
          <span className="text-micro font-semibold uppercase tracking-[0.1em] text-ink-400">Compute Bottleneck Review</span>
        </div>
        {currentStep ? (
          <div className="container-page flex gap-1.5 pb-3" aria-label="Review progress">
            {REVIEW_STEPS.map((step, i) => (
              <span
                key={step}
                className={cn('h-1 flex-1 rounded-pill transition-colors', i <= activeIndex ? 'bg-sapphire-600' : 'bg-surface-sunken')}
              />
            ))}
          </div>
        ) : null}
      </div>
      <main className="container-page" style={{ maxWidth: 760 }}>
        <div className="py-10">{children}</div>
      </main>
    </div>
  );
}
