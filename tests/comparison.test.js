import test from 'node:test'
import assert from 'node:assert/strict'
import { getBestValue, getResultStats } from '../src/components/compare/comparison.js'
import { kipSessions } from '../src/data/sessions/kip-2026-10-17.js'

test('calculates average, median and consistency from all recorded laps', () => {
  const original = { lapTimes: [72, 70, 80, 74], bestLap: 70, position: 3 }
  const stats = getResultStats(original)
  assert.equal(stats.average, 74)
  assert.equal(stats.median, 73)
  assert.equal(stats.consistency, Math.sqrt(14))
  assert.equal(stats.bestLap, 70)
  assert.equal(stats.position, 3)
  assert.equal(stats.idealLap, null)
  assert.deepEqual(original.lapTimes, [72, 70, 80, 74])
})

test('ideal laps use actual per-lap sectors and are not invented for missing data', () => {
  for (const session of kipSessions) for (const result of session.results) {
    const stats = getResultStats(result)
    if (result.lapSectors) {
      assert.ok(stats.idealLap <= result.bestLap + 0.000001)
      assert.ok(stats.idealLap > 0)
    } else assert.equal(stats.idealLap, null)
  }
  assert.equal(getResultStats({ lapTimes: [70], lapSectors: [[23, 18]] }).idealLap, null)
})

test('missing results and ties are safe and metric direction is respected', () => {
  assert.equal(getResultStats(null), null)
  assert.equal(getResultStats({ lapTimes: [] }), null)
  assert.equal(getBestValue([null, undefined]), null)
  assert.equal(getBestValue([70, null]), null)
  assert.equal(getBestValue([71, 70, 70]), 70)
  assert.equal(getBestValue([56.7, 59.46], 'max'), 59.46)
  assert.equal(getBestValue([0, 1]), 0)
})
