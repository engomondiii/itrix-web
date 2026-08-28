'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';
import { CTA } from '@/lib/content/ctaCopy';
import { useLocaleStore } from '@/store/localeStore';

export interface LicensingHeroProps {
  eyebrow: ReactNode;
  title: ReactNode;
  lead: ReactNode;
}

export function LicensingHero({ eyebrow, title, lead }: LicensingHeroProps) {
  const ko = useLocaleStore((state) => state.locale) === 'ko';
  return (
    <section className="relative overflow-hidden border-b border-border-medium bg-canvas">
      <BackgroundGrid />
      <div className="container-page relative py-16">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className="mt-4 max-w-3xl text-web-h1 text-structure-900">{title}</h1>
        <p className="reading mt-4 text-web-lead text-ink-secondary">{lead}</p>
        <div className="mt-8">
          <Link href={CTA.contactTeam.href}><Button variant="primary" size="lg">{ko ? '팀에 문의하기' : CTA.contactTeam.label}</Button></Link>
        </div>
      </div>
    </section>
  );
}
