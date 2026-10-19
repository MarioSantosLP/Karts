import TrackMap from '../shared/TrackMap'
import { getFastestResult, lastSession } from '../../data/season'
import { tracks } from '../../data/tracks'
import { formatDate, formatLap } from '../../format'

function LandingTrackCard({ paused, onToggleMotion }) {
  const track = tracks[lastSession.trackId]
  const fastest = getFastestResult(lastSession)

  function moveCircuit(event) {
    if (paused || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - box.left) / box.width - 0.5) * 7}deg`)
    event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - box.top) / box.height - 0.5) * -7}deg`)
  }

  function resetCircuit(event) {
    event.currentTarget.style.setProperty('--pointer-x', '0deg')
    event.currentTarget.style.setProperty('--pointer-y', '0deg')
  }

  return (
    <article className="track-card hero-enter" id="circuitos" aria-label="Circuito da última sessão">
      <header className="track-card-header">
        <div>
          <p className="eyebrow"><span className="tiny-square" /> Última sessão</p>
          <h2>{lastSession.name}</h2>
        </div>
        <span className="status-pill">{lastSession.status}</span>
      </header>
      <div className="track-card-map" onPointerMove={moveCircuit} onPointerLeave={resetCircuit}>
        <div className="circuit-coordinates" aria-hidden="true"><span>TRAÇADO / 01</span><span>APEX CREW</span></div>
        <div className="circuit-tilt"><TrackMap track={track} paused={paused} /></div>
        <div className="best-lap">
          <span className="best-lap-label"><span aria-hidden="true">↗</span> Melhor volta</span>
          <strong>{formatLap(fastest.bestLap)}</strong>
          <span className="best-lap-driver">{fastest.driver} <span>#{fastest.number}</span></span>
        </div>
        <button className="motion-toggle" onClick={onToggleMotion} aria-pressed={paused} aria-label={paused ? 'Retomar animações' : 'Pausar animações'} title={paused ? 'Retomar animações' : 'Pausar animações'}>
          {paused ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" /></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zm5 0h3v12h-3z" /></svg>}
        </button>
      </div>
      <a className="circuit-name" href={`#pista/${track.slug}`} aria-label={`Conhecer a pista ${track.name}`}><span className="tiny-square" /><span>{track.name}</span><span className="circuit-name-arrow" aria-hidden="true">↗</span></a>
      <dl className="track-card-stats">
        <div><dt>Data da sessão</dt><dd>{formatDate(lastSession.date)} <span>{lastSession.date.slice(0, 4)}</span></dd></div>
        <div><dt>Voltas do vencedor</dt><dd>{lastSession.laps}</dd></div>
        <div><dt>Na grelha</dt><dd>{lastSession.results.length}<span> pilotos</span></dd></div>
      </dl>
    </article>
  )
}

export default LandingTrackCard
