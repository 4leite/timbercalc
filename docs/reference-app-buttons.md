# Reference app button catalogue

This catalogue records the button inventory in the static reference app snapshot at
`reference-site/index.html`.

Source-of-truth rules:

- Count every rendered semantic `<button>` in `reference-site/index.html`.
- Count every `role="button"` element as a button-like control.
- Catalogue anchor CTAs separately as button-like links.
- Count hidden-but-rendered dropdown options, because they are present in the reference DOM and
  reachable through the UI.
- Count disabled buttons and record their state.
- Do not count non-button form controls in the core total; list them under
  [Adjacent controls not counted as buttons](#adjacent-controls-not-counted-as-buttons).
- Exclude tooltip surfaces and static display-only content.
- The totals are for the default rendered snapshot in `reference-site/index.html`. Conditional
  behavior below was cross-checked against the reference bundle in
  `reference-site/assets/index-DoD9nACF.js`; those notes document UI that appears after interactions
  without changing the default-snapshot totals.

## Totals

| Section                          | Semantic `<button>` | `role="button"` | Anchor CTA | Core subtotal | With CTA |
| -------------------------------- | ------------------: | --------------: | ---------: | ------------: | -------: |
| Header                           |                   1 |               0 |          1 |             1 |        2 |
| Needs configuration shell        |                   0 |               1 |          0 |             1 |        1 |
| Needs configuration > Beavers    |                   9 |              34 |          0 |            43 |       43 |
| Needs configuration > Timberbots |                   5 |               3 |          0 |             8 |        8 |
| Seasons and storage              |                   1 |               0 |          0 |             1 |        1 |
| Desired Surplus                  |                  43 |               0 |          0 |            43 |       43 |
| Production/day                   |                   5 |               0 |          0 |             5 |        5 |
| Power generation                 |                   0 |               0 |          0 |             0 |        0 |
| District recap                   |                   0 |               0 |          0 |             0 |        0 |
| Population                       |                  10 |               0 |          0 |            10 |       10 |
| Beavers Working hours            |                   1 |               0 |          0 |             1 |        1 |
| Footer                           |                   1 |               0 |          0 |             1 |        1 |
| **Grand total**                  |              **76** |          **38** |      **1** |       **114** |  **115** |

Core subtotal means semantic `<button>` plus `role="button"` controls. With CTA adds the separately
catalogued anchor CTA.

## Section purpose and conditional behavior

This table records what each reference-app section appears to do, plus any section or subsection
that is only visible after a user selects a button-like control. Conditional sections are documented
even when they are not present in the default `index.html` DOM.

| Section                          | Understanding / purpose                                                                                                                      | Default state in `index.html`                                                                                                                          | Conditional sections or states                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header                           | Presents the app identity, the active tool navigation item, and the external Timberborn Steam page CTA.                                      | Shows the `Calculator` nav button and Steam CTA.                                                                                                       | No additional header sections are shown by a header button in the reference bundle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Needs configuration shell        | Anchors the needs panel and provides a scroll-to-top target for the section.                                                                 | Shows the `Needs configuration` heading as a `role="button"`.                                                                                          | The heading button scrolls the panel; it does not reveal additional controls.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Needs configuration > Beavers    | Lets the user choose which beaver needs are active. Active needs drive well-being stats and production demand.                               | Beavers section is expanded and all need categories/cards are visible.                                                                                 | The Beavers header and expand banner collapse or re-expand the section body. Filter buttons (`All`, `Basic`, `Nutrition`, `Fun`, `Social Life`, `Aesthetics`, `Awe`) show subsets of the need cards rather than creating new controls. Selecting individual need cards changes active/inactive state and can affect Production/day rows.                                                                                                                                                                                                                                                                              |
| Needs configuration > Timberbots | Lets the user choose which Timberbot needs/boosts are active. Active bot needs affect bot condition and production demand.                   | Timberbots section is expanded; the `Basic` filter is active in the default snapshot while the rendered DOM still contains Basic and Boost need cards. | The Timberbots header and expand banner collapse or re-expand the section body. Filter buttons (`All`, `Basic`, `Boost`) show subsets of Timberbot needs. Selecting Catalyst or Punchcards can affect Production/day rows.                                                                                                                                                                                                                                                                                                                                                                                            |
| Seasons and storage              | Models hostile seasons and storage buffers for water, food, and logs. It can feed production modifiers back into production planning.        | Toggle is `Off`; only explanatory hint text is shown.                                                                                                  | Selecting the Off/On toggle reveals the Seasons and storage control panel: Cycle slider, Water retention slider, Difficulty select, `Cultivation halted: yes/no` button, read-only Temperate/Hostile/Water availability/Water storage/Food storage/Log storage metrics, and a `Season duration and water availability table` collapsible header. Selecting that table header reveals the cycle table with Temperate, Drought, Badtide, and Water availability rows.                                                                                                                                                   |
| Desired Surplus                  | Lets the user add extra per-day item demand beyond population needs. These demands feed Production/day.                                      | Shows `Add item…`; the dropdown option buttons are rendered but hidden with `display: none`. No selected surplus rows are visible.                     | Selecting `Add item…` opens the hidden item dropdown. Selecting an item creates a `surplus-list` row with item image/name, numeric `/day` input, and a `Remove` trash button for that selected item. The number of remove buttons is dynamic: one per selected surplus item.                                                                                                                                                                                                                                                                                                                                          |
| Production/day                   | Calculates item/day demand and required buildings/plants, land, workers, power, and bot assignment for current needs/surplus/settings.       | Shows difficulty select, Reset sliders, the Beavers needs checkbox, and default Water/Trees/Food production section headers and rows.                  | The table can show an empty state (`No buildings required. Activate needs or add desired surplus items.`) when no production is needed. Production category headers are generated dynamically from required rows; the default category buttons are Water, Trees, and Food, but selected needs, surplus items, seasons, faction, and bot settings can add/remove categories and rows. Conditional header checkboxes include `Beavers births` for Iron Teeth beavers and `Bots needs` / `Bots replacement` when bot population is greater than zero. These checkboxes are documented as adjacent controls, not buttons. |
| Power generation                 | Calculates required power generation when production rows consume power.                                                                     | Shows the empty state `No energy required — current production draws no power.`                                                                        | When required power is greater than zero, a power table appears with required HP, power-building rows, mix sliders/percentage inputs, optional water-flow controls for waterflow-dependent power, land/workers/output columns, and totals. The inspected reference bundle did not show semantic buttons in this conditional power table; its controls are inputs and dynamic rows.                                                                                                                                                                                                                                    |
| District recap                   | Summarizes district-level labor, consumption, production, buildings, land, and power balance.                                                | Rendered twice as responsive left/right variants; both are display-only KPI panels.                                                                    | No button-selected section is associated with District recap. Values change as population, needs, surplus, seasons, and production settings change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Population                       | Controls faction, beaver count, bot count, wandering time, and bot downtime; these values drive needs, labor, production, and recap metrics. | Shows Folktails selected, beaver and bot population controls, two info buttons, and no bots.                                                           | The faction toggle changes Folktails/Iron Teeth-specific labels, icons, needs, and conditional production controls. Increasing bot population enables bot-dependent states, including Production/day bot checkboxes and the Beavers Working hours full-bot-workforce action. Info buttons reveal tooltip overlays; plus/minus buttons and number inputs update derived sections.                                                                                                                                                                                                                                      |
| Beavers Working hours            | Sets the 24-hour work/leisure/sleep split used in labor and production calculations.                                                         | Shows the hours slider and a disabled `No bot population` full-bot-workforce button.                                                                   | With bot population available, the full-bot-workforce button changes state/label to a selectable `Full bot workforce` action; it can also show active or locked-no-beavers variants. The hours slider changes production/labor calculations and can cause leisure/sleep-related warnings in production rows.                                                                                                                                                                                                                                                                                                          |
| Footer                           | Shows attribution/disclaimer and exposes the privacy policy.                                                                                 | Shows the `Privacy Policy` button and disclaimer.                                                                                                      | Selecting `Privacy Policy` opens a modal dialog section mounted to `body`. The modal contains the Privacy Policy content and a `Close` (`×`) button; clicking the backdrop or pressing Escape also closes it.                                                                                                                                                                                                                                                                                                                                                                                                         |

## Conditional-only sections and controls

These elements are part of the reference app behavior but are not included in the default rendered
snapshot totals unless explicitly noted.

| Trigger                                                       | Conditional UI shown                                      | What it does                                                                                                                                                                                             | Button impact                                                                                                                                                                                          |
| ------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Select `Off` in Seasons and storage                           | Seasons and storage control panel                         | Lets the user model cycle progression, retained water, difficulty, cultivation interruption, storage needs, and hostile-season availability.                                                             | Adds two conditional semantic buttons while the panel is open: `Cultivation halted: yes/no` and `Season duration and water availability table`. The existing `Off` button changes label/state to `On`. |
| Select `Season duration and water availability table`         | Season duration and water availability table              | Shows cycle rows with Temperate, Drought, Badtide, and Water availability values.                                                                                                                        | The table body adds no extra buttons; visibility is controlled by the table header button.                                                                                                             |
| Select `Add item…` in Desired Surplus                         | Hidden surplus item dropdown                              | Lets the user choose an extra item to produce per day.                                                                                                                                                   | The 42 dropdown option buttons are already counted because they are hidden-but-rendered in the default DOM.                                                                                            |
| Select a Desired Surplus item                                 | `surplus-list` row for the selected item                  | Adds per-day demand for that item and feeds Production/day.                                                                                                                                              | Adds one conditional `Remove` semantic button per selected surplus item. This count is dynamic and not part of the default 76-button snapshot total.                                                   |
| Change active needs, surplus, seasons, faction, or population | Dynamic Production/day categories and rows                | Recomputes what must be produced and which buildings/plants are needed.                                                                                                                                  | Each visible production category has a collapsible section-header button. The default snapshot has Water, Trees, and Food; additional or fewer category buttons can appear depending on state.         |
| Iron Teeth faction with beavers                               | `Beavers births` production checkbox                      | Adds/removes birth-related demand for Iron Teeth.                                                                                                                                                        | Checkbox only; documented as an adjacent control rather than a button.                                                                                                                                 |
| Bot population greater than zero                              | `Bots needs` and `Bots replacement` production checkboxes | Adds/removes bot fuel/boost and replacement-production demand.                                                                                                                                           | Checkboxes only; documented as adjacent controls rather than buttons.                                                                                                                                  |
| Production requires power                                     | Power generation table                                    | Calculates power buildings, production mix, water flow where applicable, and total generated HP.                                                                                                         | No semantic buttons were identified in the inspected conditional power table; controls are sliders/text inputs and dynamic rows.                                                                       |
| Bot population greater than zero                              | Full-bot-workforce state in Beavers Working hours         | Allows assigning eligible workplaces to bots globally instead of manually per row.                                                                                                                       | Reuses the existing full-bot-workforce semantic button, changing it from disabled `No bot population` to selectable/active `Full bot workforce`.                                                       |
| Select `Privacy Policy` in the footer                         | Privacy Policy modal dialog                               | Shows policy text sections including Introduction, Data Collected, Analytics Tool, Cookies, Purpose of Data Processing, Data Sharing, Data Retention, Security, Your Rights, and Changes to This Policy. | Adds one conditional `Close` semantic button in the modal. The backdrop and Escape key also close the modal but are not counted as buttons.                                                            |

## Header

| Label                       | Kind            | Selector / class   | State         | Notes                                                        |
| --------------------------- | --------------- | ------------------ | ------------- | ------------------------------------------------------------ |
| Calculator                  | Semantic button | `.tool-btn.active` | Active        | Main section navigation button.                              |
| Visit Timberborn Steam page | Anchor CTA      | `a.steam-page-cta` | External link | Button-like header CTA linking to the Timberborn Steam page. |

Header count: 1 semantic button + 0 role buttons + 1 anchor CTA = 1 core, 2 with CTA.

## Needs configuration shell

| Label                                | Kind        | Selector / class                        | State                     | Notes                                                                          |
| ------------------------------------ | ----------- | --------------------------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| Scroll to top of Needs configuration | Role button | `.panel-header.panel-header--clickable` | Focusable, `tabindex="0"` | Header-like control for scrolling to the top of the Needs configuration panel. |

Needs configuration shell count: 0 semantic buttons + 1 role button = 1 core.

## Needs configuration > Beavers

### Beavers section controls

| Label       | Kind            | Selector / class                                               | State                  | Notes                                                                                                                                      |
| ----------- | --------------- | -------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Beavers     | Semantic button | `.section-header-row--beavers.section-header-row--collapsible` | `aria-expanded="true"` | Collapsible section header; text also includes current working speed, growth speed, movement speed, life expectancy, and well-being score. |
| ▲           | Semantic button | `.section-expand-banner[aria-controls="beaver-needs-section"]` | `aria-expanded="true"` | Separate expand/collapse banner for the Beavers section.                                                                                   |
| All         | Semantic button | `.ctrl-btn.ctrl-btn--all`                                      | Default                | Beaver needs filter.                                                                                                                       |
| Basic       | Semantic button | `.ctrl-btn.ctrl-btn--type`                                     | Default                | Beaver needs filter.                                                                                                                       |
| Nutrition   | Semantic button | `.ctrl-btn.ctrl-btn--type`                                     | Default                | Beaver needs filter.                                                                                                                       |
| Fun         | Semantic button | `.ctrl-btn.ctrl-btn--type`                                     | Default                | Beaver needs filter.                                                                                                                       |
| Social Life | Semantic button | `.ctrl-btn.ctrl-btn--type`                                     | Default                | Beaver needs filter.                                                                                                                       |
| Aesthetics  | Semantic button | `.ctrl-btn.ctrl-btn--type`                                     | Default                | Beaver needs filter.                                                                                                                       |
| Awe         | Semantic button | `.ctrl-btn.ctrl-btn--type`                                     | Default                | Beaver needs filter.                                                                                                                       |

Beavers section control count: 9 semantic buttons.

### Beavers need cards

| Need type   | Role-button labels                                                                                                          | Count | State notes                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- | ----: | ---------------------------------------------------------------------- |
| Basic       | Hunger; Thirst; Sleep; Shelter; Wet fur                                                                                     |     5 | Hunger, Thirst, Sleep, and Shelter are met; Wet fur is inactive/unmet. |
| Nutrition   | Carrots; Sunflower seeds; Grilled potatoes; Grilled chestnuts; Grilled spadderdock; Bread; Cattail crackers; Maple pastries |     8 | All inactive/unmet.                                                    |
| Fun         | Books; Detailer; Lido; Carousel; Mud Pit                                                                                    |     5 | All inactive/unmet.                                                    |
| Social Life | Campfire; Rooftop Terrace; Contemplation Spot; Agora; Dance Hall                                                            |     5 | All inactive/unmet.                                                    |
| Aesthetics  | Shrub; Lantern; Roofs; Scarecrow; Wind Gauge; Beaver Statue; Bulletin Pole                                                  |     7 | All inactive/unmet.                                                    |
| Awe         | Farmer Monument; Brazier of Bonding; Fountain of Joy; Earth Recultivator                                                    |     4 | All inactive/unmet.                                                    |

Beavers need-card count: 34 role buttons.

Beavers total: 9 semantic buttons + 34 role buttons = 43 core.

## Needs configuration > Timberbots

### Timberbots section controls

| Label      | Kind            | Selector / class                                            | State                  | Notes                                                                                  |
| ---------- | --------------- | ----------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| Timberbots | Semantic button | `.section-header-row--bots.section-header-row--collapsible` | `aria-expanded="true"` | Collapsible section header; text also includes current bot speed and condition values. |
| ▲          | Semantic button | `.section-expand-banner[aria-controls="bot-needs-section"]` | `aria-expanded="true"` | Separate expand/collapse banner for the Timberbots section.                            |
| All        | Semantic button | `.ctrl-btn.ctrl-btn--all`                                   | Default                | Timberbot needs filter.                                                                |
| Basic      | Semantic button | `.ctrl-btn.ctrl-btn--type.ctrl-btn--type-active`            | Active                 | Timberbot needs filter.                                                                |
| Boost      | Semantic button | `.ctrl-btn.ctrl-btn--type`                                  | Default                | Timberbot needs filter.                                                                |

Timberbots section control count: 5 semantic buttons.

### Timberbot need cards

| Need type | Role-button labels   | Count | State notes          |
| --------- | -------------------- | ----: | -------------------- |
| Basic     | Biofuel              |     1 | Met/current.         |
| Boost     | Catalyst; Punchcards |     2 | Both inactive/unmet. |

Timberbot need-card count: 3 role buttons.

Timberbots total: 5 semantic buttons + 3 role buttons = 8 core.

## Seasons and storage

| Label | Kind            | Selector / class                          | State | Notes                                        |
| ----- | --------------- | ----------------------------------------- | ----- | -------------------------------------------- |
| Off   | Semantic button | `.water-toggle-btn.water-toggle-btn--off` | Off   | Toggles hostile season/storage calculations. |

Seasons and storage count: 1 semantic button.

## Desired Surplus

| Label     | Kind            | Selector / class          | State             | Notes                                            |
| --------- | --------------- | ------------------------- | ----------------- | ------------------------------------------------ |
| Add item… | Semantic button | `.surplus-picker-trigger` | Closed by default | Opens the hidden rendered surplus item dropdown. |

### Desired Surplus hidden dropdown options

The dropdown container is rendered with `style="display: none"`; these option buttons still count
because they are present in the reference DOM and reachable from the trigger.

| Group                | Semantic option buttons                                                      |  Count |
| -------------------- | ---------------------------------------------------------------------------- | -----: |
| A                    | Antidotes                                                                    |      1 |
| B                    | Badwater; Berries; Biofuel; Books; Bot chassis; Bot heads; Bot limbs; Bread  |      8 |
| C                    | Carrots; Catalyst; Cattail crackers; Cattail flour; Cattail roots; Chestnuts |      6 |
| D                    | Dandelions; Dirt                                                             |      2 |
| E                    | Explosives; Extract                                                          |      2 |
| F                    | Fireworks                                                                    |      1 |
| G                    | Gears; Grilled chestnuts; Grilled potatoes; Grilled spadderdock              |      4 |
| L                    | Logs                                                                         |      1 |
| M                    | Maple pastries; Maple syrup; Metal blocks                                    |      3 |
| P                    | Paper; Pine resin; Planks; Potatoes; Punchcards                              |      5 |
| S                    | Science point; Scrap metal; Spadderdock; Sunflower seeds                     |      4 |
| T                    | Timberbots; Treated planks                                                   |      2 |
| W                    | Water; Wheat; Wheat flour                                                    |      3 |
| **Options subtotal** |                                                                              | **42** |

Desired Surplus total: 1 trigger button + 42 hidden option buttons = 43 semantic buttons.

## Production/day

| Label                             | Kind            | Selector / class                    | State                  | Notes                                                          |
| --------------------------------- | --------------- | ----------------------------------- | ---------------------- | -------------------------------------------------------------- |
| Scroll to top of Production table | Semantic button | `button.calc-section-heading`       | Default                | Title-like scroll-to-top button displayed as `Production/day`. |
| Reset sliders                     | Semantic button | `.prod-reset-sliders-btn`           | Default                | Resets production mix sliders.                                 |
| Water                             | Semantic button | `.prod-section-header--collapsible` | `aria-expanded="true"` | Collapsible production category header.                        |
| Trees                             | Semantic button | `.prod-section-header--collapsible` | `aria-expanded="true"` | Collapsible production category header.                        |
| Food                              | Semantic button | `.prod-section-header--collapsible` | `aria-expanded="true"` | Collapsible production category header.                        |

Production/day count: 5 semantic buttons.

## Power generation

No semantic buttons, `role="button"` controls, or anchor CTAs are rendered in the Power generation
section in this reference snapshot. The section displays the empty state: “No energy required —
current production draws no power.”

Power generation count: 0.

## District recap

No semantic buttons, `role="button"` controls, or anchor CTAs are rendered in either District recap
instance. The reference snapshot renders `recap-in-left` and `recap-in-right` responsive variants
with display-only KPI tiles; neither contains a button-like control.

District recap count: 0.

## Population

| Label                          | Kind            | Selector / class                              | State           | Notes                                                              |
| ------------------------------ | --------------- | --------------------------------------------- | --------------- | ------------------------------------------------------------------ |
| Beaver population decrement    | Semantic button | `.pop-total-block .pop-step-btn`              | Icon-only minus | Minus icon button before the Total beaver population number input. |
| Beaver population increment    | Semantic button | `.pop-total-block .pop-step-btn`              | Icon-only plus  | Plus icon button after the Total beaver population number input.   |
| Pause time info                | Semantic button | `.pop-info-btn[aria-label="Pause time info"]` | Info            | Info button for Wandering time guidance.                           |
| Wandering time decrement       | Semantic button | `.pop-time-controls .pop-step-btn`            | Icon-only minus | Minus icon button for Wandering time.                              |
| Wandering time increment       | Semantic button | `.pop-time-controls .pop-step-btn`            | Icon-only plus  | Plus icon button for Wandering time.                               |
| Timberbot population decrement | Semantic button | `.pop-input-row .pop-step-btn`                | Icon-only minus | Minus icon button before the Timberbot population number input.    |
| Timberbot population increment | Semantic button | `.pop-input-row .pop-step-btn`                | Icon-only plus  | Plus icon button after the Timberbot population number input.      |
| Downtime info                  | Semantic button | `.pop-info-btn[aria-label="Downtime info"]`   | Info            | Info button for bot Downtime guidance.                             |
| Downtime decrement             | Semantic button | `.pop-time-controls .pop-step-btn`            | Icon-only minus | Minus icon button for Downtime.                                    |
| Downtime increment             | Semantic button | `.pop-time-controls .pop-step-btn`            | Icon-only plus  | Plus icon button for Downtime.                                     |

Population count: 10 semantic buttons.

## Beavers Working hours

| Label             | Kind            | Selector / class                                          | State                            | Notes                                                                            |
| ----------------- | --------------- | --------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| No bot population | Semantic button | `.full-bot-workforce-btn.full-bot-workforce-btn--no-bots` | Disabled, `aria-disabled="true"` | Disabled full-bot-workforce action button shown when there is no bot population. |

Beavers Working hours count: 1 semantic button.

## Footer

| Label          | Kind            | Selector / class          | State   | Notes                                 |
| -------------- | --------------- | ------------------------- | ------- | ------------------------------------- |
| Privacy Policy | Semantic button | `.app-footer__policy-btn` | Default | Opens or displays the privacy policy. |

Footer count: 1 semantic button.

## Adjacent controls not counted as buttons

These controls are interactive, but they are not semantic buttons, `role="button"` controls, or
anchor CTAs, so they are excluded from the core button totals above.

| Section                              | Control                         | Element / selector                               |  Count | Notes                                                                          |
| ------------------------------------ | ------------------------------- | ------------------------------------------------ | -----: | ------------------------------------------------------------------------------ |
| Production/day                       | Difficulty                      | `select.prod-header-difficulty-select`           |      1 | Options: Easy, Normal, Hard.                                                   |
| Production/day                       | Beavers needs checkbox          | `input.prod-checkbox-input[type="checkbox"]`     |      1 | Custom checkbox in the production header.                                      |
| Production/day                       | Water production range sliders  | `input.prop-slider[type="range"]`                |      2 | One active Water Pump mix slider and one inactive Large Water Pump mix slider. |
| Production/day                       | Water production percent inputs | `input.prop-pct-input[type="text"]`              |      2 | Text inputs labelled `Mix % for Water`, values `100` and `0`.                  |
| Population                           | Faction toggle                  | `input[type="checkbox"]` inside `.toggle-switch` |      1 | Folktails/Iron Teeth toggle.                                                   |
| Population                           | Population number inputs        | `input.pop-num-input[type="number"]`             |      2 | Beaver and Timberbot population number inputs.                                 |
| Beavers Working hours                | Vuetify slider backing input    | `.hours-slider input` without an explicit type   |      1 | Backing input with value `16`.                                                 |
| Beavers Working hours                | Vuetify slider thumb            | `.v-slider-thumb[role="slider"]`                 |      1 | Slider role, not a button role.                                                |
| **Excluded adjacent controls total** |                                 |                                                  | **11** | 1 select + 9 inputs + 1 role slider.                                           |

## Reconciliation

Raw scan totals from `reference-site/index.html`:

| Raw category    | Count | Documented category                            |
| --------------- | ----: | ---------------------------------------------- |
| `<button>`      |    76 | Semantic `<button>` grand total                |
| `role="button"` |    38 | Role-button grand total                        |
| `<a>` CTA       |     1 | Anchor CTA grand total                         |
| `<select>`      |     1 | Adjacent controls, excluded from button totals |
| `<input>`       |     9 | Adjacent controls, excluded from button totals |
| `role="slider"` |     1 | Adjacent controls, excluded from button totals |

Arithmetic checks:

- Semantic section sum: `1 + 0 + 9 + 5 + 1 + 43 + 5 + 0 + 0 + 10 + 1 + 1 = 76`.
- Role-button section sum: `0 + 1 + 34 + 3 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 = 38`.
- Core subtotal: `76 + 38 = 114`.
- Button-like total including anchor CTA: `114 + 1 = 115`.
- Desired Surplus option subtotal: `1 + 8 + 6 + 2 + 2 + 1 + 4 + 1 + 3 + 5 + 4 + 2 + 3 = 42`; trigger
  plus options gives `43` semantic buttons.

No `src/` or `test/` files were used as counting inputs for this catalogue.
