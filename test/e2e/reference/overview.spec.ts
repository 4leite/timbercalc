import { expect, test } from "@playwright/test"

import { expectCalculatorText, openCalculator } from "./helpers"

test.describe("Reference calculator overview", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("renders the default Folktails production baseline", async ({ page }) => {
    await expect(page).toHaveTitle(/Timberborn Calculator/)
    await expect(page.getByRole("banner")).toContainText(/Timberborn\s*Calculator/)
    await expect(
      page.getByRole("navigation", { name: "Main sections" }).getByRole("button", {
        name: "Calculator",
      }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Visit Timberborn Steam page" })).toHaveAttribute(
      "href",
      /store\.steampowered\.com\/app\/1062090\/Timberborn/,
    )
    await expect(page.getByRole("contentinfo")).toContainText(/CalcSpirit\.com.*2026/)

    await expect(page.getByRole("spinbutton", { name: "Total beaver population" })).toHaveValue(
      "10",
    )
    await expect(page.getByRole("combobox", { name: "Difficulty" })).toHaveValue("normal")
    await expect(page.getByRole("checkbox", { name: "Beavers needs" })).toBeChecked()
    await expect(page.getByRole("button", { name: "No bot population" })).toBeDisabled()

    await expectCalculatorText(page, /Needs configuration/)
    await expectCalculatorText(page, /Production\/day/)
    await expectCalculatorText(page, /Water Pump\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Large Water Pump/)
    await expectCalculatorText(page, /Berries\s+100%\s+54\s+\(53\.40\)/)
    await expectCalculatorText(page, /Gatherer Flag\s+1 tiles\s+1 beavers/)
    await expectCalculatorText(page, /48\.0\s+item\/day/)
    await expectCalculatorText(page, /Food consumed\s+26\.7 \/day/)
    await expectCalculatorText(page, /Water consumed\s+21\.3 \/day/)
    await expectCalculatorText(page, /Buildings\s+2/)
    await expectCalculatorText(page, /No energy required/)
  })
})
