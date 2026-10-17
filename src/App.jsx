import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import Navbar from './components/layout/Navbar'
import Landing from './components/landing/Landing'
import DriverProfile from './components/drivers/DriverProfile'
import { drivers } from './data/drivers'

function subscribeToHash(listener) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

const getHash = () => window.location.hash || '#inicio'

function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => '#inicio')
  const isProfileRoute = hash.startsWith('#piloto/')
  const profileId = isProfileRoute ? hash.slice(8) : null
  const driver = drivers.find(({ id }) => id === profileId)
  const previousProfileRoute = useRef(null)

  useLayoutEffect(() => {
    document.title = isProfileRoute ? `${driver?.name ?? 'Piloto não encontrado'} | Apex Crew` : 'Apex Crew'
    document.documentElement.dataset.view = isProfileRoute ? 'driver' : 'landing'
    let frame
    if (isProfileRoute) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.querySelector('[data-page-heading]')?.focus({ preventScroll: true })
      frame = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    } else if (previousProfileRoute.current !== false) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    previousProfileRoute.current = isProfileRoute
    return () => cancelAnimationFrame(frame)
  }, [hash, isProfileRoute, driver])

  return (
    <>
      <Navbar profileMode={isProfileRoute} />
      <main>
        {isProfileRoute ? <DriverProfile key={profileId} driver={driver} /> : <Landing />}
      </main>
    </>
  )
}

export default App
