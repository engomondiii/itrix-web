import type { NextConfig } from 'next';
import { validateFrontendProductionEnv } from './src/config/env.validation';

validateFrontendProductionEnv(process.env);

const nextConfig: NextConfig = {
  // Keep feature-flagged browser suites from sharing compiled public settings.
  // Production keeps the standard .next output directory.
  distDir: process.env.PLAYWRIGHT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  // Surface 1 holds no secrets; it proxies real work to the Django backend.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
  },
  async redirects() {
    return [
      { source: '/poc', destination: '/astop', statusCode: 301 },
      { source: '/en/poc', destination: '/en/astop', statusCode: 301 },
    ];
  },
  async rewrites() {
    const dashboard = process.env.DASHBOARD_ORIGIN || 'https://itrix-dashboard-production.up.railway.app';
    return [
      { source: '/itx-console-7k2m/:path*', destination: `${dashboard}/itx-console-7k2m/:path*` },
      { source: '/itx-console-assets/:path*', destination: `${dashboard}/itx-console-assets/:path*` },
    ];
  },
  async headers() {
    return [
      {source:'/:locale(en)?/unsubscribe',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'Referrer-Policy',value:'no-referrer'}]},
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: [
            "default-src 'self'", "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''),
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
            "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net", "img-src 'self' data: blob: https:", "media-src 'self' blob:",
            "frame-src 'self' https://challenges.cloudflare.com", "frame-ancestors 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'",
            "connect-src 'self' https://challenges.cloudflare.com " + [process.env.NEXT_PUBLIC_API_URL, process.env.NEXT_PUBLIC_WS_URL].filter(Boolean).map(value => { try { return new URL(value!).origin; } catch { return ''; } }).join(' '),
          ].join('; ') },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
