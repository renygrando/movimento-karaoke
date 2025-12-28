# Planning Guide

A high-fidelity, interactive karaoke web application that transforms your device into a neon-lit stage, letting you perform your favorite songs with real-time visual feedback and gamified scoring.

**Experience Qualities**:
1. **Electric** - Every interaction pulses with cyberpunk energy through neon accents, glowing elements, and reactive animations
2. **Immersive** - The microphone visualizer and full-screen player create a genuine performance atmosphere
3. **Rewarding** - Dynamic scoring, combo multipliers, and celebratory results keep performers engaged and motivated

**Complexity Level**: Light Application (multiple features with basic state)
This is a feature-rich single-page application with song discovery, queue management, playback controls, and gamification elements, but doesn't require complex routing or backend integration.

## Essential Features

### Song Discovery & Search
- **Functionality**: Search through a curated database of karaoke tracks filtered by genre, language, and popularity
- **Purpose**: Helps users quickly find songs they want to perform without overwhelming choice paralysis
- **Trigger**: User taps search bar or browses category cards on home screen
- **Progression**: Home screen → Tap search input → Type query → View filtered results → Select song card → Tap "Sing" button → Song added to queue with toast confirmation
- **Success criteria**: Search returns results within 200ms, categories display at least 8 songs each, "Sing" button provides immediate visual feedback

### Song Favoriting
- **Functionality**: Mark favorite songs with a heart icon for quick access later
- **Purpose**: Allows users to build a personal collection of their go-to karaoke songs
- **Trigger**: User taps heart icon on any song card
- **Progression**: Browse songs → Tap heart icon → Song added to favorites with toast → Access favorites via navigation bar → View all favorited songs in dedicated view
- **Success criteria**: Favorites persist between sessions, heart icon toggles state immediately, favorites view shows all saved songs in grid layout

### Playlist Creation & Management
- **Functionality**: Create custom playlists with names and descriptions, add songs to playlists, edit playlist details, delete playlists
- **Purpose**: Enables users to curate themed setlists for different moods, events, or performance styles
- **Trigger**: User navigates to Playlists view and taps "New Playlist" button
- **Progression**: Playlists view → Tap "New Playlist" → Enter name and description → Create → Browse songs → Tap menu on song card → Select "Add to Playlist" → Choose playlist → Song added with confirmation
- **Success criteria**: Playlists persist between sessions, support unlimited songs per playlist, allow editing names/descriptions, display song count and preview

### Playlist Loading
- **Functionality**: Load entire playlists into the performance queue with one tap
- **Purpose**: Quickly queue up a curated setlist without adding songs individually
- **Trigger**: User taps "Load" button on a playlist card
- **Progression**: Playlists view → Select playlist → Tap "Load" button → All playlist songs added to queue → Toast confirmation → Navigate to queue or start singing
- **Success criteria**: All songs load to queue in order, duplicates are prevented, works with queues that already have songs

### Queue Management
- **Functionality**: View, reorder, and remove upcoming songs in the performance queue
- **Purpose**: Gives users control over their setlist and builds anticipation for next performances
- **Trigger**: Tap floating queue button (shows badge with count) or swipe up from bottom
- **Progression**: Any screen → Tap queue button → Drawer slides up → View list → Drag to reorder or swipe to delete → Tap outside to close
- **Success criteria**: Queue persists between sessions, displays song thumbnails and titles, supports up to 50 queued songs

### Live Performance Stage
- **Functionality**: Full-screen YouTube video playback with synchronized microphone input visualization
- **Purpose**: Creates an immersive karaoke experience that makes users feel like they're on a real stage
- **Trigger**: Song starts from queue or user selects "Sing Now"
- **Progression**: Song selection → Stage loads with fade transition → Video plays automatically → Mic visualizer activates → Lyrics area displays below video → Score increases during performance → Song ends → Results modal appears
- **Success criteria**: Video loads within 3 seconds, visualizer reacts to audio input with <50ms latency, no interface elements obstruct video content

