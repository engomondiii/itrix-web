'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { RevealGate } from './RevealGate';
import { CTA } from '@/lib/content/ctaCopy';
import { routes } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * The account-creation reveal (reveal ②) on the customized client page. Gated by
 * RevealGate so it appears only to holders of an unlocked account_invite (INVITED).
 *
 * Phase 2: wired to the live flow. When the portal flag is ON, the CTA leads to the
 * create-account page, which claims the invite and opens the workspace. When the flag
 * is OFF, the same CTA still leads to the create-account page, which shows the
 * graceful "we'll be in touch" fallback — so the reveal never dead-ends.
 */
export function AccountCreateGate({ token }: { token: string }) {
  const portalEnabled = siteConfig.featureFlags.clientPortal;

  return (
    <RevealGate surface="account_invite">
      <Card variant="featured" className="flex flex-col gap-3">
        <SectionLabel tone="gold">A workspace for this conversation</SectionLabel>
        <h3 className="text-web-h3 text-structure-900">Continue privately with the itriX team</h3>
        <p className="reading text-ink-secondary">
          Based on your review, you can create a private workspace to keep this conversation, share
          documents under NDA, and track next steps with the team.
        </p>
        <div className="pt-1">
          <Link
            href={routes.clientAccountCreate(token)}
            onClick={() => trackEvent('account.invite_intent', { token, portalEnabled })}
          >
            <Button variant="gold" size="md">
              {CTA.createWorkspace.label}
            </Button>
          </Link>
        </div>
      </Card>
    </RevealGate>
  );
}
