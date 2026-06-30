import { expect, test, type Page } from "@playwright/test"

import {
  addSurplusItem,
  botPopulationInput,
  expectCalculatorText,
  expectNoCalculatorText,
  lastSurplusRemoveButton,
  openCalculator,
  selectBotNeeds,
} from "./helpers"

const numericValueForLabel = async (page: Page, label: string): Promise<number> => {
  const normalizedText = (await page.getByRole("main").innerText())
    .replace(/[\s\u00a0]+/g, " ")
    .trim()
  const match = normalizedText.match(new RegExp(`${label}\\s+(-?\\d+(?:\\.\\d+)?)`, "i"))
  if (!match) {
    throw new Error(`Unable to find numeric value for label: ${label}`)
  }

  return Number(match[1])
}

test.describe("Reference advanced transitions", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("toggles boost bot needs on and back off", async ({ page }) => {
    await botPopulationInput(page).fill("6")
    await expectNoCalculatorText(page, /Catalyst\s+1 \(0\.13\)/)
    await expectNoCalculatorText(page, /Punchcards\s+1 \(0\.10\)/)

    await selectBotNeeds(page, "Boost")
    await expectCalculatorText(page, /Catalyst\s+1 \(0\.13\)/)
    await expectCalculatorText(page, /Punchcards\s+1 \(0\.10\)/)
    await expectCalculatorText(page, /Badwater Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Printing Press\s+8 tiles\s+1 \/2beavers\s+2\.4 Khp/)

    await selectBotNeeds(page, "Boost")
    await expectNoCalculatorText(page, /Catalyst\s+1 \(0\.13\)/)
    await expectNoCalculatorText(page, /Punchcards\s+1 \(0\.10\)/)
    await expectNoCalculatorText(page, /Badwater Pump\s+4 tiles\s+1 beavers/)
    await expectNoCalculatorText(page, /Printing Press\s+8 tiles\s+1 \/2beavers\s+2\.4 Khp/)
  })

  test("returns bot controls to no-bot state when bot population is reset to zero", async ({
    page,
  }) => {
    await botPopulationInput(page).fill("6")
    await expect(page.getByText("Bots needs", { exact: true })).toBeVisible()
    await expect(page.getByText("Bots replacement", { exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Full bot workforce" })).toBeEnabled()

    await botPopulationInput(page).fill("0")

    await expect(page.getByText("Bots needs", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Bots replacement", { exact: true })).toHaveCount(0)
    await expect(page.getByRole("button", { name: "No bot population" })).toBeDisabled()
    await expectCalculatorText(page, /Working bots\s+no bots/)
  })

  test("collapses and re-expands production sections without losing totals", async ({ page }) => {
    await expectCalculatorText(page, /Water Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Production\s+48 items\/day/)

    const waterSectionToggle = page.getByRole("button", { name: /^▾?Water$/i })
    await waterSectionToggle.click()
    await expectNoCalculatorText(page, /Water Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Production\s+48 items\/day/)

    await waterSectionToggle.click()
    await expectCalculatorText(page, /Water Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Production\s+48 items\/day/)
  })

  test("updates seasonal storage requirements when cycle and retention sliders change", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Off", exact: true }).click()
    const cycleSlider = page.getByRole("slider", { name: /Cycle/i })
    const retentionSlider = page.getByRole("slider", { name: /Water retention/i })

    const baselineWaterStorage = await numericValueForLabel(page, "Water storage")
    await cycleSlider.fill("1")
    const shortCycleWaterStorage = await numericValueForLabel(page, "Water storage")

    await expect(cycleSlider).toHaveValue("1")
    expect(shortCycleWaterStorage).toBeLessThan(baselineWaterStorage)

    await cycleSlider.fill("6")
    await retentionSlider.fill("1")
    const retainedWaterStorage = await numericValueForLabel(page, "Water storage")

    await expect(cycleSlider).toHaveValue("6")
    await expect(retentionSlider).toHaveValue("1")
    expect(retainedWaterStorage).toBeLessThan(baselineWaterStorage)
  })

  test("removing dependent surplus drops only dependent production", async ({ page }) => {
    await addSurplusItem(page, "Planks", "12")
    await addSurplusItem(page, "Gears", "10")
    await expectCalculatorText(page, /Planks\s+2\s+\(1\.85\)/)
    await expectCalculatorText(page, /Gear Workshop\s+12 tiles\s+2 beavers\s+3\.84 Khp/)

    await lastSurplusRemoveButton(page).click()

    await expect(page.getByText(/^Gears\s*\/day$/i)).toHaveCount(0)
    await expectNoCalculatorText(page, /Gear Workshop/)
    await expectCalculatorText(page, /Planks\s+2\s+\(1\.01\)/)
    await expectCalculatorText(page, /Lumber Mill\s+12 tiles\s+2 beavers\s+1\.6 Khp/)
  })

  test("re-enables beaver-needs production when the toggle is switched back on", async ({
    page,
  }) => {
    await page.getByText("Beavers needs", { exact: true }).click()
    await expectCalculatorText(page, /No buildings required/)
    await expectNoCalculatorText(page, /Water Pump\s+4 tiles/)

    await page.getByText("Beavers needs", { exact: true }).click()
    await expectCalculatorText(page, /Water Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Gatherer Flag\s+1 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Production\s+48 items\/day/)
  })
})
