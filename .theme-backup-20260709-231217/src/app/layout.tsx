import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site.config';
import { ThemeProvider } from '@/context/ThemeContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { SiteChrome } from '@/components/layout/SiteChrome';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
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
  themeColor: '#131A33',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
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