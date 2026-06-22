export type FactionId = "folktails" | "iron-teeth" | "emberpelts"

export {
  beaverNeedCategories,
  botNeedCategories,
  surplusOptions,
  useTimberbornCalculator,
  type ControlsPanelViewModel,
  type NeedCardViewModel,
  type NeedCategory,
  type NeedMode,
  type ProductionPanelViewModel,
  type RecapViewModel,
  type SeasonsPanelViewModel,
  type SurplusItem,
  type SurplusPanelViewModel,
  type TimberbornCalculatorViewModel,
  type Totals,
} from "./useTimberbornCalculator"

export type ResourceCategory = "drink" | "food" | "fuel" | "material"

export type SettlementConfig = {
  faction: FactionId
  population: number
  workHours?: number
  foodIds?: string[]
  desiredSurplus?: Partial<Record<string, number>>
}

export type ProductionRow = {
  resourceId: string
  resourceName: string
  category: ResourceCategory
  buildingName: string
  dailyDemand: number
  outputPerDay: number
  buildingCount: number
  workers: number
  landUse: number
}

export type SettlementPlan = {
  faction: {
    id: FactionId
    name: string
    drinkResourceId: string
  }
  productionRows: ProductionRow[]
  summary: {
    population: number
    workHours: number
    foodConsumedPerDay: number
    drinkConsumedPerDay: number
    totalBuildings: number
    totalWorkers: number
    landUse: number
  }
}

export type FactionCatalog = {
  id: FactionId
  name: string
  drinkResourceId: string
  defaultFoodIds: string[]
  foods: Array<{
    id: string
    name: string
  }>
  surplusResources: Array<{
    id: string
    name: string
    category: Exclude<ResourceCategory, "drink" | "food">
  }>
}

type ResourceDefinition = {
  id: string
  name: string
  category: ResourceCategory
  buildingName: string
  outputPerDay: number
  workers: number
  landUse: number
  ingredients?: Record<string, number>
}

type FactionDefinition = {
  id: FactionId
  name: string
  drinkResourceId: string
  defaultFoodIds: string[]
  resources: Record<string, ResourceDefinition>
}

const BASE_DRINK_PER_BEAVER = 2.13
const BASE_FOOD_PER_BEAVER = 2.67
const DEFAULT_WORK_HOURS = 16

const FACTIONS: Record<FactionId, FactionDefinition> = {
  folktails: {
    id: "folktails",
    name: "Folktails",
    drinkResourceId: "water",
    defaultFoodIds: ["berries"],
    resources: {
      water: {
        id: "water",
        name: "Water",
        category: "drink",
        buildingName: "Water Pump",
        outputPerDay: 47.5,
        workers: 1,
        landUse: 4,
      },
      berries: {
        id: "berries",
        name: "Berries",
        category: "food",
        buildingName: "Gatherer Flag",
        outputPerDay: 38,
        workers: 1,
        landUse: 1,
      },
      carrots: {
        id: "carrots",
        name: "Carrots",
        category: "food",
        buildingName: "Farmhouse",
        outputPerDay: 30,
        workers: 1,
        landUse: 12,
      },
      bread: {
        id: "bread",
        name: "Bread",
        category: "food",
        buildingName: "Bakery",
        outputPerDay: 24,
        workers: 1,
        landUse: 8,
      },
    },
  },
  "iron-teeth": {
    id: "iron-teeth",
    name: "Iron Teeth",
    drinkResourceId: "water",
    defaultFoodIds: ["kohlrabi"],
    resources: {
      water: {
        id: "water",
        name: "Water",
        category: "drink",
        buildingName: "Large Water Pump",
        outputPerDay: 60,
        workers: 1,
        landUse: 6,
      },
      kohlrabi: {
        id: "kohlrabi",
        name: "Kohlrabi",
        category: "food",
        buildingName: "Hydroponic Garden",
        outputPerDay: 42,
        workers: 1,
        landUse: 6,
      },
      bread: {
        id: "bread",
        name: "Bread",
        category: "food",
        buildingName: "Bakery",
        outputPerDay: 24,
        workers: 1,
        landUse: 8,
      },
    },
  },
  emberpelts: {
    id: "emberpelts",
    name: "Emberpelts",
    drinkResourceId: "fruit-juice",
    defaultFoodIds: ["fire-roasted-corn"],
    resources: {
      "fruit-juice": {
        id: "fruit-juice",
        name: "Fruit Juice",
        category: "drink",
        buildingName: "Juice Press",
        outputPerDay: 30,
        workers: 1,
        landUse: 4,
      },
      "fire-roasted-corn": {
        id: "fire-roasted-corn",
        name: "Fire-Roasted Corn",
        category: "food",
        buildingName: "Cookhouse",
        outputPerDay: 24,
        workers: 1,
        landUse: 4,
      },
      "wheat-flatbread": {
        id: "wheat-flatbread",
        name: "Wheat Flatbread",
        category: "food",
        buildingName: "Clay Oven",
        outputPerDay: 18,
        workers: 1,
        landUse: 4,
      },
      "canola-mash": {
        id: "canola-mash",
        name: "Canola Mash",
        category: "food",
        buildingName: "Cookhouse",
        outputPerDay: 18,
        workers: 1,
        landUse: 4,
      },
      clay: {
        id: "clay",
        name: "Clay",
        category: "material",
        buildingName: "Clay Dredger",
        outputPerDay: 20,
        workers: 1,
        landUse: 6,
      },
      bricks: {
        id: "bricks",
        name: "Bricks",
        category: "material",
        buildingName: "Brick Kiln",
        outputPerDay: 12,
        workers: 1,
        landUse: 4,
        ingredients: {
          clay: 1,
        },
      },
      charcoal: {
        id: "charcoal",
        name: "Charcoal",
        category: "fuel",
        buildingName: "Charcoal Kiln",
        outputPerDay: 12,
        workers: 1,
        landUse: 4,
      },
    },
  },
}

