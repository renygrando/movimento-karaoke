import { Song } from "@/contexts/KaraokeContext";

const YOUTUBE_API_KEY = "AIzaSyBg80vxFWhXZvBM99nacd6W2aGX79YykZE";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3/search";

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
      medium: {
        url: string;
      };
      default: {
        url: string;
      };
    };
  };
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  error?: {
    message: string;
    code: number;
  };
}

async function checkVideoEmbeddable(videoId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function searchYouTubeKaraoke(query: string): Promise<Song[]> {
  if (!query.trim()) {
    return [];
  }

  // Busca mais aberta - apenas adiciona "karaoke" ao termo
  const searchQuery = `${query} karaoke`;

  try {
    const url = new URL(YOUTUBE_API_BASE);
    url.searchParams.append("part", "snippet");
    url.searchParams.append("q", searchQuery);
    url.searchParams.append("type", "video");
    url.searchParams.append("videoEmbeddable", "true");
    url.searchParams.append("regionCode", "BR");
    url.searchParams.append("relevanceLanguage", "pt");
    url.searchParams.append("maxResults", "50"); // Aumentado para mais resultados
    url.searchParams.append("key", YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data: YouTubeSearchResponse = await response.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error);
      throw new Error(data.error.message);
    }

    if (!data.items || data.items.length === 0) {
      return [];
    }

    const songs: Song[] = [];

    for (const item of data.items) {
      if (songs.length >= 20) break; // Aumentado de 10 para 20 resultados

      // Filtros básicos apenas
      if (!isValidKaraokeVideo(item.snippet.title, item.snippet.channelTitle)) {
        continue;
      }

      const isEmbeddable = await checkVideoEmbeddable(item.id.videoId);

      if (isEmbeddable) {
        songs.push({
          id: `yt-${item.id.videoId}`,
          title: cleanTitle(item.snippet.title),
          artist: item.snippet.channelTitle,
          youtubeId: item.id.videoId,
          thumbnail:
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url,
          duration: 0,
          category: "Busca YouTube",
          language: "Portuguese",
        });
      }
    }

    return songs;
  } catch (error) {
    console.error("Failed to search YouTube:", error);
    throw error;
  }
}

function isValidKaraokeVideo(title: string, channelTitle: string): boolean {
  const titleLower = title.toLowerCase();

  // Palavras-chave que indicam que é karaoke
  const karaokeIndicators = ["karaoke", "letra", "lyrics"];

  // Filtros MÍNIMOS - apenas exclui conteúdos claramente não-karaoke
  const excludeIndicators = [
    "making of",
    "documentário",
    "documentary",
    "entrevista",
    "interview",
    "tutorial",
    "how to",
    "como fazer",
  ];

  // Deve ter pelo menos um indicador de karaoke
  const hasKaraokeIndicator = karaokeIndicators.some((indicator) =>
    titleLower.includes(indicator)
  );

  if (!hasKaraokeIndicator) {
    return false;
  }

  // Apenas exclui conteúdos muito específicos que definitivamente não são karaoke
  const hasExcludeIndicator = excludeIndicators.some((indicator) =>
    titleLower.includes(indicator)
  );

  if (hasExcludeIndicator) {
    return false;
  }

  return true;
}

function cleanTitle(title: string): string {
  return title
    .replace(/\(.*?karaoke.*?\)/gi, "")
    .replace(/\[.*?karaoke.*?\]/gi, "")
    .replace(/karaoke/gi, "")
    .replace(/letra/gi, "")
    .replace(/lyrics/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLanguage(title: string): string {
  const portugueseWords = ["com", "para", "letra", "música", "canção"];
  const titleLower = title.toLowerCase();

  for (const word of portugueseWords) {
    if (titleLower.includes(word)) {
      return "Portuguese";
    }
  }

  return "English";
}

// Busca a duração do vídeo em segundos
export async function getVideoDuration(videoId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=contentDetails`
    );
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log("⚠️ Vídeo não encontrado");
      return 0;
    }

    const duration = data.items[0].contentDetails.duration;
    // Parse ISO 8601 duration (PT1H2M3S format)
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let seconds = 0;
    
    if (match?.[1]) seconds += parseInt(match[1]) * 3600; // hours
    if (match?.[2]) seconds += parseInt(match[2]) * 60;   // minutes
    if (match?.[3]) seconds += parseInt(match[3]);        // seconds
    
    console.log("⏱️ Duração do vídeo:", seconds, "segundos");
    return seconds;
  } catch (error) {
    console.error("Erro ao buscar duração:", error);
    return 0;
  }
}
