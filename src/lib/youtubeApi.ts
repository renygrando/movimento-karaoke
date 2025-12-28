import { Song } from '@/contexts/KaraokeContext'

const YOUTUBE_API_KEY = 'AIzaSyBg80vxFWhXZvBM99nacd6W2aGX79YykZE'
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/search'

interface YouTubeSearchItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    channelTitle: string
    thumbnails: {
      high: {
        url: string
      }
      medium: {
        url: string
      }
      default: {
        url: string
      }
    }
  }
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[]
  error?: {
    message: string
    code: number
  }
}

export async function searchYouTubeKaraoke(query: string): Promise<Song[]> {
  if (!query.trim()) {
    return []
  }

  const searchQuery = `${query} karaoke letra`
  
  try {
    const url = new URL(YOUTUBE_API_BASE)
    url.searchParams.append('part', 'snippet')
    url.searchParams.append('q', searchQuery)
    url.searchParams.append('type', 'video')
    url.searchParams.append('maxResults', '10')
    url.searchParams.append('key', YOUTUBE_API_KEY)

    const response = await fetch(url.toString())
    const data: YouTubeSearchResponse = await response.json()

    if (data.error) {
      console.error('YouTube API Error:', data.error)
      throw new Error(data.error.message)
    }

    if (!data.items || data.items.length === 0) {
      return []
    }

    return data.items.map((item, index) => ({
      id: `yt-${item.id.videoId}`,
      title: cleanTitle(item.snippet.title),
      artist: item.snippet.channelTitle,
      youtubeId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.high?.url || 
                 item.snippet.thumbnails.medium?.url || 
                 item.snippet.thumbnails.default?.url,
      duration: 0,
      category: 'YouTube Search',
      language: detectLanguage(item.snippet.title),
    }))
  } catch (error) {
    console.error('Failed to search YouTube:', error)
    throw error
  }
}

function cleanTitle(title: string): string {
  return title
    .replace(/\(.*?karaoke.*?\)/gi, '')
    .replace(/\[.*?karaoke.*?\]/gi, '')
    .replace(/karaoke/gi, '')
    .replace(/letra/gi, '')
    .replace(/lyrics/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function detectLanguage(title: string): string {
  const portugueseWords = ['com', 'para', 'letra', 'música', 'canção']
  const titleLower = title.toLowerCase()
  
  for (const word of portugueseWords) {
    if (titleLower.includes(word)) {
      return 'Portuguese'
    }
  }
  
  return 'English'
}
