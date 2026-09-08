'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { SiteLocaleToggle } from '@/components/i18n/SiteLocaleToggle';
import { commonUi } from '@/lib/i18n/siteLocale';
import { useLocaleStore } from '@/store/localeStore';
import { SignInLink } from './SignInLink';

/**
 * Mobile-only presentation for the arrival bar's existing language and account
 * controls. The underlying locale store and auth routes remain owned by the same
 * components used on desktop; this component only gives them enough room on a
 * narrow viewport.
 */
export function ArrivalMobileMenu() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = commonUi(locale);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const root = rootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="arrival-mobile-nav">
      <button
        ref={triggerRef}
        type="button"
        className="arrival-mobile-menu__trigger"
        aria-label={open ? copy.closeNavigation : copy.openNavigation}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          {open ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          className="arrival-mobile-menu"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
          }}
        >
          <div className="arrival-mobile-menu__section">
            <p className="arrival-mobile-menu__label">{copy.language}</p>
            <SiteLocaleToggle />
          </div>
          <div className="arrival-mobile-menu__section arrival-mobile-menu__section--account">
            <SignInLink variant="arrival" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
