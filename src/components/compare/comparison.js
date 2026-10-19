export function getResultStats(result) {
  if (!result?.lapTimes?.length) return null
  const laps = result.lapTimes
  const average = laps.reduce((sum, lap) => sum + lap, 0) / laps.length
  const sorted = [...laps].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
  const consistency = Math.sqrt(laps.reduce((sum, lap) => sum + (lap - average) ** 2, 0) / laps.length)
  const hasSectors = result.lapSectors?.length === laps.length && result.lapSectors.every((sectors) => sectors.length === 3 && sectors.every(Number.isFinite))
  const idealLap = hasSectors ? [0, 1, 2].reduce((sum, sector) => sum + Math.min(...result.lapSectors.map((parts) => parts[sector])), 0) : null
  return { ...result, average, median, consistency, idealLap }
}

export function getBestValue(values, direction = 'min') {
  const available = values.filter(Number.isFinite)
  if (available.length < 2) return null
  return direction === 'max' ? Math.max(...available) : Math.min(...available)
}
