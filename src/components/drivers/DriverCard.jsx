import { getDriverResults } from '../../data/drivers'
import { formatLap, padNumber } from '../../format'
import DriverPortrait from './DriverPortrait'
import './Drivers.css'

function DriverCard({ driver, result: sessionResult, sessionType, label = 'APEX CREW / PILOTO', className = '' }) {
  const history = getDriverResults(driver)
  const result = sessionResult ?? history[0]?.result
  const bestLap = sessionResult?.bestLap ?? (history.length ? Math.min(...history.map(({ result }) => result.bestLap)) : null)
  const positionLabel = sessionType === 'race' ? 'na corrida' : sessionType === 'qualifying' ? 'na classificação' : 'última sessão'

  return (
    <a href={`#piloto/${driver.id}`} className={`driver-card ${className}`.trim()} style={{ '--driver-accent': driver.accent }} aria-label={`Ver perfil de ${driver.name}`}>
      <div className="driver-card-image">
        <DriverPortrait driver={driver} />
        <span className="driver-card-number" aria-hidden="true">{padNumber(driver.number)}</span>
        <span className="driver-card-team">{label}</span>
        <span className="driver-card-open" aria-hidden="true">↗</span>
      </div>
      <div className="driver-card-content">
        <div className="driver-card-name"><h3>{driver.name}</h3><span>#{padNumber(driver.number)}</span></div>
        {sessionResult && <p className="driver-card-session">Kart #{padNumber(sessionResult.kartNumber)} · {sessionResult.laps} voltas</p>}
        <div className="driver-card-result">
          <div><span>{sessionResult ? 'Melhor volta da sessão' : 'Melhor volta registada'}</span><strong>{bestLap !== null ? formatLap(bestLap) : '—'}</strong></div>
          <span className="driver-card-position">{result ? `${result.position}.º` : '—'}<small>{positionLabel}</small></span>
        </div>
        <div className="driver-card-footer">Conhecer o piloto <span aria-hidden="true">→</span></div>
      </div>
    </a>
  )
}

export default DriverCard
