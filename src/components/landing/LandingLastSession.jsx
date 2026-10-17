import { lastSession } from '../../data/season'
import { tracks } from '../../data/tracks'
import { getDriverByNumber } from '../../data/drivers'
import { formatDate, formatGap, formatLap, padNumber } from '../../format'

function LandingLastSession() {
  const fastest = lastSession.results[0]
  const track = tracks[lastSession.trackId]

  return (
    <section className="container session-section" id="sessoes" aria-labelledby="session-title">
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow"><span className="section-number">01</span> Última sessão</p><h2 id="session-title">A pista deu o <em>veredicto.</em></h2></div>
        <span className="session-date"><span className="tiny-square" /> {formatDate(lastSession.date)} {lastSession.date.slice(0, 4)}</span>
      </div>
      <div className="session-layout" id="ultima-sessao">
        <article className="session-card" id="classificacao" aria-label="Classificação da última sessão" data-reveal>
          <header className="session-card-header">
            <div><h3>{lastSession.name}</h3><p>{track.name} <span>·</span> {lastSession.laps} voltas</p></div>
            <span className="results-badge">Resultados</span>
          </header>
          <div className="results-labels" aria-hidden="true"><span>Pos.</span><span>Piloto</span><span>Melhor volta</span><span>Intervalo</span></div>
          <ol className="results" aria-label="Pilotos por melhor volta">
            {lastSession.results.map((result, i) => (
              <li key={result.number} className={i === 0 ? 'is-leader' : undefined}>
                <span className="position">{padNumber(i + 1)}</span>
                <a className="driver driver-profile-link" href={`#piloto/${getDriverByNumber(result.number).id}`} aria-label={`Ver perfil de ${result.driver}`}><span className="driver-avatar" aria-hidden="true">{result.driver[0]}</span><span>{result.driver}<small>#{padNumber(result.number)}</small></span></a>
                <span className="lap-time">{formatLap(result.bestLap)}<small>s</small></span>
                <span className={`delta${i === 0 ? ' leader-label' : ''}`}>{i === 0 ? 'Líder' : formatGap(result.bestLap - fastest.bestLap)}</span>
              </li>
            ))}
          </ol>
          <footer className="session-card-footer"><span className="signal-dot" /> Classificação por melhor volta <span>{lastSession.results.length} pilotos</span></footer>
        </article>
        <aside className="fastest-card" data-reveal aria-label="Destaque da sessão">
          <div className="fastest-top"><span className="eyebrow">O ritmo a bater</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 2-9 12h6l-1 8 9-12h-6z" /></svg></div>
          <span className="fastest-number" aria-hidden="true">{padNumber(fastest.number)}</span>
          <div className="fastest-content">
            <span className="fastest-caption">Volta mais rápida</span>
            <p className="fastest-time">{formatLap(fastest.bestLap)}<small>s</small></p>
            <h3>{fastest.driver}<span>#{padNumber(fastest.number)}</span></h3>
            {fastest.pbDelta && <p className="personal-best"><span aria-hidden="true">↗</span> {formatGap(fastest.pbDelta)}s <span>face ao recorde pessoal anterior</span></p>}
          </div>
          <div className="fastest-footer"><span className="tiny-square" /> Cada décima conta.</div>
        </aside>
      </div>
    </section>
  )
}

export default LandingLastSession
