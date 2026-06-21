import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e/reference",
  outputDir: "./results/reference",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "./playwright-report/reference" }]],
  use: {
    baseURL: "http://127.0.0.1:8123",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm reference",
    reuseExistingServer: !process.env.CI,
    url: "http://127.0.0.1:8123",
    stderr: "pipe",
  },
})
