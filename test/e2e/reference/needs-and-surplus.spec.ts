import { expect, test } from "@playwright/test"

import {
  expectCalculatorText,
  expectNoCalculatorText,
  openCalculator,
  selectBeaverNeeds,
  surplusQuantityInput,
} from "./helpers"

test.describe("Reference needs and surplus planning", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("adds and removes fun needs with their support production", async ({ page }) => {
    await selectBeaverNeeds(page, "Fun")

    await expect(page.getByRole("button", { name: /Well-being 15/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /Books Books \+3/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /Detailer Detailer \+1/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /Carousel Carousel \+3/ })).toBeVisible()
    await expectCalculatorText(page, /Landscaping/)
    await expectCalculatorText(page, /Dirt Excavator/)
    await expectCalculatorText(page, /Paper Mill/)
    await expectCalculatorText(page, /Printing Press/)
    await expectCalculatorText(page, /Power generation\s+Required :\s+19\.7 Khp/)
    await expectCalculatorText(page, /Production\s+61\.4 items\/day/)
    await expectCalculatorText(page, /Buildings\s+22/)

    await page.getByRole("button", { name: /Books Books \+3/ }).click()

    await expect(page.getByRole("button", { name: /Well-being 12/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /^Books Books$/ })).toBeVisible()
    await expectCalculatorText(page, /Production\s+55\.1 items\/day/)
    await expectCalculatorText(page, /HP used\s+16 Khp/)
    await expectNoCalculatorText(page, /Printing Press/)
  })

  test("adds positive surplus production and ignores negative surplus demand", async ({ page }) => {
    await page.getByRole("button", { name: /Add item/ }).click()
    await page.getByRole("option", { name: "Planks", exact: true }).click()

    const planksPerDay = surplusQuantityInput(page, "Planks")
    await expect(planksPerDay).toHaveValue("0")
    await planksPerDay.fill("12")

    await expect(planksPerDay).toHaveValue("12")
    await expectCalculatorText(page, /Planks\s+2\s+\(1\.01\)/)
    await expectCalculatorText(page, /Lumber Mill\s+12 tiles\s+2 beavers\s+1\.6 Khp/)
    await expectCalculatorText(page, /Oak tree\s+45 terrain/)
    await expectCalculatorText(page, /Production\s+72 items\/day/)
    await expectCalculatorText(page, /Buildings\s+7/)
    await expectCalculatorText(page, /HP used\s+1\.6 Khp/)

    await planksPerDay.fill("-5")

    await expect(planksPerDay).toHaveValue("-5")
    await expectCalculatorText(page, /Production\s+48 items\/day/)
    await expectCalculatorText(page, /Buildings\s+2/)
    await expectNoCalculatorText(page, /Lumber Mill/)
    await expectNoCalculatorText(page, /Oak tree\s+45 terrain/)
  })
})
