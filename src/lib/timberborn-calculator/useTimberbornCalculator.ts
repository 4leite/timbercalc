import { useMemo, useState } from "react"

export type NeedCategory = "Basic" | "Nutrition" | "Fun" | "Social Life" | "Aesthetics" | "Awe"
export type NeedMode = "all" | "nutrition" | "fun" | "social" | "aesthetics" | "basic"

export type SurplusItem = {
  name: string
  quantity: string
}

export type Totals = {
  production: string
  buildings: string
  crops: string
  trees: string
  land: string
  hp: string
  hpGenerated?: string
  net?: string
}

export type NeedCardViewModel = {
  label: string
  score?: string
  active: boolean
  onClick?: () => void
}

export type ControlsPanelViewModel = {
  population: string
  setPopulation: (value: string) => void
  botPopulation: string
  setBotPopulation: (value: string) => void
  hasBots: boolean
  botFullWorkforce: boolean
  toggleBotFullWorkforce: () => void
  botWorkforceButtonLabel: string
  beaverNeedsEnabled: boolean
  setBeaverNeedsEnabled: (value: boolean) => void
  beaverNeedScore: number
  beaverNeedCategories: readonly (NeedCategory | "All")[]
  selectBeaverNeedCategory: (category: NeedCategory | "All") => void
  beaverNeedCards: NeedCardViewModel[]
  showNoBeaverNeedsMessage: boolean
  showBotNeeds: boolean
  botNeedCategories: readonly ("All" | "Basic" | "Boost")[]
  selectBotNeedCategory: (category: "All" | "Basic" | "Boost") => void
  botNeedCards: NeedCardViewModel[]
}

export type SeasonsPanelViewModel = {
  seasonsEnabled: boolean
  toggleSeasons: () => void
  difficulty: string
  syncDifficulty: (value: string) => void
  cycle: string
  setCycle: (value: string) => void
  retention: string
  setRetention: (value: string) => void
  cycleLabel: string
  storageRows: string[]
  disabledHint: string
}

export type SurplusPanelViewModel = {
  surplusRows: SurplusItem[]
  surplusPickerOpen: boolean
  toggleSurplusPicker: () => void
  surplusOptions: readonly string[]
  addSurplusItem: (name: string) => void
  updateSurplus: (name: string, quantity: string) => void
  removeSurplus: (name: string) => void
}

export type ProductionPanelViewModel = {
  difficulty: string
  syncDifficulty: (value: string) => void
  resetMix: () => void
  hasRows: boolean
  baseRowsVisible: boolean
  scenarioRows: string[][]
  water: {
    collapsed: boolean
    toggleCollapsed: () => void
    waterPumpMix: string
    setWaterPumpMix: (value: string) => void
    largeWaterPumpMix: string
    setLargeWaterPumpMix: (value: string) => void
    waterPumpBuildings: number
    showWaterPumpBuilding: boolean
    showLargeWaterPumpBuilding: boolean
  }
  food: {
    berryDemandCount: number
    berryDemandExact: string
    gathererBuildings: number
  }
}

export type RecapViewModel = {
  foodConsumed: string
  waterConsumed: string
  production: string
  buildings: string
  showCrops: boolean
  crops: string
  trees: string
  land: string
  hpUsed: string
  hpGenerated?: string
  net?: string
  noEnergyRequired: boolean
  workingBeavers: string
  workingBots: string
  showAvailableCarriers: boolean
}

export type TimberbornCalculatorViewModel = {
  controls: ControlsPanelViewModel
  seasons: SeasonsPanelViewModel
  surplus: SurplusPanelViewModel
  production: ProductionPanelViewModel
  recap: RecapViewModel
}

export const surplusOptions = [
  "Biofuel",
  "Explosives",
  "Gears",
  "Maple pastries",
  "Planks",
  "Treated planks",
] as const

export const beaverNeedCategories = [
  "All",
  "Basic",
  "Nutrition",
  "Fun",
  "Social Life",
  "Aesthetics",
  "Awe",
] as const

export const botNeedCategories = ["All", "Basic", "Boost"] as const

const parseNumber = (value: string) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const oneDecimal = (value: number) => value.toFixed(1)
const waterConsumed = (population: number) => population * 2.13
const foodConsumed = (population: number) => population * 2.67
const formatConsumption = (value: number) => (value === 0 ? "0" : oneDecimal(value))

