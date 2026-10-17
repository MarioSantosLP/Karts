import TrackMap from '../shared/TrackMap'
import { lastSession } from '../../data/season'
import { tracks } from '../../data/tracks'
import { formatDate, formatLap } from '../../format'

function LandingTrackCard() {
  const track = tracks[lastSession.trackId]
  const fastest = lastSession.results[0]

  return (
    <article className="track-card">
      <header className="track-card-header">
        <div>
          <p className="eyebrow">{lastSession.name}</p>
          <h2>{track.name}</h2>
        </div>
        <span className="status-pill">{lastSession.status}</span>
      </header>

      <div className="track-card-map">
        <TrackMap track={track} />
        <div className="best-lap">
          <strong>{formatLap(fastest.bestLap)}</strong>
          <span>melhor volta · {fastest.driver}</span>
        </div>
      </div>

      <dl className="track-card-stats">
        <div>
          <dt>Data</dt>
          <dd>{formatDate(lastSession.date)}</dd>
        </div>
        <div>
          <dt>Voltas</dt>
          <dd>{lastSession.laps}</dd>
        </div>
        <div>
          <dt>Pilotos</dt>
          <dd>{lastSession.results.length}</dd>
        </div>
      </dl>
    </article>
  )
}

export default LandingTrackCard
