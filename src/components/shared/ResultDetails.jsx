import { formatLap, padNumber } from '../../format'
import './ResultDetails.css'

function ResultDetails({ result, sessionType }) {
  const average = result.lapTimes.reduce((sum, lap) => sum + lap, 0) / result.lapTimes.length
  const speedLabel = sessionType === 'race' ? 'Velocidade média da corrida' : 'Velocidade máxima alcançada'

  return (
    <div className="result-details">
      <dl className="telemetry-stats">
        <div><dt>Kart nesta sessão</dt><dd>#{padNumber(result.kartNumber)}</dd></div>
        <div><dt>Voltas realizadas</dt><dd>{result.laps}</dd></div>
        <div><dt>Melhor volta</dt><dd>{formatLap(result.bestLap)}</dd></div>
        <div><dt>Média das voltas</dt><dd>{formatLap(average)}</dd></div>
      </dl>
      <div className="sector-summary">
        <p>Setores da tabela geral <span>(segundos)</span></p>
        <dl>{result.sectors.map((sector, i) => <div key={i}><dt>S{i + 1}</dt><dd>{sector.toFixed(3)}</dd></div>)}<div><dt>{speedLabel}</dt><dd>{result.speedKmh.toFixed(2)} <small>km/h</small></dd></div></dl>
      </div>
      <ol className={`lap-grid${result.lapSectors ? ' has-sectors' : ''}`} aria-label={`Tempos de todas as voltas de ${result.driver}`}>
        {result.lapTimes.map((lap, i) => {
          const sectors = result.lapSectors?.[i]
          const lapContent = <><span className="lap-number">V{padNumber(i + 1)}</span><strong className="lap-time">{formatLap(lap)}</strong>{lap === result.bestLap && <small className="lap-best-label">Melhor volta</small>}</>
          return <li key={i} className={lap === result.bestLap ? 'is-best-lap' : undefined}>
            {sectors ? <details className="lap-toggle">
              <summary aria-label={`Volta ${i + 1}, ${formatLap(lap)}. Setores`}>{lapContent}<span className="lap-sector-hint">Setores <span aria-hidden="true">⌄</span></span></summary>
              <dl className="lap-sectors" aria-label="Setores em segundos">
                {sectors.map((sector, sectorIndex) => <div key={sectorIndex}><dt>S{sectorIndex + 1}</dt><dd>{sector.toFixed(3)}<span>s</span></dd></div>)}
              </dl>
            </details> : lapContent}
          </li>
        })}
      </ol>
    </div>
  )
}

export default ResultDetails
