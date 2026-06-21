import { describe, expect, it } from "vitest"

import { sum } from "./index"

describe("sum", () => {
  it("returns 0 when called with no arguments", () => {
    expect(sum()).toBe(0)
  })

  it("adds multiple numbers", () => {
    expect(sum(1, 2, 3, 4)).toBe(10)
  })

  it("handles negative and decimal values", () => {
    expect(sum(5, -2, 0.5)).toBe(3.5)
  })
})