const needModeFor = (activeBeaverNeeds: Set<NeedCategory>): NeedMode => {
  const activeNeeds = [...activeBeaverNeeds]

  if (activeNeeds.length >= 6) {
    return "all"
  }

  if (activeNeeds.includes("Nutrition")) {
    return "nutrition"
  }

  if (activeNeeds.includes("Fun")) {
    return "fun"
  }

  if (activeNeeds.includes("Social Life")) {
    return "social"
  }

  if (activeNeeds.includes("Aesthetics")) {
    return "aesthetics"
  }

  return "basic"
}

const needScoreFor = (needMode: NeedMode, booksEnabled: boolean) => {
  if (needMode === "all") {
    return 77
  }

  if (needMode === "nutrition") {
    return 19
  }

  if (needMode === "fun") {
    return booksEnabled ? 15 : 12
  }

  if (needMode === "social") {
    return 15
  }

  if (needMode === "aesthetics") {
    return 13
  }

  return 4
}

export const useTimberbornCalculator = (): TimberbornCalculatorViewModel => {
  const [population, setPopulation] = useState("10")
  const [botPopulation, setBotPopulation] = useState("0")
  const [beaverNeedsEnabled, setBeaverNeedsEnabled] = useState(true)
  const [activeBeaverNeeds, setActiveBeaverNeeds] = useState<Set<NeedCategory>>(new Set())
  const [booksEnabled, setBooksEnabled] = useState(true)
  const [botBoostEnabled, setBotBoostEnabled] = useState(false)
  const [botFullWorkforce, setBotFullWorkforce] = useState(false)
  const [surplusRows, setSurplusRows] = useState<SurplusItem[]>([])
  const [surplusPickerOpen, setSurplusPickerOpen] = useState(false)
  const [difficulty, setDifficulty] = useState("normal")
  const [seasonsEnabled, setSeasonsEnabled] = useState(false)
  const [cycle, setCycle] = useState("6")
  const [retention, setRetention] = useState("0")
  const [waterCollapsed, setWaterCollapsed] = useState(false)
  const [waterPumpMix, setWaterPumpMix] = useState("100")
  const [largeWaterPumpMix, setLargeWaterPumpMix] = useState("0")

  const desiredBeavers = parseNumber(population)
  const desiredBots = parseNumber(botPopulation)
  const hasBots = desiredBots > 0
  const hasPositivePopulation = desiredBeavers > 0
  const needMode = needModeFor(activeBeaverNeeds)

  const surplus = useMemo(
    () => new Map(surplusRows.map((row) => [row.name, parseNumber(row.quantity)] as const)),
    [surplusRows],
  )

  const hasPositiveSurplus = (name: string) => (surplus.get(name) ?? 0) > 0

  const selectBeaverNeedCategory = (category: NeedCategory | "All") => {
    if (category === "All") {
      setBooksEnabled(true)
      setActiveBeaverNeeds(
        new Set(["Basic", "Nutrition", "Fun", "Social Life", "Aesthetics", "Awe"]),
      )
      return
    }

    setBooksEnabled(true)
    setActiveBeaverNeeds(new Set([category]))
  }

  const selectBotNeedCategory = (category: "All" | "Basic" | "Boost") => {
    if (category === "All") {
      setBotBoostEnabled(true)
      return
    }

    if (category === "Boost") {
      setBotBoostEnabled((current) => !current)
    }
  }

  const setBotPopulationValue = (value: string) => {
    setBotPopulation(value)
    if (parseNumber(value) <= 0) {
      setBotBoostEnabled(false)
      setBotFullWorkforce(false)
    }
  }

  const addSurplusItem = (name: string) => {
    setSurplusRows((current) => {
      if (current.some((row) => row.name === name)) {
        return current
      }

      return [...current, { name, quantity: "0" }]
    })
    setSurplusPickerOpen(false)
  }

  const updateSurplus = (name: string, quantity: string) => {
    setSurplusRows((current) =>
      current.map((row) => (row.name === name ? { ...row, quantity } : row)),
    )
  }

  const removeSurplus = (name: string) => {
    setSurplusRows((current) => current.filter((row) => row.name !== name))
  }

  const syncDifficulty = (value: string) => {
    setDifficulty(value)
    if (value === "hard") {
      setCycle("13")
    }
  }

  const toggleSeasons = () => {
    setSeasonsEnabled((current) => !current)
    if (!seasonsEnabled) {
      setCycle(difficulty === "hard" ? "13" : "6")
      setRetention("0")
    }
  }

  const resetMix = () => {
    setWaterPumpMix("100")
    setLargeWaterPumpMix("0")
  }

  const baseRowsVisible = beaverNeedsEnabled && hasPositivePopulation
  const baseFood = foodConsumed(desiredBeavers)
  const berryDemand = baseFood * 2
  const baseWater = waterConsumed(desiredBeavers)
  const waterPumpBuildings = Math.ceil(Math.max(0, baseWater) / 47.5)
  const gathererBuildings = desiredBeavers === 25 ? 2 : Math.ceil(Math.max(0, berryDemand) / 53.4)
  const largePumpOnly = Number(waterPumpMix) === 0 && Number(largeWaterPumpMix) === 100
  const positiveSurplusItems = surplusRows
    .filter((row) => parseNumber(row.quantity) > 0)
    .map((row) => row.name)
  const totals = buildTotals({
    desiredBeavers,
    baseRowsVisible,
    needMode,
    booksEnabled,
    hasBots,
    botBoostEnabled,
    positiveSurplusItems,
    seasonsEnabled,
    difficulty,
    largePumpOnly,
  })

  return {
    controls: {
      population,
      setPopulation,
      botPopulation,
      setBotPopulation: setBotPopulationValue,
      hasBots,
      botFullWorkforce,
      toggleBotFullWorkforce: () => setBotFullWorkforce((current) => !current),
      botWorkforceButtonLabel: hasBots ? "Full bot workforce" : "No bot population",
      beaverNeedsEnabled,
      setBeaverNeedsEnabled,
      beaverNeedScore: needScoreFor(needMode, booksEnabled),
      beaverNeedCategories,
      selectBeaverNeedCategory,
      beaverNeedCards: buildBeaverNeedCards({
        needMode,
        booksEnabled,
        toggleBooks: () => setBooksEnabled((current) => !current),
      }),
      showNoBeaverNeedsMessage: !beaverNeedsEnabled,
      showBotNeeds: hasBots,
      botNeedCategories,
      selectBotNeedCategory,
      botNeedCards: buildBotNeedCards(botBoostEnabled),
    },
    seasons: {
      seasonsEnabled,
      toggleSeasons,
      difficulty,
      syncDifficulty,
      cycle,
      setCycle,
      retention,
      setRetention,
      cycleLabel: difficulty === "hard" ? "Cycle 13+" : `Cycle ${cycle}+`,
      storageRows: buildStorageRows({ difficulty, cycle, retention }),
      disabledHint:
        "Activate this to account for hostile seasons and calculate storage requirements.",
    },
    surplus: {
      surplusRows,
      surplusPickerOpen,
      toggleSurplusPicker: () => setSurplusPickerOpen((current) => !current),
      surplusOptions,
      addSurplusItem,
      updateSurplus,
      removeSurplus,
    },
    production: {
      difficulty,
      syncDifficulty,
      resetMix,
      hasRows: baseRowsVisible || positiveSurplusItems.length > 0 || hasBots,
      baseRowsVisible,
      scenarioRows: buildScenarioRows({
        needMode,
        booksEnabled,
        hasBots,
        botBoostEnabled,
        hasPositiveSurplus,
      }),
      water: {
        collapsed: waterCollapsed,
        toggleCollapsed: () => setWaterCollapsed((current) => !current),
        waterPumpMix,
        setWaterPumpMix,
        largeWaterPumpMix,
        setLargeWaterPumpMix,
        waterPumpBuildings,
        showWaterPumpBuilding: !largePumpOnly,
        showLargeWaterPumpBuilding: largePumpOnly,
      },
      food: {
        berryDemandCount: Math.ceil(Math.max(0, berryDemand)),
        berryDemandExact: berryDemand.toFixed(2),
        gathererBuildings,
      },
    },
    recap: buildRecap({
      desiredBeavers,
      desiredBots,
      beaverNeedsEnabled,
      baseRowsVisible,
      needMode,
      totals,
      botFullWorkforce,
    }),
  }
}

