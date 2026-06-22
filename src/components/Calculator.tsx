/* eslint-disable better-tailwindcss/no-unknown-classes */
import {
  useTimberbornCalculator,
  type ControlsPanelViewModel,
  type NeedCardViewModel,
  type ProductionPanelViewModel,
  type RecapViewModel,
  type SeasonsPanelViewModel,
  type SurplusPanelViewModel,
} from "#/lib/timberborn-calculator"

export const Calculator = () => {
  const calculator = useTimberbornCalculator()

  return (
    <section className="reference-calculator" aria-label="Timberborn calculator">
      <ControlsPanel controls={calculator.controls} />
      <SeasonsPanel seasons={calculator.seasons} />
      <SurplusPanel surplus={calculator.surplus} />
      <ProductionPanel production={calculator.production} recap={calculator.recap} />
    </section>
  )
}

const ControlsPanel = ({ controls }: { controls: ControlsPanelViewModel }) => {
  return (
    <section className="pop-panel" aria-labelledby="needs-heading">
      <div className="panel-header">
        <span id="needs-heading" className="calc-section-heading">
          Needs configuration
        </span>
      </div>

      <div className="population-grid">
        <label className="pop-col pop-col--beavers">
          <span>Total beaver population</span>
          <input
            type="number"
            value={controls.population}
            onChange={(event) => controls.setPopulation(event.target.value)}
          />
        </label>
        <label className="pop-col pop-col--bots">
          <span>Total bot population</span>
          <input
            type="number"
            value={controls.botPopulation}
            onChange={(event) => controls.setBotPopulation(event.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={!controls.hasBots}
          onClick={controls.toggleBotFullWorkforce}
        >
          {controls.botWorkforceButtonLabel}
        </button>
      </div>

      <div id="beaver-needs-section" className="needs-section">
        <div className="section-title-row">
          <span>Beavers</span>
          <button type="button">Well-being {controls.beaverNeedScore}</button>
        </div>
        <div className="needs-filter-btns">
          {controls.beaverNeedCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => controls.selectBeaverNeedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="needs-grid">
          {controls.beaverNeedCards.map((need) => (
            <NeedButton key={need.label} need={need} />
          ))}
        </div>
        {controls.showNoBeaverNeedsMessage ? <p>No beaver needs selected.</p> : null}
      </div>

      {controls.showBotNeeds ? (
        <div id="bot-needs-section" className="needs-section">
          <div className="section-title-row">
            <span>Bots needs</span>
            <span>Bots replacement</span>
          </div>
          <div className="needs-filter-btns">
            {controls.botNeedCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => controls.selectBotNeedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="needs-grid">
            {controls.botNeedCards.map((need) => (
              <NeedButton key={need.label} need={need} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="prod-checkboxes">
        <label>
          <input
            type="checkbox"
            checked={controls.beaverNeedsEnabled}
            onChange={(event) => controls.setBeaverNeedsEnabled(event.target.checked)}
          />
          <span>Beavers needs</span>
        </label>
      </div>
    </section>
  )
}

const NeedButton = ({ need }: { need: NeedCardViewModel }) => {
  return (
    <button
      type="button"
      className={need.active ? "need-card need-card--active" : "need-card"}
      aria-label={`${need.label} ${need.label}${need.active && need.score ? ` ${need.score}` : ""}`}
      onClick={need.onClick}
    >
      <span>{need.label}</span>
      {need.active && need.score ? <span>{need.score}</span> : null}
    </button>
  )
}

const SeasonsPanel = ({ seasons }: { seasons: SeasonsPanelViewModel }) => {
  return (
    <section className="water-mgmt">
      <div className="power-table-title-row">
        <span className="calc-section-heading">Seasons and storage</span>
        <button type="button" onClick={seasons.toggleSeasons}>
          {seasons.seasonsEnabled ? "On" : "Off"}
        </button>
      </div>

      {seasons.seasonsEnabled ? (
        <div className="water-controls">
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
          <input
            aria-label={seasons.cycleLabel}
            type="range"
            min="1"
            max="13"
            value={seasons.cycle}
            onChange={(event) => seasons.setCycle(event.target.value)}
          />
          <input
            aria-label={`Water retention ${Number(seasons.retention).toFixed(1)} d`}
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={seasons.retention}
            onChange={(event) => seasons.setRetention(event.target.value)}
          />
          <div className="season-storage">
            {seasons.storageRows.map((row) => (
              <p key={row}>{row}</p>
            ))}
          </div>
        </div>
      ) : (
        <p className="water-mgmt-off-hint">{seasons.disabledHint}</p>
      )}
    </section>
  )
}

const SurplusPanel = ({ surplus }: { surplus: SurplusPanelViewModel }) => {
  return (
    <section className="surplus-section">
      <div className="surplus-header-row">
        <span className="section-title">Desired Surplus</span>
        <button type="button" onClick={surplus.toggleSurplusPicker}>
          Add item…
        </button>
      </div>
      {surplus.surplusPickerOpen ? (
        <div className="surplus-picker-dropdown" role="listbox">
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
      ) : null}
      {surplus.surplusRows.map((row) => (
        <div key={row.name} className="surplus-row">
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
    </section>
  )
}

const ProductionPanel = ({
  production,
  recap,
}: {
  production: ProductionPanelViewModel
  recap: RecapViewModel
}) => {
  return (
    <section className="prod-table-wrap">
      <div className="prod-table-title-row">
        <button type="button" className="calc-section-heading">
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
      </div>

      {production.hasRows ? (
        <div className="prod-table">
          <WaterProductionSection production={production} />
          <FoodProductionSection production={production} />
          {production.scenarioRows.map((row) => (
            <div key={row.join("|")} className="prod-row">
              {row.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No buildings required</div>
      )}

      <Recap recap={recap} />
    </section>
  )
}

const WaterProductionSection = ({ production }: { production: ProductionPanelViewModel }) => {
  if (!production.baseRowsVisible) {
    return null
  }

  return (
    <section className="prod-section">
      <button
        type="button"
        className="prod-section-header"
        aria-expanded={!production.water.collapsed}
        onClick={production.water.toggleCollapsed}
      >
        Water
      </button>
      {production.water.collapsed ? null : (
        <div className="prod-type-rows">
          <div className="prod-row">
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
          <div className="prod-row prod-row--inactive">
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

const FoodProductionSection = ({ production }: { production: ProductionPanelViewModel }) => {
  if (!production.baseRowsVisible) {
    return null
  }

  return (
    <section className="prod-section">
      <button type="button" className="prod-section-header">
        Food
      </button>
      <div className="prod-row">
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

const Recap = ({ recap }: { recap: RecapViewModel }) => {
  return (
    <section className="district-recap">
      <p>Food consumed {recap.foodConsumed} /day</p>
      <p>Water consumed {recap.waterConsumed} /day</p>
      <p>Production {recap.production} items/day</p>
      <p>Buildings {recap.buildings}</p>
      {recap.showCrops ? <p>Crops {recap.crops}</p> : null}
      <p>Trees {recap.trees}</p>
      <p>Land use {recap.land}</p>
      <p>HP used {recap.hpUsed}</p>
      {recap.hpGenerated ? <p>HP generated {recap.hpGenerated}</p> : null}
      {recap.net ? <p>Net balance {recap.net}</p> : null}
      {recap.noEnergyRequired ? <p>No energy required</p> : null}
      <p>{recap.workingBeavers}</p>
      <p>{recap.workingBots}</p>
      {recap.showAvailableCarriers ? <p>Available (all) 0 carriers</p> : null}
    </section>
  )
}
