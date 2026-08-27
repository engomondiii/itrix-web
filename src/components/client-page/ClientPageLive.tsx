'use client';

import { ClientPageShell } from './ClientPageShell';
import type { ClientPage } from '@/types/client.types';

/** A review reaches this component only after READY and secure access exchange. */
export function ClientPageLive({ initialPage }: { initialPage: ClientPage }) {
  return <ClientPageShell page={initialPage} />;
}
