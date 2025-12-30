import { Song } from "@/contexts/KaraokeContext";
import { useKaraoke } from "@/contexts/KaraokeContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microphone, Heart, DotsThreeVertical } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SongCardProps {
  song: Song;
  onSingNow?: () => void;
}

export function SongCard({ song, onSingNow }: SongCardProps) {
  const {
    toggleFavorite,
    isFavorite,
    playlists,
    addSongToPlaylist,
    addDiscoveredSong,
  } = useKaraoke();
  const favorite = isFavorite(song.id);

  const handleSing = () => {
    addDiscoveredSong(song);
    onSingNow?.();
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    addDiscoveredSong(song);
    toggleFavorite(song.id);
    toast.success(
      favorite ? "Removida dos favoritos" : "Adicionada aos favoritos!",
      {
        description: song.title,
      }
    );
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addDiscoveredSong(song);
    addSongToPlaylist(playlistId, song.id);
    const playlist = playlists.find((p) => p.id === playlistId);
    toast.success("Adicionada à playlist!", {
      description: playlist?.name,
    });
  };

  return (
    <Card className="group relative overflow-hidden bg-linear-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(131,56,236,0.4)] backdrop-blur-sm rounded-2xl">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleFavorite}
            className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-pink-500/80 hover:scale-110 transition-all shadow-lg"
          >
            <Heart
              size={20}
              weight={favorite ? "fill" : "regular"}
              className={favorite ? "text-pink-400" : "text-white"}
            />
          </Button>

          {playlists.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-purple-500/80 hover:scale-110 transition-all shadow-lg"
                >
                  <DotsThreeVertical size={20} className="text-white" />
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

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-['Exo_2'] font-bold text-lg text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-tight mb-1">
            {song.title}
          </h3>
          <p className="font-['Exo_2'] text-sm text-purple-200/70 line-clamp-1">
            {song.artist}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-['Exo_2'] text-purple-300/60 uppercase tracking-wider font-semibold px-2 py-1 rounded-md bg-purple-500/20">
            {song.language}
          </span>
          {song.duration > 0 && (
            <span className="font-['Exo_2'] text-purple-300/60 font-medium">
              {Math.floor(song.duration / 60)}:
              {(song.duration % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>

        <Button
          onClick={handleSing}
          className="w-full gap-2 h-11 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-['Exo_2'] font-bold uppercase tracking-wide hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] transition-all duration-300 rounded-xl"
        >
          <Microphone size={20} weight="fill" />
          Cantar Agora
        </Button>
      </div>
    </Card>
  );
}
