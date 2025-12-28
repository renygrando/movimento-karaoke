import { useKaraoke } from '@/contexts/KaraokeContext'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Queue, X, Play } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function QueueDrawer() {
  const { queue, removeFromQueue, playNext, currentSong } = useKaraoke()

  const handleRemove = (songId: string, songTitle: string) => {
    removeFromQueue(songId)
    toast.success('Removed from queue', {
      description: songTitle,
    })
  }

  const handlePlayNext = () => {
    if (queue.length > 0) {
      playNext()
      toast.success('Starting next song!')
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-[0_0_25px_rgba(0,245,255,0.6)] hover:shadow-[0_0_35px_rgba(0,245,255,0.8)] bg-primary hover:bg-primary/90 z-50"
        >
          <div className="relative">
            <Queue size={24} weight="fill" />
            {queue.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs font-bold animate-pulse">
                {queue.length}
              </Badge>
            )}
          </div>
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="glass-card border-border/50 max-h-[80vh]">
        <DrawerHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-['Orbitron'] text-2xl uppercase tracking-wider glow-text">
              Queue
            </DrawerTitle>
            <Badge variant="secondary" className="font-['Exo_2'] text-sm px-3 py-1">
              {queue.length} {queue.length === 1 ? 'song' : 'songs'}
            </Badge>
          </div>
        </DrawerHeader>

        <ScrollArea className="h-[60vh] px-4">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
              <Queue size={64} className="text-muted-foreground opacity-50" />
              <div>
                <h3 className="font-['Exo_2'] font-semibold text-lg text-foreground mb-2">
                  Queue is Empty
                </h3>
                <p className="font-['Exo_2'] text-sm text-muted-foreground">
                  Pick your first song and start the party!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              {!currentSong && queue.length > 0 && (
                <Button
                  onClick={handlePlayNext}
                  className="w-full mb-4 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-['Exo_2'] font-semibold uppercase tracking-wide"
                >
                  <Play size={20} weight="fill" />
                  Play Next Song
                </Button>
              )}
              
              {queue.map((song, index) => (
                <div
                  key={song.id}
                  className="group flex items-center gap-4 p-3 rounded-lg bg-card/50 border border-border/30 hover:border-primary/50 transition-all"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-['Orbitron'] text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-shrink-0 w-20 h-12 rounded overflow-hidden">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-['Exo_2'] font-semibold text-sm text-foreground truncate">
                      {song.title}
                    </h4>
                    <p className="font-['Exo_2'] text-xs text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(song.id, song.title)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X size={18} weight="bold" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
