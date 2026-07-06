import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_VITE_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.walkthrough.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/walkthrough",
  use: {
    baseURL,
    trace: "off",
    screenshot: "off",
    video: "off",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  webServer: {
    command: `pnpm exec vite --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: "chromium-walkthrough",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 2560, height: 1440 },
      },
    },
  ],
});
