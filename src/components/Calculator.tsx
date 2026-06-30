import { type KeyboardEvent, useState } from "react"

import {
  useTimberbornCalculator,
  type ControlsPanelViewModel,
  type NeedCardViewModel,
  type ProductionPanelViewModel,
  type RecapViewModel,
  type SeasonsPanelViewModel,
  type SurplusPanelViewModel,
} from "#/lib/timberborn-calculator"

const thinSpace = "\u2009"

export const Calculator = () => {
  const calculator = useTimberbornCalculator()

  return (
    <section className="mx-auto grid max-w-295 gap-4 p-4" aria-label="Timberborn calculator">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] gap-4">
        <div className="grid gap-4">
          <ControlsPanel controls={calculator.controls} />
          <SeasonsPanel seasons={calculator.seasons} />
          <SurplusPanel surplus={calculator.surplus} />
          <ProductionPanel production={calculator.production} />
          <PowerGenerationPanel production={calculator.production} recap={calculator.recap} />
          <Recap recap={calculator.recap} variant="left" />
        </div>
        <aside className="grid gap-4">
          <PopulationPanel controls={calculator.controls} />
          <WorkingHoursPanel controls={calculator.controls} />
          <Recap recap={calculator.recap} variant="right" />
        </aside>
      </div>
    </section>
  )
}

