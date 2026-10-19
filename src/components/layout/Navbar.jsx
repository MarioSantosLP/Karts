import { useEffect, useRef, useState } from 'react'
import { crewName, season } from '../../data/season'
import './Navbar.css'

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Pistas', href: '#pistas' },
  { label: 'Sessão', href: '#sessoes' },
  { label: 'Pilotos', href: '#pilotos' },
  { label: 'Comparar', href: '#comparar' },
]

const sectionForHash = (hash) => {
  if (hash.startsWith('#piloto/')) return '#pilotos'
  if (hash.startsWith('#pista/') || hash === '#circuitos') return '#pistas'
  if (hash === '#classificacao' || hash === '#ultima-sessao') return '#sessoes'
  return links.some((link) => link.href === hash) ? hash : '#inicio'
}

function Navbar({ profileMode = false, compareMode = false, tracksMode = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(() => sectionForHash(window.location.hash))
  const menuButton = useRef(null)

  useEffect(() => {
    let frame = null
    const updateActiveSection = () => {
      frame = null
      if (profileMode || compareMode || tracksMode) {
        setActiveSection(tracksMode ? '#pistas' : compareMode ? '#comparar' : '#pilotos')
        return
      }

      // Follow the actual anchors, including the circuit below the photo carousel.
      const marker = Math.max(110, window.innerHeight * 0.3)
      let currentSection = '#inicio'
      let closestTop = -Infinity
      if (window.scrollY > 12) {
        links.forEach(({ href }) => {
          const section = document.getElementById(href === '#pistas' ? 'circuitos' : href.slice(1))
          if (!section) return
          const top = section.getBoundingClientRect().top
          if (top <= marker && top > closestTop) {
            currentSection = href
            closestTop = top
          }
        })
      }
      setActiveSection(currentSection)
    }
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(updateActiveSection)
    }

    const updateHash = () => {
      setActiveSection(sectionForHash(window.location.hash))
      scheduleUpdate()
    }
    scheduleUpdate()
    window.addEventListener('hashchange', updateHash)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [profileMode, compareMode, tracksMode])

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    const closeOnDesktop = () => {
      if (window.innerWidth >= 820) setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [menuOpen])

  const selectSection = (href) => {
    setActiveSection(href)
    setMenuOpen(false)
  }

  return (
    <header className={`navbar${menuOpen ? ' navbar--open' : ''}`}>
      <div className="container navbar-inner">
        <a className="brand" href="#inicio" aria-label={`${crewName} — início`} onClick={() => selectSection('#inicio')}>
          <svg className="brand-logo" viewBox="0 0 42 42" aria-hidden="true">
            <rect x="1" y="1" width="40" height="40" rx="11" />
            <path d="M11 10h5v5h-5zM21 10h5v5h-5zM16 15h5v5h-5zM26 15h5v5h-5zM11 20h5v5h-5zM21 20h5v5h-5zM16 25h5v5h-5zM26 25h5v5h-5z" />
          </svg>
          <span className="brand-name" aria-hidden="true">APEX<span>CREW</span></span>
        </a>

        <nav id="main-navigation" className="nav-links" aria-label="Navegação principal">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={activeSection === link.href ? 'active' : undefined}
              aria-current={activeSection === link.href ? 'location' : undefined}
              onClick={() => selectSection(link.href)}
            >
              {link.label}
            </a>
          ))}
          <span className="nav-mobile-season">TEMPORADA {season.year}</span>
        </nav>

        <div className="navbar-season" aria-label={`Temporada ${season.year}`}>
          <span className="navbar-season-dot" aria-hidden="true" />
          TEMPORADA <strong>{season.year}</strong>
        </div>

        <button
          ref={menuButton}
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default Navbar
