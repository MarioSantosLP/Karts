import LandingTrackCard from './LandingTrackCard'
import { lastSession, season } from '../../data/season'

function LandingHero({ paused, onToggleMotion }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="season-pill hero-enter">
            <span className="signal-dot" /> Temporada {season.year}
            <span className="season-divider" /> A corrida continua
          </div>
          <h1 id="hero-title" className="hero-enter">
            Cada<br />décima<br /><span className="accent-text">conta.</span>
          </h1>
          <p className="hero-lead hero-enter">
            Amigos fora da pista. Rivais em cada curva.<br className="desktop-break" />
            Os nossos tempos, as nossas corridas. Tudo aqui.
          </p>
          <div className="hero-actions hero-enter">
            <a className="button button-primary" href="#classificacao">
              Ver classificação <span aria-hidden="true">↗</span>
            </a>
            <a className="hero-session-link" href="#sessoes">
              Última sessão <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="crew-line hero-enter">
            <div className="crew-avatars" aria-hidden="true">
              {lastSession.results.slice(0, 3).map((driver) => (
                <span key={driver.number}>{driver.driver[0]}</span>
              ))}
            </div>
            <p><strong>{season.drivers} pilotos.</strong> Uma só obsessão.</p>
          </div>
        </div>
        <LandingTrackCard paused={paused} onToggleMotion={onToggleMotion} />
      </div>
      <div className="container hero-bottom">
        <a className="scroll-cue" href="#temporada">
          <span className="scroll-cue-line" aria-hidden="true" /> Explora a temporada
        </a>
        <span className="hero-motto">A próxima volta pode mudar tudo.</span>
      </div>
    </section>
  )
}

export default LandingHero
