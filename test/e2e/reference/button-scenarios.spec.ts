import { expect, test } from "@playwright/test"

import {
  addSurplusItem,
  botPopulationInput,
  calculator,
  footer,
  firstSurplusQuantityInput,
  openCalculator,
  removeLastSurplusItem,
  sectionExpandBanner,
  sectionHeaderButton,
  surplusOptions,
} from "./helpers"

const chunksOf = <Value>(values: readonly Value[], size: number): Value[][] => {
  const chunks: Value[][] = []

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }

  return chunks
}

test.describe("Reference button scenarios", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("collapses and re-expands the Needs configuration sections from both controls", async ({
    page,
  }) => {
    const beaverHeader = sectionHeaderButton(page, "beaver-needs-section")
    const beaverBanner = sectionExpandBanner(page, "beaver-needs-section")
    const botHeader = sectionHeaderButton(page, "bot-needs-section")
    const botBanner = sectionExpandBanner(page, "bot-needs-section")

    await beaverHeader.click()
    await expect(beaverHeader).toHaveAttribute("aria-expanded", "false")
    await expect(beaverBanner).toHaveAttribute("aria-expanded", "false")
    await expect(page.getByRole("button", { name: /^Hunger\b/i })).toBeHidden()

    await beaverBanner.click()
    await expect(beaverHeader).toHaveAttribute("aria-expanded", "true")
    await expect(beaverBanner).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("button", { name: /^Hunger\b/i })).toBeVisible()

    await botHeader.click()
    await expect(botHeader).toHaveAttribute("aria-expanded", "false")
    await expect(botBanner).toHaveAttribute("aria-expanded", "false")
    await expect(page.getByRole("button", { name: "Biofuel" })).toBeHidden()

    await botBanner.click()
    await expect(botHeader).toHaveAttribute("aria-expanded", "true")
    await expect(botBanner).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("button", { name: "Biofuel" })).toBeVisible()
  })

  test("reveals and exercises every conditional Seasons and storage button", async ({ page }) => {
    await page.getByRole("button", { name: "Off", exact: true }).click()
    await expect(page.getByRole("button", { name: "On", exact: true })).toBeVisible()
    await expect(page.getByText(/Cultivation halted:\s*yes/i)).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Season duration and water availability table" }),
    ).toBeVisible()

    const cultivationToggle = page.getByText(/Cultivation halted:\s*(yes|no)/i)
    await expect(cultivationToggle).toHaveText(/Cultivation halted:\s*yes/i)
    await cultivationToggle.click()
    await expect(cultivationToggle).toHaveText(/Cultivation halted:\s*no/i)
    await cultivationToggle.click()
    await expect(cultivationToggle).toHaveText(/Cultivation halted:\s*yes/i)

    const tableToggle = page.getByRole("button", {
      name: "Season duration and water availability table",
    })
    await expect(tableToggle).toHaveAttribute("aria-expanded", "false")
    await tableToggle.click()
    await expect(tableToggle).toHaveAttribute("aria-expanded", "true")
    await expect(calculator(page)).toContainText(/Temperate/)
    await expect(calculator(page)).toContainText(/Drought/)
    await expect(calculator(page)).toContainText(/Badtide/)
    await expect(calculator(page)).toContainText(/Water availability/)

    await tableToggle.click()
    await expect(tableToggle).toHaveAttribute("aria-expanded", "false")

    await tableToggle.click()
    await expect(tableToggle).toHaveAttribute("aria-expanded", "true")
    await expect(calculator(page)).toContainText(/Drought/)
    await expect(calculator(page)).toContainText(/Badtide/)

    await page.getByRole("button", { name: "On", exact: true }).click()
    await expect(page.getByRole("button", { name: "Off", exact: true })).toBeVisible()
    await expect(page.getByText(/Cultivation halted:/i)).toHaveCount(0)
    await expect(
      page.getByRole("button", { name: "Season duration and water availability table" }),
    ).toHaveCount(0)
  })

  test("opens and closes the Privacy Policy modal through its documented controls", async ({
    page,
  }) => {
    const openPolicy = footer(page).getByRole("button", { name: "Privacy Policy" })

    await openPolicy.click()
    const dialog = page.getByRole("dialog", { name: "Privacy Policy" })
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(/Last updated: April 2026/)
    await expect(dialog).toContainText(/1\. Introduction/)
    await expect(dialog).toContainText(/10\. Changes to This Policy/)
    await expect(dialog.getByRole("button", { name: "Close" })).toBeVisible()
    await expect(dialog.getByRole("button")).toHaveCount(1)

    await dialog.getByRole("button", { name: "Close" }).click()
    await expect(dialog).toHaveCount(0)

    await openPolicy.click()
    await expect(page.getByRole("dialog", { name: "Privacy Policy" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog", { name: "Privacy Policy" })).toHaveCount(0)
  })

  test("updates Population values through every step button and exposes info tooltips", async ({
    page,
  }) => {
    const population = calculator(page)
    const beaverInput = page.getByRole("spinbutton", { name: "Total beaver population" })
    const decrementButtons = population.getByRole("button", { name: "−", exact: true })
    const incrementButtons = population.getByRole("button", { name: "+", exact: true })
    const decreaseBeaverPopulation = decrementButtons.nth(0)
    const increaseBeaverPopulation = incrementButtons.nth(0)
    const decreaseWanderingTime = decrementButtons.nth(1)
    const increaseWanderingTime = incrementButtons.nth(1)
    const decreaseBotPopulation = decrementButtons.nth(2)
    const increaseBotPopulation = incrementButtons.nth(2)
    const decreaseDowntime = decrementButtons.nth(3)
    const increaseDowntime = incrementButtons.nth(3)

    await expect(decrementButtons).toHaveCount(4)
    await expect(incrementButtons).toHaveCount(4)
    await expect(beaverInput).toHaveValue("10")
    await decreaseBeaverPopulation.click()
    await expect(beaverInput).toHaveValue("9")
    await increaseBeaverPopulation.click()
    await expect(beaverInput).toHaveValue("10")

    await expect(decreaseWanderingTime).toBeVisible()
    await expect(increaseWanderingTime).toBeVisible()
    await expect(population).toContainText(/0\.5\s*h/)
    await increaseWanderingTime.click()
    await expect(population).toContainText(/1\s*h/)
    await decreaseWanderingTime.click()
    await expect(population).toContainText(/0\.5\s*h/)

    await expect(decreaseBotPopulation).toBeVisible()
    await expect(increaseBotPopulation).toBeVisible()
    await expect(botPopulationInput(page)).toHaveValue("0")
    await increaseBotPopulation.click()
    await expect(botPopulationInput(page)).toHaveValue("1")
    await decreaseBotPopulation.click()
    await expect(botPopulationInput(page)).toHaveValue("0")

    await expect(decreaseDowntime).toBeVisible()
    await expect(increaseDowntime).toBeVisible()
    await expect(population).toContainText(/1\s*h/)
    await increaseDowntime.click()
    await expect(population).toContainText(/1\.5\s*h/)
    await decreaseDowntime.click()
    await expect(population).toContainText(/1\s*h/)

    await page.getByRole("button", { name: "Pause time info" }).hover()
    await expect(
      page
        .getByRole("tooltip")
        .filter({ hasText: /Mean time spent fulfilling basic needs during work time/ })
        .last(),
    ).toBeVisible()
    await page.getByRole("button", { name: "Downtime info" }).hover()
    await expect(
      page
        .getByRole("tooltip")
        .filter({ hasText: /refueling and collecting boosts/i })
        .last(),
    ).toBeVisible()
  })

  for (const [index, optionChunk] of chunksOf(surplusOptions, 8).entries()) {
    test(`can add, quantify, and remove Desired Surplus options ${index + 1}`, async ({ page }) => {
      await expect(page.getByRole("button", { name: "Remove", exact: true })).toHaveCount(0)

      for (const option of optionChunk) {
        await test.step(option, async () => {
          await addSurplusItem(page, option, "1")
          await expect(firstSurplusQuantityInput(page)).toHaveValue("1")
          await expect(page.getByRole("button", { name: "Remove", exact: true })).toHaveCount(1)
          await expect(calculator(page)).toContainText(option)
          await removeLastSurplusItem(page)
          await expect(page.getByRole("button", { name: "Remove", exact: true })).toHaveCount(0)
        })
      }
    })
  }
})
