import { season } from '../../data/season'
import { formatCount } from '../../format'

const stats = [
  { value: season.sessions, label: 'Sessões realizadas' },
  { value: season.laps, label: 'Voltas registadas' },
  { value: season.drivers, label: 'Pilotos ativos' },
  { value: season.circuits, label: 'Circuitos visitados' },
]

function LandingStats() {
  return (
    <section className="container">
      <dl className="stats-bar">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{formatCount(stat.value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default LandingStats
