import { expect, test } from "@playwright/test"

test.describe("Smoke tests", { tag: "@smoke" }, async () => {
  test("homepage loads", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
  })

  test("unknown route returns 404", async ({ page }) => {
    await page.goto("/nonexistent-page-xyz")
    await expect(page.getByText("404 - page not found")).toBeVisible()
  })
})
