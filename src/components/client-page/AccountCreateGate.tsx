'use client';

import Link from 'next/link';
import { routes } from '@/constants/routes';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * Kept only for source compatibility with older imports. My Review no longer contains an
 * account gate; workspace creation is an independent, open-registration action.
 */
export function AccountCreateGate() {
  const copy = useCommonCopy();
  return (
    <aside className="rounded-md border border-border-soft p-4">
      <p className="text-secondary text-ink-secondary">{copy.workspaceOptional}</p>
      <Link href={routes.portalSignUp} className="mt-2 inline-block text-secondary font-medium text-ink-primary underline underline-offset-4">{copy.openWorkspace}</Link>
    </aside>
  );
}
