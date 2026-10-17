import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import LastSession from './components/LastSession'
import { lastSession } from './data/season'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <LastSession session={lastSession} />
      </main>
    </>
  )
}

export default App
