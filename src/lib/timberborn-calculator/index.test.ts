import { describe, expect, it } from "vitest"

import { calculateSettlementPlan } from "./index"

describe("calculateSettlementPlan", () => {
  it("plans starter water and food for a small Folktails district", () => {
    const plan = calculateSettlementPlan({
      faction: "folktails",
      population: 10,
      workHours: 16,
      foodIds: ["berries"],
    })

    expect(plan.faction.name).toBe("Folktails")
    expect(plan.summary.population).toBe(10)
    expect(plan.summary.foodConsumedPerDay).toBeCloseTo(26.7, 1)
    expect(plan.summary.drinkConsumedPerDay).toBeCloseTo(21.3, 1)
    expect(plan.summary.totalBuildings).toBe(2)

    expect(plan.productionRows).toEqual([
      expect.objectContaining({
        resourceId: "water",
        resourceName: "Water",
        buildingName: "Water Pump",
        dailyDemand: 21.3,
        buildingCount: 0.45,
      }),
      expect.objectContaining({
        resourceId: "berries",
        resourceName: "Berries",
        buildingName: "Gatherer Flag",
        dailyDemand: 26.7,
        buildingCount: 0.7,
      }),
    ])
  })

  it("adds Emberpelts support production for bricks", () => {
    const plan = calculateSettlementPlan({
      faction: "emberpelts",
      population: 12,
      workHours: 16,
      foodIds: ["fire-roasted-corn"],
      desiredSurplus: {
        bricks: 12,
        charcoal: 6,
      },
    })

    const rowById = Object.fromEntries(plan.productionRows.map((row) => [row.resourceId, row]))

    expect(plan.faction.drinkResourceId).toBe("fruit-juice")
    expect(plan.summary.drinkConsumedPerDay).toBeCloseTo(25.6, 1)
    expect(rowById["fruit-juice"]).toMatchObject({
      resourceName: "Fruit Juice",
      buildingName: "Juice Press",
    })
    expect(rowById.bricks).toMatchObject({
      resourceName: "Bricks",
      buildingName: "Brick Kiln",
      dailyDemand: 12,
      buildingCount: 1,
    })
    expect(rowById.clay).toMatchObject({
      resourceName: "Clay",
      buildingName: "Clay Dredger",
      dailyDemand: 12,
      buildingCount: 0.6,
    })
    expect(rowById.charcoal).toMatchObject({
      resourceName: "Charcoal",
      buildingName: "Charcoal Kiln",
      dailyDemand: 6,
      buildingCount: 0.5,
    })
  })
})
