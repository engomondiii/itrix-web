/** Accept the configured public site behind an HTTPS edge, never arbitrary forwarded hosts. */
export function hasAllowedRequestOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin || origin === 'null') return false;
  const configured = process.env.WEBSITE_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL;
  // When configured, fail closed rather than treating a spoofed Host as authorization.
  const candidates = configured ? [configured] : [new URL(request.url).origin];
  return candidates.some((candidate) => {
    try {
      const url = new URL(candidate);
      return ['https:', 'http:'].includes(url.protocol) && url.origin === origin;
    } catch {
      return false;
    }
  });
}
