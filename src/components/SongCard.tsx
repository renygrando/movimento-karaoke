import { Song } from '@/contexts/KaraokeContext'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Microphone, Heart, DotsThreeVertical } from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SongCardProps {
  song: Song
  onSingNow?: () => void
}

export function SongCard({ song, onSingNow }: SongCardProps) {
  const { toggleFavorite, isFavorite, playlists, addSongToPlaylist, addDiscoveredSong } = useKaraoke()
  const favorite = isFavorite(song.id)

  const handleSing = () => {
    addDiscoveredSong(song)
    onSingNow?.()
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    addDiscoveredSong(song)
    toggleFavorite(song.id)
    toast.success(favorite ? 'Removida dos favoritos' : 'Adicionada aos favoritos!', {
      description: song.title,
    })
  }

  const handleAddToPlaylist = (playlistId: string) => {
    addDiscoveredSong(song)
    addSongToPlaylist(playlistId, song.id)
    const playlist = playlists.find(p => p.id === playlistId)
    toast.success('Adicionada à playlist!', {
      description: playlist?.name,
    })
  }

  return (
    <Card className="group relative overflow-hidden glass-card hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
        
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleFavorite}
            className="h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 hover:scale-110 transition-all"
          >
            <Heart
              size={18}
              weight={favorite ? 'fill' : 'regular'}
              className={favorite ? 'text-accent' : 'text-foreground'}
            />
          </Button>
          
          {playlists.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 hover:scale-110 transition-all"
                >
                  <DotsThreeVertical size={18} className="text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="font-['Exo_2']">
                    Adicionar à Playlist
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass-card">
                    {playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist.id}
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        className="font-['Exo_2']"
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-['Exo_2'] font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {song.title}
          </h3>
          <p className="font-['Exo_2'] text-sm text-muted-foreground line-clamp-1">
            {song.artist}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-['Exo_2'] text-muted-foreground uppercase tracking-wide">
            {song.language}
          </span>
          {song.duration > 0 && (
            <span className="text-xs font-['Exo_2'] text-muted-foreground">
              {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        <Button
          onClick={handleSing}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2'] font-medium uppercase tracking-wide hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all"
        >
          <Microphone size={18} />
          Cantar Agora
        </Button>
      </div>
    </Card>
  )
}
