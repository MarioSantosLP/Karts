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
    <section className="season-section" id="temporada" aria-label="Estatísticas da temporada">
      <div className="container season-inner" data-reveal>
        <p className="eyebrow season-heading">A temporada<br /><strong>em números.</strong><span>{season.year} / Apex Crew</span></p>
        <dl className="stats-bar">
          {stats.map((stat, index) => (
            <div key={stat.label} style={{ '--reveal-delay': `${index * 80}ms` }}>
              <dt>{stat.label}</dt><dd>{formatCount(stat.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default LandingStats
