import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    // Customer Success is feature-gated in production. E2E intentionally enables
    // the customer-facing surface so its governed ASTOP/LO/entitlement contract is
    // exercised rather than silently testing the disabled-state placeholder.
    command: 'NEXT_PUBLIC_ENABLE_CUSTOMER_SUCCESS=true NEXT_PUBLIC_ENABLE_CLIENT_PORTAL=true npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
