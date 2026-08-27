'use client';

import Link from 'next/link';
import { routes } from '@/constants/routes';

/**
 * Kept only for source compatibility with older imports. My Review no longer contains an
 * account gate; workspace creation is an independent, open-registration action.
 */
export function AccountCreateGate() {
  return (
    <aside className="rounded-md border border-border-soft p-4">
      <p className="text-secondary text-ink-secondary">A workspace is optional and does not change what your review may disclose.</p>
      <Link href={routes.portalSignUp} className="mt-2 inline-block text-secondary font-medium text-ink-primary underline underline-offset-4">Open a workspace</Link>
    </aside>
  );
}
