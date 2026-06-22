import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e/reference",
  outputDir: "./results/app-reference",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "./playwright-report/app-reference" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev",
    reuseExistingServer: false,
    url: "http://localhost:3000",
    stderr: "pipe",
  },
})
