'use client';

import { DeploymentHealthPanel } from '@/components/success/DeploymentHealthPanel';
import { useDeploymentHealth } from '@/hooks/useDeploymentHealth';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';

/**
 * DEPLOYMENTS — environments, versions, last check, incidents, known limitations.
 *
 * This is the FACTUAL data a health signal is derived from. The signal itself — the
 * internal health class, and from Backend v7.0 its four values including `critical` —
 * never reaches this plane (Architecture v2.7 §10.5). A customer sees what is running
 * and what is wrong with it; they do not see how we grade them.
 *
 * Known limitations are shown rather than omitted. A deployment page that lists only
 * what works is a deployment page nobody trusts the second time.
 */
export function DeploymentsPaneSection() {
  const { deployments, loading } = useDeploymentHealth();

  return (
    <PaneSectionFrame
      section="deployments"
      loading={loading}
      empty={deployments.length === 0}
      emptyMessage={PANE_SECTION_EMPTY.deployments}
    >
      <DeploymentHealthPanel deployments={deployments} />
    </PaneSectionFrame>
  );
}
