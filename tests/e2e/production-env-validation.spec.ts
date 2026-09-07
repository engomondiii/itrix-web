import { expect, test } from '@playwright/test';
import { validateFrontendProductionEnv } from '../../src/config/env.validation';

const productionBase = {
  NODE_ENV: 'production',
  NEXT_PUBLIC_SITE_URL: 'https://www.example.com',
  NEXT_PUBLIC_API_URL: 'https://api.example.com/api/v1',
  NEXT_PUBLIC_LEGAL_PUBLISHED: 'true',
  NEXT_PUBLIC_ENABLE_OPEN_SIGNUP: 'true',
} satisfies Record<string, string>;

function validate(overrides: Record<string, string | undefined> = {}) {
  validateFrontendProductionEnv({ ...productionBase, ...overrides });
}

test.describe('production frontend environment contract', () => {
  test('rejects a production API URL that points at localhost', () => {
    expect(() =>
      validate({ NEXT_PUBLIC_API_URL: 'http://localhost:8000/api/v1' }),
    ).toThrow(/NEXT_PUBLIC_API_URL must not point at localhost/i);
  });

  test('rejects realtime when no valid websocket URL is configured', () => {
    expect(() =>
      validate({
        NEXT_PUBLIC_ENABLE_REALTIME: 'true',
        NEXT_PUBLIC_WS_URL: '',
      }),
    ).toThrow(/NEXT_PUBLIC_WS_URL is required/i);

    expect(() =>
      validate({
        NEXT_PUBLIC_ENABLE_REALTIME: 'true',
        NEXT_PUBLIC_WS_URL: 'https://api.example.com/ws',
      }),
    ).toThrow(/NEXT_PUBLIC_WS_URL must use wss: or ws:/i);
  });

  test('accepts a valid production API URL', () => {
    expect(() => validate()).not.toThrow();
  });

  test('accepts a valid secure websocket configuration', () => {
    expect(() =>
      validate({
        NEXT_PUBLIC_ENABLE_REALTIME: 'true',
        NEXT_PUBLIC_WS_URL: 'wss://api.example.com/ws',
      }),
    ).not.toThrow();
  });

  test('allows intentionally disabled optional features without their optional settings', () => {
    expect(() =>
      validate({
        NEXT_PUBLIC_ENABLE_REALTIME: 'false',
        NEXT_PUBLIC_WS_URL: '',
        NEXT_PUBLIC_ENABLE_MARKDOWN_TURNS: 'false',
        NEXT_PUBLIC_MARKDOWN_LINK_ALLOWED_HOSTS: '',
      }),
    ).not.toThrow();
  });

  test('rejects an invalid required feature-flag pairing', () => {
    expect(() =>
      validate({
        NEXT_PUBLIC_ENABLE_OPEN_SIGNUP: 'true',
        NEXT_PUBLIC_LEGAL_PUBLISHED: 'false',
      }),
    ).toThrow(/NEXT_PUBLIC_LEGAL_PUBLISHED=true is required/i);
  });

  test('does not impose production-only requirements on local development', () => {
    expect(() =>
      validateFrontendProductionEnv({
        NODE_ENV: 'development',
        NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_API_URL: 'http://localhost:8000/api/v1',
        NEXT_PUBLIC_ENABLE_REALTIME: 'true',
      }),
    ).not.toThrow();
  });
});
