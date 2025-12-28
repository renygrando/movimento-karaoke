import { Song } from '@/contexts/KaraokeContext'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Microphone, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SongCardProps {
  song: Song
  onSingNow?: () => void
}

export function SongCard({ song, onSingNow }: SongCardProps) {
  const { addToQueue, currentSong } = useKaraoke()

  const handleSing = () => {
    if (currentSong) {
      addToQueue(song)
      toast.success('Added to queue!', {
        description: `${song.title} by ${song.artist}`,
      })
    } else {
      onSingNow?.()
    }
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
          <span className="text-xs font-['Exo_2'] text-muted-foreground">
            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <Button
          onClick={handleSing}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2'] font-medium uppercase tracking-wide hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all"
        >
          {currentSong ? <Plus size={18} /> : <Microphone size={18} />}
          {currentSong ? 'Add to Queue' : 'Sing Now'}
        </Button>
      </div>
    </Card>
  )
}
