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

  // Busca especificamente por karaoke com letra
  const searchQuery = `${query} karaoke letra`;

  try {
    const url = new URL(YOUTUBE_API_BASE);
    url.searchParams.append("part", "snippet");
    url.searchParams.append("q", searchQuery);
    url.searchParams.append("type", "video");
    url.searchParams.append("videoEmbeddable", "true");
    url.searchParams.append("regionCode", "BR");
    url.searchParams.append("relevanceLanguage", "pt");
    url.searchParams.append("maxResults", "30"); // Mais resultados para filtrar
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
      if (songs.length >= 10) break;

      // Filtros para garantir que é um karaoke legítimo
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
  const channelLower = channelTitle.toLowerCase();

  // Palavras-chave que indicam que é um karaoke válido
  const karaokeIndicators = ["karaoke", "letra", "lyrics", "com letra"];

  // Palavras que indicam que NÃO é um karaoke (é um videoclipe, trailer, etc)
  const excludeIndicators = [
    "videoclipe",
    "video clip",
    "oficial",
    "official",
    "trailer",
    "teaser",
    "making of",
    "documentário",
    "documentary",
    "entrevista",
    "interview",
    "live session",
    "ao vivo",
    "acústico",
    "unplugged",
  ];

  // Deve ter pelo menos um indicador de karaoke
  const hasKaraokeIndicator = karaokeIndicators.some((indicator) =>
    titleLower.includes(indicator)
  );

  if (!hasKaraokeIndicator) {
    return false;
  }

  // Não deve ter nenhum indicador de exclusão
  const hasExcludeIndicator = excludeIndicators.some((indicator) =>
    titleLower.includes(indicator)
  );

  if (hasExcludeIndicator) {
    return false;
  }

  // Canais de karaoke conhecidos são mais confiáveis
  const karaokeChannels = [
    "karaoke",
    "lyrics",
    "letra",
    "music video",
    "cartoon",
  ];

  // Se for de um canal conhecido de karaoke, aumenta confiança
  const fromKaraokeChannel = karaokeChannels.some((channel) =>
    channelLower.includes(channel)
  );

  // Se não for de um canal de karaoke, exige mais critérios
  if (!fromKaraokeChannel) {
    // Deve conter "letra" ou "lyrics" explicitamente se não for de canal conhecido
    const hasExplicitLyrics =
      titleLower.includes("letra") ||
      titleLower.includes("lyrics") ||
      titleLower.includes("com letra");

    if (!hasExplicitLyrics) {
      return false;
    }
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
