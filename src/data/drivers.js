import { lastSession } from './season.js'

export const drivers = [
  { id: 'mario', name: 'Mário', number: 27, accent: '#669cff' },
  { id: 'duarte', name: 'Duarte', number: 14, accent: '#75c9dd' },
  { id: 'filipe', name: 'Filipe', number: 8, accent: '#a196ed' },
  { id: 'samuel', name: 'Samuel', number: 19, accent: '#7bc4ab' },
  { id: 'tiago', name: 'Tiago', number: 33, accent: '#e3b47e' },
  { id: 'rafael', name: 'Rafael', number: 5, accent: '#b29bda' },
]

// Only this session has individual results. Season totals are not career totals.
export const driverSessions = [lastSession]

export function getDriverResults(driver) {
  return driverSessions.flatMap((session) => {
    const sortedResults = [...session.results].sort((a, b) => a.bestLap - b.bestLap)
    const position = sortedResults.findIndex((result) => result.number === driver.number)
    if (position === -1) return []
    return [{ session, result: sortedResults[position], position: position + 1, gap: sortedResults[position].bestLap - sortedResults[0].bestLap }]
  }).sort((a, b) => b.session.date.localeCompare(a.session.date))
}

export function getDriverByNumber(number) {
  return drivers.find((driver) => driver.number === number)
}
