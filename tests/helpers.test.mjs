import test from "node:test"
import assert from "node:assert/strict"
import { safeMax } from "../src/utils/request.js"
import { findMinMax, generateGrid } from "../src/mini3d/utils/utils.js"

test("safeMax handles empty and normal arrays", () => {
  assert.equal(safeMax([]), undefined)
  assert.equal(safeMax([3, 9, 2]), 9)
})

test("findMinMax handles empty and normal arrays", () => {
  assert.deepEqual(findMinMax([]), { max: undefined, min: undefined })
  assert.deepEqual(findMinMax([3, 9, 2]), { max: 9, min: 2 })
})

test("generateGrid returns Vector3-like points with z=0", () => {
  const coordinates = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 3 },
    { x: 0, y: 3 },
  ]
  const { scopeInsidePoint } = generateGrid(coordinates, 1)
  assert.ok(scopeInsidePoint.length > 0)
  assert.equal(scopeInsidePoint[0].z, 0)
})
