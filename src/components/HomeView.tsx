import { useState } from 'react'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SongCard } from './SongCard'
import { searchSongs, getSongsByCategory, categories } from '@/lib/songDatabase'
import { searchYouTubeKaraoke } from '@/lib/youtubeApi'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'
import { Song } from '@/contexts/KaraokeContext'

export function HomeView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [youtubeResults, setYoutubeResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { setCurrentSong, setScore, setCombo, addDiscoveredSong } = useKaraoke()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setHasSearched(true)

    try {
      const results = await searchYouTubeKaraoke(searchQuery)
      setYoutubeResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchError('Não foi possível carregar as músicas agora. Tente novamente.')
      setYoutubeResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSingNow = (song: Song) => {
    addDiscoveredSong(song)
    setCurrentSong(song)
    setScore(0)
    setCombo(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="font-['Orbitron'] text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-center mb-6 glow-text">
            KARAOKE
          </h1>
          
          <div className="relative max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="search-songs"
                type="text"
                placeholder="Busque por músicas ou artistas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 font-['Exo_2'] text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2'] font-semibold uppercase tracking-wide"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {hasSearched ? (
          <section>
            <h2 className="font-['Orbitron'] text-2xl font-bold uppercase tracking-wider mb-6 text-foreground">
              Resultados da Busca
              {!isSearching && (
                <span className="ml-3 text-sm text-muted-foreground font-['Exo_2'] normal-case tracking-normal">
                  {youtubeResults.length} {youtubeResults.length === 1 ? 'música' : 'músicas'}
                </span>
              )}
            </h2>
            
            {isSearching ? (
              <div className="text-center py-16">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="font-['Exo_2'] text-muted-foreground text-lg">
                  Procurando músicas no YouTube...
                </p>
              </div>
            ) : searchError ? (
              <div className="glass-card p-8 rounded-lg text-center">
                <p className="font-['Exo_2'] text-destructive text-lg mb-4">
                  {searchError}
                </p>
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="font-['Exo_2']"
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : youtubeResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {youtubeResults.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onSingNow={() => handleSingNow(song)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-['Exo_2'] text-muted-foreground text-lg">
                  Nenhum vídeo de karaokê encontrado. Tente palavras-chave diferentes.
                </p>
              </div>
            )}
          </section>
        ) : (
          <>
            {categories.map((category, index) => {
              const songs = getSongsByCategory(category)
              
              return (
                <section key={category}>
                  {index > 0 && <Separator className="mb-12 bg-border/30" />}
                  
                  <h2 className="font-['Orbitron'] text-2xl font-bold uppercase tracking-wider mb-6 glow-text">
                    {category}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {songs.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onSingNow={() => handleSingNow(song)}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
