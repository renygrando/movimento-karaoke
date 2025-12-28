import { useState } from 'react'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Trash,
  PlayCircle,
  MusicNotes,
  PencilSimple,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { songDatabase } from '@/lib/songDatabase'

export function PlaylistsView() {
  const { playlists, createPlaylist, deletePlaylist, updatePlaylist, loadPlaylistToQueue } = useKaraoke()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('')
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name')
      return
    }

    createPlaylist(newPlaylistName, newPlaylistDescription)
    toast.success('Playlist created!', {
      description: newPlaylistName,
    })
    setNewPlaylistName('')
    setNewPlaylistDescription('')
    setIsCreateDialogOpen(false)
  }

  const handleDeletePlaylist = (playlistId: string, playlistName: string) => {
    deletePlaylist(playlistId)
    toast.success('Playlist deleted', {
      description: playlistName,
    })
  }

  const handleLoadPlaylist = (playlistId: string, playlistName: string) => {
    loadPlaylistToQueue(playlistId)
    toast.success('Playlist loaded to queue!', {
      description: playlistName,
    })
  }

  const startEditing = (playlistId: string, name: string, description: string) => {
    setEditingPlaylist(playlistId)
    setEditName(name)
    setEditDescription(description)
  }

  const handleUpdatePlaylist = () => {
    if (!editName.trim() || !editingPlaylist) return

    updatePlaylist(editingPlaylist, {
      name: editName,
      description: editDescription,
    })
    toast.success('Playlist updated!')
    setEditingPlaylist(null)
  }

  const getSongsForPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId)
    if (!playlist) return []
    return playlist.songIds
      .map(id => songDatabase.find(s => s.id === id))
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-black uppercase tracking-[0.2em] glow-text">
              My Playlists
            </h1>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2'] font-medium uppercase tracking-wide hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all"
                >
                  <Plus size={18} />
                  New Playlist
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border/50">
                <DialogHeader>
                  <DialogTitle className="font-['Orbitron'] text-2xl uppercase tracking-wide">
                    Create Playlist
                  </DialogTitle>
                  <DialogDescription className="font-['Exo_2'] text-muted-foreground">
                    Build your perfect setlist
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input
                      id="playlist-name"
                      placeholder="Playlist name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="font-['Exo_2'] bg-card/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      id="playlist-description"
                      placeholder="Description (optional)"
                      value={newPlaylistDescription}
                      onChange={(e) => setNewPlaylistDescription(e.target.value)}
                      className="font-['Exo_2'] bg-card/50 border-border/50 min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="font-['Exo_2']"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePlaylist}
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2']"
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <MusicNotes size={64} className="text-muted-foreground opacity-50" />
            <h2 className="font-['Orbitron'] text-2xl font-bold text-muted-foreground">
              No Playlists Yet
            </h2>
            <p className="font-['Exo_2'] text-muted-foreground text-center max-w-md">
              Create your first playlist to organize your favorite songs and build the perfect setlist
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2'] font-medium uppercase tracking-wide hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all mt-4"
            >
              <Plus size={18} />
              Create Playlist
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => {
              const songs = getSongsForPlaylist(playlist.id)
              const isEditing = editingPlaylist === playlist.id

              return (
                <Card
                  key={playlist.id}
                  className="glass-card hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                >
                  <div className="p-6 space-y-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="font-['Exo_2'] bg-card/50 border-border/50"
                        />
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="font-['Exo_2'] bg-card/50 border-border/50 min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleUpdatePlaylist}
                            className="flex-1 font-['Exo_2'] bg-primary hover:bg-primary/90"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPlaylist(null)}
                            className="flex-1 font-['Exo_2']"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <h3 className="font-['Orbitron'] text-xl font-bold text-foreground uppercase tracking-wide line-clamp-1">
                            {playlist.name}
                          </h3>
                          {playlist.description && (
                            <p className="font-['Exo_2'] text-sm text-muted-foreground line-clamp-2">
                              {playlist.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-['Exo_2'] text-muted-foreground">
                          <MusicNotes size={16} />
                          <span>
                            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                          </span>
                        </div>

                        {songs.length > 0 && (
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {songs.slice(0, 5).map((song) => song && (
                              <div
                                key={song.id}
                                className="text-xs font-['Exo_2'] text-muted-foreground truncate"
                              >
                                • {song.title} - {song.artist}
                              </div>
                            ))}
                            {songs.length > 5 && (
                              <div className="text-xs font-['Exo_2'] text-muted-foreground">
                                + {songs.length - 5} more
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleLoadPlaylist(playlist.id, playlist.name)}
                            disabled={songs.length === 0}
                            className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-['Exo_2'] font-medium uppercase tracking-wide hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all"
                          >
                            <PlayCircle size={16} />
                            Load
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              startEditing(playlist.id, playlist.name, playlist.description)
                            }
                            className="font-['Exo_2']"
                          >
                            <PencilSimple size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
                            className="font-['Exo_2'] hover:bg-destructive/20 hover:border-destructive"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
