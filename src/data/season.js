// Placeholder data — swap in real results after each race.

export const crewName = 'Apex Crew'

export const season = {
  year: 2026,
  sessions: 1,
  laps: 16,
  drivers: 10,
  circuits: 1,
}

export const lastSession = {
  name: 'Weekend Grand Prix',
  trackId: 'internacional',
  date: '2026-10-16',
  laps: 16,
  status: 'Concluída',
  // Ordered fastest first.
  // TODO: placeholder lap times — replace with the real times from the race.
  // pbDelta (optional): improvement on the driver's previous personal best, in seconds
  results: [
    { driver: 'Carolina Duarte', number: 4, bestLap: 52.481 },
    { driver: 'Tomás Duarte', number: 13, bestLap: 52.806 },
    { driver: 'Mário Santos', number: 17, bestLap: 53.124 },
    { driver: 'Nuno Duarte', number: 44, bestLap: 53.397 },
    { driver: 'Tiago Cardoso', number: 35, bestLap: 53.582 },
    { driver: 'Guilherme Pina', number: 34, bestLap: 53.911 },
    { driver: 'Nicolas Mendes', number: 21, bestLap: 54.208 },
    { driver: 'Juan Lima', number: 36, bestLap: 54.563 },
    { driver: 'Rodrigo Pires', number: 37, bestLap: 54.870 },
    { driver: 'Jia Kang', number: 29, bestLap: 55.342 },
  ],
}
