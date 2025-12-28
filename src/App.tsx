import { KaraokeProvider } from './contexts/KaraokeContext'
import { HomeView } from './components/HomeView'
import { Toaster } from './components/ui/sonner'
import { InstallPrompt } from './components/InstallPrompt'
import { usePWA } from './hooks/use-pwa'

function App() {
  usePWA()
  
  return (
    <KaraokeProvider>
      <HomeView />
      <Toaster />
      <InstallPrompt />
    </KaraokeProvider>
  )
}

export default App