import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — landing app.
 *
 * Lives inside `./landing/` so the test infra (config, tests/, screenshots/)
 * stays scoped to this app. Run from inside this folder:
 *
 *   cd landing
 *   npx playwright test                          # run everything
 *   npx playwright test smoke.spec.ts            # run one file
 *   npx playwright test --ui                      # debug mode
 *   npx playwright test --headed                  # visible browser
 *
 * The webServer block below auto-starts `npm run dev` on port 3000.
 * Screenshots from `page.screenshot()` land in `landing/tests/screenshots/`.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Visual regression: store screenshots under tests/screenshots/
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});