import { lastSession } from '../../data/season'
import { formatDate, formatGap, formatLap, padNumber } from '../../format'

function LandingLastSession() {
  const leaderTime = lastSession.results[0].bestLap

  return (
    <section className="container section" id="ultima-sessao">
      <article className="session-card">
        <header className="session-card-header">
          <div>
            <p className="eyebrow">Última sessão</p>
            <h2>{lastSession.name}</h2>
          </div>
          <time dateTime={lastSession.date}>{formatDate(lastSession.date)}</time>
        </header>

        <ol className="results">
          {lastSession.results.map((result, i) => (
            <li key={result.driver} className={i === 0 ? 'is-leader' : undefined}>
              <span className="position">{i + 1}</span>
              <span className="driver">
                {result.driver} <small>#{padNumber(result.number)}</small>
              </span>
              <span className="lap-time">{formatLap(result.bestLap)}</span>
              {result.pbDelta ? (
                <span className="delta is-pb">PB {formatGap(result.pbDelta)}</span>
              ) : (
                <span className="delta">{i === 0 ? '' : formatGap(result.bestLap - leaderTime)}</span>
              )}
            </li>
          ))}
        </ol>

        <a className="session-link" href="#sessoes">
          Resultados completos <span aria-hidden="true">↗</span>
        </a>
      </article>
    </section>
  )
}

export default LandingLastSession
