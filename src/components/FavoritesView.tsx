import { useKaraoke } from '@/contexts/KaraokeContext'
import { SongCard } from './SongCard'
import { Heart } from '@phosphor-icons/react'

interface FavoritesViewProps {
  onSongSelect: () => void
}

export function FavoritesView({ onSongSelect }: FavoritesViewProps) {
  const { favorites, setCurrentSong, setScore, setCombo, getSongById, addDiscoveredSong } = useKaraoke()

  const favoriteSongs = favorites
    .map(id => getSongById(id))
    .filter(Boolean)

  const handleSingNow = (song: any) => {
    addDiscoveredSong(song)
    setCurrentSong(song)
    setScore(0)
    setCombo(0)
    onSongSelect()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-black uppercase tracking-[0.2em] glow-text flex items-center gap-3 justify-center">
            <Heart size={32} weight="fill" className="text-accent" />
            Favoritos
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {favoriteSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Heart size={64} className="text-muted-foreground opacity-50" />
            <h2 className="font-['Orbitron'] text-2xl font-bold text-muted-foreground">
              Nenhum Favorito Ainda
            </h2>
            <p className="font-['Exo_2'] text-muted-foreground text-center max-w-md">
              Toque no ícone de coração em qualquer música para adicioná-la aos seus favoritos
            </p>
          </div>
        ) : (
          <div>
            <p className="font-['Exo_2'] text-muted-foreground mb-6">
              {favoriteSongs.length} {favoriteSongs.length === 1 ? 'música' : 'músicas'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteSongs.map((song) => song && (
                <SongCard
                  key={song.id}
                  song={song}
                  onSingNow={() => handleSingNow(song)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
