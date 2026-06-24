import { expect, test } from "@playwright/test"

import {
  beaverNeedCards,
  beaverNeeds,
  botNeedCards,
  botNeeds,
  desiredSurplus,
  districtRecaps,
  footer,
  openCalculator,
  populationControls,
  powerGenerationSection,
  productionTable,
  roleButtons,
  seasonsAndStorage,
  sectionExpandBanner,
  sectionHeaderButton,
  semanticButtons,
  surplusOptions,
  workingHoursPanel,
} from "./helpers"

const flatValues = <T extends Record<string, readonly string[]>>(groups: T): string[] => {
  return Object.values(groups).flatMap((values) => [...values])
}

test.describe("Reference button inventory", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("matches the documented default button totals", async ({ page }) => {
    await expect(semanticButtons(page)).toHaveCount(76)
    await expect(roleButtons(page)).toHaveCount(38)
    await expect(page.locator("a.steam-page-cta")).toHaveCount(1)

    await expect(page.locator('button, [role="button"]')).toHaveCount(114)
    await expect(page.locator('button, [role="button"], a.steam-page-cta')).toHaveCount(115)
  })

  test("covers every default section subtotal from the catalogue", async ({ page }) => {
    await expect(page.getByRole("banner").locator("button")).toHaveCount(1)
    await expect(page.getByRole("banner").locator("a.steam-page-cta")).toHaveCount(1)

    await expect(
      page.getByRole("button", { name: "Scroll to top of Needs configuration" }),
    ).toHaveCount(1)
    await expect(
      page.getByRole("button", { name: "Scroll to top of Needs configuration" }),
    ).toHaveAttribute("role", "button")

    await expect(sectionHeaderButton(page, "beaver-needs-section")).toHaveCount(1)
    await expect(sectionExpandBanner(page, "beaver-needs-section")).toHaveCount(1)
    await expect(beaverNeeds(page).locator("button")).toHaveCount(7)
    await expect(beaverNeeds(page).locator('[role="button"]')).toHaveCount(34)

    await expect(sectionHeaderButton(page, "bot-needs-section")).toHaveCount(1)
    await expect(sectionExpandBanner(page, "bot-needs-section")).toHaveCount(1)
    await expect(botNeeds(page).locator("button")).toHaveCount(3)
    await expect(botNeeds(page).locator('[role="button"]')).toHaveCount(3)

    await expect(seasonsAndStorage(page).locator("button")).toHaveCount(1)
    await expect(desiredSurplus(page).locator("button")).toHaveCount(43)
    await expect(productionTable(page).locator("button")).toHaveCount(5)
    await expect(powerGenerationSection(page).locator("button")).toHaveCount(0)
    await expect(districtRecaps(page)).toHaveCount(2)
    await expect(districtRecaps(page).locator('button, [role="button"], a')).toHaveCount(0)
    await expect(populationControls(page).locator("button")).toHaveCount(10)
    await expect(workingHoursPanel(page).locator("button")).toHaveCount(1)
    await expect(footer(page).locator("button")).toHaveCount(1)
  })

  test("exposes every default named button-like control", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Calculator" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Visit Timberborn Steam page" })).toHaveAttribute(
      "href",
      /store\.steampowered\.com\/app\/1062090\/Timberborn/,
    )
    await expect(page.getByRole("link", { name: "Visit Timberborn Steam page" })).toHaveAttribute(
      "rel",
      /noopener noreferrer/,
    )

    await expect(
      page.getByRole("button", { name: "Scroll to top of Needs configuration" }),
    ).toBeVisible()
    await expect(sectionHeaderButton(page, "beaver-needs-section")).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(sectionExpandBanner(page, "beaver-needs-section")).toHaveAttribute(
      "aria-expanded",
      "true",
    )

    for (const category of Object.keys(beaverNeedCards)) {
      await expect(
        beaverNeeds(page).getByRole("button", { name: category, exact: true }),
      ).toBeVisible()
    }

    for (const cardName of flatValues(beaverNeedCards)) {
      await expect(
        beaverNeeds(page).getByRole("button", { name: new RegExp(`^${cardName}`) }),
      ).toBeVisible()
    }

    await expect(sectionHeaderButton(page, "bot-needs-section")).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(sectionExpandBanner(page, "bot-needs-section")).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(botNeeds(page).getByRole("button", { name: "All", exact: true })).toBeVisible()
    for (const category of Object.keys(botNeedCards)) {
      await expect(
        botNeeds(page).getByRole("button", { name: category, exact: true }),
      ).toBeVisible()
    }
    for (const cardName of flatValues(botNeedCards)) {
      await expect(
        botNeeds(page).getByRole("button", { name: new RegExp(`^${cardName}`) }),
      ).toBeVisible()
    }

    await expect(seasonsAndStorage(page).getByRole("button", { name: "Off" })).toBeVisible()
    await expect(desiredSurplus(page).getByRole("button", { name: /Add item/ })).toBeVisible()
    await expect(
      productionTable(page).getByRole("button", { name: "Scroll to top of Production table" }),
    ).toBeVisible()
    await expect(productionTable(page).getByRole("button", { name: "Reset sliders" })).toBeVisible()
    for (const category of ["Water", "Trees", "Food"]) {
      await expect(
        productionTable(page).getByRole("button", { name: new RegExp(`^▾?\\s*${category}$`, "i") }),
      ).toBeVisible()
    }

    await expect(page.getByRole("button", { name: "Pause time info" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Downtime info" })).toBeVisible()
    await expect(page.getByRole("button", { name: "No bot population" })).toBeDisabled()
    await expect(footer(page).getByRole("button", { name: "Privacy Policy" })).toBeVisible()
  })

  test("keeps every hidden surplus dropdown option rendered and reachable", async ({ page }) => {
    await expect(desiredSurplus(page).getByRole("option", { includeHidden: true })).toHaveCount(
      surplusOptions.length,
    )

    for (const option of surplusOptions) {
      await expect(
        desiredSurplus(page).getByRole("option", {
          name: option,
          exact: true,
          includeHidden: true,
        }),
      ).toHaveCount(1)
    }
  })
})
