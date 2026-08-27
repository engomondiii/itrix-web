import { buildMetadata } from '@/components/seo/PageMeta';
import { ClientPageCurrentLoader } from '@/components/client-page/ClientPageCurrentLoader';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = buildMetadata({ title: 'Your itriX review', path: '/c', noIndex: true });

/** Tokenless My Review. Authorization lives in an httpOnly BFF cookie. */
export default function ClientPageRoute() { return <ClientPageCurrentLoader />; }
