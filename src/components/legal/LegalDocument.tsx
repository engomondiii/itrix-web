'use client';

import Link from 'next/link';
import { routes } from '@/constants/routes';
import { ItrixLogo } from '@/components/brand/ItrixLogo';
import { LEGAL_UNPUBLISHED_NOTICE, LEGAL_PUBLISHED } from '@/lib/content/legalCopy';
import { LEGAL_INSTRUMENTS_KO } from '@/lib/i18n/legalKo';
import type { LegalInstrument } from '@/lib/content/legalCopy';
import { LegalNav } from './LegalNav';
import { LegalVersionBadge } from './LegalVersionBadge';
import { SiteLocaleToggle } from '@/components/i18n/SiteLocaleToggle';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { useLocaleStore } from '@/store/localeStore';

/** Server-rendered English remains the canonical no-JS fallback; Korean is an in-page convenience rendering of the same published v1.2 policy substance. */
export function LegalDocument({ instrument }: { instrument: LegalInstrument }) {
  const isKo = useLocaleStore((s) => s.locale) === 'ko';
  const ko = LEGAL_INSTRUMENTS_KO[instrument.slug];
  return (
    <div className="legal-page">
      <header className="legal-page__bar">
        <Link href={routes.home} className="legal-page__brand" aria-label={isKo ? 'itriX 홈' : 'itriX home'}><ItrixLogo width={104} /></Link>
        <div className="flex items-center gap-3"><SiteLocaleToggle compact /><LegalNav current={instrument.slug} /></div>
      </header>
      <main id="content" className="legal-page__main">
        <article className="legal-doc">
          <h1 className="legal-doc__title"><LocalizedText en={instrument.title} ko={ko.title} /></h1>
          <p className="legal-doc__standfirst"><LocalizedText en={instrument.standfirst} ko={ko.standfirst} /></p>
          <LegalVersionBadge instrument={instrument} />
          {!LEGAL_PUBLISHED ? <aside className="legal-draft" role="note"><p className="legal-draft__label"><LocalizedText en="Publication unavailable" ko="게시 불가" /></p><LocalizedText en={<p>{LEGAL_UNPUBLISHED_NOTICE}</p>} ko={<p>현재 법률 문서는 게시되지 않았습니다. 현재 적용되는 문서가 필요하면 itrix@gpslab.org로 문의하십시오. 한국어 표시는 영어 정책과 동일한 내용을 전달하기 위한 편의 번역이며 충돌 시 영어 버전이 우선합니다.</p>} /></aside> : null}
          {instrument.sections.map((section, index) => {
            const ks = ko.sections[index];
            return <section key={section.heading} className="legal-doc__section"><h2><LocalizedText en={section.heading} ko={ks?.heading ?? section.heading} /></h2><LocalizedText en={renderBody(section.body)} ko={renderBody(ks?.body ?? section.body)} /></section>;
          })}
        </article>
      </main>
    </div>
  );
}
function renderBody(body:string[]){const blocks:Array<{kind:'p';text:string}|{kind:'ul';items:string[]}>=[];for(const raw of body){if(raw.startsWith('· ')){const last=blocks[blocks.length-1];const item=raw.slice(2);if(last&&last.kind==='ul')last.items.push(item);else blocks.push({kind:'ul',items:[item]});}else blocks.push({kind:'p',text:raw});}return blocks.map((block,i)=>block.kind==='p'?<p key={i}>{block.text}</p>:<ul key={i}>{block.items.map(item=><li key={item}>{item}</li>)}</ul>)}
