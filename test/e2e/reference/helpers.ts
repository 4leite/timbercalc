import { expect, type Locator, type Page } from "@playwright/test"

const escapedRegExp = (expected: string): string => expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const beaverNeedCards = {
  Basic: ["Hunger", "Thirst", "Sleep", "Shelter", "Wet fur"],
  Nutrition: [
    "Carrots",
    "Sunflower seeds",
    "Grilled potatoes",
    "Grilled chestnuts",
    "Grilled spadderdock",
    "Bread",
    "Cattail crackers",
    "Maple pastries",
  ],
  Fun: ["Books", "Detailer", "Lido", "Carousel", "Mud Pit"],
  "Social Life": ["Campfire", "Rooftop Terrace", "Contemplation Spot", "Agora", "Dance Hall"],
  Aesthetics: [
    "Shrub",
    "Lantern",
    "Roofs",
    "Scarecrow",
    "Wind Gauge",
    "Beaver Statue",
    "Bulletin Pole",
  ],
  Awe: ["Farmer Monument", "Brazier of Bonding", "Fountain of Joy", "Earth Recultivator"],
} as const

export const botNeedCards = {
  Basic: ["Biofuel"],
  Boost: ["Catalyst", "Punchcards"],
} as const

export const surplusOptions = [
  "Antidotes",
  "Badwater",
  "Berries",
  "Biofuel",
  "Books",
  "Bot chassis",
  "Bot heads",
  "Bot limbs",
  "Bread",
  "Carrots",
  "Catalyst",
  "Cattail crackers",
  "Cattail flour",
  "Cattail roots",
  "Chestnuts",
  "Dandelions",
  "Dirt",
  "Explosives",
  "Extract",
  "Fireworks",
  "Gears",
  "Grilled chestnuts",
  "Grilled potatoes",
  "Grilled spadderdock",
  "Logs",
  "Maple pastries",
  "Maple syrup",
  "Metal blocks",
  "Paper",
  "Pine resin",
  "Planks",
  "Potatoes",
  "Punchcards",
  "Science point",
  "Scrap metal",
  "Spadderdock",
  "Sunflower seeds",
  "Timberbots",
  "Treated planks",
  "Water",
  "Wheat",
  "Wheat flour",
] as const

const caseInsensitive = (expected: string | RegExp): RegExp => {
  if (typeof expected === "string") {
    return new RegExp(escapedRegExp(expected), "i")
  }

  return new RegExp(
    expected.source,
    expected.flags.includes("i") ? expected.flags : `${expected.flags}i`,
  )
}

const beaverNeedsSection = (page: Page): Locator => {
  return page.locator("#beaver-needs-section")
}

const botNeedsSection = (page: Page): Locator => {
  return page.locator("#bot-needs-section")
}

const sectionByHeading = (page: Page, heading: string): Locator => {
  return calculator(page)
    .locator("section")
    .filter({ has: calculator(page).getByText(heading, { exact: true }) })
    .first()
}

const waterManagementSection = (page: Page): Locator => {
  return sectionByHeading(page, "Seasons and storage")
}

const surplusSection = (page: Page): Locator => {
  return sectionByHeading(page, "Desired Surplus")
}

const productionSection = (page: Page): Locator => {
  return sectionByHeading(page, "Production/day")
}

const populationSection = (page: Page): Locator => {
  return sectionByHeading(page, "Population")
}

const productionRow = (page: Page, expected: string | RegExp): Locator => {
  return productionSection(page)
    .locator("div")
    .filter({ hasText: caseInsensitive(expected) })
    .first()
}

const visibleCalculatorText = async (page: Page): Promise<string> => {
  return (await calculator(page).innerText()).replace(/[\s\u00a0]+/g, " ").trim()
}

export const openCalculator = async (page: Page) => {
  await page.goto("/")
  await expect(calculator(page)).toBeVisible()
}

export const calculator = (page: Page) => {
  return page.getByRole("main")
}

export const beaverNeeds = beaverNeedsSection

export const botNeeds = botNeedsSection

export const seasonsAndStorage = waterManagementSection

export const desiredSurplus = surplusSection

export const productionTable = productionSection

export const populationControls = populationSection

export const workingHoursPanel = (page: Page): Locator => {
  return sectionByHeading(page, "Beavers Working hours")
}

export const footer = (page: Page): Locator => {
  return page.getByRole("contentinfo")
}

export const districtRecaps = (page: Page): Locator => {
  return calculator(page)
    .locator("section")
    .filter({ has: calculator(page).getByText("District recap", { exact: true }) })
}

export const powerGenerationSection = (page: Page): Locator => {
  return calculator(page)
    .locator("div")
    .filter({ hasText: /Power generation/i })
    .last()
}

export const semanticButtons = (scope: Page | Locator): Locator => {
  return scope.locator("button")
}

export const roleButtons = (scope: Page | Locator): Locator => {
  return scope.locator('[role="button"]')
}

export const sectionHeaderButton = (page: Page, ariaControls: string): Locator => {
  return page.locator(`button[aria-controls="${ariaControls}"]`).first()
}

export const sectionExpandBanner = (page: Page, ariaControls: string): Locator => {
  return page.locator(`button[aria-controls="${ariaControls}"]`).last()
}

export const surplusRow = (page: Page, item: string): Locator => {
  return surplusSection(page)
    .locator("div")
    .filter({ has: page.getByRole("button", { name: "Remove" }) })
    .filter({ hasText: new RegExp(`^${escapedRegExp(item)}\\s*/day$`, "i") })
    .last()
}

export const expectCalculatorText = async (page: Page, expected: string | RegExp) => {
  await expect
    .poll(async () => await visibleCalculatorText(page))
    .toMatch(caseInsensitive(expected))
}

export const expectNoCalculatorText = async (page: Page, unexpected: string | RegExp) => {
  await expect
    .poll(async () => await visibleCalculatorText(page))
    .not.toMatch(caseInsensitive(unexpected))
}

export const surplusQuantityInput = (page: Page, item: string): Locator => {
  return surplusRow(page, item).getByRole("spinbutton")
}

export const botPopulationInput = (page: Page): Locator => {
  return populationSection(page).getByRole("spinbutton").last()
}

export const seasonDifficultySelect = (page: Page): Locator => {
  return waterManagementSection(page).getByRole("combobox", { name: "Difficulty" })
}

export const productionDifficultySelect = (page: Page): Locator => {
  return productionTable(page).getByRole("combobox", { name: "Difficulty" })
}

export const productionMixInput = (
  page: Page,
  resource: string,
  rowText: string | RegExp,
): Locator => {
  return productionRow(page, rowText).getByLabel(`Mix % for ${resource}`)
}

export const selectBeaverNeeds = async (page: Page, category: string) => {
  await beaverNeedsSection(page).getByRole("button", { name: category, exact: true }).click()
}

export const selectBotNeeds = async (page: Page, category: string) => {
  await botNeedsSection(page).getByRole("button", { name: category, exact: true }).click()
}

export const addSurplusItem = async (page: Page, item: string, quantity: string) => {
  await page.getByRole("button", { name: /Add item/ }).click()
  await page.getByRole("option", { name: item, exact: true }).click()
  await surplusQuantityInput(page, item).fill(quantity)
}

export const removeSurplusItem = async (page: Page, item: string) => {
  await surplusRow(page, item).getByRole("button", { name: "Remove" }).click()
  await expect(surplusRow(page, item)).toHaveCount(0)
}