### Microphone Visualizer
- **Functionality**: Real-time audio waveform display that reacts to microphone input intensity
- **Purpose**: Provides immediate visual feedback confirming the mic is active and responding to voice
- **Trigger**: Automatically activates when stage view loads (after mic permission granted)
- **Progression**: Stage loads → Request mic permission → Access granted → Visualizer appears at bottom → Bars pulse with voice input → Persists throughout song
- **Success criteria**: Visualizer displays 32-64 frequency bars, updates at 60fps, color intensity matches input volume

### Gamification System
- **Functionality**: Dynamic scoring algorithm with combo multipliers and performance ratings
- **Purpose**: Adds competitive fun and replay value by quantifying performance quality
- **Trigger**: Score starts at 0 when song begins, increments based on playback progress and mock "pitch accuracy"
- **Progression**: Song starts → Score counter appears → Points increase during singing → Combo multiplier builds → "Perfect!" animations appear → Song ends → Final score calculated → Star rating displayed (1-5) → Random compliment shown
- **Success criteria**: Score visibly increases every 2-3 seconds, combo counter resets if no vocal input for 5 seconds, results screen includes shareable score

## Edge Case Handling

- **No Microphone Permission**: Display persistent banner explaining visualizer requires mic access, with retry button
- **Empty Favorites**: Show encouraging empty state with heart icon and instructions to favorite songs
- **Empty Playlists**: Show empty state with music note icon and "Create Playlist" button
- **Empty Playlist Content**: Disable "Load" button on playlists with no songs, show "0 songs" count
- **Queue Empty**: Show encouraging empty state with "Pick your first song!" and featured recommendations
- **Video Load Failure**: Catch YouTube errors and display retry button with option to skip to next song
- **Mic Not Available**: Disable visualizer gracefully but allow playback to continue normally
- **Network Interruption**: Show loading state if video buffering exceeds 5 seconds, allow user to cancel
- **Multiple Rapid Clicks**: Debounce "Sing" button to prevent duplicate queue entries
- **Duplicate Songs in Queue**: Prevent adding same song twice to queue
- **Duplicate Songs in Playlist**: Prevent adding same song twice to a playlist
- **Navigation During Playback**: Maintain playback state when switching between views

## Design Direction

The design should evoke the electric energy of a late-night Tokyo karaoke bar crossed with Blade Runner's neon-soaked streets. Every element should glow, pulse, and react—creating a space that feels alive and celebratory. Users should feel like rock stars the moment they enter the app, with bold typography, high-contrast neon colors, and smooth theatrical transitions.

## Color Selection

A cyberpunk-inspired palette with deep purples, electric pinks, and cyan accents against a rich dark background.

- **Primary Color**: Electric Cyan `oklch(0.75 0.15 210)` - Represents energy, technology, and the spotlight; used for primary CTAs and active states
- **Secondary Colors**: 
  - Deep Purple Background `oklch(0.15 0.05 285)` - Creates depth and noir atmosphere
  - Neon Magenta `oklch(0.65 0.25 330)` - Accent for queue badges, combos, and celebrations
