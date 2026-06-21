import { expect, type Locator, type Page } from "@playwright/test"

const escapedRegExp = (expected: string): string => expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

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

const surplusSection = (page: Page): Locator => {
  return calculator(page).locator(".surplus-section")
}

const productionRow = (page: Page, expected: string | RegExp): Locator => {
  return calculator(page)
    .locator(".prod-row")
    .filter({ hasText: caseInsensitive(expected) })
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
  return surplusSection(page)
    .locator(".surplus-row")
    .filter({ hasText: new RegExp(`^${escapedRegExp(item)}\\s*/day$`, "i") })
    .getByRole("spinbutton")
}

export const botPopulationInput = (page: Page): Locator => {
  return calculator(page).locator(".pop-col--bots").getByRole("spinbutton")
}

export const seasonDifficultySelect = (page: Page): Locator => {
  return calculator(page).locator(".water-mgmt").getByRole("combobox", { name: "Difficulty" })
}

export const productionDifficultySelect = (page: Page): Locator => {
  return calculator(page).locator(".prod-table-wrap").getByRole("combobox", { name: "Difficulty" })
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
