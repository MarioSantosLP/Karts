import { sessions, getFastestResult } from './season.js'

export const drivers = [
  { id: 'carolina-duarte', name: 'Carolina Duarte', number: 4, accent: '#669cff' },
  { id: 'tomas-duarte', name: 'Tomás Duarte', number: 13, accent: '#75c9dd' },
  { id: 'mario-santos', name: 'Mário Santos', number: 17, accent: '#a196ed' },
  { id: 'nuno-duarte', name: 'Nuno Duarte', number: 44, accent: '#7bc4ab' },
  { id: 'tiago-cardoso', name: 'Tiago Cardoso', number: 35, accent: '#e3b47e' },
  { id: 'guilherme-pina', name: 'Guilherme Pina', number: 34, accent: '#b29bda' },
  { id: 'nicolas-mendes', name: 'Nicolas Mendes', number: 21, accent: '#e48fa8' },
  { id: 'juan-lima', name: 'Juan Lima', number: 36, accent: '#8fd1e8' },
  { id: 'rodrigo-pires', name: 'Rodrigo Pires', number: 37, accent: '#d6c27a' },
  { id: 'jia-kang', name: 'Jia Kang', number: 29, accent: '#9ec98a' },
]

export const driverSessions = sessions

export function getDriverResults(driver) {
  return driverSessions.flatMap((session) => {
    const result = session.results.find((result) => result.driverId === driver.id)
    if (!result) return []
    return [{ session, result, position: result.position, gap: result.bestLap - getFastestResult(session).bestLap }]
  }).sort((a, b) => `${b.session.date}T${b.session.time}`.localeCompare(`${a.session.date}T${a.session.time}`))
}

export function getDriverByNumber(number) {
  return drivers.find((driver) => driver.number === number)
}