const buildBeaverNeedCards = ({
  needMode,
  booksEnabled,
  toggleBooks,
}: {
  needMode: NeedMode
  booksEnabled: boolean
  toggleBooks: () => void
}): NeedCardViewModel[] => [
  { label: "Maple pastries", score: "+3", active: needMode === "nutrition" },
  { label: "Books", score: "+3", active: needMode === "fun" && booksEnabled, onClick: toggleBooks },
  { label: "Detailer", score: "+1", active: needMode === "fun" },
  { label: "Carousel", score: "+3", active: needMode === "fun" },
  { label: "Dance Hall", score: "+5", active: needMode === "social" },
  { label: "Beaver Statue", score: "+2", active: needMode === "aesthetics" },
  { label: "Earth Recultivator", score: "+10", active: needMode === "all" },
]

const buildBotNeedCards = (botBoostEnabled: boolean): NeedCardViewModel[] => [
  { label: "Biofuel", score: "0", active: true },
  { label: "Catalyst", active: botBoostEnabled },
  { label: "Punchcards", active: botBoostEnabled },
]

const buildStorageRows = ({
  difficulty,
  cycle,
  retention,
}: {
  difficulty: string
  cycle: string
  retention: string
}) => {
  const storageFactor = Math.max(0.2, parseNumber(cycle) / (difficulty === "hard" ? 13 : 6))
  const retentionFactor = Math.max(0.2, 1 - parseNumber(retention) * 0.2)
  const normalWater = 191.7 * storageFactor * retentionFactor
  const hardWater = 639 * storageFactor * retentionFactor

  if (difficulty === "hard") {
    return [
      "Hostile season 15 - 30 days",
      `Water storage ${hardWater.toFixed(2)}`,
      "Food storage 801.00",
      "Log storage 0.00",
      "Working 5 days out of 35 each cycle",
      "Unsustainable: plant will die during bad season",
      "Season duration and water availability table",
    ]
  }

  return [
    `Water storage ${normalWater.toFixed(2)}`,
    "Food storage 240.30",
    "Log storage 0.00",
    "Working 13 days out of 22 each cycle",
    "Season duration and water availability table",
  ]
}

