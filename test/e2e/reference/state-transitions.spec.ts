import { expect, test } from "@playwright/test"

import {
  botPopulationInput,
  expectCalculatorText,
  expectNoCalculatorText,
  openCalculator,
  productionDifficultySelect,
  seasonDifficultySelect,
  surplusQuantityInput,
} from "./helpers"

test.describe("Reference state transitions", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("switches to full bot workforce when requested", async ({ page }) => {
    await botPopulationInput(page).fill("6")

    await expectCalculatorText(page, /Working bvrs\s+20 \/ 9\s+100%/)
    await expectCalculatorText(page, /Working bots\s+0 \/ 6\s+0%/)

    await page.getByRole("button", { name: "Full bot workforce" }).click()

    await expectCalculatorText(page, /Working bvrs\s+0 \/ 9\s+0%/)
    await expectCalculatorText(page, /Working bots\s+20 \/ 6\s+100%/)
  })

  test("removes surplus rows and drops their dependency chain", async ({ page }) => {
    await page.getByRole("button", { name: /Add item/ }).click()
    await page.getByRole("option", { name: "Planks", exact: true }).click()

    const planksPerDay = surplusQuantityInput(page, "Planks")
    await planksPerDay.fill("12")
    await expectCalculatorText(page, /Lumber Mill\s+12 tiles\s+2 beavers\s+1\.6 Khp/)

    await page
      .locator(".surplus-row")
      .filter({ hasText: /^Planks\s*\/day$/i })
      .getByRole("button", { name: "Remove" })
      .click()

    await expect(page.locator(".surplus-row").filter({ hasText: /^Planks\s*\/day$/i })).toHaveCount(
      0,
    )
    await expectNoCalculatorText(page, /Lumber Mill/)
    await expectNoCalculatorText(page, /Oak tree\s+45 terrain/)
    await expectCalculatorText(page, /Production\s+48 items\/day/)
    await expectCalculatorText(page, /Buildings\s+2/)
  })

  test("keeps production and season difficulty in sync in both directions", async ({ page }) => {
    await expect(productionDifficultySelect(page)).toHaveValue("normal")
    await productionDifficultySelect(page).selectOption("easy")
    await expect(productionDifficultySelect(page)).toHaveValue("easy")

    await page.getByRole("button", { name: "Off", exact: true }).click()
    await expect(page.getByRole("button", { name: "On", exact: true })).toBeVisible()
    await expect(seasonDifficultySelect(page)).toHaveValue("easy")

    await seasonDifficultySelect(page).selectOption("hard")
    await expect(seasonDifficultySelect(page)).toHaveValue("hard")
    await expect(productionDifficultySelect(page)).toHaveValue("hard")

    await productionDifficultySelect(page).selectOption("normal")
    await expect(productionDifficultySelect(page)).toHaveValue("normal")
    await expect(seasonDifficultySelect(page)).toHaveValue("normal")
  })
})
