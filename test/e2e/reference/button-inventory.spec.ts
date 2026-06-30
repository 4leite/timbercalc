import { expect, test } from "@playwright/test"

import { beaverNeedCards, botNeedCards, footer, openCalculator, surplusOptions } from "./helpers"

const flatValues = <T extends Record<string, readonly string[]>>(groups: T): string[] => {
  return Object.values(groups).flatMap((values) => [...values])
}

test.describe("Reference button inventory", { tag: "@reference" }, () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page)
  })

  test("matches the documented default accessible control totals", async ({ page }) => {
    await expect(page.getByRole("button", { includeHidden: true })).toHaveCount(72)
    await expect(page.getByRole("link", { name: "Visit Timberborn Steam page" })).toHaveCount(1)
    await expect
      .poll(async () => {
        const buttons = await page.getByRole("button", { includeHidden: true }).count()
        const links = await page.getByRole("link", { name: "Visit Timberborn Steam page" }).count()

        return buttons + links
      })
      .toBe(73)
  })

  test("covers every default section subtotal from the catalogue", async ({ page }) => {
    await expect(page.getByRole("banner").getByRole("button")).toHaveCount(1)
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Visit Timberborn Steam page" }),
    ).toHaveCount(1)

    await expect(
      page.getByRole("button", { name: "Scroll to top of Needs configuration" }),
    ).toHaveCount(1)
    await expect(
      page.getByRole("button", { name: "Scroll to top of Needs configuration" }),
    ).toHaveAttribute("role", "button")

    await expect(page.getByRole("button", { name: /^Beavers\b/i })).toHaveCount(1)
    await expect(page.getByRole("button", { name: /^Timberbots\b/i })).toHaveCount(1)
    await expect(page.getByRole("button", { name: "", exact: true })).toHaveCount(2)
    await expect(page.getByRole("button", { name: "Basic", exact: true })).toHaveCount(2)
    await expect(page.getByRole("button", { name: "All", exact: true })).toHaveCount(2)
    await expect(page.getByRole("button", { name: "Off", exact: true })).toHaveCount(1)
    await expect(page.getByRole("button", { name: /Add item/ })).toHaveCount(1)
    await expect(
      page.getByRole("button", { name: "Scroll to top of Production table" }),
    ).toHaveCount(1)
    await expect(page.getByRole("button", { name: "Reset sliders" })).toHaveCount(1)
    await expect(page.getByRole("button", { name: /^▾?\s*(Water|Trees|Food)$/i })).toHaveCount(3)
    await expect(
      page.getByRole("main").getByRole("button", { name: "−", exact: true }),
    ).toHaveCount(4)
    await expect(
      page.getByRole("main").getByRole("button", { name: "+", exact: true }),
    ).toHaveCount(4)
    await expect(page.getByRole("button", { name: "Pause time info" })).toHaveCount(1)
    await expect(page.getByRole("button", { name: "Downtime info" })).toHaveCount(1)
    await expect(footer(page).getByRole("button", { name: "Privacy Policy" })).toHaveCount(1)
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
    await expect(page.getByRole("button", { name: /^Beavers\b/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(page.getByRole("button", { name: "", exact: true }).first()).toHaveAttribute(
      "aria-expanded",
      "true",
    )

    for (const category of Object.keys(beaverNeedCards)) {
      await expect(page.getByRole("button", { name: category, exact: true }).first()).toBeVisible()
    }

    for (const cardName of flatValues(beaverNeedCards)) {
      await expect(page.getByRole("button", { name: new RegExp(`^${cardName}`) })).toBeVisible()
    }

    await expect(page.getByRole("button", { name: /^Timberbots\b/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(page.getByRole("button", { name: "", exact: true }).last()).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(page.getByRole("button", { name: "All", exact: true }).last()).toBeVisible()
    for (const category of Object.keys(botNeedCards)) {
      await expect(page.getByRole("button", { name: category, exact: true }).last()).toBeVisible()
    }
    for (const cardName of flatValues(botNeedCards)) {
      await expect(page.getByRole("button", { name: new RegExp(`^${cardName}`) })).toBeVisible()
    }

    await expect(page.getByRole("button", { name: "Off" })).toBeVisible()
    await expect(page.getByRole("button", { name: /Add item/ })).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Scroll to top of Production table" }),
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Reset sliders" })).toBeVisible()
    for (const category of ["Water", "Trees", "Food"]) {
      await expect(
        page.getByRole("button", { name: new RegExp(`^▾?\\s*${category}$`, "i") }),
      ).toBeVisible()
    }

    await expect(page.getByRole("button", { name: "Pause time info" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Downtime info" })).toBeVisible()
    await expect(
      page.getByRole("main").getByRole("button", { name: "−", exact: true }),
    ).toHaveCount(4)
    await expect(
      page.getByRole("main").getByRole("button", { name: "+", exact: true }),
    ).toHaveCount(4)
    await expect(page.getByRole("button", { name: "No bot population" })).toBeDisabled()
    await expect(footer(page).getByRole("button", { name: "Privacy Policy" })).toBeVisible()
  })

  test("keeps every hidden surplus dropdown option rendered and reachable", async ({ page }) => {
    await expect(page.getByRole("option", { includeHidden: true })).toHaveCount(
      surplusOptions.length + 3,
    )

    for (const option of surplusOptions) {
      await expect(
        page.getByRole("option", {
          name: option,
          exact: true,
          includeHidden: true,
        }),
      ).toHaveCount(1)
    }
  })
})