const ControlsPanel = ({ controls }: { controls: ControlsPanelViewModel }) => {
  const [beaversExpanded, setBeaversExpanded] = useState(true)
  const [botsExpanded, setBotsExpanded] = useState(true)

  const toggleBeavers = () => setBeaversExpanded((current) => !current)
  const toggleBots = () => setBotsExpanded((current) => !current)

  return (
    <section
      className="rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4"
      aria-labelledby="needs-heading"
    >
      <div role="button" tabIndex={0} aria-label="Scroll to top of Needs configuration">
        <span id="needs-heading" className="text-xl font-extrabold">
          Needs configuration
        </span>
      </div>

      <button
        type="button"
        className="mt-3 flex gap-2"
        aria-expanded={beaversExpanded}
        aria-controls="beaver-needs-section"
        onClick={toggleBeavers}
      >
        <span>Beavers</span>
        <span>Working Speed 0%</span>
        <span>Growth Speed 0% | 6.00 d</span>
        <span>Movement Speed +5%</span>
        <span>Life Expectancy 0% | 50 d</span>
        <span>Well-being {controls.beaverNeedScore}</span>
      </button>
      <button
        type="button"
        className="mt-3 flex gap-2"
        aria-expanded={beaversExpanded}
        aria-controls="beaver-needs-section"
        onClick={toggleBeavers}
      >
        <span aria-hidden="true">{beaversExpanded ? "▲" : "▼"}</span>
      </button>

      {beaversExpanded ? (
        <div id="beaver-needs-section" className="mt-4">
          <div className="mt-3">
            <span>Needs</span>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {controls.beaverNeedCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={category === "All" ? "" : ""}
                  onClick={() => controls.selectBeaverNeedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {controls.beaverNeedCards.map((need) => (
              <NeedButton key={need.label} need={need} />
            ))}
          </div>
          {controls.showNoBeaverNeedsMessage ? <p>No beaver needs selected.</p> : null}
        </div>
      ) : null}

      <button
        type="button"
        className="mt-3 flex gap-2"
        aria-expanded={botsExpanded}
        aria-controls="bot-needs-section"
        onClick={toggleBots}
      >
        <span>Timberbots</span>
        <span>Working Speed +65%</span>
        <span>Movement Speed +30%</span>
        <span>Condition 0</span>
      </button>
      <button
        type="button"
        className="mt-3 flex gap-2"
        aria-expanded={botsExpanded}
        aria-controls="bot-needs-section"
        onClick={toggleBots}
      >
        <span aria-hidden="true">{botsExpanded ? "▲" : "▼"}</span>
      </button>

      {botsExpanded ? (
        <div id="bot-needs-section" className="mt-4">
          {controls.hasBots ? (
            <div>
              <span>Bots needs</span>
              <span>Bots replacement</span>
            </div>
          ) : null}
          <div className="mt-3">
            <span>Needs</span>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {controls.botNeedCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={category === "Basic" ? "" : category === "All" ? "" : ""}
                  onClick={() => controls.selectBotNeedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {controls.botNeedCards.map((need) => (
              <NeedButton key={need.label} need={need} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

const NeedButton = ({ need }: { need: NeedCardViewModel }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      need.onClick?.()
    }
  }

  return (
    <div
      className={
        need.active
          ? `
            cursor-pointer rounded-lg border border-[#7ec59b] bg-[#6fae72] px-3
            py-[0.45rem] text-white
          `
          : `
            cursor-pointer rounded-lg border border-[#7ec59b] bg-[#2e654f] px-3
            py-[0.45rem] text-white opacity-75
          `
      }
      role="button"
      tabIndex={0}
      aria-label={`${need.label} ${need.label}${need.active && need.score ? ` ${need.score}` : ""}`}
      onClick={need.onClick}
      onKeyDown={handleKeyDown}
    >
      <span>{need.label}</span>
      {need.active && need.score ? <span>{need.score}</span> : null}
    </div>
  )
}

const SeasonsPanel = ({ seasons }: { seasons: SeasonsPanelViewModel }) => {
  const [cultivationHalted, setCultivationHalted] = useState(true)
  const [tableExpanded, setTableExpanded] = useState(false)

  return (
    <section className="rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4">
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-xl font-extrabold">Seasons and storage</span>
        <button type="button" onClick={seasons.toggleSeasons}>
          {seasons.seasonsEnabled ? "On" : "Off"}
        </button>
      </div>

      {seasons.seasonsEnabled ? (
        <div>
          <label>
            <span>Cycle</span>
            <input
              aria-label={seasons.cycleLabel}
              type="range"
              min="1"
              max="13"
              value={seasons.cycle}
              onChange={(event) => seasons.setCycle(event.target.value)}
            />
          </label>
          <label>
            <span>Water retention</span>
            <input
              aria-label={`Water retention ${Number(seasons.retention).toFixed(1)} d`}
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={seasons.retention}
              onChange={(event) => seasons.setRetention(event.target.value)}
            />
          </label>
          <label>
            Difficulty
            <select
              value={seasons.difficulty}
              onChange={(event) => seasons.syncDifficulty(event.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <button type="button" onClick={() => setCultivationHalted((current) => !current)}>
            Cultivation halted: {cultivationHalted ? "yes" : "no"}
          </button>
          <div>
            {seasons.storageRows.map((row) => (
              <p key={row}>{row}</p>
            ))}
          </div>
          <div>
            <button
              type="button"
              aria-expanded={tableExpanded}
              onClick={() => setTableExpanded((current) => !current)}
            >
              <span aria-hidden="true">▾</span>
              <span>Season duration and water availability table</span>
            </button>
            <div style={{ display: tableExpanded ? "block" : "none" }}>
              <div
                className="
                  mt-3 grid grid-cols-5 gap-2 rounded-[0.6rem] bg-white/10 p-3
                  text-sm font-semibold text-white/80
                "
              >
                <span>Cycle</span>
                <span>Temperate min-max days</span>
                <span>Drought min-max days</span>
                <span>Badtide min-max days</span>
                <span>Water availability min-max %</span>
              </div>
              <div
                className="
                  mt-2 grid grid-cols-5 gap-2 rounded-[0.6rem] bg-white/6 p-3
                "
              >
                <span>{seasons.cycleLabel}</span>
                <span>13 - 17</span>
                <span>5 - 9</span>
                <span>4 - 8</span>
                <span>59.1% - 77.3%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>{seasons.disabledHint}</p>
      )}
    </section>
  )
}

const SurplusPanel = ({ surplus }: { surplus: SurplusPanelViewModel }) => {
  return (
    <section className="rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4">
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-xl font-extrabold">Desired Surplus</span>
        <button type="button" onClick={surplus.toggleSurplusPicker}>
          <span>Add item…</span>
          <span aria-hidden="true"> ▾</span>
        </button>
      </div>
      <div
        className="
          mt-2 grid max-w-72 gap-[0.4rem] rounded-lg border border-white/20
          bg-[#102018] p-2
        "
        role="listbox"
        style={{ display: surplus.surplusPickerOpen ? "grid" : "none" }}
      >
        {surplus.surplusOptions.map((option) => (
          <button
            key={option}
            type="button"
            role="option"
            onClick={() => surplus.addSurplusItem(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div>
        {surplus.surplusRows.map((row) => (
          <div key={row.name} className="mt-2 flex items-center gap-2">
            <span>{row.name}</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={row.quantity}
              onChange={(event) => surplus.updateSurplus(row.name, event.target.value)}
            />
            <span>/day</span>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => surplus.removeSurplus(row.name)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

const ProductionPanel = ({ production }: { production: ProductionPanelViewModel }) => {
  return (
    <section className="rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4">
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="text-xl font-extrabold"
          aria-label="Scroll to top of Production table"
        >
          Production/day
        </button>
        <label>
          Difficulty
          <select
            value={production.difficulty}
            onChange={(event) => production.syncDifficulty(event.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <button type="button" onClick={production.resetMix}>
          Reset sliders
        </button>
        <label>
          <input
            type="checkbox"
            checked={production.beaverNeedsEnabled}
            onChange={(event) => production.setBeaverNeedsEnabled(event.target.checked)}
          />
          <span>Beavers needs</span>
        </label>
        {production.showBotReferenceLabels ? (
          <>
            <span>Bots needs</span>
            <span>Bots replacement</span>
          </>
        ) : null}
      </div>

      {production.hasRows ? (
        <div className="mt-4 grid gap-3">
          {production.referenceSections ? (
            <div className="grid gap-2 rounded-[0.6rem] bg-white/6 p-3">
              <div className="text-sm font-semibold text-white/80">
                ITEM/DAY NEEDED BUILDING/PLANTS NEEDED LAND USE WORKERS POWER/DAY BOTS
              </div>
              {production.referenceSections.map((section) => (
                <section key={section.title} className="rounded-[0.6rem] bg-white/6 p-3">
                  <button type="button" aria-expanded="true">
                    <span aria-hidden="true">▾ </span>
                    {section.title}
                  </button>
                  <div className="mt-2 grid gap-2 rounded-[0.6rem] bg-white/6 p-3">
                    {section.rows.map((row) => (
                      <ProductionSnapshotRow key={row.text} text={row.text} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <>
              <div
                className="
                  grid grid-cols-1 gap-2 rounded-[0.6rem] bg-white/10 p-3
                  text-sm font-semibold text-white/80
                  md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
                "
              >
                <span className="md:text-right">Item/day needed</span>
                <span>Building/Plants needed</span>
                <span className="md:text-right">Land use</span>
                <span className="md:text-right">Workers</span>
                <span className="md:text-right">Power/day</span>
                <span className="md:text-right">Bots</span>
              </div>
              <WaterProductionSection production={production} />
              <TreesProductionSection />
              <FoodProductionSection production={production} />
              {production.scenarioRows.map((row) => (
                <div
                  key={row.join("|")}
                  className="
                    grid grid-cols-1 gap-2
                    md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
                  "
                >
                  {row.map((line, index) => (
                    <p key={`${line}-${index}`} className={index === 1 ? "" : "md:text-right"}>
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="rounded-[0.6rem] bg-white/6 p-3">
          No buildings required. Activate needs or add desired surplus items.
        </div>
      )}
    </section>
  )
}

const ProductionSnapshotRow = ({ text }: { text: string }) => {
  const words = text.split(" ")

  return (
    <div className="wrap-break-word">
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 ? " " : ""}
          {word}
        </span>
      ))}
    </div>
  )
}

const WaterProductionSection = ({ production }: { production: ProductionPanelViewModel }) => {
  if (!production.baseRowsVisible) {
    return null
  }

  return (
    <section className="mt-4">
      <button
        type="button"
        className=""
        aria-expanded={!production.water.collapsed}
        onClick={production.water.toggleCollapsed}
      >
        <span aria-hidden="true">▾ </span>Water
      </button>
      {production.water.collapsed ? null : (
        <div className="grid gap-3">
          <div className="rounded-[0.6rem] bg-white/6 p-3">
            <p>
              Water % {production.water.waterPumpMix} Water Pump
              <input
                aria-label="Mix % for Water"
                type="text"
                value={production.water.waterPumpMix}
                onChange={(event) => production.water.setWaterPumpMix(event.target.value)}
              />
            </p>
            {production.water.showWaterPumpBuilding ? (
              <p>
                Water Pump {production.water.waterPumpBuildings * 4} tiles{" "}
                {production.water.waterPumpBuildings} beavers
              </p>
            ) : null}
          </div>
          <div className="rounded-[0.6rem] bg-white/6 p-3 opacity-50">
            <p>
              Water % {production.water.largeWaterPumpMix} Large Water Pump
              <input
                aria-label="Mix % for Water"
                type="text"
                value={production.water.largeWaterPumpMix}
                onChange={(event) => production.water.setLargeWaterPumpMix(event.target.value)}
              />
            </p>
            {production.water.showLargeWaterPumpBuilding ? (
              <p>Large Water Pump 9 tiles 1 /3beavers</p>
            ) : (
              <p>Large Water Pump</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

const TreesProductionSection = () => {
  return (
    <section className="mt-4">
      <button type="button" className="" aria-expanded="true">
        <span aria-hidden="true">▾ </span>Trees
      </button>
    </section>
  )
}

const FoodProductionSection = ({ production }: { production: ProductionPanelViewModel }) => {
  if (!production.baseRowsVisible) {
    return null
  }

  return (
    <section className="mt-4">
      <button type="button" className="" aria-expanded="true">
        <span aria-hidden="true">▾ </span>Food
      </button>
      <div className="rounded-[0.6rem] bg-white/6 p-3">
        <p>
          Berries 100% {production.food.berryDemandCount} ({production.food.berryDemandExact})
        </p>
        <p>
          Gatherer Flag {production.food.gathererBuildings} tiles{" "}
          {production.food.gathererBuildings} beavers
        </p>
        <p>48.0 item/day</p>
      </div>
    </section>
  )
}

const PowerGenerationPanel = ({
  production,
  recap,
}: {
  production: ProductionPanelViewModel
  recap: RecapViewModel
}) => {
  const requiresPower = recap.hpUsed !== "0 hp"

  return (
    <section className="rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4">
      <span className="text-xl font-extrabold">Power generation</span>
      {requiresPower ? (
        <div>
          <p>Required : {recap.hpUsed}</p>
          <p>HP used {recap.hpUsed}</p>
          {recap.hpGenerated ? <p>HP generated {recap.hpGenerated}</p> : null}
          <input aria-label="Mix % for Power" type="text" value="100" readOnly />
          <p>{production.difficulty}</p>
        </div>
      ) : (
        <p>No energy required — current production draws no power.</p>
      )}
    </section>
  )
}

const PopulationPanel = ({ controls }: { controls: ControlsPanelViewModel }) => {
  return (
    <section className="rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4">
      <span className="text-xl font-extrabold">Population</span>
      <div className="mt-1 grid gap-1">
        <div>
          <button type="button" aria-label="−" onClick={controls.decrementPopulation}>
            <span aria-hidden="true">−</span>
          </button>
          <label>
            <span>Total beaver population</span>
            <input
              type="number"
              value={controls.population}
              onChange={(event) => controls.setPopulation(event.target.value)}
            />
          </label>
          <button type="button" aria-label="+" onClick={controls.incrementPopulation}>
            <span aria-hidden="true">+</span>
          </button>
        </div>
        <span>0.20 deaths/day</span>
        <div>
          <span>
            Wandering time
            <Tooltip text="Mean time spent fulfilling basic needs during work time. Highly dependant on your district size and organization. Recommended values : 0.5 to 2 hours">
              <button type="button" aria-label="Pause time info">
                i
              </button>
            </Tooltip>
          </span>
          <div>
            <button type="button" aria-label="−" onClick={controls.decrementWanderingTime}>
              <span aria-hidden="true">−</span>
            </button>
            <span>
              {controls.wanderingTime}
              {thinSpace}h
            </span>
            <button type="button" aria-label="+" onClick={controls.incrementWanderingTime}>
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-1 grid gap-1">
        <div>
          <button type="button" aria-label="−" onClick={controls.decrementBotPopulation}>
            <span aria-hidden="true">−</span>
          </button>
          <label>
            <span className="sr-only">Total bot population</span>
            <input
              type="number"
              value={controls.botPopulation}
              onChange={(event) => controls.setBotPopulation(event.target.value)}
            />
          </label>
          <button type="button" aria-label="+" onClick={controls.incrementBotPopulation}>
            <span aria-hidden="true">+</span>
          </button>
        </div>
        <span>0.00 retired/day</span>
        <div>
          <span>
            Downtime
            <Tooltip text="Mean time spent refueling and collecting boosts during work time. Highly dependant on your district size and organization. Recommended values : 1 to 3 hours">
              <button type="button" aria-label="Downtime info">
                i
              </button>
            </Tooltip>
          </span>
          <div>
            <button type="button" aria-label="−" onClick={controls.decrementDowntime}>
              <span aria-hidden="true">−</span>
            </button>
            <span>
              {controls.downtime}
              {thinSpace}h
            </span>
            <button type="button" aria-label="+" onClick={controls.incrementDowntime}>
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  return (
    <span className="group relative inline-block">
      {children}
      <span
        role="tooltip"
        className="
          absolute top-full left-0 z-20 hidden w-max max-w-88 rounded-lg border
          border-white/25 bg-[#08150f] p-2
          group-focus-within:block
          group-hover:block
        "
      >
        {text}
      </span>
    </span>
  )
}

const WorkingHoursPanel = ({ controls }: { controls: ControlsPanelViewModel }) => {
  const leisureHours = Math.max(0, 24 - controls.workingHours - 4)
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault()
      controls.decrementWorkingHours()
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault()
      controls.incrementWorkingHours()
    }
  }

  return (
    <section className="rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-extrabold">Beavers Working hours</span>
        <span>
          {controls.workingHours}
          {thinSpace}/{thinSpace}24h
        </span>
      </div>
      <div
        role="slider"
        aria-valuemin={0}
        aria-valuemax={24}
        aria-valuenow={controls.workingHours}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <input value={controls.workingHours} readOnly />
      </div>
      <p>Work time {controls.workingHours} h</p>
      <p>Leisure time {leisureHours} h</p>
      <p>Sleep time 4 h</p>
      <button
        type="button"
        disabled={!controls.hasBots}
        aria-disabled={!controls.hasBots}
        onClick={controls.toggleBotFullWorkforce}
      >
        {controls.botWorkforceButtonLabel}
      </button>
    </section>
  )
}

const Recap = ({ recap }: { recap: RecapViewModel; variant: "left" | "right" }) => {
  return (
    <section className="mt-4 rounded-[0.85rem] border border-white/15 bg-[#1e3a30] p-4">
      <span className="text-xl font-extrabold">District recap</span>
      <p>{recap.workingBeavers}</p>
      <p>{recap.workingBots}</p>
      {recap.showAvailableCarriers ? (
        <p>
          Available (all) {recap.availableCarriers ?? 0} carriers{" "}
          {recap.availableCarrierPercent ?? 0}%
        </p>
      ) : null}
      <p>Food consumed {recap.foodConsumed} /day</p>
      <p>Water consumed {recap.waterConsumed} /day</p>
      <p>Production {recap.production} items/day</p>
      <p>Buildings {recap.buildings}</p>
      <p>Trees {recap.trees}</p>
      {recap.showCrops ? <p>Crops {recap.crops}</p> : null}
      <p>Land use {recap.land}</p>
      <p>HP used {recap.hpUsed}</p>
      {recap.hpGenerated ? <p>HP generated {recap.hpGenerated}</p> : null}
      {recap.net ? <p>Net balance {recap.net}</p> : null}
      {recap.noEnergyRequired ? <p>No energy required</p> : null}
    </section>
  )
}
