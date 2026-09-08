'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ItrixLogo } from '@/components/brand/ItrixLogo';
import { SiteLocaleToggle } from '@/components/i18n/SiteLocaleToggle';
import { commonUi } from '@/lib/i18n/siteLocale';
import { useRailCopy } from '@/lib/i18n/conversationLocale';
import { useLocaleStore } from '@/store/localeStore';
import { useRailStore } from '@/store/railStore';

/**
 * Mobile-only WorkingShell chrome.
 *
 * The arrival surface already has an intentional mobile bar. Once a conversation
 * exists the shell changes, but the product identity, locale access and conversation
 * navigation must remain one coherent header rather than three controls floating over
 * the content. Locale persistence and rail state stay owned by their existing stores.
 */
export function WorkingMobileHeader() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = commonUi(locale);
  const railCopy = useRailCopy();
  const openRail = useRailStore((state) => state.openSheet);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageId = useId();
  const languageRootRef = useRef<HTMLDivElement | null>(null);
  const languageTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!languageOpen) return;

    function onPointerDown(event: PointerEvent) {
      const root = languageRootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setLanguageOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setLanguageOpen(false);
      languageTriggerRef.current?.focus();
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [languageOpen]);

  const currentLanguage = locale === 'ko' ? copy.korean : copy.english;
  const currentFlag = locale === 'ko' ? '🇰🇷' : '🇺🇸';

  return (
    <header className="working-mobile-header" data-testid="working-mobile-header">
      <div className="working-mobile-header__brand">
        <ItrixLogo width={96} priority />
      </div>

      <div ref={languageRootRef} className="working-mobile-header__language">
        <button
          ref={languageTriggerRef}
          type="button"
          className="working-mobile-header__language-trigger"
          aria-label={`${copy.language}: ${currentLanguage}`}
          aria-expanded={languageOpen}
          aria-controls={languageId}
          onClick={() => setLanguageOpen((open) => !open)}
        >
          <span aria-hidden="true" className="working-mobile-header__language-flag">{currentFlag}</span>
          <span className="working-mobile-header__language-current">{locale === 'ko' ? '한국어' : 'EN'}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 8 4 4 4-4" />
          </svg>
        </button>

        {languageOpen ? (
          <div
            id={languageId}
            className="working-mobile-header__language-menu"
            onClick={(event) => {
              if (event.target instanceof Element && event.target.closest('button')) {
                setLanguageOpen(false);
                languageTriggerRef.current?.focus();
              }
            }}
          >
            <p className="working-mobile-header__language-label">{copy.language}</p>
            <SiteLocaleToggle />
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="working-mobile-header__nav"
        aria-label={railCopy.openNavigation}
        onClick={openRail}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </header>
  );
}
