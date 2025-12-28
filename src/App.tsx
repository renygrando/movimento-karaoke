import { KaraokeProvider } from './contexts/KaraokeContext'
import { HomeView } from './components/HomeView'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <KaraokeProvider>
      <HomeView />
      <Toaster />
    </KaraokeProvider>
  )
}

export default App