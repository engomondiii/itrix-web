'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { Spinner } from '@/components/ui/Spinner';
import { DeploymentHealthPanel } from '@/components/success/DeploymentHealthPanel';
import { useDeploymentHealth } from '@/hooks/useDeploymentHealth';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/** Operational status, incidents, versions and the limitations we already know. */
export default function DeploymentsPage() {
  const { deployments, loading } = useDeploymentHealth();
  return (
    <>
      <PortalTopbar title="Deployments" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <header>
          <h1 className="font-display text-web-h2 text-ink-primary">{SUCCESS_COPY.deployments.title}</h1>
          <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{SUCCESS_COPY.deployments.intro}</p>
        </header>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <DeploymentHealthPanel deployments={deployments} />
        )}
      </div>
    </>
  );
}
