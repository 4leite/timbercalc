import { expect, it } from "vitest"

import { nutritionProductionSnapshotSections } from "./productionSnapshots"

it("parses Nutrition production snapshots into sections and rows", () => {
  const sections = nutritionProductionSnapshotSections("baselineNutrition")

  expect(sections.map((section) => section.title)).toEqual([
    "Water",
    "Crops",
    "Trees",
    "Food",
    "Wood",
  ])
  expect(sections.every((section) => section.rows.length > 0)).toBe(true)
  expect(sections.flatMap((section) => section.rows).map((row) => row.text)).not.toContainEqual(
    expect.stringMatching(/▾/),
  )

  const woodRows = sections.find((section) => section.title === "Wood")?.rows ?? []
  expect(woodRows.map((row) => row.text)).toEqual([
    "0.1 oak tree /day 1 (0.01) lumberjack flag 1 tiles 1 beavers",
    "total 59.2 item/day 13 buildings 32 crops 14 trees 64 tiles 45 terrain 14 beavers 1.92 khp /day",
  ])
})
