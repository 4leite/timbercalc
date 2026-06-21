import { expect, test } from "@playwright/test"

import {
  expectCalculatorText,
  expectNoCalculatorText,
  openCalculator,
  productionDifficultySelect,
  seasonDifficultySelect,
} from "./helpers"

test.describe("Reference seasons and storage", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("accounts for normal hostile seasons and can switch to hard difficulty", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Off", exact: true }).click()

    await expect(page.getByRole("button", { name: "On", exact: true })).toBeVisible()
    await expect(page.getByRole("slider", { name: "Cycle 6+" })).toHaveValue("6")
    await expect(page.getByRole("slider", { name: "Water retention 0.0 d" })).toHaveValue("0")
    await expectCalculatorText(page, /Water storage\s+191\.70/)
    await expectCalculatorText(page, /Food storage\s+240\.30/)
    await expectCalculatorText(page, /Log storage\s+0\.00/)
    await expectCalculatorText(page, /Working 13 days out of 22 each cycle/)
    await expectCalculatorText(page, /Buildings\s+3/)
    await expectCalculatorText(page, /Trees\s+91/)

    await seasonDifficultySelect(page).selectOption("hard")

    await expect(seasonDifficultySelect(page)).toHaveValue("hard")
    await expect(productionDifficultySelect(page)).toHaveValue("hard")
    await expect(page.getByRole("slider", { name: "Cycle 13+" })).toHaveValue("13")
    await expectCalculatorText(page, /Hostile season\s+15 -\s+30\s+days/)
    await expectCalculatorText(page, /Water storage\s+639\.00/)
    await expectCalculatorText(page, /Food storage\s+801\.00/)
    await expectCalculatorText(page, /Working 5 days out of 35 each cycle/)
    await expectCalculatorText(page, /Unsustainable: plant will die during bad season/)
    await expectCalculatorText(page, /Buildings\s+9/)
    await expectCalculatorText(page, /Trees\s+374/)
  })

  test("hides seasonal storage controls again when seasons are off", async ({ page }) => {
    await page.getByRole("button", { name: "Off", exact: true }).click()
    await page.getByRole("button", { name: "On", exact: true }).click()

    await expect(page.getByRole("button", { name: "Off", exact: true })).toBeVisible()
    await expectNoCalculatorText(page, /Water storage\s+191\.70/)
    await expectNoCalculatorText(page, /Food storage\s+240\.30/)
    await expectNoCalculatorText(page, /Season duration and water availability table/)
    await expectCalculatorText(page, /Buildings\s+2/)
    await expectCalculatorText(page, /Trees\s+54/)
  })
})
