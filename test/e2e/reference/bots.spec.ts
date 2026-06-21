import { expect, test } from "@playwright/test"

import { botPopulationInput, expectCalculatorText, openCalculator, selectBotNeeds } from "./helpers"

test.describe("Reference bot population and needs", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("adds replacement production for a timberbot population", async ({ page }) => {
    await botPopulationInput(page).fill("6")

    await expect(botPopulationInput(page)).toHaveValue("6")
    await expect(page.getByText("Bots needs", { exact: true })).toBeVisible()
    await expect(page.getByText("Bots replacement", { exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Full bot workforce" })).toBeEnabled()
    await expectCalculatorText(page, /Spadderdock crop\s+4 terrain/)
    await expectCalculatorText(page, /Bot Part Factory\s+9 tiles\s+1 beavers\s+2\.4 Khp/)
    await expectCalculatorText(
      page,
      /Timberbots\s+1 \(0\.20\)\s+Bot Assembler\s+9 tiles\s+1 \/2beavers\s+4 Khp/,
    )
    await expectCalculatorText(page, /Production\s+68\.3 items\/day/)
    await expectCalculatorText(page, /Buildings\s+25/)
    await expectCalculatorText(page, /Working bvrs\s+20 \/ 9\s+100%/)
    await expectCalculatorText(page, /Working bots\s+0 \/ 6\s+0%/)
    await expectCalculatorText(page, /HP used\s+21\.12 Khp/)
  })

  test("bot needs add catalyst and punchcard support on top of replacement", async ({ page }) => {
    await botPopulationInput(page).fill("6")
    await selectBotNeeds(page, "All")

    await expect(page.getByRole("button", { name: /Biofuel 0/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /Catalyst/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /Punchcards/ })).toBeVisible()
    await expectCalculatorText(page, /Badwater Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Catalyst\s+1 \(0\.13\)\s+Refinery\s+6 tiles\s+1 \/2beavers/)
    await expectCalculatorText(
      page,
      /Punchcards\s+1 \(0\.10\)\s+Printing Press\s+8 tiles\s+1 \/2beavers\s+2\.4 Khp/,
    )
    await expectCalculatorText(page, /Production\s+94\.5 items\/day/)
    await expectCalculatorText(page, /Buildings\s+35/)
    await expectCalculatorText(page, /Land use\s+161 tiles\s+\+\s+114 terrain/)
    await expectCalculatorText(page, /HP generated\s+32\.93 Khp/)
  })
})
