import { expect, test } from "@playwright/test"

import { calculator, expectCalculatorText, expectNoCalculatorText, openCalculator } from "./helpers"

test.describe("Reference production calculations", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("recalculates demand and labor when population increases", async ({ page }) => {
    await page.getByRole("spinbutton", { name: "Total beaver population" }).fill("25")

    await expect(page.getByRole("spinbutton", { name: "Total beaver population" })).toHaveValue(
      "25",
    )
    await expectCalculatorText(page, /Water Pump\s+8 tiles\s+2 beavers/)
    await expectCalculatorText(page, /Berries\s+100%\s+134\s+\(133\.50\)/)
    await expectCalculatorText(page, /Gatherer Flag\s+2 tiles\s+2 beavers/)
    await expectCalculatorText(page, /Food consumed\s+66\.8 \/day/)
    await expectCalculatorText(page, /Water consumed\s+53\.3 \/day/)
    await expectCalculatorText(page, /Production\s+120 items\/day/)
    await expectCalculatorText(page, /Buildings\s+4/)
    await expectCalculatorText(page, /Working bvrs\s+4 \/ 22\s+18%/)
  })

  test("removes need-driven production when beaver needs are disabled", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Beavers needs" }).click()

    await expect(page.getByRole("checkbox", { name: "Beavers needs" })).not.toBeChecked()
    await expectCalculatorText(page, /No buildings required/)
    await expectCalculatorText(page, /Working bvrs\s+0 \/ 9\s+0%/)
    await expectCalculatorText(page, /Production\s+0 items\/day/)
    await expectCalculatorText(page, /Buildings\s+0/)
    await expectNoCalculatorText(page, /Water Pump\s+4 tiles/)
  })

  test("keeps the reference behavior for negative population input", async ({ page }) => {
    await page.getByRole("spinbutton", { name: "Total beaver population" }).fill("-3")

    await expect(page.getByRole("spinbutton", { name: "Total beaver population" })).toHaveValue(
      "-3",
    )
    await expectCalculatorText(page, /No buildings required/)
    await expectCalculatorText(page, /Food consumed\s+-8\.0 \/day/)
    await expectCalculatorText(page, /Water consumed\s+-6\.4 \/day/)
    await expectCalculatorText(page, /Working bvrs\s+no beavers/)
    await expectCalculatorText(page, /Production\s+0 items\/day/)
    await expectCalculatorText(page, /Buildings\s+0/)
    await expect(calculator(page)).not.toContainText(/Gatherer Flag\s+1 tiles/)
  })
})
