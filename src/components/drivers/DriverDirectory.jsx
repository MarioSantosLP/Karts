import { useMemo, useState } from 'react'
import { drivers, getDriverResults } from '../../data/drivers'
import { formatLap, padNumber } from '../../format'
import DriverPortrait from './DriverPortrait'
import DriverSortMenu from './DriverSortMenu'
import './Drivers.css'

const PAGE_SIZE = 6
const SORT_OPTIONS = [
  { value: 'number', label: 'Número' },
  { value: 'name', label: 'Nome' },
  { value: 'pace', label: 'Melhor volta' },
]

function DriverDirectory() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('number')
  const [page, setPage] = useState(0)
  const displayedDrivers = useMemo(() => {
    const query = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT').trim()
    return drivers.filter((driver) => driver.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT').includes(query) || String(driver.number).includes(query)).sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'pt-PT')
      if (sort === 'pace') return (getDriverResults(a)[0]?.result.bestLap ?? Infinity) - (getDriverResults(b)[0]?.result.bestLap ?? Infinity)
      return a.number - b.number
    })
  }, [search, sort])
  const pageCount = Math.max(1, Math.ceil(displayedDrivers.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const pageStart = currentPage * PAGE_SIZE
  const pageDrivers = displayedDrivers.slice(pageStart, pageStart + PAGE_SIZE)

  function updateSearch(value) {
    setSearch(value)
    setPage(0)
  }

  function updateSort(value) {
    setSort(value)
    setPage(0)
  }

  return (
    <section className="container drivers-section" id="pilotos" aria-labelledby="drivers-title">
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow"><span className="section-number">02</span> A nossa grelha</p><h2 id="drivers-title">Dez pilotos. <em>Uma crew.</em></h2></div>
        <p className="drivers-intro">Conhece quem está por trás de cada volta.</p>
      </div>
      <div className="drivers-toolbar">
        <label className="driver-search"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><input type="search" value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Nome ou número do piloto" aria-label="Procurar piloto" /></label>
        <DriverSortMenu options={SORT_OPTIONS} value={sort} onChange={updateSort} />
      </div>
      <div className="drivers-grid">
        {pageDrivers.map((driver) => {
          const latest = getDriverResults(driver)[0]
          return (
            <a key={driver.id} href={`#piloto/${driver.id}`} className="driver-card" style={{ '--driver-accent': driver.accent }} aria-label={`Ver perfil de ${driver.name}`}>
              <div className="driver-card-image"><DriverPortrait driver={driver} /><span className="driver-card-number" aria-hidden="true">{padNumber(driver.number)}</span><span className="driver-card-team">APEX CREW / PILOTO</span><span className="driver-card-open" aria-hidden="true">↗</span></div>
              <div className="driver-card-content"><div className="driver-card-name"><h3>{driver.name}</h3><span>#{padNumber(driver.number)}</span></div><div className="driver-card-result"><div><span>Melhor volta registada</span><strong>{latest ? formatLap(Math.min(...getDriverResults(driver).map(({ result }) => result.bestLap))) : '—'}<small>s</small></strong></div><span className="driver-card-position">{latest ? `${latest.position}.º` : '—'}<small>última sessão</small></span></div><div className="driver-card-footer">Conhecer o piloto <span aria-hidden="true">→</span></div></div>
            </a>
          )
        })}
      </div>
      {displayedDrivers.length === 0 && <div className="drivers-empty" role="status"><p>Nenhum piloto encontrado.</p><button type="button" onClick={() => updateSearch('')}>Ver todos os pilotos</button></div>}
      <div className="drivers-footer">
        <p className="drivers-count" role="status">
          {displayedDrivers.length === 0 ? 0 : `${pageStart + 1}–${pageStart + pageDrivers.length}`} de {displayedDrivers.length} pilotos
        </p>
        {pageCount > 1 && (
          <nav className="drivers-pagination" aria-label="Páginas de pilotos">
            <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 0} aria-label="Página anterior">←</button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button key={i} type="button" onClick={() => setPage(i)} className={i === currentPage ? 'is-active' : undefined} aria-current={i === currentPage ? 'page' : undefined}>{i + 1}</button>
            ))}
            <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount - 1} aria-label="Página seguinte">→</button>
          </nav>
        )}
      </div>
    </section>
  )
}

export default DriverDirectory
