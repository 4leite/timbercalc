import { Button } from "@tohuhono/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@tohuhono/ui/card"
import { Checkbox } from "@tohuhono/ui/checkbox"
import { Input } from "@tohuhono/ui/input"
import { Label } from "@tohuhono/ui/label"
import { Separator } from "@tohuhono/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tohuhono/ui/table"
import { useEffect, useState } from "react"

import {
  calculateSettlementPlan,
  getFactionCatalog,
  type FactionId,
} from "#/lib/timberborn-calculator"

const factions = getFactionCatalog()

const formatNumber = (value: number) => {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1)
}

const parseWholeNumber = (value: string, fallback: number) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback
  }

  return Math.floor(parsed)
}

const parseDecimalNumber = (value: string, fallback: number) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback
  }

  return parsed
}

export const Calculator = () => {
  const [factionId, setFactionId] = useState<FactionId>("folktails")
  const [population, setPopulation] = useState(10)
  const [workHours, setWorkHours] = useState(16)
  const [foodIds, setFoodIds] = useState<string[]>(["berries"])
  const [desiredSurplus, setDesiredSurplus] = useState<Record<string, string>>({})
  const activeFaction = factions.find((faction) => faction.id === factionId) ?? factions[0]

  useEffect(() => {
    setFoodIds(activeFaction.defaultFoodIds)
    setDesiredSurplus((current) => {
      return Object.fromEntries(
        Object.entries(current).filter(([resourceId]) => {
          return activeFaction.surplusResources.some((resource) => resource.id === resourceId)
        }),
      )
    })
  }, [activeFaction])

  const normalizedSurplus = Object.fromEntries(
    Object.entries(desiredSurplus)
      .map(([resourceId, value]) => [resourceId, parseDecimalNumber(value, 0)] as const)
      .filter(([, value]) => value > 0),
  )

  const plan = calculateSettlementPlan({
    faction: factionId,
    population,
    workHours,
    foodIds,
    desiredSurplus: normalizedSurplus,
  })

  const toggleFood = (foodId: string, checked: boolean) => {
    setFoodIds((current) => {
      if (checked) {
        return current.includes(foodId) ? current : [...current, foodId]
      }

      if (current.length === 1) {
        return current
      }

      return current.filter((id) => id !== foodId)
    })
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">District calculator</h1>
        <p className="text-sm text-muted-foreground">
          Population, work hours, food mix, and faction-only surpluses.
        </p>
      </div>

      <div
        className="
          grid gap-4
          xl:grid-cols-[22rem_minmax(0,1fr)]
        "
      >
        <div className="space-y-4">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>District</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Faction</Label>
                <div className="flex flex-wrap gap-2">
                  {factions.map((faction) => (
                    <Button
                      key={faction.id}
                      variant={faction.id === factionId ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFactionId(faction.id)}
                    >
                      {faction.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div
                className="
                  grid gap-4
                  sm:grid-cols-2
                  xl:grid-cols-1
                "
              >
                <div className="space-y-2">
                  <Label htmlFor="population">Population</Label>
                  <Input
                    id="population"
                    type="number"
                    min={0}
                    step={1}
                    value={population}
                    onChange={(event) =>
                      setPopulation(parseWholeNumber(event.target.value, population))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work-hours">Work hours</Label>
                  <Input
                    id="work-hours"
                    type="number"
                    min={1}
                    max={24}
                    step={0.5}
                    value={workHours}
                    onChange={(event) =>
                      setWorkHours(parseDecimalNumber(event.target.value, workHours))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div
                className="
                  grid gap-3
                  sm:grid-cols-2
                  xl:grid-cols-1
                "
              >
                <div
                  className="
                    rounded-lg border border-dashed border-border/70 p-3
                  "
                >
                  <div
                    className="
                      text-xs font-medium tracking-wide text-muted-foreground
                      uppercase
                    "
                  >
                    Drink output
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {plan.productionRows[0]?.resourceName}
                  </div>
                </div>

                <div
                  className="
                    rounded-lg border border-dashed border-border/70 p-3
                  "
                >
                  <div
                    className="
                      text-xs font-medium tracking-wide text-muted-foreground
                      uppercase
                    "
                  >
                    Default diet
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {activeFaction.defaultFoodIds
                      .map((foodId) => activeFaction.foods.find((food) => food.id === foodId)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>Food mix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeFaction.foods.map((food) => {
                const inputId = `food-${food.id}`

                return (
                  <div key={food.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox
                      id={inputId}
                      checked={foodIds.includes(food.id)}
                      onCheckedChange={(checked) => toggleFood(food.id, Boolean(checked))}
                    />
                    <Label htmlFor={inputId} className="cursor-pointer">
                      {food.name}
                    </Label>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {activeFaction.surplusResources.length > 0 ? (
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle>Desired surplus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeFaction.surplusResources.map((resource) => {
                  const inputId = `surplus-${resource.id}`

                  return (
                    <div key={resource.id} className="space-y-2">
                      <Label htmlFor={inputId}>{resource.name} surplus per day</Label>
                      <Input
                        id={inputId}
                        type="number"
                        min={0}
                        step={0.5}
                        value={desiredSurplus[resource.id] ?? ""}
                        onChange={(event) => {
                          const value = event.target.value
                          setDesiredSurplus((current) => ({
                            ...current,
                            [resource.id]: value,
                          }))
                        }}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>District recap</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="
                  grid gap-3
                  sm:grid-cols-2
                  2xl:grid-cols-3
                "
              >
                <StatCard label="Population" value={formatNumber(plan.summary.population)} />
                <StatCard
                  label="Drink consumed"
                  value={`${formatNumber(plan.summary.drinkConsumedPerDay)}/day`}
                />
                <StatCard
                  label="Food consumed"
                  value={`${formatNumber(plan.summary.foodConsumedPerDay)}/day`}
                />
                <StatCard label="Buildings" value={formatNumber(plan.summary.totalBuildings)} />
                <StatCard label="Workers" value={formatNumber(plan.summary.totalWorkers)} />
                <StatCard label="Land use" value={`${formatNumber(plan.summary.landUse)} tiles`} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>Production</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Demand/day</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead>Buildings</TableHead>
                    <TableHead>Workers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.productionRows.map((row) => (
                    <TableRow key={row.resourceId}>
                      <TableCell>
                        <div className="font-medium">{row.resourceName}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {row.category}
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(row.dailyDemand)}</TableCell>
                      <TableCell>{row.buildingName}</TableCell>
                      <TableCell>{row.buildingCount.toFixed(2)}</TableCell>
                      <TableCell>
                        {formatNumber(Math.ceil(row.buildingCount * row.workers))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
      <div
        className="
          text-xs font-medium tracking-wide text-muted-foreground uppercase
        "
      >
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  )
}
