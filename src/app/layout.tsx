import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site.config';
import { ThemeProvider } from '@/context/ThemeContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { SiteChrome } from '@/components/layout/SiteChrome';

/**
 * itriX Brand Manual v1.5 EN — type system (§4.1).
 *
 *   Space Grotesk → --font-space-grotesk   Display: hero / page / section headings
 *   Inter         → --font-inter           Primary: ALL UI and body text
 *   IBM Plex Mono → --font-mono            Technical labels, versions, code, IDs
 *
 * Pretendard (Korean) is CDN-loaded in globals.css and sits in every stack.
 * Space Grotesk is Latin-only, so Korean glyphs in a Display heading fall back
 * to Pretendard automatically — designers assign ONE "Display" style and the
 * script decides the face. Korean headings additionally release the negative
 * letter-spacing (see styles/base.css) to stop full-width glyphs clipping.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: { card: 'summary_large_image', title: siteConfig.title, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  /* Soft Signal White — the dominant canvas (Brand Manual §3.2). The browser
     chrome should match the page, not the structural ink. */
  themeColor: '#F8FAFC',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink-primary antialiased">
        <a href="#content" className="skip-link">
          Skip to the assessment
        </a>
        <ThemeProvider>
          <VisitorProvider>
            <ToastProvider>
              {/*
                SiteChrome mounts the RelationshipShell around every public route
                and steps aside for self-chromed segments (/review owns its
                ReviewLayout; the (portal) group owns its PortalShell). It is the
                ONE place that decision is made, so the shell can never be
                double-mounted.
              */}
              <SiteChrome>{children}</SiteChrome>
            </ToastProvider>
          </VisitorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
