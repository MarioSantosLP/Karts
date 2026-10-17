const MONTHS = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']

// '2026-10-16' -> '16 out.'
export function formatDate(iso) {
  const [, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

// 1427 -> '1 427'
export function formatCount(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function formatLap(seconds) {
  const milliseconds = Math.round(seconds * 1000)
  if (milliseconds < 60000) return (milliseconds / 1000).toFixed(3)
  return `${Math.floor(milliseconds / 60000)}:${((milliseconds % 60000) / 1000).toFixed(3).padStart(6, '0')}`
}

// Signed gap, using a real minus sign: 0.325 -> '+0.325', -0.327 -> '−0.327'
export function formatGap(seconds) {
  const sign = seconds < 0 ? '−' : '+'
  return sign + Math.abs(seconds).toFixed(3)
}

export function padNumber(n) {
  return String(n).padStart(2, '0')
}