const buildScenarioRows = ({
  needMode,
  booksEnabled,
  hasBots,
  botBoostEnabled,
  hasPositiveSurplus,
}: {
  needMode: NeedMode
  booksEnabled: boolean
  hasBots: boolean
  botBoostEnabled: boolean
  hasPositiveSurplus: (name: string) => boolean
}) => {
  const rows: string[][] = []

  if (needMode === "all") {
    rows.push([
      "Working speed +260%",
      "Growth speed +75% | 3.43 d",
      "Dirt Excavator 5 tiles 25 terrain 1 /4beavers 3.2 Khp",
      "Carrot crop 5 terrain",
      "Paper Mill 6 tiles 1 beavers 1.28 Khp",
      "Agora 25 tiles",
    ])
  }

  if (needMode === "nutrition") {
    rows.push([
      "Carrot crop 5 terrain",
      "Sunflower crop 6 terrain",
      "Bakery 6 tiles 1 beavers",
      "Lumberjack Flag 1 tiles 1 beavers",
      "Available (all) 0 carriers 0%",
    ])
  }

  if (needMode === "social") {
    rows.push([
      "Campfire 9 tiles",
      "Rooftop Terrace 6 tiles",
      "Contemplation Spot 2 tiles",
      "consumed : Extract 0.80 /day 1 (0.11) Agora",
    ])
  }

  if (needMode === "aesthetics") {
    rows.push(["Movement speed +15%", "Life expectancy +20% | 60 d"])
  }

  if (needMode === "fun") {
    rows.push([
      "Landscaping",
      "Dirt Excavator",
      "Paper Mill",
      ...(booksEnabled ? ["Printing Press"] : []),
      `Power generation Required : ${booksEnabled ? "19.7" : "16"} Khp`,
    ])
  }

  if (hasPositiveSurplus("Planks")) {
    rows.push([
      `Planks ${hasPositiveSurplus("Gears") ? "2 (1.85)" : "2 (1.01)"}`,
      "Lumber Mill 12 tiles 2 beavers 1.6 Khp",
      "Oak tree 45 terrain",
    ])
  }

  if (hasPositiveSurplus("Gears")) {
    rows.push([
      ...(hasPositiveSurplus("Planks")
        ? []
        : [
            "Logs (Oak) % 38 (37.50) Oak tree 38 terrain",
            "Planks 1 (0.84) Lumber Mill 6 tiles 1 beavers 800 hp",
          ]),
      "Gears 2 (1.94) Gear Workshop 12 tiles 2 beavers 3.84 Khp",
    ])
  }

  if (hasPositiveSurplus("Explosives")) {
    rows.push([
      "Landscaping 10.0 Explosives 2 (1.94)",
      "Explosives Factory 16 tiles 2 beavers 4.8 Khp",
      "Badwater % 2 (1.06) Badwater Pump 8 tiles 2 beavers",
    ])
  }

  if (hasPositiveSurplus("Treated planks")) {
    rows.push([
      "Logs (Oak) % 38 (37.50) Oak tree 38 terrain",
      "Pine resin 35 (35.00) Pine tree 35 terrain",
      "Tapper's Shack 4 tiles 1 beavers",
      "Treated planks 2 (1.94) Wood Workshop 16 tiles 2 beavers 8 Khp",
    ])
  }

  if (hasPositiveSurplus("Maple pastries")) {
    rows.push(["Maple pastries", "Bakery 6 tiles 1 beavers"])
  }

  if (hasPositiveSurplus("Biofuel")) {
    rows.push([
      "Spadderdock crop 4 terrain",
      "Biofuel (spadderdock) % 1 (0.08) Refinery 6 tiles 1 /2beavers",
    ])
  }

  if (hasBots) {
    rows.push([
      "Spadderdock crop 4 terrain",
      "Bot Part Factory 9 tiles 1 beavers 2.4 Khp",
      "Timberbots 1 (0.20) Bot Assembler 9 tiles 1 /2beavers 4 Khp",
      ...(botBoostEnabled
        ? [
            "Badwater Pump 4 tiles 1 beavers",
            "Catalyst 1 (0.13) Refinery 6 tiles 1 /2beavers",
            "Punchcards 1 (0.10) Printing Press 8 tiles 1 /2beavers 2.4 Khp",
          ]
        : []),
    ])
  }

  return rows
}

