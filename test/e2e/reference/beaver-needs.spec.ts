import { expect, test } from "@playwright/test"

import {
  expectCalculatorText,
  expectNoCalculatorText,
  openCalculator,
  selectBeaverNeeds,
} from "./helpers"

test.describe("Reference beaver needs categories", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("plans every beaver need and its full support chain", async ({ page }) => {
    await selectBeaverNeeds(page, "All")

    await expect(page.getByRole("button", { name: /Well-being 77/ })).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Earth Recultivator Earth Recultivator \+10/ }),
    ).toBeVisible()
    await expectCalculatorText(page, /Working speed\s+\+260%/)
    await expectCalculatorText(page, /Growth speed\s+\+75%\s+\|\s+3\.43 d/)
    await expectCalculatorText(
      page,
      /Dirt Excavator\s+5 tiles\s+25 terrain\s+1 \/4beavers\s+3\.2 Khp/,
    )
    await expectCalculatorText(page, /Carrot crop\s+5 terrain/)
    await expectCalculatorText(page, /Paper Mill\s+6 tiles\s+1 beavers\s+1\.28 Khp/)
    await expectCalculatorText(page, /Agora\s+25 tiles/)
    await expectCalculatorText(page, /Production\s+76\.6 items\/day/)
    await expectCalculatorText(page, /Buildings\s+39/)
    await expectCalculatorText(page, /Crops\s+32/)
    await expectCalculatorText(page, /HP used\s+21\.6 Khp/)
    await expectCalculatorText(page, /Working bvrs\s+22 \/ 10\s+100%/)
  })

  test("nutrition needs add crop, food processing, and low-power support production", async ({
    page,
  }) => {
    await selectBeaverNeeds(page, "Nutrition")

    await expect(page.getByRole("button", { name: /Well-being 19/ })).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Maple pastries Maple pastries \+3/ }),
    ).toBeVisible()
    await expectCalculatorText(page, /Carrot crop\s+5 terrain/)
    await expectCalculatorText(page, /Sunflower crop\s+6 terrain/)
    await expectCalculatorText(page, /Bakery\s+6 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Lumberjack Flag\s+1 tiles\s+1 beavers/)
    await expectCalculatorText(page, /Production\s+59\.2 items\/day/)
    await expectCalculatorText(page, /Buildings\s+15/)
    await expectCalculatorText(page, /Crops\s+32/)
    await expectCalculatorText(page, /HP used\s+1\.92 Khp/)
    await expectCalculatorText(page, /Available \(all\)\s+0 carriers\s+0%/)
  })

  test("social life needs add gathering buildings and power for extract support", async ({
    page,
  }) => {
    await selectBeaverNeeds(page, "Social Life")

    await expect(page.getByRole("button", { name: /Well-being 15/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /Dance Hall Dance Hall \+5/ })).toBeVisible()
    await expectCalculatorText(page, /Campfire\s+9 tiles/)
    await expectCalculatorText(page, /Rooftop Terrace\s+6 tiles/)
    await expectCalculatorText(page, /Contemplation Spot\s+2 tiles/)
    await expectCalculatorText(page, /consumed :\s+Extract\s+0\.80 \/day\s+1 \(0\.11\)\s+Agora/)
    await expectCalculatorText(page, /Production\s+52\.1 items\/day/)
    await expectCalculatorText(page, /Buildings\s+14/)
    await expectCalculatorText(page, /Land use\s+91 tiles\s+\+\s+55 terrain/)
    await expectCalculatorText(page, /HP used\s+3\.2 Khp/)
  })

  test("aesthetic needs affect well-being without adding production requirements", async ({
    page,
  }) => {
    await selectBeaverNeeds(page, "Aesthetics")

    await expect(page.getByRole("button", { name: /Well-being 13/ })).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Beaver Statue Beaver Statue \+2/ }),
    ).toBeVisible()
    await expectCalculatorText(page, /Movement speed\s+\+15%/)
    await expectCalculatorText(page, /Life expectancy\s+\+20%\s+\|\s+60 d/)
    await expectCalculatorText(page, /Production\s+48 items\/day/)
    await expectCalculatorText(page, /Buildings\s+2/)
    await expectNoCalculatorText(page, /Power generation\s+Required/)
  })
})
