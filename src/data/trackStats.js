import { sessions } from './season.js'

export function getTrackStats(trackId, records = sessions) {
  const trackSessions = records.filter((session) => session.trackId === trackId)
  const meetings = new Map()
  const bestByDriver = new Map()
  const driverIds = new Set()
  let laps = 0

  trackSessions.forEach((session) => {
    if (!meetings.has(session.date)) meetings.set(session.date, { date: session.date, sessions: [], laps: 0, driverIds: new Set() })
    const meeting = meetings.get(session.date)
    meeting.sessions.push(session)
    session.results.forEach((result) => {
      laps += result.laps
      meeting.laps += result.laps
      driverIds.add(result.driverId)
      meeting.driverIds.add(result.driverId)
      const previous = bestByDriver.get(result.driverId)
      if (!previous || result.bestLap < previous.result.bestLap) bestByDriver.set(result.driverId, { result, session })
    })
  })

  const bestLaps = [...bestByDriver.values()].sort((a, b) => a.result.bestLap - b.result.bestLap)
  return {
    grandsPrix: meetings.size,
    laps,
    drivers: driverIds.size,
    sessions: trackSessions.length,
    best: bestLaps[0] ?? null,
    bestLaps,
    meetings: [...meetings.values()].sort((a, b) => b.date.localeCompare(a.date)).map((meeting) => ({ date: meeting.date, sessions: [...meeting.sessions].sort((a, b) => a.time.localeCompare(b.time)), laps: meeting.laps, drivers: meeting.driverIds.size })),
  }
}
