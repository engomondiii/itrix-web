import { brand } from '@/constants/brand';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export const siteConfig = {
  name: brand.name,
  title: `${brand.name} — ${brand.positioning}`,
  description:
    'iTrix builds computational AI infrastructure for sustainable AI. ALPHA Compute diagnoses how a workload is represented; ALPHA Core validates whether the transformed representation can run.',
  keywords: [
    'computational AI infrastructure',
    'sustainable AI',
    'ALPHA Compute',
    'ALPHA Core',
    'AXIOM',
    'CRE',
    'FQNM',
    'compute bottleneck',
  ],
  url: siteUrl,
  apiUrl,
  ogImage: '/og-image.png',
  thesis: brand.thesis,
} as const;
