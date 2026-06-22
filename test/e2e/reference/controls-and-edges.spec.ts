import { expect, test } from "@playwright/test"

import { expectCalculatorText, expectNoCalculatorText, openCalculator } from "./helpers"

test.describe("Reference controls and edge inputs", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("keeps zero population as a valid no-demand state", async ({ page }) => {
    await page.getByRole("spinbutton", { name: "Total beaver population" }).fill("0")

    await expect(page.getByRole("spinbutton", { name: "Total beaver population" })).toHaveValue("0")
    await expectCalculatorText(page, /No buildings required/)
    await expectCalculatorText(page, /Food consumed\s+0 \/day/)
    await expectCalculatorText(page, /Water consumed\s+0 \/day/)
    await expectCalculatorText(page, /Working bvrs\s+no beavers/)
    await expectCalculatorText(page, /Available \(all\)\s+0 carriers/)
    await expectCalculatorText(page, /Production\s+0 items\/day/)
    await expectCalculatorText(page, /Buildings\s+0/)
    await expectCalculatorText(page, /HP used\s+0 hp/)
  })

  test("resets production mix sliders back to the water-pump baseline", async ({ page }) => {
    const waterMixInputs = page.getByRole("textbox", { name: "Mix % for Water" })
    const waterPumpMix = waterMixInputs.first()
    const largeWaterPumpMix = waterMixInputs.nth(1)

    await waterPumpMix.fill("0")
    await largeWaterPumpMix.click()
    await largeWaterPumpMix.press("ControlOrMeta+A")
    await largeWaterPumpMix.pressSequentially("100")

    await expect(waterPumpMix).toHaveValue("0")
    await expect(largeWaterPumpMix).toHaveValue("100")
    await expectCalculatorText(page, /Water\s+%\s+0\s+Water Pump/)
    await expectCalculatorText(page, /Large Water Pump\s+9 tiles\s+1 \/3beavers/)
    await expectCalculatorText(page, /Land use\s+10 tiles\s+\+\s+54 terrain/)

    await page.getByRole("button", { name: "Reset sliders" }).click()

    await expect(waterPumpMix).toHaveValue("100")
    await expect(largeWaterPumpMix).toHaveValue("0")
    await expectCalculatorText(page, /Water Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Large Water Pump/)
    await expectCalculatorText(page, /Land use\s+5 tiles\s+\+\s+54 terrain/)
    await expectNoCalculatorText(page, /Large Water Pump\s+9 tiles/)
  })
})
