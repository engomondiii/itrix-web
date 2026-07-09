import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site.config';
import { ThemeProvider } from '@/context/ThemeContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { SiteChrome } from '@/components/layout/SiteChrome';

/**
 * Mathematical Glass Intelligence (Brand Bible v1.2) type system.
 *
 *   Space Grotesk → --font-space-grotesk   (Display: Hero/Page/Section headings)
 *   Inter         → --font-sans / --font-inter  (Primary: all UI + body text)
 *   IBM Plex Mono → --font-mono              (Technical labels, code, IDs, KPIs)
 *
 * Pretendard (Korean) is loaded from CDN in globals.css and referenced in the
 * font stacks; Space Grotesk is Latin-only, so Korean glyphs in a Display
 * heading fall back to Pretendard automatically (Brand Bible §4.1).
 *
 * The CSS-variable names --font-sans and --font-mono are preserved so the
 * token layer and every existing component continue to resolve correctly.
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
  // v1.2 dark structural ink (was Atelier deep indigo #131A33).
  themeColor: '#1F2937',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-canvas text-ink-900 antialiased">
        <ThemeProvider>
          <VisitorProvider>
            <ToastProvider>
              {/*
                Global marketing chrome (Header + Footer + #content main) is now
                applied by SiteChrome, which renders it for marketing routes and
                steps aside for self-chromed segments like /review (ReviewLayout).
                This replaces the chrome for the funnel instead of duplicating it.
              */}
              <SiteChrome>{children}</SiteChrome>
            </ToastProvider>
          </VisitorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
