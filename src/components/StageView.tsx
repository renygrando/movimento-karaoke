import { useEffect, useState, useRef } from 'react'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Button } from '@/components/ui/button'
import { MicrophoneVisualizer } from './MicrophoneVisualizer'
import { ResultsModal } from './ResultsModal'
import { ArrowLeft, Lightning, Warning, YoutubeLogo } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface StageViewProps {
  onBack: () => void
}

export function StageView({ onBack }: StageViewProps) {
  const { currentSong, score, setScore, combo, setCombo, playNext } = useKaraoke()
  const [showResults, setShowResults] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const scoreIntervalRef = useRef<number | undefined>(undefined)
  const comboIntervalRef = useRef<number | undefined>(undefined)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!currentSong || !isReady) return

    scoreIntervalRef.current = window.setInterval(() => {
      const baseIncrease = Math.floor(Math.random() * 100) + 50
      const comboMultiplier = 1 + (combo * 0.1)
      const totalIncrease = Math.floor(baseIncrease * comboMultiplier)
      
      setScore(score + totalIncrease)
    }, 2500)

    comboIntervalRef.current = window.setInterval(() => {
      setCombo(Math.min(combo + 1, 10))
    }, 3000)

    return () => {
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
      if (comboIntervalRef.current) clearInterval(comboIntervalRef.current)
    }
  }, [currentSong, isReady, combo, score, setScore, setCombo])

  useEffect(() => {
    if (currentSong) {
      setIsReady(true)
      setHasError(false)
    }
  }, [currentSong])

  const handleSongEnd = () => {
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
    if (comboIntervalRef.current) clearInterval(comboIntervalRef.current)
    setShowResults(true)
  }

  const handleResultsClose = () => {
    setShowResults(false)
    setIsReady(false)
    setHasError(false)
    playNext()
    onBack()
  }

  const handlePlayerError = () => {
    setHasError(true)
    toast.error('Este vídeo não pode ser reproduzido aqui. Clique em "Abrir no YouTube" para assistir.')
  }

  const handleOpenInYoutube = () => {
    if (currentSong) {
      window.open(`https://www.youtube.com/watch?v=${currentSong.youtubeId}`, '_blank')
    }
  }

  if (!currentSong) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['Exo_2'] text-muted-foreground">No song selected</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-foreground hover:text-primary"
          >
            <ArrowLeft size={20} />
            <span className="font-['Exo_2'] font-medium">Back</span>
          </Button>

          <div className="flex items-center gap-6">
            <AnimatePresence mode="wait">
              {combo > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/50"
                >
                  <Lightning size={20} weight="fill" className="text-accent" />
                  <span className="font-['Orbitron'] font-bold text-accent">
                    x{combo}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-right">
              <div className="font-['Orbitron'] text-3xl font-bold glow-text">
                {score.toLocaleString()}
              </div>
              <div className="font-['Exo_2'] text-xs text-muted-foreground uppercase tracking-wide">
                Score
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-20 pb-4 px-4">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-4">
          <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.3)] neon-border relative aspect-video">
            {hasError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-background via-secondary/50 to-background">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 border-2 border-accent"
                >
                  <Warning size={48} weight="fill" className="text-accent" />
                </motion.div>
                
                <div className="text-center space-y-2">
                  <h3 className="font-['Orbitron'] text-2xl font-bold text-foreground">
                    Vídeo Protegido
                  </h3>
                  <p className="font-['Exo_2'] text-muted-foreground max-w-md">
                    Este vídeo não permite reprodução externa. Abra no YouTube para cantar!
                  </p>
                </div>

                <Button
                  onClick={handleOpenInYoutube}
                  className="gap-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-['Exo_2'] font-semibold px-6 py-6 text-lg"
                >
                  <YoutubeLogo size={28} weight="fill" />
                  Abrir no YouTube
                </Button>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
                title={currentSong.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onError={handlePlayerError}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 rounded-lg">
              <h2 className="font-['Exo_2'] font-bold text-2xl text-foreground mb-1">
                {currentSong.title}
              </h2>
              <p className="font-['Exo_2'] text-lg text-muted-foreground">
                {currentSong.artist}
              </p>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <div className="mb-3">
                <h3 className="font-['Exo_2'] font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  Microphone Visualizer
                </h3>
              </div>
              <MicrophoneVisualizer />
            </div>
          </div>
        </div>
      </div>

      <ResultsModal
        open={showResults}
        onClose={handleResultsClose}
        score={score}
        songTitle={currentSong.title}
        songArtist={currentSong.artist}
      />
    </div>
  )
}
