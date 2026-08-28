'use client';

import { useCenterCopy } from '@/lib/i18n/conversationLocale';

import Link from 'next/link';
import { ItrixLogo } from '@/components/brand/ItrixLogo';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';

/**
 * The wordmark and its descriptor — top left, on both shells.
 *
 * v6.0 CHANGES TWO THINGS.
 *
 * THE DESCRIPTOR DROPS "AI". It reads "Computational Infrastructure company"
 * (Playbook v1.7 §00 change 4). Only the descriptor changed; the corporate
 * positioning line in the Knowledge Core is untouched. The descriptor is TEXT,
 * not a link — it describes the company, it does not navigate anywhere.
 *
 * THE LOCKUP IS CHROME, NOT NAVIGATION. There are no navigation links beside it
 * any more. In the rail it starts a new conversation rather than returning to a
 * marketing homepage, because on this surface the front door IS a new
 * conversation; on the arrival screen it links home, which is where the visitor
 * already is, and exists so the mark is still a familiar affordance.
 *
 * Brand Manual §2.3–2.4: ≥120px wide with clear space equal to the lowercase "i"
 * height, enforced by the padding rather than trusted to a neighbour.
 */
export interface WordmarkLockupProps {
  /** `arrival` stacks the descriptor beside the mark; `rail` stacks it beneath. */
  variant?: 'arrival' | 'rail';
  /** Fired instead of navigating. The rail passes "start a new conversation". */
  onActivate?: () => void;
}

export function WordmarkLockup({ variant = 'arrival', onActivate }: WordmarkLockupProps) {
  const centerCopy = useCenterCopy();
  const inner = (
    <>
      <ItrixLogo width={120} priority={variant === 'arrival'} />
      <span className="wordmark__descriptor">{centerCopy.descriptor}</span>
    </>
  );

  if (onActivate) {
    return (
      <button
        type="button"
        className="wordmark"
        data-variant={variant}
        aria-label={`${brand.name} — start a new conversation`}
        onClick={onActivate}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={routes.home} className="wordmark" data-variant={variant} aria-label={`${brand.name} home`}>
      {inner}
    </Link>
  );
}
