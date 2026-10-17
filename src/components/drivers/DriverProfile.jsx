import { crewName, lastSession, season } from '../../data/season'
import { drivers, getDriverResults } from '../../data/drivers'
import { tracks } from '../../data/tracks'
import { formatDate, formatGap, formatLap, padNumber } from '../../format'
import ResultDetails from '../shared/ResultDetails'
import DriverPortrait from './DriverPortrait'
import DriverPhotoEditor from './DriverPhotoEditor'
import './Drivers.css'

function DriverProfile({ driver }) {
  if (!driver) return <section className="container driver-not-found"><p className="eyebrow">Apex Crew</p><h1 data-page-heading tabIndex={-1}>Piloto não encontrado.</h1><a className="button button-primary" href="#pilotos">Voltar aos pilotos <span aria-hidden="true">↗</span></a></section>

  const history = getDriverResults(driver)
  const latest = history[0]
  const best = history.reduce((record, entry) => !record || entry.result.bestLap < record.result.bestLap ? entry : record, null)
  const laps = history.reduce((sum, { result }) => sum + result.laps, 0)
  const index = drivers.findIndex(({ id }) => id === driver.id)
  const next = drivers[(index + 1) % drivers.length]
  const comparison = [...lastSession.results].sort((a, b) => a.bestLap - b.bestLap)
  const maxGap = comparison[comparison.length - 1].bestLap - comparison[0].bestLap

  return (
    <div className="driver-profile" style={{ '--driver-accent': driver.accent }}>
      <div className="container profile-breadcrumb"><a href="#pilotos"><span aria-hidden="true">←</span> Todos os pilotos</a><a href={`#piloto/${next.id}`} className="next-driver">{next.name}<span aria-hidden="true">→</span></a></div>
      <section className="profile-hero" aria-labelledby="profile-title">
        <div className="container profile-hero-inner">
          <div className="profile-copy">
            <p className="eyebrow"><span className="tiny-square" /> {crewName} <span className="profile-kicker-divider">/</span> Perfil do piloto</p>
            <span className="profile-racing-number">PILOTO <strong>#{padNumber(driver.number)}</strong></span>
            <h1 id="profile-title" data-page-heading tabIndex={-1}>{driver.name}<span>.</span></h1>
            <p className="profile-tagline">A mesma paixão. Uma forma única de fazer a curva.</p>
            <div className="profile-tags"><span><span className="signal-dot" /> Temporada {season.year}</span><span>{latest ? `${latest.position}.º na última corrida` : 'Sem resultados registados'}</span></div>
            {latest && <div className="profile-hero-result"><span aria-hidden="true">↗</span><p>{latest.gap === 0 ? 'A volta mais rápida da última corrida.' : `${formatGap(latest.gap)}s face à volta mais rápida da última corrida.`}<small>{tracks[latest.session.trackId].name}</small></p></div>}
          </div>
          <div className="profile-photo-column"><div className="profile-portrait"><span className="profile-photo-number" aria-hidden="true">{padNumber(driver.number)}</span><DriverPortrait driver={driver} priority /><span className="profile-photo-name">{driver.name}<span>#{padNumber(driver.number)}</span></span></div><DriverPhotoEditor driver={driver} /></div>
        </div>
      </section>
      <section className="profile-stats-section" aria-label={`Estatísticas de ${driver.name}`}><dl className="container profile-stats">
        <div><dt>Melhor volta registada</dt><dd>{best ? formatLap(best.result.bestLap) : '—'}</dd></div>
        <div><dt>Sessões no histórico</dt><dd>{padNumber(history.length)}</dd></div>
        <div><dt>Voltas registadas</dt><dd>{laps}</dd></div>
        <div><dt>Posição na última corrida</dt><dd>{latest ? padNumber(latest.position) : '—'}<small>/ {latest ? padNumber(latest.session.results.length) : '—'}</small></dd></div>
      </dl></section>
      <div className="container profile-body">
        <div className="profile-main-column">
          <section className="profile-record" aria-labelledby="record-title"><div className="profile-section-heading"><span className="section-number">01</span><h2 id="record-title">O tempo de referência.</h2></div>
            {best ? <div className="record-panel"><div><p className="eyebrow">Melhor volta no histórico</p><h3>{tracks[best.session.trackId].name}</h3><p className="record-date">{formatDate(best.session.date)} {best.session.date.slice(0, 4)}</p>{best.result.pbDelta < 0 && <span className="record-improvement">↗ {formatGap(best.result.pbDelta)}s face ao recorde pessoal anterior</span>}</div><p className="record-time">{formatLap(best.result.bestLap)}</p></div> : <p className="profile-no-results">Os tempos aparecem aqui após a primeira sessão.</p>}
          </section>
          <section className="profile-history" aria-labelledby="history-title"><div className="profile-section-heading"><span className="section-number">02</span><h2 id="history-title">Cada sessão, uma história.</h2><span className="profile-section-count">{history.length} {history.length === 1 ? 'sessão' : 'sessões'}</span></div>
            <div className="profile-history-list">{history.map(({session, result, position}) => <div className="session-history-entry" key={session.id}><article className="profile-history-row"><span className="history-date"><strong>{session.date.slice(8)}</strong><span>{formatDate(session.date).split(' ').slice(1).join(' ')} {session.date.slice(0, 4)}</span></span><div className="history-session"><h3>{session.name}</h3><p>{tracks[session.trackId].name} <span>·</span> {session.time} <span>·</span> {result.laps} voltas <span>·</span> Kart #{result.kartNumber}</p></div><div className="history-lap"><strong>{formatLap(result.bestLap)}</strong><span>melhor volta</span></div><span className="history-position">{position}.º<small>/ {session.results.length}</small></span></article><details className="profile-session-details" open><summary>Voltas, setores e velocidade · {session.type === 'race' ? 'Corrida' : 'Classificação'}</summary><ResultDetails result={result} /></details></div>)}</div>
            <p className="profile-data-note">Estatísticas calculadas a partir das sessões com resultados individuais disponíveis.</p>
          </section>
        </div>
        <aside className="profile-pace" aria-labelledby="pace-title"><div className="profile-pace-heading"><span className="eyebrow">Última corrida · ranking de ritmo</span><h2 id="pace-title">O ritmo da crew.</h2><p>Diferença para a melhor volta, em segundos.</p></div><ol className="pace-comparison">{comparison.map((result, i) => {
          const gap = result.bestLap - comparison[0].bestLap
          return <li key={result.number} className={result.driverId === driver.id ? 'is-current-driver' : ''}><div className="pace-driver"><span>{padNumber(i + 1)}</span><span>{result.driver}{result.driverId === driver.id && <small>em destaque</small>}</span><strong>{gap === 0 ? 'Referência' : `${formatGap(gap)}s`}</strong></div><div className="pace-track" aria-hidden="true"><span style={{ width: `${maxGap ? gap / maxGap * 100 : 0}%` }} /></div></li>
        })}</ol><a className="profile-all-results" href="#classificacao">Ver classificação completa <span aria-hidden="true">↗</span></a></aside>
      </div>
      <footer className="container profile-footer"><a href="#pilotos"><span aria-hidden="true">←</span> Voltar à grelha</a><span>{crewName} / {season.year}</span><a href={`#piloto/${next.id}`}>Próximo piloto: {next.name}<span aria-hidden="true">→</span></a></footer>
    </div>
  )
}

export default DriverProfile
