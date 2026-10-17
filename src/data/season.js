import { kipSessions } from './sessions/kip-2026-10-17.js'

export const crewName = 'Apex Crew'
export const sessions = kipSessions
export const lastSession = sessions[sessions.length - 1]

export const season = {
  year: 2026,
  sessions: sessions.length,
  laps: sessions.reduce((sum, session) => sum + session.results.reduce((total, result) => total + result.laps, 0), 0),
  drivers: new Set(sessions.flatMap((session) => session.results.map((result) => result.driverId))).size,
  circuits: new Set(sessions.map((session) => session.trackId)).size,
}

export function getFastestResult(session) {
  return session.results.reduce((fastest, result) => result.bestLap < fastest.bestLap ? result : fastest)
}
