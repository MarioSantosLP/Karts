import { useEffect, useRef, useState } from 'react'
import LandingHero from './LandingHero'
import LandingCarousel from './LandingCarousel'
import LandingStats from './LandingStats'
import LandingLastSession from './LandingLastSession'
import DriverDirectory from '../drivers/DriverDirectory'
import { crewName, season } from '../../data/season'
import './Landing.css'

function Landing() {
  const [paused, setPaused] = useState(false)
  const landingRef = useRef(null)

  useEffect(() => {
    const elements = landingRef.current.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    elements.forEach((element) => {
      element.classList.add('reveal-ready')
      observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={landingRef} className="landing" data-motion={paused ? 'paused' : 'running'}>
      <LandingCarousel />
      <LandingHero paused={paused} onToggleMotion={() => setPaused((value) => !value)} />
      <LandingStats />
      <LandingLastSession />
      <DriverDirectory />
      <footer className="container site-footer"><a href="#inicio">{crewName}<span>↗︎</span></a><p>Boas voltas. Melhores histórias.</p><span>Temporada {season.year}</span></footer>
    </div>
  )
}

export default Landing
