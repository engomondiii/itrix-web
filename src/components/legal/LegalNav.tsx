'use client';

import Link from 'next/link';
import { LEGAL_INSTRUMENTS } from '@/lib/content/legalCopy';
import { LEGAL_INSTRUMENTS_KO } from '@/lib/i18n/legalKo';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { useLocaleStore } from '@/store/localeStore';
export function LegalNav({current}:{current:string}){const isKo=useLocaleStore(s=>s.locale)==='ko';return <nav className="legal-nav" aria-label={isKo ? '법률 문서' : 'Legal instruments'}><ul>{LEGAL_INSTRUMENTS.map(i=><li key={i.slug}><Link href={`/${i.slug}`} aria-current={i.slug===current?'page':undefined} className="legal-nav__link"><LocalizedText en={i.navLabel} ko={LEGAL_INSTRUMENTS_KO[i.slug].navLabel}/></Link></li>)}</ul></nav>}
