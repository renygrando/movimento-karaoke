import { useKaraoke } from '@/contexts/KaraokeContext'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Queue, X, Play, Trash, Plus, ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useState } from 'react'
import { ResultsModal } from './ResultsModal'
import { Song } from '@/contexts/KaraokeContext'

export function QueueDrawer() {
  const { queue, removeFromQueue, playNext, currentSong, clearQueue, reorderQueue } = useKaraoke()
  const [showAddSongModal, setShowAddSongModal] = useState(false)
  const [open, setOpen] = useState(false)

  const handleRemove = (songId: string, songTitle: string) => {
    removeFromQueue(songId)
    toast.success('Removida da fila', {
      description: songTitle,
    })
  }

  const handlePlayNext = () => {
    if (queue.length > 0) {
      setOpen(false)
      playNext()
      toast.success('Iniciando próxima música!')
    }
  }

  const handleClearQueue = () => {
    if (queue.length === 0) return
    clearQueue()
    toast.success('Fila limpa!')
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newQueue = [...queue]
    const temp = newQueue[index]
    newQueue[index] = newQueue[index - 1]
    newQueue[index - 1] = temp
    reorderQueue(newQueue)
    toast.success('Posição alterada')
  }

  const moveDown = (index: number) => {
    if (index === queue.length - 1) return
    const newQueue = [...queue]
    const temp = newQueue[index]
    newQueue[index] = newQueue[index + 1]
    newQueue[index + 1] = temp
    reorderQueue(newQueue)
    toast.success('Posição alterada')
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-24 right-6 rounded-full w-14 h-14 shadow-[0_0_25px_rgba(0,245,255,0.6)] hover:shadow-[0_0_35px_rgba(0,245,255,0.8)] bg-primary hover:bg-primary/90 z-50"
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
      
      <DrawerContent className="glass-card border-border/50 max-h-[85vh]">
        <DrawerHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-['Orbitron'] text-2xl uppercase tracking-wider glow-text">
              Fila de Músicas
            </DrawerTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-['Exo_2'] text-sm px-3 py-1">
                {queue.length} {queue.length === 1 ? 'música' : 'músicas'}
              </Badge>
              {queue.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearQueue}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                >
                  <Trash size={16} weight="bold" />
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="h-[65vh] px-4">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
              <Queue size={64} className="text-muted-foreground opacity-50" />
              <div>
                <h3 className="font-['Exo_2'] font-semibold text-lg text-foreground mb-2">
                  Fila Vazia
                </h3>
                <p className="font-['Exo_2'] text-sm text-muted-foreground mb-4">
                  Escolha sua primeira música e comece a festa!
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
                  Tocar Próxima Música
                </Button>
              )}
              
              {queue.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30 hover:border-primary/50 transition-all"
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

                  <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveUp(index)}
                        className="h-8 w-8 p-0 hover:bg-secondary/50 text-foreground"
                        title="Mover para cima"
                      >
                        <ArrowUp size={16} weight="bold" />
                      </Button>
                    )}
                    {index < queue.length - 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveDown(index)}
                        className="h-8 w-8 p-0 hover:bg-secondary/50 text-foreground"
                        title="Mover para baixo"
                      >
                        <ArrowDown size={16} weight="bold" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(song.id, song.title)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Remover"
                    >
                      <X size={18} weight="bold" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border/30 p-4">
          <p className="text-center text-xs text-muted-foreground font-['Exo_2']">
            {queue.length > 0 
              ? 'Passe o mouse sobre uma música para reordenar ou remover'
              : 'Adicione músicas à fila na tela inicial'
            }
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
