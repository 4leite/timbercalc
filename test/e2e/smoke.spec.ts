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

test.describe("Calculator", { tag: "@tdd" }, async () => {
  test("switches to Emberpelts and shows brick support production", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: "District calculator" })).toBeVisible()
    await expect(page.getByText("Water Pump")).toBeVisible()

    await page.getByRole("button", { name: "Emberpelts" }).click()
    await page.getByLabel("Bricks surplus per day").fill("12")

    const productionTable = page.getByRole("table")

    await expect(productionTable.getByText("Fruit Juice")).toBeVisible()
    await expect(productionTable.getByText("Brick Kiln")).toBeVisible()
    await expect(productionTable.getByText("Clay Dredger")).toBeVisible()
  })
})