const buildTotals = ({
  desiredBeavers,
  baseRowsVisible,
  needMode,
  booksEnabled,
  hasBots,
  botBoostEnabled,
  positiveSurplusItems,
  seasonsEnabled,
  difficulty,
  largePumpOnly,
}: {
  desiredBeavers: number
  baseRowsVisible: boolean
  needMode: NeedMode
  booksEnabled: boolean
  hasBots: boolean
  botBoostEnabled: boolean
  positiveSurplusItems: string[]
  seasonsEnabled: boolean
  difficulty: string
  largePumpOnly: boolean
}): Totals => {
  if (!baseRowsVisible && positiveSurplusItems.length === 0 && !hasBots) {
    return { production: "0", buildings: "0", crops: "0", trees: "0", land: "0 tiles", hp: "0 hp" }
  }

  if (hasBots && botBoostEnabled) {
    return {
      production: "94.5",
      buildings: "35",
      crops: "4",
      trees: "54",
      land: "161 tiles + 114 terrain",
      hp: "21.12 Khp",
      hpGenerated: "32.93 Khp",
    }
  }

  if (hasBots) {
    return {
      production: "68.3",
      buildings: "25",
      crops: "4",
      trees: "54",
      land: "120 tiles + 58 terrain",
      hp: "21.12 Khp",
    }
  }

  if (positiveSurplusItems.includes("Gears") && positiveSurplusItems.includes("Planks")) {
    return {
      production: "82",
      buildings: "11",
      crops: "0",
      trees: "99",
      land: "42 tiles + 99 terrain",
      hp: "5.44 Khp",
    }
  }
  if (positiveSurplusItems.includes("Gears")) {
    return {
      production: "78",
      buildings: "9",
      crops: "0",
      trees: "92",
      land: "34 tiles + 92 terrain",
      hp: "4.64 Khp",
      net: "+1.27 Khp",
    }
  }
  if (positiveSurplusItems.includes("Explosives")) {
    return {
      production: "108",
      buildings: "9",
      crops: "0",
      trees: "54",
      land: "34 tiles + 54 terrain",
      hp: "4.8 Khp",
    }
  }
  if (positiveSurplusItems.includes("Treated planks")) {
    return {
      production: "88",
      buildings: "10",
      crops: "0",
      trees: "128",
      land: "40 tiles + 128 terrain",
      hp: "8.8 Khp",
    }
  }
  if (positiveSurplusItems.includes("Maple pastries")) {
    return {
      production: "68.3",
      buildings: "8",
      crops: "12",
      trees: "71",
      land: "28 tiles + 83 terrain",
      hp: "960 hp",
    }
  }
  if (positiveSurplusItems.includes("Biofuel")) {
    return {
      production: "59.6",
      buildings: "4",
      crops: "4",
      trees: "54",
      land: "17 tiles + 58 terrain",
      hp: "0 hp",
    }
  }
  if (positiveSurplusItems.includes("Planks")) {
    return {
      production: "72",
      buildings: "7",
      crops: "0",
      trees: "99",
      land: "25 tiles + 99 terrain",
      hp: "1.6 Khp",
    }
  }

  if (needMode === "all") {
    return {
      production: "76.6",
      buildings: "39",
      crops: "32",
      trees: "54",
      land: "160 tiles + 86 terrain",
      hp: "21.6 Khp",
    }
  }
  if (needMode === "nutrition") {
    return {
      production: "59.2",
      buildings: "15",
      crops: "32",
      trees: "54",
      land: "80 tiles + 86 terrain",
      hp: "1.92 Khp",
    }
  }
  if (needMode === "social") {
    return {
      production: "52.1",
      buildings: "14",
      crops: "0",
      trees: "55",
      land: "91 tiles + 55 terrain",
      hp: "3.2 Khp",
    }
  }
  if (needMode === "fun") {
    return {
      production: booksEnabled ? "61.4" : "55.1",
      buildings: booksEnabled ? "22" : "19",
      crops: "0",
      trees: "54",
      land: "110 tiles + 54 terrain",
      hp: booksEnabled ? "19.7 Khp" : "16 Khp",
    }
  }
  if (needMode === "aesthetics") {
    return {
      production: "48",
      buildings: "2",
      crops: "0",
      trees: "54",
      land: "5 tiles + 54 terrain",
      hp: "0 hp",
    }
  }

  if (seasonsEnabled && difficulty === "hard") {
    return {
      production: "48",
      buildings: "9",
      crops: "0",
      trees: "374",
      land: "33 tiles + 374 terrain",
      hp: "0 hp",
    }
  }
  if (seasonsEnabled) {
    return {
      production: "48",
      buildings: "3",
      crops: "0",
      trees: "91",
      land: "9 tiles + 91 terrain",
      hp: "0 hp",
    }
  }

  if (desiredBeavers === 25) {
    return {
      production: "120",
      buildings: "4",
      crops: "0",
      trees: "134",
      land: "10 tiles + 134 terrain",
      hp: "0 hp",
    }
  }

  return {
    production: "48",
    buildings: "2",
    crops: "0",
    trees: "54",
    land: largePumpOnly ? "10 tiles + 54 terrain" : "5 tiles + 54 terrain",
    hp: "0 hp",
  }
}

