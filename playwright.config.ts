import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm build && pnpm preview --host 127.0.0.1 --port 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop-light",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "desktop-dark",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "mobile-light",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "mobile-dark",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
        viewport: { width: 375, height: 812 },
      },
    },
  ],
});
