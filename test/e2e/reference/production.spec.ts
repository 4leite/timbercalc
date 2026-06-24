import { expect, test, type Page } from "@playwright/test"

import {
  nutritionProductionSnapshots,
  type NutritionProductionSnapshotKey,
} from "../../../src/lib/timberborn-calculator/productionSnapshots"
import {
  botPopulationInput,
  calculator,
  districtRecaps,
  expectCalculatorText,
  expectNoCalculatorText,
  openCalculator,
  productionTable,
  selectBeaverNeeds,
  workingHoursPanel,
} from "./helpers"

type ProductionMatrixCase = {
  name: string
  apply: (page: Page) => Promise<void>
  productionSnapshot: NutritionProductionSnapshotKey
  districtRecap: string
}

const normalizeText = (text: string) =>
  text
    .replace(/[\s\u00a0]+/g, " ")
    .trim()
    .toLowerCase()

const escapedRegExp = (expected: string): string => expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const nutritionDistrictRecapText = normalizeText(`
  DISTRICT RECAP
  WORKING BVRS 15 / 9 100%
  WORKING BOTS no bots
  AVAILABLE (ALL) 0 carriers 0%
  FOOD CONSUMED 26.7 /day
  WATER CONSUMED 21.3 /day
  PRODUCTION 59.2 items/day
  BUILDINGS 15
  TREES 14
  CROPS 32
  LAND USE 68 tiles + 45 terrain
  HP USED 1.92 Khp
  HP GENERATED 2.53 Khp
  NET BALANCE +609 hp
`)

const clickNutritionNeed = async (page: Page, need: string) => {
  await page
    .locator("#beaver-needs-section")
    .getByRole("button", { name: new RegExp(`^${escapedRegExp(need)}\\b`, "i") })
    .click()
}

const increaseWanderingTime = async (page: Page, steps: number) => {
  const increaseButton = page
    .getByRole("button", { name: "Pause time info" })
    .locator("xpath=../../..")
    .locator("button:not([aria-label])")
    .last()

  for (let step = 0; step < steps; step += 1) {
    await increaseButton.click()
  }
}

const increaseDowntime = async (page: Page, steps: number) => {
  const increaseButton = page
    .getByRole("button", { name: "Downtime info" })
    .locator("xpath=../../..")
    .locator("button:not([aria-label])")
    .last()

  for (let step = 0; step < steps; step += 1) {
    await increaseButton.click()
  }
}

const reduceWorkingHours = async (page: Page, steps: number) => {
  const workingHours = workingHoursPanel(page).getByRole("slider")
  await workingHours.focus()

  for (let step = 0; step < steps; step += 1) {
    await page.keyboard.press("ArrowLeft")
  }
}

