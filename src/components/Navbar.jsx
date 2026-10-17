import { crewName } from '../data/season'
import './Navbar.css'

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sessões', href: '#sessoes' },
  { label: 'Pilotos', href: '#pilotos' },
  { label: 'Classificação', href: '#classificacao' },
  { label: 'Circuitos', href: '#circuitos' },
]

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a className="brand" href="#inicio">
          <svg className="brand-logo" viewBox="0 0 36 36" aria-hidden="true">
            <rect width="36" height="36" rx="8" />
            <path d="M10 10h4v4h-4zM18 10h4v4h-4zM14 14h4v4h-4zM22 14h4v4h-4zM10 18h4v4h-4zM18 18h4v4h-4zM14 22h4v4h-4zM22 22h4v4h-4z" />
          </svg>
          <span className="brand-name">{crewName}</span>
        </a>
        <nav className="nav-links" aria-label="Principal">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={i === 0 ? 'active' : undefined}
              aria-current={i === 0 ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
