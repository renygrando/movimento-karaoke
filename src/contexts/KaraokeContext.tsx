import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

export interface Song {
  id: string
  title: string
  artist: string
  youtubeId: string
  thumbnail: string
  duration: number
  category: string
  language: string
}

export interface Playlist {
  id: string
  name: string
  description: string
  songIds: string[]
  createdAt: number
  updatedAt: number
}

interface KaraokeContextType {
  currentSong: Song | null
  setCurrentSong: (song: Song | null) => void
  queue: Song[]
  addToQueue: (song: Song) => void
  removeFromQueue: (songId: string) => void
  clearQueue: () => void
  playNext: () => void
  score: number
  setScore: (score: number) => void
  combo: number
  setCombo: (combo: number) => void
  isMicActive: boolean
  setIsMicActive: (active: boolean) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  favorites: string[]
  toggleFavorite: (songId: string) => void
  isFavorite: (songId: string) => boolean
  playlists: Playlist[]
  createPlaylist: (name: string, description: string) => void
  deletePlaylist: (playlistId: string) => void
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void
  addSongToPlaylist: (playlistId: string, songId: string) => void
  removeSongFromPlaylist: (playlistId: string, songId: string) => void
  loadPlaylistToQueue: (playlistId: string) => void
  discoveredSongs: Record<string, Song>
  addDiscoveredSong: (song: Song) => void
  getSongById: (songId: string) => Song | undefined
}

const KaraokeContext = createContext<KaraokeContextType | undefined>(undefined)

export function KaraokeProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [queue, setQueue] = useKV<Song[]>('karaoke-queue', [])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [isMicActive, setIsMicActive] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [favorites, setFavorites] = useKV<string[]>('karaoke-favorites', [])
  const [playlists, setPlaylists] = useKV<Playlist[]>('karaoke-playlists', [])
  const [discoveredSongs, setDiscoveredSongs] = useKV<Record<string, Song>>('karaoke-discovered-songs', {})

  const { songDatabase } = require('@/lib/songDatabase')
  
  const getSongById = useCallback((songId: string): Song | undefined => {
    return (discoveredSongs || {})[songId] || songDatabase.find((s: Song) => s.id === songId)
  }, [discoveredSongs, songDatabase])

  const addDiscoveredSong = useCallback((song: Song) => {
    setDiscoveredSongs((current) => ({
      ...(current || {}),
      [song.id]: song,
    }))
  }, [setDiscoveredSongs])

  const addToQueue = useCallback((song: Song) => {
    setQueue((currentQueue) => {
      const safeQueue = currentQueue || []
      const exists = safeQueue.some(s => s.id === song.id)
      if (exists) return safeQueue
      return [...safeQueue, song]
    })
  }, [setQueue])

  const removeFromQueue = useCallback((songId: string) => {
    setQueue((currentQueue) => {
      const safeQueue = currentQueue || []
      return safeQueue.filter(s => s.id !== songId)
    })
  }, [setQueue])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [setQueue])

  const playNext = useCallback(() => {
    setQueue((currentQueue) => {
      const safeQueue = currentQueue || []
      if (safeQueue.length === 0) {
        setCurrentSong(null)
        return safeQueue
      }
      const [nextSong, ...rest] = safeQueue
      setCurrentSong(nextSong)
      setScore(0)
      setCombo(0)
      return rest
    })
  }, [setQueue])

  const toggleFavorite = useCallback((songId: string) => {
    setFavorites((currentFavorites) => {
      const safeFavorites = currentFavorites || []
      if (safeFavorites.includes(songId)) {
        return safeFavorites.filter(id => id !== songId)
      }
      return [...safeFavorites, songId]
    })
  }, [setFavorites])

  const isFavorite = useCallback((songId: string) => {
    return (favorites || []).includes(songId)
  }, [favorites])

  const createPlaylist = useCallback((name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      songIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setPlaylists((current) => [...(current || []), newPlaylist])
  }, [setPlaylists])

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((current) => (current || []).filter(p => p.id !== playlistId))
  }, [setPlaylists])

  const updatePlaylist = useCallback((playlistId: string, updates: Partial<Playlist>) => {
    setPlaylists((current) => 
      (current || []).map(p => 
        p.id === playlistId 
          ? { ...p, ...updates, updatedAt: Date.now() }
          : p
      )
    )
  }, [setPlaylists])

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((current) =>
      (current || []).map(p =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId], updatedAt: Date.now() }
          : p
      )
    )
  }, [setPlaylists])

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((current) =>
      (current || []).map(p =>
        p.id === playlistId
          ? { ...p, songIds: p.songIds.filter(id => id !== songId), updatedAt: Date.now() }
          : p
      )
    )
  }, [setPlaylists])

  const loadPlaylistToQueue = useCallback((playlistId: string) => {
    const playlist = (playlists || []).find(p => p.id === playlistId)
    if (!playlist) return

    const playlistSongs = playlist.songIds
      .map(id => getSongById(id))
      .filter(Boolean) as Song[]

    setQueue((currentQueue) => {
      const safeQueue = currentQueue || []
      const newSongs = playlistSongs.filter(
        song => !safeQueue.some(s => s.id === song.id)
      )
      return [...safeQueue, ...newSongs]
    })
  }, [playlists, setQueue, getSongById])

  return (
    <KaraokeContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        queue: queue || [],
        addToQueue,
        removeFromQueue,
        clearQueue,
        playNext,
        score,
        setScore,
        combo,
        setCombo,
        isMicActive,
        setIsMicActive,
        isPlaying,
        setIsPlaying,
        favorites: favorites || [],
        toggleFavorite,
        isFavorite,
        playlists: playlists || [],
        createPlaylist,
        deletePlaylist,
        updatePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        loadPlaylistToQueue,
        discoveredSongs: discoveredSongs || {},
        addDiscoveredSong,
        getSongById,
      }}
    >
      {children}
    </KaraokeContext.Provider>
  )
}

export function useKaraoke() {
  const context = useContext(KaraokeContext)
  if (!context) {
    throw new Error('useKaraoke must be used within KaraokeProvider')
  }
  return context
}