const roundTo = (value: number, digits: number) => {
  const multiplier = 10 ** digits
  return Math.round(value * multiplier) / multiplier
}

const clampPopulation = (population: number) => {
  if (!Number.isFinite(population) || population < 0) {
    return 0
  }

  return Math.floor(population)
}

const unique = <Value>(values: Value[]) => {
  return [...new Set(values)]
}

const isSurplusResource = (
  resource: ResourceDefinition,
): resource is ResourceDefinition & { category: "fuel" | "material" } => {
  return resource.category === "fuel" || resource.category === "material"
}

export const getFactions = () => {
  return Object.values(FACTIONS)
}

export const getFactionCatalog = (): FactionCatalog[] => {
  return Object.values(FACTIONS).map((faction) => ({
    id: faction.id,
    name: faction.name,
    drinkResourceId: faction.drinkResourceId,
    defaultFoodIds: faction.defaultFoodIds,
    foods: Object.values(faction.resources)
      .filter((resource) => resource.category === "food")
      .map((resource) => ({
        id: resource.id,
        name: resource.name,
      })),
    surplusResources: Object.values(faction.resources)
      .filter(isSurplusResource)
      .map((resource) => ({
        id: resource.id,
        name: resource.name,
        category: resource.category,
      })),
  }))
}

export const calculateSettlementPlan = (config: SettlementConfig): SettlementPlan => {
  const faction = FACTIONS[config.faction]
  const population = clampPopulation(config.population)
  const workHours = roundTo(config.workHours ?? DEFAULT_WORK_HOURS, 1)
  const activityFactor = workHours / DEFAULT_WORK_HOURS
  const drinkDemand = roundTo(population * BASE_DRINK_PER_BEAVER * activityFactor, 1)
  const foodDemand = roundTo(population * BASE_FOOD_PER_BEAVER * activityFactor, 1)
  const foodIds = unique(config.foodIds?.length ? config.foodIds : faction.defaultFoodIds)
  const demandByResourceId = new Map<string, number>()
  const demandOrder: string[] = []

  const addDemand = (resourceId: string, amount: number) => {
    const resource = faction.resources[resourceId]

    if (!resource || amount <= 0) {
      return
    }

    if (!demandByResourceId.has(resourceId)) {
      demandOrder.push(resourceId)
    }

    demandByResourceId.set(
      resourceId,
      roundTo((demandByResourceId.get(resourceId) ?? 0) + amount, 1),
    )

    for (const [ingredientId, ingredientAmount] of Object.entries(resource.ingredients ?? {})) {
      addDemand(ingredientId, roundTo(amount * ingredientAmount, 1))
    }
  }

  addDemand(faction.drinkResourceId, drinkDemand)

  const perFoodDemand = foodIds.length > 0 ? foodDemand / foodIds.length : 0

  for (const foodId of foodIds) {
    const resource = faction.resources[foodId]

    if (!resource) {
      continue
    }

    addDemand(resource.id, roundTo(perFoodDemand, 1))
  }

  for (const [resourceId, surplus] of Object.entries(config.desiredSurplus ?? {})) {
    const resource = faction.resources[resourceId]

    if (!resource || !surplus || surplus <= 0) {
      continue
    }

    addDemand(resource.id, roundTo(surplus, 1))
  }

  const productionRows = demandOrder.map((resourceId) => {
    const resource = faction.resources[resourceId]
    return buildProductionRow(resource, demandByResourceId.get(resourceId) ?? 0)
  })

  return {
    faction: {
      id: faction.id,
      name: faction.name,
      drinkResourceId: faction.drinkResourceId,
    },
    productionRows,
    summary: {
      population,
      workHours,
      foodConsumedPerDay: foodDemand,
      drinkConsumedPerDay: drinkDemand,
      totalBuildings: productionRows.reduce(
        (total, row) => total + Math.ceil(row.buildingCount),
        0,
      ),
      totalWorkers: productionRows.reduce(
        (total, row) => total + Math.ceil(row.buildingCount * row.workers),
        0,
      ),
      landUse: productionRows.reduce(
        (total, row) => total + Math.ceil(row.buildingCount) * row.landUse,
        0,
      ),
    },
  }
}

const buildProductionRow = (resource: ResourceDefinition, dailyDemand: number): ProductionRow => {
  return {
    resourceId: resource.id,
    resourceName: resource.name,
    category: resource.category,
    buildingName: resource.buildingName,
    dailyDemand,
    outputPerDay: resource.outputPerDay,
    buildingCount: roundTo(dailyDemand / resource.outputPerDay, 2),
    workers: resource.workers,
    landUse: resource.landUse,
  }
}
