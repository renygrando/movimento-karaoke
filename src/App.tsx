import { useState } from 'react'
import { KaraokeProvider, useKaraoke } from './contexts/KaraokeContext'
import { HomeView } from './components/HomeView'
import { StageView } from './components/StageView'
import { QueueDrawer } from './components/QueueDrawer'
import { Toaster } from './components/ui/sonner'

function AppContent() {
  const { currentSong } = useKaraoke()
  const [view, setView] = useState<'home' | 'stage'>('home')

  const handleSongSelect = () => {
    setView('stage')
  }

  const handleBack = () => {
    setView('home')
  }

  return (
    <>
      {view === 'home' && currentSong === null ? (
        <HomeView onSongSelect={handleSongSelect} />
      ) : (
        <StageView onBack={handleBack} />
      )}
      
      {view === 'home' && <QueueDrawer />}
      <Toaster />
    </>
  )
}

function App() {
  return (
    <KaraokeProvider>
      <AppContent />
    </KaraokeProvider>
  )
}

export default App