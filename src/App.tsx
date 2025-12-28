import { useState } from 'react'
import { KaraokeProvider, useKaraoke } from './contexts/KaraokeContext'
import { HomeView } from './components/HomeView'
import { StageView } from './components/StageView'
import { QueueDrawer } from './components/QueueDrawer'
import { PlaylistsView } from './components/PlaylistsView'
import { FavoritesView } from './components/FavoritesView'
import { Toaster } from './components/ui/sonner'
import { Button } from './components/ui/button'
import { House, Heart, Playlist } from '@phosphor-icons/react'

function AppContent() {
  const { currentSong } = useKaraoke()
  const [view, setView] = useState<'home' | 'stage' | 'playlists' | 'favorites'>('home')

  const handleSongSelect = () => {
    setView('stage')
  }

  const handleBack = () => {
    setView('home')
  }

  return (
    <>
      {view === 'stage' ? (
        <StageView onBack={handleBack} />
      ) : (
        <>
          {view === 'home' && <HomeView onSongSelect={handleSongSelect} />}
          {view === 'playlists' && <PlaylistsView />}
          {view === 'favorites' && <FavoritesView onSongSelect={handleSongSelect} />}
          
          <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-lg bg-background/80 border-t border-border/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-around gap-2">
              <Button
                variant={view === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('home')}
                className={`flex-1 gap-2 font-['Exo_2'] uppercase tracking-wide transition-all ${
                  view === 'home'
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <House size={20} />
                <span className="hidden sm:inline">Início</span>
              </Button>
              
              <Button
                variant={view === 'favorites' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('favorites')}
                className={`flex-1 gap-2 font-['Exo_2'] uppercase tracking-wide transition-all ${
                  view === 'favorites'
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <Heart size={20} />
                <span className="hidden sm:inline">Favoritos</span>
              </Button>
              
              <Button
                variant={view === 'playlists' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('playlists')}
                className={`flex-1 gap-2 font-['Exo_2'] uppercase tracking-wide transition-all ${
                  view === 'playlists'
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <Playlist size={20} />
                <span className="hidden sm:inline">Playlists</span>
              </Button>
            </div>
          </div>

          <div className="h-20" />
        </>
      )}
      
      {view !== 'stage' && <QueueDrawer />}
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