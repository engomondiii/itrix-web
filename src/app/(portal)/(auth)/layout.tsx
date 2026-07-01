import type { ReactNode } from 'react';
import Link from 'next/link';
import { routes } from '@/constants/routes';
import { brand } from '@/constants/brand';

/** Centered auth layout — no sidebar, calm warm-paper canvas (Playbook §61). */
export default function PortalAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-12">
      <Link href={routes.home} className="mb-8 text-xl font-bold tracking-tight text-indigo-950">
        iTri<span className="text-gold-500">X</span>
      </Link>
      <div className="w-full max-w-md rounded-lg border border-line bg-surface p-8 shadow-1">{children}</div>
      <p className="mt-6 text-caption italic text-ink-400">“{brand.thesis}”</p>
    </div>
  );
}
