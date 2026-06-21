import { test } from "@playwright/test"

import { addSurplusItem, expectCalculatorText, openCalculator } from "./helpers"

test.describe("Reference surplus dependency chains", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("plans gears with log, plank, workshop, and power dependencies", async ({ page }) => {
    await addSurplusItem(page, "Gears", "10")

    await expectCalculatorText(page, /Logs \(Oak\)\s+%\s+38 \(37\.50\)\s+Oak tree\s+38 terrain/)
    await expectCalculatorText(
      page,
      /Planks\s+1 \(0\.84\)\s+Lumber Mill\s+6 tiles\s+1 beavers\s+800 hp/,
    )
    await expectCalculatorText(
      page,
      /Gears\s+2 \(1\.94\)\s+Gear Workshop\s+12 tiles\s+2 beavers\s+3\.84 Khp/,
    )
    await expectCalculatorText(page, /Production\s+78 items\/day/)
    await expectCalculatorText(page, /Buildings\s+9/)
    await expectCalculatorText(page, /HP used\s+4\.64 Khp/)
    await expectCalculatorText(page, /Net balance\s+\+1\.27 Khp/)
  })

  test("plans explosives with badwater pumping and factory power", async ({ page }) => {
    await addSurplusItem(page, "Explosives", "10")

    await expectCalculatorText(page, /Landscaping\s+10\.0\s+Explosives\s+2 \(1\.94\)/)
    await expectCalculatorText(page, /Explosives Factory\s+16 tiles\s+2 beavers\s+4\.8 Khp/)
    await expectCalculatorText(
      page,
      /Badwater\s+%\s+2 \(1\.06\)\s+Badwater Pump\s+8 tiles\s+2 beavers/,
    )
    await expectCalculatorText(page, /Production\s+108 items\/day/)
    await expectCalculatorText(page, /Buildings\s+9/)
    await expectCalculatorText(page, /Land use\s+34 tiles\s+\+\s+54 terrain/)
    await expectCalculatorText(page, /HP used\s+4\.8 Khp/)
  })

  test("plans treated planks with oak logs, pine resin, and wood workshop", async ({ page }) => {
    await addSurplusItem(page, "Treated planks", "10")

    await expectCalculatorText(page, /Logs \(Oak\)\s+%\s+38 \(37\.50\)\s+Oak tree\s+38 terrain/)
    await expectCalculatorText(page, /Pine resin\s+35 \(35\.00\)\s+Pine tree\s+35 terrain/)
    await expectCalculatorText(page, /Tapper's Shack\s+4 tiles\s+1 beavers/)
    await expectCalculatorText(
      page,
      /Treated planks\s+2 \(1\.94\)\s+Wood Workshop\s+16 tiles\s+2 beavers\s+8 Khp/,
    )
    await expectCalculatorText(page, /Production\s+88 items\/day/)
    await expectCalculatorText(page, /Buildings\s+10/)
    await expectCalculatorText(page, /Trees\s+128/)
    await expectCalculatorText(page, /HP used\s+8\.8 Khp/)
  })

  test("plans maple pastries with crops, bakery, and modest power", async ({ page }) => {
    await addSurplusItem(page, "Maple pastries", "10")

    await expectCalculatorText(page, /Maple pastries/)
    await expectCalculatorText(page, /Bakery\s+6 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Production\s+68\.3 items\/day/)
    await expectCalculatorText(page, /Buildings\s+8/)
    await expectCalculatorText(page, /Crops\s+12/)
    await expectCalculatorText(page, /Trees\s+71/)
    await expectCalculatorText(page, /HP used\s+960 hp/)
  })

  test("plans biofuel from spadderdock without requiring power generation", async ({ page }) => {
    await addSurplusItem(page, "Biofuel", "10")

    await expectCalculatorText(page, /Spadderdock crop\s+4 terrain/)
    await expectCalculatorText(
      page,
      /Biofuel \(spadderdock\)\s+%\s+1 \(0\.08\)\s+Refinery\s+6 tiles\s+1 \/2beavers/,
    )
    await expectCalculatorText(page, /Production\s+59\.6 items\/day/)
    await expectCalculatorText(page, /Buildings\s+4/)
    await expectCalculatorText(page, /Crops\s+4/)
    await expectCalculatorText(page, /No energy required/)
    await expectCalculatorText(page, /Working bvrs\s+4 \/ 9\s+44%/)
  })
})
