import { useState } from 'react'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Input } from '@/components/ui/input'
import { SongCard } from './SongCard'
import { searchSongs, getSongsByCategory, categories } from '@/lib/songDatabase'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'

interface HomeViewProps {
  onSongSelect: () => void
}

export function HomeView({ onSongSelect }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { setCurrentSong, setScore, setCombo } = useKaraoke()

  const filteredSongs = searchQuery ? searchSongs(searchQuery) : []

  const handleSingNow = (song: any) => {
    setCurrentSong(song)
    setScore(0)
    setCombo(0)
    onSongSelect()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="font-['Orbitron'] text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-center mb-6 glow-text">
            KARAOKE
          </h1>
          
          <div className="relative max-w-2xl mx-auto">
            <MagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="search-songs"
              type="text"
              placeholder="Search for songs or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 font-['Exo_2'] text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {searchQuery ? (
          <section>
            <h2 className="font-['Orbitron'] text-2xl font-bold uppercase tracking-wider mb-6 text-foreground">
              Search Results
              <span className="ml-3 text-sm text-muted-foreground font-['Exo_2'] normal-case tracking-normal">
                {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
              </span>
            </h2>
            
            {filteredSongs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSongs.map((song) => (
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
                  No songs found. Try a different search term.
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
