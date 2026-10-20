import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';
import matrix from './playwright.release.matrix.json';

type Partition = keyof typeof matrix;

const PORTS: Record<Partition, number> = {
  base: 3101,
  bff: 3102,
  realtime: 3103,
  adaptive: 3104,
  accessibility: 3105,
};

const LOCAL_API_URL = 'http://127.0.0.1:8000/api/v1';

const COMMON = [
  'NEXT_PUBLIC_LEGAL_PUBLISHED=true',
  'NEXT_PUBLIC_ENABLE_OPEN_SIGNUP=true',
  'NEXT_PUBLIC_ENABLE_SIGNUP_INVITE_CODE=true',
].join(' ');

const FLAGS: Record<Partition, string> = {
  base: [
    'NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE=true',
    'NEXT_PUBLIC_ENABLE_TWO_MODE_SHELL=true',
    'NEXT_PUBLIC_ENABLE_CONTENT_PANE=true',
    'NEXT_PUBLIC_ENABLE_MARKDOWN_TURNS=true',
    'NEXT_PUBLIC_MARKDOWN_LINK_ALLOWED_HOSTS=arxiv.org,itrix.co.kr',
    'NEXT_PUBLIC_ENABLE_CLIENT_PORTAL=true',
    'NEXT_PUBLIC_ENABLE_CUSTOMER_SUCCESS=true',
  ].join(' '),
  bff: [
    'NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE=true',
    'NEXT_PUBLIC_ENABLE_CLIENT_PORTAL=true',
    'NEXT_PUBLIC_ENABLE_AUTH_ZONE=true',
    'NEXT_PUBLIC_ENABLE_PASSWORD_RESET=true',
    'NEXT_PUBLIC_ENABLE_LEGAL_ASSENT=true',
    'NEXT_PUBLIC_ENABLE_ATTACHMENTS=true',
  ].join(' '),
  realtime: [
    'NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE=true',
    'NEXT_PUBLIC_ENABLE_REALTIME=true',
    'NEXT_PUBLIC_ENABLE_STREAMING_TURNS=true',
    'NEXT_PUBLIC_WS_URL=ws://127.0.0.1:3999/ws',
  ].join(' '),
  adaptive: [
    'NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE=true',
    'NEXT_PUBLIC_ENABLE_REALTIME=true',
    'NEXT_PUBLIC_ENABLE_ADAPTIVE_QUESTIONS=true',
    'NEXT_PUBLIC_WS_URL=ws://127.0.0.1:3999/ws',
  ].join(' '),
  accessibility: [
    'NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE=true',
    'NEXT_PUBLIC_ENABLE_TWO_MODE_SHELL=true',
    'NEXT_PUBLIC_ENABLE_CONTENT_PANE=true',
    'NEXT_PUBLIC_ENABLE_CLIENT_PORTAL=true',
    'NEXT_PUBLIC_ENABLE_CUSTOMER_SUCCESS=true',
  ].join(' '),
};

export function releaseConfig(partition: Partition): PlaywrightTestConfig {
  const port = PORTS[partition];
  const baseURL = `http://127.0.0.1:${port}`;
  const projects =
    partition === 'accessibility'
      ? [
          { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
          { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
        ]
      : [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }];

  return defineConfig({
    testDir: './tests/e2e',
    testMatch: matrix[partition],
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI ? [['github'], ['line']] : 'line',
    use: {
      baseURL,
      trace: 'retain-on-failure',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
    projects,
    webServer: {
      command: `NEXT_PUBLIC_SITE_URL=${baseURL} NEXT_PUBLIC_API_URL=${LOCAL_API_URL} API_URL=${LOCAL_API_URL} ${COMMON} ${FLAGS[partition]} npm run dev -- --hostname 127.0.0.1 -p ${port}`,
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  });
}
