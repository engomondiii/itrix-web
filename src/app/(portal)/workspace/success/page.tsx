'use client';

import Link from 'next/link';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { StateMorph } from '@/components/shell/StateMorph';
import { OutcomeProgressCard } from '@/components/success/OutcomeProgressCard';
import { DeploymentHealthPanel } from '@/components/success/DeploymentHealthPanel';
import { SupportRequestList } from '@/components/success/SupportRequestList';
import { ChangesSinceLastVisit } from '@/components/success/ChangesSinceLastVisit';
import { RelationshipTeamCard } from '@/components/success/RelationshipTeamCard';
import { ImprovementComposer } from '@/components/success/ImprovementComposer';
import { useSuccessOverview } from '@/hooks/useSuccessOverview';
import { useJourneyContext } from '@/context/JourneyContext';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import { siteConfig } from '@/config/site.config';

/**
 * State 10 — the customer-success home.
 *
 *   PRIORITY RULE
 *   Keeping paying customers happy and successful is more important than moving
 *   them toward another agreement. This is not an upsell page.
 *
 * The order on this page is the priority order, and it is deliberate:
 *
 *   1. what changed since they were last here   (what they missed)
 *   2. their outcomes                            (whether this is working)
 *   3. open support                              (what is hurting)
 *   4. deployment health                         (whether it is running)
 *   5. their named team                          (who to ask)
 *   6. the improvement composer                  (how to say something)
 *
 * There is no expansion CTA anywhere on this page, at any health level. The
 * backend's customer-first rule decides whether a commercial action is ever
 * ranked primary; this surface simply has nowhere to put one.
 */
export default function SuccessHomePage() {
  const { data, loading } = useSuccessOverview();
  const { stateKey } = useJourneyContext();

  if (!siteConfig.featureFlags.customerSuccess) {
    return (
      <>
        <PortalTopbar title="Your workspace" />
        <div className="mx-auto max-w-3xl px-6 py-8">
          <EmptyState>Customer success is not enabled for this workspace yet.</EmptyState>
        </div>
      </>
    );
  }

  return (
    <>
      <PortalTopbar title="Your workspace" />
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data ? (
          <StateMorph stateKey={stateKey}>
            <div className="flex flex-col gap-10">
              <header>
                <h1 className="font-display text-web-h2 text-ink-primary">{SUCCESS_COPY.home.welcome}</h1>
              </header>

              <Block title={SUCCESS_COPY.changes.title} intro={SUCCESS_COPY.changes.intro} href="/workspace/success/feedback" hideLink>
                <ChangesSinceLastVisit />
              </Block>

              <Block title={SUCCESS_COPY.outcomes.title} intro={SUCCESS_COPY.outcomes.intro} href="/workspace/success/outcomes">
                {data.outcomes.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {data.outcomes.slice(0, 3).map((o) => (
                      <OutcomeProgressCard key={o.id} outcome={o} />
                    ))}
                  </div>
                ) : (
                  <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.outcomes.empty}</p>
                )}
              </Block>

              <Block title={SUCCESS_COPY.support.title} intro={SUCCESS_COPY.support.intro} href="/workspace/success/support">
                <SupportRequestList requests={data.openSupport} />
              </Block>

              <Block title={SUCCESS_COPY.deployments.title} intro={SUCCESS_COPY.deployments.intro} href="/workspace/success/deployments">
                <DeploymentHealthPanel deployments={data.deployments.slice(0, 2)} />
              </Block>

              <Block title={SUCCESS_COPY.team.title} intro={SUCCESS_COPY.team.intro} href="/workspace/success/feedback" hideLink>
                <RelationshipTeamCard team={data.team} />
              </Block>

              <section aria-labelledby="improve-title" className="rounded-panel border border-border-soft bg-surface-glass-soft p-5">
                <h2 id="improve-title" className="sr-only">Tell us what to improve</h2>
                <ImprovementComposer />
              </section>
            </div>
          </StateMorph>
        ) : (
          <EmptyState>{SUCCESS_COPY.outcomes.empty}</EmptyState>
        )}
      </div>
    </>
  );
}

function Block({
  title, intro, href, hideLink = false, children,
}: {
  title: string; intro: string; href: string; hideLink?: boolean; children: React.ReactNode;
}) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={id} className="font-display text-web-h3 text-ink-primary">{title}</h2>
        {hideLink ? null : (
          <Link href={href} className="text-caption text-ink-primary underline underline-offset-2">
            See all
          </Link>
        )}
      </div>
      <p className="max-w-reading text-caption text-ink-secondary">{intro}</p>
      {children}
    </section>
  );
}
