import { season } from '../data/season'
import { formatCount } from '../format'
import './StatsBar.css'

const stats = [
  { value: season.sessions, label: 'Sessões realizadas' },
  { value: season.laps, label: 'Voltas registadas' },
  { value: season.drivers, label: 'Pilotos ativos' },
  { value: season.circuits, label: 'Circuitos visitados' },
]

function StatsBar() {
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

export default StatsBar