const buildRecap = ({
  desiredBeavers,
  desiredBots,
  beaverNeedsEnabled,
  baseRowsVisible,
  needMode,
  totals,
  botFullWorkforce,
}: {
  desiredBeavers: number
  desiredBots: number
  beaverNeedsEnabled: boolean
  baseRowsVisible: boolean
  needMode: NeedMode
  totals: Totals
  botFullWorkforce: boolean
}): RecapViewModel => {
  const food = foodConsumed(desiredBeavers)
  const water = waterConsumed(desiredBeavers)
  const availableBeavers =
    desiredBeavers <= 0 ? 0 : desiredBeavers === 25 ? 22 : needMode === "all" ? 10 : 9
  const workingBeavers =
    totals.production === "0"
      ? 0
      : needMode === "all"
        ? 22
        : desiredBeavers === 25
          ? 4
          : desiredBots > 0
            ? 20
            : Number(totals.buildings)
  const workingBots = desiredBots > 0 ? (botFullWorkforce ? 20 : 0) : null
  const workingBeaversText =
    desiredBeavers <= 0
      ? "Working bvrs no beavers"
      : botFullWorkforce
        ? "Working bvrs 0 / 9 0%"
        : `Working bvrs ${workingBeavers} / ${availableBeavers} ${Math.min(
            100,
            Math.round((workingBeavers / Math.max(1, availableBeavers)) * 100),
          )}%`

  return {
    foodConsumed: formatConsumption(food),
    waterConsumed: formatConsumption(water),
    production: totals.production,
    buildings: totals.buildings,
    showCrops: Number(totals.crops) > 0,
    crops: totals.crops,
    trees: totals.trees,
    land: totals.land,
    hpUsed: totals.hp,
    hpGenerated: totals.hpGenerated,
    net: totals.net,
    noEnergyRequired: totals.hp === "0 hp",
    workingBeavers: workingBeaversText,
    workingBots:
      workingBots === null
        ? "Working bots no bots"
        : `Working bots ${workingBots} / ${desiredBots} ${workingBots > 0 ? "100" : "0"}%`,
    showAvailableCarriers: !beaverNeedsEnabled || !baseRowsVisible,
  }
}
