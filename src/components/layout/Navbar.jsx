import { useEffect, useRef, useState } from 'react'
import { crewName, season } from '../../data/season'
import './Navbar.css'

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sessão', href: '#sessoes' },
  { label: 'Pilotos', href: '#pilotos' },
  { label: 'Circuito', href: '#circuitos' },
]

const sectionForHash = (hash) => {
  if (hash.startsWith('#piloto/')) return '#pilotos'
  if (hash === '#classificacao' || hash === '#ultima-sessao') return '#sessoes'
  return links.some((link) => link.href === hash) ? hash : '#inicio'
}

function Navbar({ profileMode = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(() => sectionForHash(window.location.hash))
  const preferredSection = useRef(sectionForHash(window.location.hash))
  const menuButton = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting)
        if (!visibleSection) return

        // Circuito and Pilotos are nested anchors. Track their parent sections
        // while preserving the destination the visitor explicitly selected.
        if (visibleSection.target.id === 'pilotos') {
          setActiveSection('#pilotos')
        } else if (visibleSection.target.id === 'inicio') {
          setActiveSection(preferredSection.current === '#circuitos' ? '#circuitos' : '#inicio')
        } else {
          setActiveSection(preferredSection.current === '#pilotos' ? '#pilotos' : '#sessoes')
        }
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    )

    ;(profileMode ? [] : ['inicio', 'sessoes', 'pilotos']).forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    const updateHash = () => {
      preferredSection.current = sectionForHash(window.location.hash)
      setActiveSection(preferredSection.current)
    }
    let previousScrollY = window.scrollY
    const updateTop = () => {
      const scrollY = window.scrollY
      if (!profileMode && scrollY <= 12 && previousScrollY > 12) {
        preferredSection.current = '#inicio'
        setActiveSection('#inicio')
      }
      previousScrollY = scrollY
    }
    window.addEventListener('hashchange', updateHash)
    window.addEventListener('scroll', updateTop, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('scroll', updateTop)
    }
  }, [profileMode])

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
    preferredSection.current = href
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