const nutritionMatrixCases: ProductionMatrixCase[] = [
  {
    name: "baseline nutrition",
    apply: async () => {},
    productionSnapshot: "baselineNutrition",
    districtRecap: nutritionDistrictRecapText,
  },
  {
    name: "population 16",
    apply: async (page) => {
      await page.getByRole("spinbutton", { name: "Total beaver population" }).fill("16")
    },
    productionSnapshot: "population16",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 15 / 15 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 42.7 /day WATER CONSUMED 34.1 /day PRODUCTION 94.7 items/day BUILDINGS 15
      TREES 21 CROPS 49 LAND USE 68 tiles + 69 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
  {
    name: "wandering time 2.0h",
    apply: async (page) => {
      await increaseWanderingTime(page, 3)
    },
    productionSnapshot: "wanderingTime2h",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 15 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 59.2 items/day BUILDINGS 15
      TREES 14 CROPS 32 LAND USE 68 tiles + 45 terrain HP USED 1.92 Khp HP GENERATED 2.44 Khp
      NET BALANCE +523 hp
    `),
  },
  {
    name: "working hours 12h",
    apply: async (page) => {
      await reduceWorkingHours(page, 4)
    },
    productionSnapshot: "workingHours12h",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 15 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 59.2 items/day BUILDINGS 15
      TREES 14 CROPS 32 LAND USE 68 tiles + 45 terrain HP USED 1.44 Khp HP GENERATED 2.3 Khp
      NET BALANCE +859 hp
    `),
  },
  {
    name: "bot downtime 3.0h",
    apply: async (page) => {
      await botPopulationInput(page).fill("6")
      await increaseDowntime(page, 4)
    },
    productionSnapshot: "botDowntime3h",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 30 / 9 100% WORKING BOTS 0 / 6 0% AVAILABLE (ALL) 6 carriers 40%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 79.5 items/day BUILDINGS 35
      TREES 23 CROPS 36 LAND USE 163 tiles + 83 terrain HP USED 23.04 Khp HP GENERATED 23.65 Khp
      NET BALANCE +614 hp
    `),
  },
  {
    name: "carrots off",
    apply: async (page) => clickNutritionNeed(page, "Carrots"),
    productionSnapshot: "carrotsOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 15 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 60.8 items/day BUILDINGS 15
      TREES 16 CROPS 31 LAND USE 68 tiles + 46 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
  {
    name: "sunflower seeds off",
    apply: async (page) => clickNutritionNeed(page, "Sunflower seeds"),
    productionSnapshot: "sunflowerSeedsOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 15 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 60.1 items/day BUILDINGS 15
      TREES 16 CROPS 28 LAND USE 68 tiles + 43 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
  {
    name: "grilled potatoes off",
    apply: async (page) => clickNutritionNeed(page, "Grilled potatoes"),
    productionSnapshot: "grilledPotatoesOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 14 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 59.7 items/day BUILDINGS 14
      TREES 16 CROPS 30 LAND USE 64 tiles + 45 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
  {
    name: "grilled chestnuts off",
    apply: async (page) => clickNutritionNeed(page, "Grilled chestnuts"),
    productionSnapshot: "grilledChestnutsOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 13 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 58.6 items/day BUILDINGS 13
      TREES 10 CROPS 37 LAND USE 63 tiles + 46 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
  {
    name: "grilled spadderdock off",
    apply: async (page) => clickNutritionNeed(page, "Grilled spadderdock"),
    productionSnapshot: "grilledSpadderdockOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 14 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 59.3 items/day BUILDINGS 14
      TREES 16 CROPS 31 LAND USE 64 tiles + 46 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
  {
    name: "bread off",
    apply: async (page) => clickNutritionNeed(page, "Bread"),
    productionSnapshot: "breadOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 14 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 59.1 items/day BUILDINGS 14
      TREES 16 CROPS 34 LAND USE 62 tiles + 49 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
  {
    name: "cattail crackers off",
    apply: async (page) => clickNutritionNeed(page, "Cattail crackers"),
    productionSnapshot: "cattailCrackersOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 13 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 58.7 items/day BUILDINGS 13
      TREES 16 CROPS 34 LAND USE 56 tiles + 49 terrain HP USED 960 hp HP GENERATED 2.53 Khp
      NET BALANCE +1.57 Khp
    `),
  },
  {
    name: "maple pastries off",
    apply: async (page) => clickNutritionNeed(page, "Maple pastries"),
    productionSnapshot: "maplePastriesOff",
    districtRecap: normalizeText(`
      DISTRICT RECAP WORKING BVRS 13 / 9 100% WORKING BOTS no bots AVAILABLE (ALL) 0 carriers 0%
      FOOD CONSUMED 26.7 /day WATER CONSUMED 21.3 /day PRODUCTION 56.6 items/day BUILDINGS 14
      TREES 9 CROPS 32 LAND USE 58 tiles + 41 terrain HP USED 1.92 Khp HP GENERATED 2.53 Khp
      NET BALANCE +609 hp
    `),
  },
]

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
    await page.getByText("Beavers needs", { exact: true }).click()

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

  test("matches the full Production/day and recap for basic plus nutrition needs", async ({
    page,
  }) => {
    await selectBeaverNeeds(page, "Nutrition")

    await expect
      .poll(async () => normalizeText(await productionTable(page).innerText()))
      .toBe(nutritionProductionSnapshots.baselineNutrition)
    await expect
      .poll(async () => normalizeText(await districtRecaps(page).last().innerText()))
      .toBe(nutritionDistrictRecapText)
  })

  for (const scenario of nutritionMatrixCases) {
    test(`matches full Nutrition production table for ${scenario.name}`, async ({ page }) => {
      await selectBeaverNeeds(page, "Nutrition")
      await scenario.apply(page)

      await expect
        .poll(async () => normalizeText(await productionTable(page).innerText()))
        .toBe(nutritionProductionSnapshots[scenario.productionSnapshot])
      await expect
        .poll(async () => normalizeText(await districtRecaps(page).last().innerText()))
        .toBe(scenario.districtRecap)
    })
  }
})
