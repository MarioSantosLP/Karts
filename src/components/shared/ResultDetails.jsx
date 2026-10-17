import { formatLap, padNumber } from '../../format'
import './ResultDetails.css'

function ResultDetails({ result }) {
  const average = result.lapTimes.reduce((sum, lap) => sum + lap, 0) / result.lapTimes.length

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
        <dl>{result.sectors.map((sector, i) => <div key={i}><dt>S{i + 1}</dt><dd>{sector.toFixed(3)}</dd></div>)}<div><dt>Velocidade indicada</dt><dd>{result.speedKmh.toFixed(2)} <small>km/h</small></dd></div></dl>
      </div>
      <ol className="lap-grid" aria-label={`Tempos de todas as voltas de ${result.driver}`}>
        {result.lapTimes.map((lap, i) => <li key={i} className={lap === result.bestLap ? 'is-best-lap' : undefined}><span>V{padNumber(i + 1)}</span><strong>{formatLap(lap)}</strong>{lap === result.bestLap && <small>Melhor volta</small>}</li>)}
      </ol>
    </div>
  )
}

export default ResultDetails
