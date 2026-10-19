import test from 'node:test'
import assert from 'node:assert/strict'
import { getTrackStats } from '../src/data/trackStats.js'
import { kipSessions } from '../src/data/sessions/kip-2026-10-17.js'

test('counts qualifying and race as one GP and sums each driver lap total', () => {
  const stats = getTrackStats('internacional', kipSessions)
  assert.equal(stats.grandsPrix, 1)
  assert.equal(stats.sessions, 2)
  assert.equal(stats.drivers, 10)
  assert.equal(stats.laps, 199)
  assert.equal(stats.best.result.driverId, 'tomas-duarte')
  assert.equal(stats.best.result.bestLap, 70.072)
  assert.equal(stats.bestLaps.length, 10)
  assert.equal(stats.bestLaps.find(({ result }) => result.driverId === 'jia-kang').session.type, 'qualifying')
})

test('filters other circuits and preserves the fastest record across multiple visits', () => {
  const extra = { ...kipSessions[1], date: '2026-11-17', results: [{ ...kipSessions[1].results[0], laps: 12, bestLap: 69.8 }] }
  const other = { ...extra, trackId: 'another-track', results: [{ ...extra.results[0], bestLap: 50 }] }
  const stats = getTrackStats('internacional', [...kipSessions, extra, other])
  assert.equal(stats.grandsPrix, 2)
  assert.equal(stats.laps, 211)
  assert.equal(stats.best.result.bestLap, 69.8)
  assert.equal(stats.meetings[0].date, '2026-11-17')
  assert.equal(stats.meetings[0].drivers, 1)
})

test('unvisited tracks have zero totals and no invented record', () => {
  const stats = getTrackStats('unvisited', kipSessions)
  assert.equal(stats.grandsPrix, 0)
  assert.equal(stats.laps, 0)
  assert.equal(stats.best, null)
  assert.deepEqual(stats.bestLaps, [])
})
