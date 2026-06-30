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

const visibleCalculatorText = async (page: Page): Promise<string> => {
  return (await calculator(page).innerText()).replace(/[\s\u00a0]+/g, " ").trim()
}

const visibleCalculatorRawText = async (page: Page): Promise<string> => {
  return await calculator(page).innerText()
}

const indexOfPattern = (text: string, expected: RegExp, fromIndex = 0): number => {
  const match = expected.exec(text.slice(fromIndex))
  return match ? fromIndex + match.index : -1
}

const lastIndexOfPattern = (text: string, expected: RegExp): number => {
  const globalExpected = new RegExp(
    expected.source,
    expected.flags.includes("g") ? expected.flags : `${expected.flags}g`,
  )
  let lastIndex = -1
  let match: RegExpExecArray | null

  while ((match = globalExpected.exec(text)) !== null) {
    lastIndex = match.index
  }

  return lastIndex
}

const textBetween = (text: string, start: RegExp, end: RegExp): string => {
  const startIndex = indexOfPattern(text, start)
  if (startIndex === -1) {
    return ""
  }

  const endIndex = indexOfPattern(text, end, startIndex + 1)
  return text.slice(startIndex, endIndex === -1 ? undefined : endIndex)
}

export const normalizedCalculatorText = async (page: Page): Promise<string> => {
  return (await visibleCalculatorText(page)).toLowerCase()
}

export const openCalculator = async (page: Page) => {
  await page.goto("/")
  await expect(calculator(page)).toBeVisible({ timeout: 15_000 })
}

export const calculator = (page: Page) => {
  return page.getByRole("main")
}

export const workingHoursPanel = (page: Page): Locator => {
  return calculator(page)
}

export const populationControls = (page: Page): Locator => {
  return calculator(page)
}

export const productionTableText = async (page: Page): Promise<string> => {
  return textBetween(
    await visibleCalculatorRawText(page),
    /production\/day/i,
    /power generation|district recap/i,
  )
}

export const lastDistrictRecapText = async (page: Page): Promise<string> => {
  const text = await visibleCalculatorRawText(page)
  const recapIndex = lastIndexOfPattern(text, /district recap/i)
  return recapIndex === -1 ? "" : text.slice(recapIndex)
}

export const footer = (page: Page): Locator => {
  return page.getByRole("contentinfo")
}

export const beaverHeaderButton = (page: Page): Locator => {
  return page.getByRole("button", { name: /^Beavers\b/i })
}

export const botHeaderButton = (page: Page): Locator => {
  return page.getByRole("button", { name: /^Timberbots\b/i })
}

export const beaverExpandButton = (page: Page): Locator => {
  return page.getByRole("button", { name: "", exact: true }).first()
}

export const botExpandButton = (page: Page): Locator => {
  return page.getByRole("button", { name: "", exact: true }).last()
}

export const sectionHeaderButton = (page: Page, ariaControls: string): Locator => {
  return ariaControls === "beaver-needs-section" ? beaverHeaderButton(page) : botHeaderButton(page)
}

export const sectionExpandBanner = (page: Page, ariaControls: string): Locator => {
  return ariaControls === "beaver-needs-section" ? beaverExpandButton(page) : botExpandButton(page)
}

export const beaverNeedCategoryButton = (page: Page, category: string): Locator => {
  return page.getByRole("button", { name: category, exact: true }).first()
}

export const botNeedCategoryButton = (page: Page, category: string): Locator => {
  if (category === "Boost") {
    return page.getByRole("button", { name: "Boost", exact: true })
  }

  return page.getByRole("button", { name: category, exact: true }).last()
}

export const firstSurplusQuantityInput = (page: Page): Locator => {
  return page.getByRole("spinbutton").first()
}

export const lastSurplusRemoveButton = (page: Page): Locator => {
  return page.getByRole("button", { name: "Remove", exact: true }).last()
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

export const botPopulationInput = (page: Page): Locator => {
  return page.getByRole("spinbutton").nth(1)
}

export const seasonDifficultySelect = (page: Page): Locator => {
  return page.getByRole("combobox", { name: "Difficulty" }).first()
}

export const productionDifficultySelect = (page: Page): Locator => {
  return page.getByRole("combobox", { name: "Difficulty" }).last()
}

export const selectBeaverNeeds = async (page: Page, category: string) => {
  await beaverNeedCategoryButton(page, category).click()
}

export const selectBotNeeds = async (page: Page, category: string) => {
  await botNeedCategoryButton(page, category).click()
}

export const addSurplusItem = async (page: Page, item: string, quantity: string) => {
  await page.getByRole("button", { name: /Add item/ }).click()
  await page.getByRole("option", { name: item, exact: true }).click()
  const surplusRowCount = await page.getByRole("button", { name: "Remove", exact: true }).count()
  await page
    .getByRole("spinbutton")
    .nth(surplusRowCount - 1)
    .fill(quantity)
}

export const removeLastSurplusItem = async (page: Page) => {
  const rowsBeforeRemove = await page.getByRole("button", { name: "Remove", exact: true }).count()
  await lastSurplusRemoveButton(page).click()
  await expect(page.getByRole("button", { name: "Remove", exact: true })).toHaveCount(
    rowsBeforeRemove - 1,
  )
}
