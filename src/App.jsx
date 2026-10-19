import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import Navbar from './components/layout/Navbar'
import Landing from './components/landing/Landing'
import DriverProfile from './components/drivers/DriverProfile'
import DriverComparison from './components/compare/DriverComparison'
import { drivers } from './data/drivers'

function subscribeToHash(listener) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

const getHash = () => window.location.hash || '#inicio'

function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => '#inicio')
  const isProfileRoute = hash.startsWith('#piloto/')
  const isCompareRoute = hash === '#comparar'
  const isPageRoute = isProfileRoute || isCompareRoute
  const profileId = isProfileRoute ? hash.slice(8) : null
  const driver = drivers.find(({ id }) => id === profileId)
  const previousPageRoute = useRef(null)

  useLayoutEffect(() => {
    document.title = isProfileRoute ? `${driver?.name ?? 'Piloto não encontrado'} | Apex Crew` : isCompareRoute ? 'Comparar pilotos | Apex Crew' : 'Apex Crew'
    document.documentElement.dataset.view = isProfileRoute ? 'driver' : isCompareRoute ? 'compare' : 'landing'
    let frame
    if (isPageRoute) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.querySelector('[data-page-heading]')?.focus({ preventScroll: true })
      frame = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    } else if (previousPageRoute.current !== false) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    previousPageRoute.current = isPageRoute
    return () => cancelAnimationFrame(frame)
  }, [hash, isProfileRoute, isCompareRoute, isPageRoute, driver])

  return (
    <>
      <Navbar profileMode={isProfileRoute} compareMode={isCompareRoute} />
      <main>
        {isProfileRoute ? <DriverProfile key={profileId} driver={driver} /> : isCompareRoute ? <DriverComparison /> : <Landing />}
      </main>
    </>
  )
}

export default App
