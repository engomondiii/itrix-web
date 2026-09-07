type Env = Record<string, string | undefined>;

function enabled(value: string | undefined): boolean {
  return (value ?? '').toLowerCase() === 'true';
}

function enabledDefaultOn(value: string | undefined): boolean {
  return (value ?? '').toLowerCase() !== 'false';
}

function parsedUrl(name: string, value: string | undefined, protocols: string[]): URL {
  if (!value?.trim()) throw new Error(`${name} is required for a production build.`);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid URL.`);
  }
  if (!protocols.includes(url.protocol)) {
    throw new Error(`${name} must use ${protocols.join(' or ')}.`);
  }
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
    throw new Error(`${name} must not point at localhost in a production build.`);
  }
  return url;
}

/**
 * Validate only production invariants that would make an enabled customer flow unusable
 * or unsafe. Local development keeps its zero-config defaults, and optional disabled
 * features do not acquire new requirements merely because this validator exists.
 */
export function validateFrontendProductionEnv(env: Env): void {
  if ((env.NODE_ENV ?? '').toLowerCase() !== 'production') return;

  const site = parsedUrl('NEXT_PUBLIC_SITE_URL', env.NEXT_PUBLIC_SITE_URL, ['https:', 'http:']);
  const publicApi = parsedUrl('NEXT_PUBLIC_API_URL', env.NEXT_PUBLIC_API_URL, ['https:', 'http:']);

  // API_URL is the preferred server-only BFF endpoint. If omitted, the existing proxy
  // intentionally falls back to NEXT_PUBLIC_API_URL; validate it only when supplied.
  if (env.API_URL?.trim()) parsedUrl('API_URL', env.API_URL, ['https:', 'http:']);

  if (enabled(env.NEXT_PUBLIC_ENABLE_REALTIME)) {
    const ws = parsedUrl('NEXT_PUBLIC_WS_URL', env.NEXT_PUBLIC_WS_URL, ['wss:', 'ws:']);
    if (site.protocol === 'https:' && ws.protocol !== 'wss:') {
      throw new Error('NEXT_PUBLIC_WS_URL must use wss: when NEXT_PUBLIC_SITE_URL uses https:.');
    }
  }

  // Open signup defaults ON. Its UI blocks when legal publication is off, so shipping
  // that combination would expose a front door that can never complete.
  if (enabledDefaultOn(env.NEXT_PUBLIC_ENABLE_OPEN_SIGNUP) && !enabled(env.NEXT_PUBLIC_LEGAL_PUBLISHED)) {
    throw new Error(
      'NEXT_PUBLIC_LEGAL_PUBLISHED=true is required while open signup is enabled in production.',
    );
  }

  if (enabled(env.NEXT_PUBLIC_ENABLE_MARKDOWN_TURNS)) {
    const hosts = (env.NEXT_PUBLIC_MARKDOWN_LINK_ALLOWED_HOSTS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (hosts.length === 0) {
      throw new Error(
        'NEXT_PUBLIC_MARKDOWN_LINK_ALLOWED_HOSTS is required when Markdown turns are enabled.',
      );
    }
  }

  // Avoid accidentally compiling a public API endpoint under a different origin than the
  // declared site due solely to an empty/malformed host; no same-origin requirement exists.
  void publicApi;
}
