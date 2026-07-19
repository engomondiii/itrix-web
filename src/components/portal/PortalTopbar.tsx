'use client';

import { usePortalAuth } from '@/hooks/usePortalAuth';

/** Slim workspace top bar: the current client + organization. No public chrome. */
export function PortalTopbar({ title }: { title: string }) {
  const { client } = usePortalAuth();
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border-medium bg-surface px-6 py-4">
      <h1 className="text-web-h3 text-structure-900">{title}</h1>
      {client ? (
        <div className="text-right">
          <p className="text-secondary font-medium text-ink-primary">{client.fullName ?? client.email}</p>
          {client.organization ? <p className="text-caption text-ink-secondary">{client.organization}</p> : null}
        </div>
      ) : null}
    </header>
  );
}
