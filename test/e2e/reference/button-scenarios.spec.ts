import { expect, test } from "@playwright/test"

import {
  addSurplusItem,
  beaverNeeds,
  botNeeds,
  botPopulationInput,
  desiredSurplus,
  footer,
  openCalculator,
  populationControls,
  removeSurplusItem,
  seasonsAndStorage,
  sectionExpandBanner,
  sectionHeaderButton,
  surplusOptions,
  surplusQuantityInput,
} from "./helpers"

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
    await expect(beaverNeeds(page)).toBeHidden()

    await beaverBanner.click()
    await expect(beaverHeader).toHaveAttribute("aria-expanded", "true")
    await expect(beaverBanner).toHaveAttribute("aria-expanded", "true")
    await expect(beaverNeeds(page)).toBeVisible()

    await botHeader.click()
    await expect(botHeader).toHaveAttribute("aria-expanded", "false")
    await expect(botBanner).toHaveAttribute("aria-expanded", "false")
    await expect(botNeeds(page)).toBeHidden()

    await botBanner.click()
    await expect(botHeader).toHaveAttribute("aria-expanded", "true")
    await expect(botBanner).toHaveAttribute("aria-expanded", "true")
    await expect(botNeeds(page)).toBeVisible()
  })

  test("reveals and exercises every conditional Seasons and storage button", async ({ page }) => {
    const seasons = seasonsAndStorage(page)

    await seasons.getByRole("button", { name: "Off", exact: true }).click()
    await expect(seasons.getByRole("button", { name: "On", exact: true })).toBeVisible()
    await expect(seasons.locator("button")).toHaveCount(3)

    const cultivationToggle = seasons
      .getByText(/Cultivation halted:\s*(yes|no)/i)
      .locator("xpath=..")
    await expect(cultivationToggle).toHaveText(/Cultivation halted:\s*yes/i)
    await cultivationToggle.click()
    await expect(cultivationToggle).toHaveText(/Cultivation halted:\s*no/i)
    await cultivationToggle.click()
    await expect(cultivationToggle).toHaveText(/Cultivation halted:\s*yes/i)

    const tableToggle = seasons.getByRole("button", {
      name: "Season duration and water availability table",
    })
    await expect(tableToggle).toHaveAttribute("aria-expanded", "false")
    await tableToggle.click()
    await expect(tableToggle).toHaveAttribute("aria-expanded", "true")
    const tableBody = seasons
      .locator("div")
      .filter({ hasText: /Temperate/ })
      .filter({ hasText: /Drought/ })
      .last()
    await expect(tableBody).toBeVisible()
    await expect(tableBody).toContainText(/Temperate/)
    await expect(tableBody).toContainText(/Drought/)
    await expect(tableBody).toContainText(/Badtide/)
    await expect(tableBody).toContainText(/Water availability/)

    await tableToggle.click()
    await expect(tableToggle).toHaveAttribute("aria-expanded", "false")
    await expect(tableBody).toBeHidden()

    await seasons.getByRole("button", { name: "On", exact: true }).click()
    await expect(seasons.getByRole("button", { name: "Off", exact: true })).toBeVisible()
    await expect(seasons.locator("button")).toHaveCount(1)
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
    await expect(dialog.locator("button")).toHaveCount(1)

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
    const population = populationControls(page)
    const beaverInput = page.getByRole("spinbutton", { name: "Total beaver population" })
    const beaverInputButtons = beaverInput.locator("xpath=..").locator("button")
    const beaverTimeContainer = page
      .getByRole("button", { name: "Pause time info" })
      .locator("xpath=../../..")
    const beaverTimeButtons = beaverTimeContainer.locator("button:not([aria-label])")
    const botInputButtons = botPopulationInput(page).locator("xpath=..").locator("button")
    const botTimeContainer = page
      .getByRole("button", { name: "Downtime info" })
      .locator("xpath=../../..")
    const botTimeButtons = botTimeContainer.locator("button:not([aria-label])")

    await expect(beaverInputButtons).toHaveCount(2)
    await expect(beaverInput).toHaveValue("10")
    await beaverInputButtons.first().click()
    await expect(beaverInput).toHaveValue("9")
    await beaverInputButtons.nth(1).click()
    await expect(beaverInput).toHaveValue("10")

    await expect(beaverTimeButtons).toHaveCount(2)
    await expect(beaverTimeContainer).toContainText(/0\.5\s*h/)
    await beaverTimeButtons.nth(1).click()
    await expect(beaverTimeContainer).toContainText(/1\s*h/)
    await beaverTimeButtons.first().click()
    await expect(beaverTimeContainer).toContainText(/0\.5\s*h/)

    await expect(botInputButtons).toHaveCount(2)
    await expect(botPopulationInput(page)).toHaveValue("0")
    await botInputButtons.nth(1).click()
    await expect(botPopulationInput(page)).toHaveValue("1")
    await botInputButtons.first().click()
    await expect(botPopulationInput(page)).toHaveValue("0")

    await expect(botTimeButtons).toHaveCount(2)
    await expect(botTimeContainer).toContainText(/1\s*h/)
    await botTimeButtons.nth(1).click()
    await expect(botTimeContainer).toContainText(/1\.5\s*h/)
    await botTimeButtons.first().click()
    await expect(botTimeContainer).toContainText(/1\s*h/)

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

  test("can add, quantify, and remove every Desired Surplus option", async ({ page }) => {
    await expect(desiredSurplus(page).getByRole("button", { name: "Remove" })).toHaveCount(0)

    for (const option of surplusOptions) {
      await test.step(option, async () => {
        await addSurplusItem(page, option, "1")
        await expect(surplusQuantityInput(page, option)).toHaveValue("1")
        await expect(desiredSurplus(page).getByRole("button", { name: "Remove" })).toHaveCount(1)
        await expect(desiredSurplus(page)).toContainText(option)
        await removeSurplusItem(page, option)
        await expect(desiredSurplus(page).getByRole("button", { name: "Remove" })).toHaveCount(0)
      })
    }
  })
})
