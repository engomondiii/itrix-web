import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["website-revisions.spec.ts"],
  workers: 2,
  use: { baseURL: "http://127.0.0.1:3127", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "firefox", use: devices["Desktop Firefox"] },
  ],
  webServer: {
    command:
      "WATCHPACK_POLLING=true PLAYWRIGHT_DIST_DIR=.next-playwright/revisions NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE=true NEXT_PUBLIC_ENABLE_TWO_MODE_SHELL=true NEXT_PUBLIC_ENABLE_CONTENT_PANE=true NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3127 API_URL=http://127.0.0.1:8000/api/v1 npm run dev -- --hostname 127.0.0.1 -p 3127",
    url: "http://127.0.0.1:3127",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
