import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site.config';
import { ThemeProvider } from '@/context/ThemeContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ThreadProvider } from '@/context/ThreadContext';
import { ShellProvider } from '@/context/ShellContext';
import { SiteChrome } from '@/components/layout/SiteChrome';

/**
 * itriX Brand Manual v1.5 EN — type system (§4.1). Unchanged in v5.0.
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
 * v5.0: the global HEADER AND FOOTER ARE GONE.
 *
 * Their contents moved into the sidebar — brand, navigation and NDA access to
 * SidebarBrandNav, the legal links to SidebarLegalFooter (Surface 1 v5.0 §00.1
 * change 8, Playbook v1.6 §16A/§16D). A full-width bar above a conversation is
 * furniture, and it competes with the one thing the visitor came to do.
 *
 * The two providers wrap every route because the sidebar is present on every
 * route. ThreadProvider comes first: ShellProvider keys its contract off the
 * active thread, so the order is a real dependency, not a preference.
 */
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
              <ThreadProvider>
                <ShellProvider>
                  <SiteChrome>{children}</SiteChrome>
                </ShellProvider>
              </ThreadProvider>
            </ToastProvider>
          </VisitorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
