import LandingTrackCard from './LandingTrackCard'
import { season } from '../../data/season'

function LandingHero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="season-pill">Temporada {season.year} em andamento</span>
          <h1>
            Cada décima <span className="accent-text">conta.</span>
          </h1>
          <p className="hero-lead">
            Todos os nossos tempos, sessões e rivalidades num só lugar. Compara voltas,
            acompanha a classificação e descobre quem é realmente o mais rápido.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#classificacao">
              Ver classificação <span aria-hidden="true">→</span>
            </a>
            <a className="button button-ghost" href="#ultima-sessao">
              <span aria-hidden="true">▶</span> Última sessão
            </a>
          </div>
        </div>
        <LandingTrackCard />
      </div>
    </section>
  )
}

export default LandingHero
