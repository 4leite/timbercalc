import { expect, test, type Page } from "@playwright/test"

import {
  nutritionPopulationTotals,
  nutritionProductionSnapshotForPopulation,
  nutritionProductionSnapshots,
  type NutritionProductionSnapshotKey,
} from "../../../src/lib/timberborn-calculator/productionSnapshots"
import {
  botPopulationInput,
  calculator,
  expectCalculatorText,
  expectNoCalculatorText,
  lastDistrictRecapText,
  openCalculator,
  populationControls,
  productionTableText,
  selectBeaverNeeds,
  workingHoursPanel,
} from "./helpers"

type ProductionMatrixCase = {
  name: string
  apply: (page: Page) => Promise<void>
  productionSnapshot: NutritionProductionSnapshotKey
  districtRecap: string
}

type NutritionPopulationMatrixCase = {
  population: number
}

type NutritionWorkingHoursMatrixCase = {
  population: number
  workingHours: number
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

const nutritionPopulationMatrixCases: NutritionPopulationMatrixCase[] = [
  { population: 1 },
  { population: 2 },
  { population: 3 },
  { population: 7 },
  { population: 10 },
  { population: 13 },
  { population: 16 },
  { population: 19 },
  { population: 22 },
  { population: 25 },
]

const nutritionWorkingHoursMatrixCases: NutritionWorkingHoursMatrixCase[] = [
  { population: 25, workingHours: 16 },
  { population: 25, workingHours: 15 },
  { population: 25, workingHours: 12 },
]

const nutritionPopulationRecapText = (
  population: number,
  options?: { workingHours?: number; wanderingTime?: number },
) => {
  const totals = nutritionPopulationTotals(population, options)
  const workingPercent = Math.min(
    100,
    Math.round((totals.workingBeavers / Math.max(1, totals.availableBeavers)) * 100),
  )

  return normalizeText(`
    DISTRICT RECAP
    WORKING BVRS ${totals.workingBeavers} / ${totals.availableBeavers} ${workingPercent}%
    WORKING BOTS no bots
    AVAILABLE (ALL) ${totals.availableCarriers} carriers ${totals.availableCarrierPercent}%
    FOOD CONSUMED ${(population * 2.67).toFixed(1)} /day
    WATER CONSUMED ${(population * 2.13).toFixed(1)} /day
    PRODUCTION ${totals.production} items/day
    BUILDINGS ${totals.buildings}
    TREES ${totals.trees}
    CROPS ${totals.crops}
    LAND USE ${totals.land}
    HP USED ${totals.hp}
    HP GENERATED ${totals.hpGenerated}
    NET BALANCE ${totals.net}
  `)
}

const clickNutritionNeed = async (page: Page, need: string) => {
  await page.getByRole("button", { name: new RegExp(`^${escapedRegExp(need)}\\b`, "i") }).click()
}

const productionBodyStructure = async (page: Page) => {
  return await page
    .getByRole("button", { name: "Scroll to top of Production table" })
    .evaluate((button) => {
      const normalize = (text: string | null | undefined) =>
        (text ?? "").replace(/[\s\u00a0]+/g, " ").trim()
      const allElements = Array.from(document.body.getElementsByTagName("*"))
      const productionIndex = allElements.indexOf(button)
      const powerIndex = allElements.findIndex(
        (element, index) =>
          index > productionIndex &&
          normalize(element.textContent).toLowerCase() === "power generation",
      )
      const isBetweenProductionAndPower = (element: Element) => {
        const index = allElements.indexOf(element)
        return index > productionIndex && powerIndex !== -1 && index < powerIndex
      }

      return {
        paragraphCount: Array.from(document.getElementsByTagName("p")).filter(
          isBetweenProductionAndPower,
        ).length,
        longTextLeafs: allElements
          .filter(
            (element) => element.children.length === 0 && isBetweenProductionAndPower(element),
          )
          .map((element) => normalize(element.textContent))
          .filter((text) => text.length > 120),
      }
    })
}

const increaseWanderingTime = async (page: Page, steps: number) => {
  const increaseButton = populationControls(page)
    .getByRole("button", { name: "+", exact: true })
    .nth(1)

  for (let step = 0; step < steps; step += 1) {
    await increaseButton.click()
  }
}

const increaseDowntime = async (page: Page, steps: number) => {
  const increaseButton = populationControls(page)
    .getByRole("button", { name: "+", exact: true })
    .nth(3)

  for (let step = 0; step < steps; step += 1) {
    await increaseButton.click()
  }
}

const reduceWorkingHours = async (page: Page, steps: number) => {
  const workingHours = workingHoursPanel(page).getByRole("slider").last()
  await workingHours.focus()

  for (let step = 0; step < steps; step += 1) {
    await page.keyboard.press("ArrowLeft")
  }
}

const nutritionMatrixCases: ProductionMatrixCase[] = [
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
      .poll(async () => normalizeText(await productionTableText(page)))
      .toBe(nutritionProductionSnapshots.baselineNutrition)
    await expect
      .poll(async () => normalizeText(await lastDistrictRecapText(page)))
      .toBe(nutritionDistrictRecapText)
  })

  test("renders the Nutrition production table as expanded production sections", async ({
    page,
  }) => {
    await selectBeaverNeeds(page, "Nutrition")

    const productionSections = page.getByRole("button", {
      name: /^▾?\s*(Water|Crops|Trees|Food|Wood)$/i,
    })
    await expect(productionSections).toHaveCount(5)

    for (const section of ["Water", "Crops", "Trees", "Food", "Wood"]) {
      await expect(
        page.getByRole("button", { name: new RegExp(`^▾?\\s*${section}$`, "i") }),
      ).toHaveAttribute("aria-expanded", "true")
    }

    await expect.poll(async () => (await productionBodyStructure(page)).paragraphCount).toBe(0)
    await expect.poll(async () => (await productionBodyStructure(page)).longTextLeafs).toEqual([])
  })

  for (const scenario of nutritionPopulationMatrixCases) {
    test(`matches full Nutrition production table and recap for population ${scenario.population}`, async ({
      page,
    }) => {
      await selectBeaverNeeds(page, "Nutrition")
      await page
        .getByRole("spinbutton", { name: "Total beaver population" })
        .fill(String(scenario.population))

      await expect
        .poll(async () => normalizeText(await productionTableText(page)))
        .toBe(nutritionProductionSnapshotForPopulation(scenario.population))
      await expect
        .poll(async () => normalizeText(await lastDistrictRecapText(page)))
        .toBe(nutritionPopulationRecapText(scenario.population))
    })
  }

  for (const scenario of nutritionWorkingHoursMatrixCases) {
    test(`matches full Nutrition production table and recap for population ${scenario.population} at ${scenario.workingHours}h`, async ({
      page,
    }) => {
      await selectBeaverNeeds(page, "Nutrition")
      await page
        .getByRole("spinbutton", { name: "Total beaver population" })
        .fill(String(scenario.population))
      await reduceWorkingHours(page, 16 - scenario.workingHours)

      await expect
        .poll(async () => normalizeText(await productionTableText(page)))
        .toBe(
          nutritionProductionSnapshotForPopulation(scenario.population, {
            workingHours: scenario.workingHours,
          }),
        )
      await expect
        .poll(async () => normalizeText(await lastDistrictRecapText(page)))
        .toBe(
          nutritionPopulationRecapText(scenario.population, {
            workingHours: scenario.workingHours,
          }),
        )
    })
  }

  for (const scenario of nutritionMatrixCases) {
    test(`matches full Nutrition production table for ${scenario.name}`, async ({ page }) => {
      await selectBeaverNeeds(page, "Nutrition")
      await scenario.apply(page)

      await expect
        .poll(async () => normalizeText(await productionTableText(page)))
        .toBe(nutritionProductionSnapshots[scenario.productionSnapshot])
      await expect
        .poll(async () => normalizeText(await lastDistrictRecapText(page)))
        .toBe(scenario.districtRecap)
    })
  }
})
