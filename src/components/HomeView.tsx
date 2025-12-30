import { useState, useEffect, useRef, useCallback } from "react";
import { useKaraoke } from "@/contexts/KaraokeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SongCard } from "./SongCard";
import { searchYouTubeKaraoke } from "@/lib/youtubeApi";
import {
  MagnifyingGlass,
  Warning,
  YoutubeLogo,
  CircleNotch,
  Sparkle,
} from "@phosphor-icons/react";
import { Song } from "@/contexts/KaraokeContext";
import { motion, AnimatePresence } from "framer-motion";
import { MicrophoneVisualizer } from "./MicrophoneVisualizer";
import { ResultsModal } from "./ResultsModal";
import { toast } from "sonner";

export function HomeView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { currentSong, setCurrentSong, playNext, addDiscoveredSong } =
    useKaraoke();

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const [showResults, setShowResults] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  const [compatibilityError, setCompatibilityError] = useState<string | null>(
    null
  );
  const [finalScore, setFinalScore] = useState(0);
  const scoreIntervalRef = useRef<number | undefined>(undefined);
  const comboIntervalRef = useRef<number | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerReadyRef = useRef(false);
  const scoreRef = useRef(0);
  const playerMonitorRef = useRef<number | undefined>(undefined);
  const videoEndedRef = useRef(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const results = await searchYouTubeKaraoke(searchQuery);
      setYoutubeResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(
        "Não foi possível carregar as músicas agora. Tente novamente."
      );
      setYoutubeResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSingNow = (song: Song) => {
    addDiscoveredSong(song);
    setCurrentSong(song);
    setScore(0);
    setCombo(0);
    setFinalScore(0);
    scoreRef.current = 0;
    playerReadyRef.current = false;
    videoEndedRef.current = false;
    toast.success("🎤 Tocando agora!", {
      description: `${song.title} - ${song.artist}`,
    });
  };

  const handleSongEnd = useCallback(() => {
    if (videoEndedRef.current) {
      console.log("⚠️ handleSongEnd já foi chamado, ignorando...");
      return;
    }

    console.log("🎬🎬🎬 VÍDEO TERMINOU - handleSongEnd executando");
    videoEndedRef.current = true;

    // Limpa todos os intervals
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
    if (playerMonitorRef.current) clearInterval(playerMonitorRef.current);

    const finalScoreValue = scoreRef.current || 0;
    console.log("📊 Score final:", finalScoreValue);

    // Define o score e abre o modal
    setFinalScore(finalScoreValue);
    setShowResults(true);
    console.log("✅ Modal aberto com score:", finalScoreValue);

    toast.success("🎉 Música finalizada! Confira sua nota!", {
      duration: 5000,
    });
  }, []);

  useEffect(() => {
    const checkVideoCompatibility = async () => {
      if (!currentSong) return;

      setIsCheckingCompatibility(true);
      setCompatibilityError(null);
      setHasError(false);
      setIsReady(false);
      playerReadyRef.current = false;

      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${currentSong.youtubeId}&format=json`,
          { method: "GET" }
        );

        if (!response.ok) {
          if (
            response.status === 401 ||
            response.status === 403 ||
            response.status === 404
          ) {
            setCompatibilityError("restricted");
            setHasError(true);
            toast.error("Vídeo com restrições de reprodução", {
              description:
                "Este vídeo não pode ser incorporado. Use o botão para abrir no YouTube.",
            });
          } else {
            setCompatibilityError("not_found");
            setHasError(true);
          }
        } else {
          setIsReady(false);
        }
      } catch (error) {
        console.error("Compatibility check error:", error);
        setCompatibilityError("network_error");
        setHasError(true);
      } finally {
        setIsCheckingCompatibility(false);
      }
    };

    checkVideoCompatibility();
  }, [currentSong]);

  useEffect(() => {
    let messageHandler: ((event: MessageEvent) => void) | null = null;

    const setupListener = () => {
      messageHandler = (event: MessageEvent) => {
        // Aceita mensagens do YouTube
        if (
          event.origin !== "https://www.youtube.com" &&
          event.origin !== "https://www.youtube-nocookie.com"
        ) {
          return;
        }

        try {
          let data = event.data;

          // Tenta fazer parse se for string
          if (typeof data === "string") {
            try {
              data = JSON.parse(data);
            } catch {
              return; // Ignora se não for JSON válido
            }
          }

          if (!data || typeof data !== "object" || !data.event) return;

          console.log("📨 YouTube event:", data.event, data.info);

          // Player pronto
          if (data.event === "onReady") {
            console.log("✅ Player pronto!");
            playerReadyRef.current = true;
            setIsReady(true);
            setHasError(false);
            videoEndedRef.current = false;
          }

          // Mudança de estado do player
          if (data.event === "onStateChange") {
            const state = data.info;

            if (state === -1) console.log("⏸️ Player: UNSTARTED");
            if (state === 0) console.log("🏁 Player: ENDED");
            if (state === 1) console.log("▶️ Player: PLAYING");
            if (state === 2) console.log("⏸️ Player: PAUSED");
            if (state === 3) console.log("⏳ Player: BUFFERING");
            if (state === 5) console.log("📼 Player: CUED");

            // ESTADO 0 = VÍDEO TERMINOU
            if (state === 0) {
              if (!videoEndedRef.current) {
                console.log("🎬🎬🎬 VÍDEO TERMINOU! Chamando handleSongEnd");
                handleSongEnd();
              } else {
                console.log(
                  "⚠️ Vídeo já foi finalizado, ignorando evento duplicado"
                );
              }
            }
          }

          // Resposta do getPlayerState (usado pelo polling)
          if (
            data.event === "infoDelivery" &&
            data.info &&
            typeof data.info.playerState !== "undefined"
          ) {
            const state = data.info.playerState;

            // Estado 0 = vídeo terminou
            if (state === 0 && !videoEndedRef.current) {
              console.log(
                "🎯 POLLING detectou fim do vídeo! Chamando handleSongEnd"
              );
              handleSongEnd();
            }
          }

          // Erro do player
          if (data.event === "onError") {
            console.log("❌ Erro no player:", data);
            handlePlayerError();
          }
        } catch (error) {
          // Silenciosamente ignora erros
        }
      };

      window.addEventListener("message", messageHandler);
      console.log("🎧 Event listener adicionado");
    };

    setupListener();

    return () => {
      if (messageHandler) {
        window.removeEventListener("message", messageHandler);
        console.log("🎧 Event listener removido");
      }
    };
  }, [handleSongEnd]);

  useEffect(() => {
    if (!currentSong || !isReady) return;

    console.log("⚡ Starting score interval for song:", currentSong.title);
    videoEndedRef.current = false;

    scoreIntervalRef.current = window.setInterval(() => {
      const baseIncrease = Math.floor(Math.random() * 100) + 50;
      const comboMultiplier = 1 + combo * 0.1;
      const totalIncrease = Math.floor(baseIncrease * comboMultiplier);

      setScore((prevScore) => {
        const newScore = prevScore + totalIncrease;
        scoreRef.current = newScore;
        return newScore;
      });
    }, 2500);

    comboIntervalRef.current = window.setInterval(() => {
      setCombo((prevCombo) => Math.min(prevCombo + 1, 10));
    }, 3000);

    // Polling para verificar estado do player a cada segundo
    playerMonitorRef.current = window.setInterval(() => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // Solicita o estado atual do player
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"getPlayerState","args":""}',
          "*"
        );
      }
    }, 1000);

    console.log("✅ Polling iniciado para monitorar estado do player");

    return () => {
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
      if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
      if (playerMonitorRef.current) clearInterval(playerMonitorRef.current);
    };
  }, [currentSong, isReady, combo]);

  const handlePlayerError = () => {
    if (!hasError) {
      setHasError(true);
      setCompatibilityError("playback_error");
      toast.error(
        'Este vídeo não pode ser reproduzido aqui. Clique em "Abrir no YouTube" para assistir.'
      );
    }
  };

  const handleOpenInYoutube = () => {
    if (currentSong) {
      window.open(
        `https://www.youtube.com/watch?v=${currentSong.youtubeId}`,
        "_blank"
      );
    }
  };

  const handleSkipSong = () => {
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    if (comboIntervalRef.current) clearInterval(comboIntervalRef.current);
    if (playerMonitorRef.current) clearInterval(playerMonitorRef.current);
    setIsReady(false);
    setHasError(false);
    setCompatibilityError(null);
    setCurrentSong(null);
    setScore(0);
    setCombo(0);
    setFinalScore(0);
    scoreRef.current = 0;
    videoEndedRef.current = false;
  };

  const handleResultsClose = () => {
    setShowResults(false);
    setIsReady(false);
    setHasError(false);
    setCurrentSong(null);
    setScore(0);
    setCombo(0);
    setFinalScore(0);
    scoreRef.current = 0;
    videoEndedRef.current = false;
  };

  const getErrorMessage = () => {
    switch (compatibilityError) {
      case "restricted":
        return {
          title: "Vídeo Protegido (Erro 153)",
          description:
            "Este vídeo possui restrições de incorporação definidas pelo proprietário e não pode ser reproduzido aqui. Clique no botão abaixo para assistir diretamente no YouTube!",
        };
      case "not_found":
        return {
          title: "Vídeo Não Encontrado",
          description:
            "Este vídeo não está mais disponível ou foi removido pelo proprietário.",
        };
      case "playback_error":
        return {
          title: "Erro de Reprodução",
          description:
            "Ocorreu um erro ao tentar reproduzir este vídeo. Tente abrir no YouTube para uma melhor experiência.",
        };
      case "network_error":
        return {
          title: "Erro de Conexão",
          description:
            "Não foi possível verificar a compatibilidade do vídeo. Verifique sua conexão ou tente abrir no YouTube.",
        };
      default:
        return {
          title: "Não Foi Possível Carregar",
          description:
            "Este vídeo não pode ser carregado no momento. Tente novamente ou abra no YouTube.",
        };
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header with search */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/40 border-b border-purple-500/20 shadow-[0_4px_30px_rgba(131,56,236,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['Orbitron'] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider mb-2"
              style={{
                background:
                  "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(131, 56, 236, 0.5))",
              }}
            >
              🎤 Movimento Karaoke
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-['Exo_2'] text-purple-300/80 text-sm sm:text-base tracking-wide"
            >
              Cante suas músicas favoritas com estilo
            </motion.p>
          </div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-linear-to-r from-purple-900/50 to-pink-900/50 p-2 rounded-2xl backdrop-blur-sm border border-purple-500/30 shadow-[0_0_30px_rgba(131,56,236,0.2)]">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={24}
                  weight="bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 z-10"
                />
                <Input
                  id="search-songs"
                  type="text"
                  placeholder="Busque por músicas ou artistas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 sm:pl-14 h-12 sm:h-14 bg-black/40 border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 font-['Exo_2'] text-base sm:text-lg text-white placeholder:text-purple-300/50 rounded-xl"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="h-12 sm:h-14 px-6 sm:px-8 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-['Exo_2'] font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,0,110,0.5)] hover:shadow-[0_0_30px_rgba(255,0,110,0.7)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <CircleNotch
                    size={24}
                    className="animate-spin"
                    weight="bold"
                  />
                ) : (
                  "Buscar"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 relative z-10">
        {/* Now Playing Section */}
        <AnimatePresence>
          {currentSong && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Sparkle
                  size={32}
                  weight="fill"
                  className="text-pink-500 animate-pulse"
                />
                <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-bold uppercase tracking-wider bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Agora Tocando
                </h2>
              </div>

              {/* Video Player */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(131,56,236,0.4)] border-2 border-purple-500/30 bg-black aspect-video">
                {isCheckingCompatibility ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-linear-to-br from-purple-900/30 via-pink-900/30 to-blue-900/30">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="flex items-center justify-center w-24 h-24 rounded-full bg-purple-500/20 border-4 border-purple-500"
                    >
                      <CircleNotch
                        size={48}
                        weight="bold"
                        className="text-purple-400"
                      />
                    </motion.div>

                    <div className="text-center space-y-3">
                      <h3 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-white">
                        Verificando Compatibilidade
                      </h3>
                      <p className="font-['Exo_2'] text-purple-200/80 max-w-md text-base sm:text-lg">
                        Checando se o vídeo pode ser reproduzido...
                      </p>
                    </div>
                  </div>
                ) : hasError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-linear-to-br from-red-900/30 via-pink-900/30 to-purple-900/30">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500"
                    >
                      <Warning
                        size={56}
                        weight="fill"
                        className="text-red-400"
                      />
                    </motion.div>

                    <div className="text-center space-y-3">
                      <h3 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-white">
                        {getErrorMessage().title}
                      </h3>
                      <p className="font-['Exo_2'] text-red-200/80 max-w-md text-base sm:text-lg">
                        {getErrorMessage().description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleOpenInYoutube}
                        size="lg"
                        className="gap-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-['Exo_2'] font-bold px-8 py-6 text-lg rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.5)]"
                      >
                        <YoutubeLogo size={32} weight="fill" />
                        Abrir no YouTube
                      </Button>

                      <Button
                        onClick={handleSkipSong}
                        size="lg"
                        variant="outline"
                        className="gap-3 font-['Exo_2'] font-bold px-8 py-6 text-lg border-2 border-purple-500/50 hover:bg-purple-500/20 text-white rounded-xl"
                      >
                        Fechar Player
                      </Button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1&iv_load_policy=3&fs=1&cc_load_policy=0&playsinline=1&loop=0`}
                    title={currentSong.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                    onError={handlePlayerError}
                  />
                )}
              </div>

              {/* Song Info Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-linear-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 backdrop-blur-sm"
              >
                <h3 className="font-['Exo_2'] font-bold text-2xl sm:text-3xl text-white mb-2">
                  {currentSong.title}
                </h3>
                <p className="font-['Exo_2'] text-lg sm:text-xl text-purple-200/80">
                  {currentSong.artist}
                </p>
              </motion.div>

              {/* Visualizer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-linear-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 backdrop-blur-sm"
              >
                <div className="mb-4">
                  <h3 className="font-['Exo_2'] font-semibold text-sm uppercase tracking-wider text-blue-300/80 mb-3">
                    🎵 Visualizador de Microfone
                  </h3>
                </div>
                <MicrophoneVisualizer />
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Search Results */}
        {hasSearched && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                Resultados da Busca
              </h2>
              {!isSearching && youtubeResults.length > 0 && (
                <span className="px-4 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-['Exo_2'] text-sm font-semibold">
                  {youtubeResults.length}{" "}
                  {youtubeResults.length === 1 ? "música" : "músicas"}
                </span>
              )}
            </div>

            {isSearching ? (
              <div className="text-center py-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <CircleNotch
                    size={64}
                    weight="bold"
                    className="text-purple-500"
                  />
                </motion.div>
                <p className="font-['Exo_2'] text-purple-300/80 text-xl">
                  Procurando músicas no YouTube...
                </p>
              </div>
            ) : searchError ? (
              <div className="p-12 rounded-2xl bg-linear-to-br from-red-900/40 to-pink-900/40 border border-red-500/30 backdrop-blur-sm text-center">
                <p className="font-['Exo_2'] text-red-200 text-xl mb-6">
                  {searchError}
                </p>
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="font-['Exo_2'] font-semibold border-2 border-red-500/50 hover:bg-red-500/20 text-white"
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : youtubeResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {youtubeResults.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SongCard
                      song={song}
                      onSingNow={() => handleSingNow(song)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-24">
                <p className="font-['Exo_2'] text-purple-300/80 text-xl">
                  Nenhum vídeo de karaokê encontrado. Tente palavras-chave
                  diferentes.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Welcome Message */}
        {!hasSearched && !currentSong && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              🎤
            </motion.div>
            <h2 className="font-['Orbitron'] text-4xl sm:text-5xl font-bold mb-6 bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Bem-vindo ao Movimento Karaoke
            </h2>
            <p className="font-['Exo_2'] text-purple-300/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Use a barra de busca acima para encontrar suas músicas favoritas e
              começar a cantar! 🎵✨
            </p>
          </motion.div>
        )}
      </div>

      <ResultsModal
        open={showResults}
        onClose={handleResultsClose}
        score={finalScore}
        songTitle={currentSong?.title || ""}
        songArtist={currentSong?.artist || ""}
      />
    </div>
  );
}
