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
}

const KaraokeContext = createContext<KaraokeContextType | undefined>(undefined)

export function KaraokeProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [queue, setQueue] = useKV<Song[]>('karaoke-queue', [])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [isMicActive, setIsMicActive] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

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
