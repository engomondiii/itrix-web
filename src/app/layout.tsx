import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site.config';
import { ThemeProvider } from '@/context/ThemeContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ThreadProvider } from '@/context/ThreadContext';
import { ShellProvider } from '@/context/ShellContext';
import { ContentPaneProvider } from '@/context/ContentPaneContext';
import { ShellModeGate } from '@/components/shell/ShellModeGate';
import { LocaleDocumentSync } from '@/components/i18n/LocaleDocumentSync';
import { LocalizedText } from '@/components/i18n/LocalizedText';

/**
 * itriX Brand Manual v1.5 EN — type system (§4.1). Unchanged in v6.0.
 *
 *   Space Grotesk → --font-space-grotesk   Display: hero / page / section headings
 *   Inter         → --font-inter           Primary: ALL UI and body text
 *   IBM Plex Mono → --font-mono            Technical labels, versions, code, IDs
 *
 * Pretendard (Korean) is CDN-loaded in globals.css and sits in every stack.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'], weight: ['500', '600', '700'],
  variable: '--font-space-grotesk', display: 'swap',
});
const inter = Inter({
  subsets: ['latin'], weight: ['400', '500', '600', '700'],
  variable: '--font-inter', display: 'swap',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin'], weight: ['400', '500'],
  variable: '--font-mono', display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    type: 'website', siteName: siteConfig.name, title: siteConfig.title,
    description: siteConfig.description, url: siteConfig.url,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: { card: 'summary_large_image', title: siteConfig.title, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F8FAFC',
  width: 'device-width',
  initialScale: 1,
};

/**
 * ── THE GATE SITS ABOVE EVERY ROUTE, AND THAT IS THE POINT ──────────────────
 *
 * v6.0 mounts ShellModeGate here, replacing SiteChrome. Because it is above the
 * route tree, going from the arrival shell to the working shell MOUNTS TWO ZONES
 * AROUND A TREE THAT IS ALREADY ON SCREEN rather than navigating: the composer keeps
 * focus and an in-flight upload survives (Architecture v2.7 §2.6, tested in
 * tests/e2e/mode-transition.spec.ts).
 *
 * There is no global header and no global footer, and v6.0 removes what little was
 * left of them from the arrival screen too: the navigation links are gone, "NDA
 * access" became "Sign in", and the dark footer became the pinned legal strip. A
 * full-width bar above a conversation is furniture, and it competes with the one
 * thing the visitor came to do.
 *
 * The three providers wrap every route because the gate needs the contract on every
 * route. The ORDER IS A REAL DEPENDENCY, not a preference: ShellProvider keys its
 * contract off the active thread, and ContentPaneProvider needs both — it derives
 * the pane's sections from the shell contract and its artifacts from the active
 * thread.
 *
 * v6.0 PHASE 2 adds ContentPaneProvider here rather than inside WorkingShell,
 * because three places need the SAME answer about the pane: the pane renders itself,
 * the conversation header shows the open/hide control, and the artifact reference
 * card in the transcript decides whether "Open" focuses the pane or expands inline.
 * Mounting it per-shell would give each of them its own copy — three artifact
 * subscriptions, and three chances to disagree about whether the pane is visible.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink-primary antialiased">
        <LocaleDocumentSync />
        <a href="#content" className="skip-link">
          <LocalizedText en="Skip to the assessment" ko="평가로 건너뛰기" />
        </a>
        <ThemeProvider>
          <VisitorProvider>
            <ToastProvider>
              <ThreadProvider>
                <ShellProvider>
                  <ContentPaneProvider>
                    <ShellModeGate>{children}</ShellModeGate>
                  </ContentPaneProvider>
                </ShellProvider>
              </ThreadProvider>
            </ToastProvider>
          </VisitorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
