import TrackMap from './TrackMap'
import { tracks } from '../data/tracks'
import { formatDate, formatLap } from '../format'
import './TrackCard.css'

function TrackCard({ session }) {
  const track = tracks[session.trackId]
  const fastest = session.results[0]

  return (
    <article className="track-card">
      <header className="track-card-header">
        <div>
          <p className="eyebrow">{session.name}</p>
          <h2>{track.name}</h2>
        </div>
        <span className="status-pill">{session.status}</span>
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
          <dd>{formatDate(session.date)}</dd>
        </div>
        <div>
          <dt>Voltas</dt>
          <dd>{session.laps}</dd>
        </div>
        <div>
          <dt>Pilotos</dt>
          <dd>{session.results.length}</dd>
        </div>
      </dl>
    </article>
  )
}

export default TrackCard
