import { Song } from '@/contexts/KaraokeContext'

export const songDatabase: Song[] = [
  {
    id: '1',
    title: 'Garota de Ipanema',
    artist: 'Tom Jobim',
    youtubeId: 'UJkxFhFRFDA',
    thumbnail: 'https://img.youtube.com/vi/UJkxFhFRFDA/maxresdefault.jpg',
    duration: 320,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '2',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    youtubeId: 'oPQ3o14ksaM',
    thumbnail: 'https://img.youtube.com/vi/oPQ3o14ksaM/maxresdefault.jpg',
    duration: 280,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '3',
    title: 'Aquarela',
    artist: 'Toquinho',
    youtubeId: 'fNHqoJe2lDE',
    thumbnail: 'https://img.youtube.com/vi/fNHqoJe2lDE/maxresdefault.jpg',
    duration: 245,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '4',
    title: 'Asa Branca',
    artist: 'Luiz Gonzaga',
    youtubeId: 'CKjbVi7Jk_g',
    thumbnail: 'https://img.youtube.com/vi/CKjbVi7Jk_g/maxresdefault.jpg',
    duration: 200,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '5',
    title: 'Pais Tropical',
    artist: 'Jorge Ben Jor',
    youtubeId: 'MCzqErq29Kw',
    thumbnail: 'https://img.youtube.com/vi/MCzqErq29Kw/maxresdefault.jpg',
    duration: 260,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '6',
    title: 'Chega de Saudade',
    artist: 'João Gilberto',
    youtubeId: 'cHxp-xcEKLI',
    thumbnail: 'https://img.youtube.com/vi/cHxp-xcEKLI/maxresdefault.jpg',
    duration: 200,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '7',
    title: 'Mas Que Nada',
    artist: 'Sérgio Mendes',
    youtubeId: 'FbSHFuUP9dY',
    thumbnail: 'https://img.youtube.com/vi/FbSHFuUP9dY/maxresdefault.jpg',
    duration: 195,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '8',
    title: 'Ai Se Eu Te Pego',
    artist: 'Michel Teló',
    youtubeId: 'hcm55lU9knw',
    thumbnail: 'https://img.youtube.com/vi/hcm55lU9knw/maxresdefault.jpg',
    duration: 185,
    category: 'Brazilian Hits',
    language: 'Portuguese',
  },
  {
    id: '9',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    youtubeId: 'fJ9rUzIMcZQ',
    thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
    duration: 354,
    category: 'International Classics',
    language: 'English',
  },
  {
    id: '10',
    title: 'Sweet Child O Mine',
    artist: 'Guns N Roses',
    youtubeId: '1w7OgIMMRc4',
    thumbnail: 'https://img.youtube.com/vi/1w7OgIMMRc4/maxresdefault.jpg',
    duration: 356,
    category: 'International Classics',
    language: 'English',
  },
  {
    id: '11',
    title: 'I Will Always Love You',
    artist: 'Whitney Houston',
    youtubeId: '3JWTaaS7LdU',
    thumbnail: 'https://img.youtube.com/vi/3JWTaaS7LdU/maxresdefault.jpg',
    duration: 272,
    category: 'International Classics',
    language: 'English',
  },
  {
    id: '12',
    title: 'Livin On A Prayer',
    artist: 'Bon Jovi',
    youtubeId: 'lDK9QqIzhwk',
    thumbnail: 'https://img.youtube.com/vi/lDK9QqIzhwk/maxresdefault.jpg',
    duration: 249,
    category: 'International Classics',
    language: 'English',
  },
  {
    id: '13',
    title: 'Dont Stop Believin',
    artist: 'Journey',
    youtubeId: '1k8craCGpgs',
    thumbnail: 'https://img.youtube.com/vi/1k8craCGpgs/maxresdefault.jpg',
    duration: 251,
    category: 'International Classics',
    language: 'English',
  },
  {
    id: '14',
    title: 'Total Eclipse of the Heart',
    artist: 'Bonnie Tyler',
    youtubeId: 'lcOxhH8N3Bo',
    thumbnail: 'https://img.youtube.com/vi/lcOxhH8N3Bo/maxresdefault.jpg',
    duration: 302,
    category: 'International Classics',
    language: 'English',
  },
  {
    id: '15',
    title: 'My Heart Will Go On',
    artist: 'Celine Dion',
    youtubeId: 'WNIPqafd4As',
    thumbnail: 'https://img.youtube.com/vi/WNIPqafd4As/maxresdefault.jpg',
    duration: 283,
    category: 'International Classics',
    language: 'English',
  },
  {
    id: '16',
    title: 'Careless Whisper',
    artist: 'George Michael',
    youtubeId: 'izGwDsrQ1eQ',
    thumbnail: 'https://img.youtube.com/vi/izGwDsrQ1eQ/maxresdefault.jpg',
    duration: 306,
    category: 'International Classics',
    language: 'English',
  },
]

export function searchSongs(query: string): Song[] {
  if (!query.trim()) return songDatabase
  
  const lowerQuery = query.toLowerCase()
  return songDatabase.filter(
    song =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery)
  )
}

export function getSongsByCategory(category: string): Song[] {
  return songDatabase.filter(song => song.category === category)
}

export const categories = [
  'Brazilian Hits',
  'International Classics',
]
