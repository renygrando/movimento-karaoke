import { useState, useEffect, useRef } from 'react'
import { useKaraoke } from '@/contexts/KaraokeContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SongCard } from './SongCard'
import { searchYouTubeKaraoke } from '@/lib/youtubeApi'
import { MagnifyingGlass, Warning, YoutubeLogo, CircleNotch } from '@phosphor-icons/react'
import { Song } from '@/contexts/KaraokeContext'
import { motion } from 'framer-motion'
import { MicrophoneVisualizer } from './MicrophoneVisualizer'
import { ResultsModal } from './ResultsModal'
import { toast } from 'sonner'

export function HomeView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [youtubeResults, setYoutubeResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { 
    currentSong, 
    setCurrentSong, 
    playNext,
    addDiscoveredSong 
  } = useKaraoke()

  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)

  const [showResults, setShowResults] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false)
  const [compatibilityError, setCompatibilityError] = useState<string | null>(null)
  const [finalScore, setFinalScore] = useState(0)
  const scoreIntervalRef = useRef<number | undefined>(undefined)
  const comboIntervalRef = useRef<number | undefined>(undefined)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerReadyRef = useRef(false)

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
    setFinalScore(0)
    playerReadyRef.current = false
    toast.success('Tocando agora!', {
      description: `${song.title} - ${song.artist}`,
    })
  }

  useEffect(() => {
    const checkVideoCompatibility = async () => {
      if (!currentSong) return

      setIsCheckingCompatibility(true)
      setCompatibilityError(null)
      setHasError(false)
      setIsReady(false)
      playerReadyRef.current = false

      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${currentSong.youtubeId}&format=json`,
          { method: 'GET' }
        )

        if (!response.ok) {
          if (response.status === 401 || response.status === 403 || response.status === 404) {
            setCompatibilityError('restricted')
            setHasError(true)
            toast.error('Vídeo com restrições de reprodução', {
              description: 'Este vídeo não pode ser incorporado. Use o botão para abrir no YouTube.',
            })
          } else {
            setCompatibilityError('not_found')
            setHasError(true)
          }
          setIsCheckingCompatibility(false)
          return
        }

        const data = await response.json()
        
        if (data && data.title) {
          setIsReady(true)
          setIsCheckingCompatibility(false)
        } else {
          setCompatibilityError('unknown')
          setHasError(true)
          setIsCheckingCompatibility(false)
        }
      } catch (error) {
        console.error('Video compatibility check failed:', error)
        setCompatibilityError('network_error')
        setHasError(true)
        setIsCheckingCompatibility(false)
      }
    }

    checkVideoCompatibility()

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://www.youtube.com' || event.origin === 'https://www.youtube-nocookie.com') {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
          
          if (data.event === 'onStateChange') {
            if (data.info === 0) {
              handleSongEnd()
            } else if (data.info === 1) {
              playerReadyRef.current = true
            }
          }
          
          if (data.event === 'infoDelivery' && data.info?.errorCode) {
            console.error('YouTube Player Error Code:', data.info.errorCode)
            if (data.info.errorCode === 150 || data.info.errorCode === 153 || data.info.errorCode === 101) {
              handlePlayerError()
            }
          }
        } catch (e) {
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [currentSong])

  useEffect(() => {
    if (!currentSong || !isReady) return

    scoreIntervalRef.current = window.setInterval(() => {
      const baseIncrease = Math.floor(Math.random() * 100) + 50
      const comboMultiplier = 1 + (combo * 0.1)
      const totalIncrease = Math.floor(baseIncrease * comboMultiplier)
      
      setScore(prevScore => prevScore + totalIncrease)
    }, 2500)

    comboIntervalRef.current = window.setInterval(() => {
      setCombo(prevCombo => Math.min(prevCombo + 1, 10))
    }, 3000)

    return () => {
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
      if (comboIntervalRef.current) clearInterval(comboIntervalRef.current)
    }
  }, [currentSong, isReady])

  const handleSongEnd = () => {
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
    if (comboIntervalRef.current) clearInterval(comboIntervalRef.current)
    setFinalScore(score)
    setShowResults(true)
  }

  const handlePlayerError = () => {
    if (!hasError) {
      setHasError(true)
      setCompatibilityError('playback_error')
      toast.error('Este vídeo não pode ser reproduzido aqui. Clique em "Abrir no YouTube" para assistir.')
    }
  }

  const handleOpenInYoutube = () => {
    if (currentSong) {
      window.open(`https://www.youtube.com/watch?v=${currentSong.youtubeId}`, '_blank')
    }
  }

  const handleSkipSong = () => {
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
    if (comboIntervalRef.current) clearInterval(comboIntervalRef.current)
    setIsReady(false)
    setHasError(false)
    setCompatibilityError(null)
    setCurrentSong(null)
    setScore(0)
    setCombo(0)
    setFinalScore(0)
  }

  const handleResultsClose = () => {
    setShowResults(false)
    setIsReady(false)
    setHasError(false)
    setCurrentSong(null)
    setScore(0)
    setCombo(0)
    setFinalScore(0)
  }

  const getErrorMessage = () => {
    switch (compatibilityError) {
      case 'restricted':
        return {
          title: 'Vídeo Protegido (Erro 153)',
          description: 'Este vídeo possui restrições de incorporação definidas pelo proprietário e não pode ser reproduzido aqui. Clique no botão abaixo para assistir diretamente no YouTube!'
        }
      case 'not_found':
        return {
          title: 'Vídeo Não Encontrado',
          description: 'Este vídeo não está mais disponível ou foi removido pelo proprietário.'
        }
      case 'playback_error':
        return {
          title: 'Erro de Reprodução',
          description: 'Ocorreu um erro ao tentar reproduzir este vídeo. Tente abrir no YouTube para uma melhor experiência.'
        }
      case 'network_error':
        return {
          title: 'Erro de Conexão',
          description: 'Não foi possível verificar a compatibilidade do vídeo. Verifique sua conexão ou tente abrir no YouTube.'
        }
      default:
        return {
          title: 'Não Foi Possível Carregar',
          description: 'Este vídeo não pode ser carregado no momento. Tente novamente ou abra no YouTube.'
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-black uppercase tracking-[0.15em] text-center mb-6 glow-text">
            Movimento Karaoke
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

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {currentSong && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-['Orbitron'] text-2xl font-bold uppercase tracking-wider text-foreground">
                Agora Tocando
              </h2>
            </div>

            <div className="bg-black rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.3)] neon-border aspect-video">
              {isCheckingCompatibility ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-background via-secondary/50 to-background">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary"
                  >
                    <CircleNotch size={48} weight="bold" className="text-primary" />
                  </motion.div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="font-['Orbitron'] text-2xl font-bold text-foreground">
                      Verificando Compatibilidade
                    </h3>
                    <p className="font-['Exo_2'] text-muted-foreground max-w-md">
                      Checando se o vídeo pode ser reproduzido...
                    </p>
                  </div>
                </div>
              ) : hasError ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-background via-secondary/50 to-background">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 border-2 border-accent"
                  >
                    <Warning size={48} weight="fill" className="text-accent" />
                  </motion.div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="font-['Orbitron'] text-2xl font-bold text-foreground">
                      {getErrorMessage().title}
                    </h3>
                    <p className="font-['Exo_2'] text-muted-foreground max-w-md">
                      {getErrorMessage().description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleOpenInYoutube}
                      className="gap-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-['Exo_2'] font-semibold px-6 py-6 text-lg"
                    >
                      <YoutubeLogo size={28} weight="fill" />
                      Abrir no YouTube
                    </Button>

                    <Button
                      onClick={handleSkipSong}
                      variant="outline"
                      className="gap-3 font-['Exo_2'] font-semibold px-6 py-6 text-lg border-primary/50 hover:bg-primary/10"
                    >
                      Fechar Player
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
                  title={currentSong.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                  onError={handlePlayerError}
                />
              )}
            </div>

            <div className="glass-card p-4 rounded-lg">
              <h3 className="font-['Exo_2'] font-bold text-2xl text-foreground mb-1">
                {currentSong.title}
              </h3>
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
          </section>
        )}

        {hasSearched && (
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
        )}

        {!hasSearched && !currentSong && (
          <div className="text-center py-24">
            <h2 className="font-['Orbitron'] text-3xl font-bold mb-4 text-foreground">
              Bem-vindo ao Movimento Karaoke
            </h2>
            <p className="font-['Exo_2'] text-muted-foreground text-lg max-w-md mx-auto">
              Use a barra de busca acima para encontrar suas músicas favoritas e começar a cantar!
            </p>
          </div>
        )}
      </div>

      <ResultsModal
        open={showResults}
        onClose={handleResultsClose}
        score={finalScore}
        songTitle={currentSong?.title || ''}
        songArtist={currentSong?.artist || ''}
      />
    </div>
  )
}