- **Accent Color**: Hot Pink `oklch(0.70 0.22 350)` - Attention-grabbing highlight for "Sing" buttons and score increases
- **Foreground/Background Pairings**: 
  - Background (Deep Purple #1a0f2e): Cyan text (#00f5ff) - Ratio 8.2:1 ✓
  - Background (Deep Purple #1a0f2e): White text (#ffffff) - Ratio 14.5:1 ✓
  - Primary (Electric Cyan #00f5ff): Deep Purple text (#1a0f2e) - Ratio 8.2:1 ✓
  - Accent (Hot Pink #ff1f8f): White text (#ffffff) - Ratio 5.1:1 ✓

## Font Selection

Typography should feel bold, futuristic, and slightly edgy—combining geometric sans-serifs with condensed letterforms that echo neon signage.

- **Typographic Hierarchy**:
  - H1 (App Title "KARAOKE"): Orbitron Bold / 36px / wide letter-spacing (0.1em) / uppercase
  - H2 (Category Headers): Orbitron SemiBold / 24px / normal spacing / uppercase
  - H3 (Song Titles): Exo 2 SemiBold / 18px / tight leading
  - Body (Descriptions, Lyrics): Exo 2 Regular / 16px / relaxed leading (1.6)
  - UI Labels (Buttons, Tags): Exo 2 Medium / 14px / uppercase / slight spacing

## Animations

Animations should feel snappy and theatrical—like stage lighting cues and laser shows. Every interaction should provide immediate feedback with glowing effects and smooth transitions. Microphone visualizer bars should bounce with elastic easing. Score increases should have a satisfying pop-in effect. Page transitions should use subtle fade-with-scale combinations (0.98 → 1.0 scale). Button hovers trigger a neon glow bloom effect using drop-shadow filters. The queue drawer slides up with momentum-based spring physics.

## Component Selection

- **Components**: 
  - `Card` - Song discovery tiles with hover glow effects and glassmorphism backdrop, playlist cards
  - `Button` - Primary "Sing" CTAs with neon outline variant, ghost buttons for secondary actions, favorite/menu icon buttons
  - `Input` - Search bar with glowing focus state, playlist name input
  - `Textarea` - Playlist description input
  - `Drawer` - Queue management sliding from bottom with backdrop blur
  - `Dialog` - Results modal with celebration animations, playlist creation dialog
  - `DropdownMenu` - Song card menu for adding to playlists and queue
  - `Badge` - Queue count indicator with pulsing animation, playlist song count
  - `ScrollArea` - Smooth scrolling for song lists and categories
  - `Separator` - Subtle dividers with gradient glow effect
  - Navigation bar - Fixed bottom navigation with Home, Favorites, Playlists, and Queue buttons
- **Customizations**: 
  - Custom visualizer component using canvas API with gradient fills
  - Custom progress bar for song playback with neon trail effect
  - Custom score counter with animated number transitions
- **States**: 
  - Buttons: Default with subtle glow → Hover adds bloom effect → Active compresses slightly with brightness boost → Disabled reduces opacity to 40%
  - Inputs: Default with dim border → Focus adds cyan glow and border brightens → Filled shows success checkmark
  - Cards: Default with dark glass background → Hover lifts with shadow and brightens → Active state adds cyan border pulse
- **Icon Selection**: 
  - Microphone (mic icon) for recording/stage mode
  - MagnifyingGlass for search
  - Queue for song list
  - Play/Pause for controls
  - Plus for adding songs
  - Star for ratings
  - Lightning for combos
  - X for removing items
  - Heart for favorites (filled when favorited)
  - DotsThreeVertical for song card menu
  - House for home navigation
  - Playlist for playlists navigation
  - MusicNotes for empty playlist states
  - PlayCircle for loading playlists
  - Trash for deleting playlists
  - PencilSimple for editing playlists
- **Spacing**: 
  - Card padding: p-6 (24px)
  - Section gaps: gap-8 (32px) 
  - Button padding: px-8 py-4 (32px/16px)
  - Grid gaps: gap-4 (16px)
  - Container max-width: max-w-6xl with px-4 mobile padding
- **Mobile**: 
  - Stack all categories vertically on mobile (<768px)
  - Search bar becomes fixed at top with backdrop blur on scroll
  - Song cards use single column grid on mobile, 2 columns on tablet, 3+ on desktop
  - Stage view uses 100vh height with video taking 60% and lyrics/visualizer 40%
  - Queue drawer slides from bottom and can be swiped closed
  - Bottom navigation bar fixed at bottom with 4 primary navigation items
  - Navigation items show icons only on mobile, icons + text on larger screens
  - Playlists and favorites views follow same responsive grid as home view
  - Dialog and drawer components adapt to full-screen on mobile
