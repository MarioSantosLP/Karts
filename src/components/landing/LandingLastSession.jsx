import { useState } from 'react'
import { lastSession, sessions } from '../../data/season'
import { tracks } from '../../data/tracks'
import { drivers } from '../../data/drivers'
import DriverCard from '../drivers/DriverCard'
import { formatDate, formatGap, formatLap, padNumber } from '../../format'

function LandingLastSession() {
  const [sessionId, setSessionId] = useState(lastSession.id)
  const session = sessions.find(({ id }) => id === sessionId)
  const winnerResult = session.results.find((result) => result.position === 1)
  const winner = drivers.find((driver) => driver.id === winnerResult?.driverId)
  const isRace = session.type === 'race'

  return (
    <section className="container session-section" id="sessoes" aria-labelledby="session-title">
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow"><span className="section-number">01</span> Última ida à pista</p><h2 id="session-title">A pista deu o <em>veredicto.</em></h2></div>
        <span className="session-date"><span className="tiny-square" /> {formatDate(session.date)} {session.date.slice(0, 4)}</span>
      </div>
      <div className="session-switch" role="group" aria-label="Escolher sessão">
        {sessions.map((item) => <button key={item.id} type="button" aria-pressed={sessionId === item.id} onClick={() => setSessionId(item.id)}>{item.name}</button>)}
      </div>
      <div className="session-layout" id="ultima-sessao">
        <article className="session-card" id="classificacao" aria-label="Resultados da sessão" data-reveal>
          <header className="session-card-header">
            <div><h3>{session.name}</h3><p>{tracks[session.trackId].name}</p></div>
            <span className="results-badge">{session.results.length} pilotos</span>
          </header>
          <div className="session-results-scroll" tabIndex={0} role="region" aria-label="Tabela de resultados; desliza para ver todas as colunas">
            <table className="session-results-table">
              <thead><tr><th scope="col">Pos.</th><th scope="col">Piloto / kart</th><th scope="col">Melhor volta</th><th scope="col">Voltas</th><th scope="col">{isRace ? 'Intervalo' : 'Diferença'}</th></tr></thead>
              <tbody>{session.results.map((result) => <tr key={result.driverId} className={result.position === 1 ? 'is-leader' : undefined}>
                <td>{padNumber(result.position)}</td>
                <td><a className="driver driver-profile-link" href={`#piloto/${result.driverId}`}><span className="driver-avatar" aria-hidden="true">{result.driver[0]}</span><span>{result.driver}<small>Kart #{padNumber(result.kartNumber)}</small></span></a></td>
                <td>{formatLap(result.bestLap)}</td><td>{result.laps}</td>
                <td>{isRace ? result.interval : result.position === 1 ? '—' : `${formatGap(result.gap)}s`}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className="results-scroll-hint">Desliza a tabela para ver voltas e intervalos →</p>
          <footer className="session-card-footer"><span className="signal-dot" /> {isRace ? 'Posição de chegada · intervalo para o anterior' : 'Ordenada pela melhor volta · diferença para o líder'}</footer>
        </article>
        {winner && <aside className="session-winner" data-reveal aria-label={isRace ? 'Vencedor da corrida' : 'Primeiro na classificação'}>
          <DriverCard driver={winner} result={winnerResult} sessionType={session.type} label={isRace ? 'Vencedor da corrida' : '1.º na classificação'} className="session-winner-card" />
        </aside>}
      </div>
    </section>
  )
}

export default LandingLastSession
