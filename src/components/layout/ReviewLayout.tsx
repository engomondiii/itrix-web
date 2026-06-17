'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
 * no marketing nav. The intake step (/review) presents the prompt and the live
 * read side by side, so it uses the full content width; the question / result /
 * confirmation steps read best as a single narrow column.
 */
export function ReviewLayout({ children, currentStep }: ReviewLayoutProps) {
  const pathname = usePathname();
  const isIntake = pathname === routes.review;
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
      <main className="container-page" style={{ maxWidth: isIntake ? 1120 : 760 }}>
        <div className="py-10">{children}</div>
      </main>
    </div>
  );
}