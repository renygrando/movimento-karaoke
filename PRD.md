# Planning Guide

Uma aplicação web de karaokê moderna e intuitiva que oferece acesso imediato às músicas brasileiras mais populares, com reprodução instantânea e interface clean e sofisticada.

**Experience Qualities**:
1. **Vibrante** - Cores vivas e gradientes suaves criam uma atmosfera energética e envolvente
2. **Imersivo** - Player em tela cheia com visualizador de microfone proporciona experiência autêntica de karaokê
3. **Intuitivo** - Interface limpa com navegação direta - clicar e cantar sem complicações

**Complexity Level**: Light Application (multiple features with basic state)
Aplicação single-page com catálogo de músicas curado, gerenciamento de filas, sistema de favoritos, playlists e player integrado. Foco em experiência direta e sem fricção.

## Essential Features

### Catálogo de Músicas Populares
- **Funcionalidade**: Biblioteca curada com 24 músicas populares brasileiras atuais (Barões da Pisadinha, Gusttavo Lima, Marília Mendonça, Anitta, etc.) organizadas em 8 categorias
- **Propósito**: Acesso imediato aos maiores hits sem necessidade de busca - as músicas que todos querem cantar
- **Gatilho**: Usuário abre o app
- **Progressão**: App carrega → Exibe categorias (Piseiro, Sertanejo, Funk, Forró, Axé, Pagode, Pop, Pop Latino) → Scroll para explorar → Clica em "Cantar Agora" → Player inicia automaticamente
- **Critérios de sucesso**: Carregamento instantâneo, cards com thumbnails claros, organização por categoria facilita descoberta, grid responsivo

### Reprodução Instantânea
- **Funcionalidade**: Ao clicar em qualquer música (home, favoritos ou fila), o player aparece automaticamente em tela cheia
- **Propósito**: Experiência zero-friction - do clique ao canto em segundos
- **Gatilho**: Click em "Cantar Agora" ou diretamente em uma música da fila
- **Progressão**: Seleção → Player aparece → Vídeo carrega → Reprodução inicia → Pontuação começa
- **Critérios de sucesso**: Transição suave (<300ms), vídeo inicia em <3s, sem passos intermediários, volta fácil para navegação

### Gerenciamento de Fila Inteligente
- **Funcionalidade**: Drawer flutuante mostra fila, permite reordenar e tocar qualquer música com um clique
- **Propósito**: Controle total da setlist sem sair da experiência
- **Gatilho**: Botão flutuante com badge mostrando quantidade de músicas
- **Progressão**: Click no botão → Drawer abre → Visualiza lista → Click direto em música para tocar OU arrasta para reordenar → Click remove música → Click em "Limpar" remove todas
- **Critérios de sucesso**: Fila persiste entre sessões, click toca imediatamente, reordenação intuitiva, visual limpo

### Sistema de Favoritos
- **Funcionalidade**: Marcar músicas favoritas com ícone de coração, acessar view dedicada
- **Propósito**: Coleção pessoal de músicas preferidas para acesso rápido
- **Gatilho**: Click no ícone de coração em qualquer card
- **Progressão**: Navega músicas → Click coração → Toast confirma → Acessa via navegação → View mostra todas favoritas → Click para tocar
- **Critérios de sucesso**: Persistência entre sessões, toggle instantâneo, view dedicada com mesma experiência da home

### Playlists Customizadas
- **Funcionalidade**: Criar playlists com nome/descrição, adicionar músicas, carregar toda playlist na fila
- **Propósito**: Curadoria temática para diferentes ocasiões
- **Gatilho**: View de playlists → "Nova Playlist"
- **Progressão**: Cria playlist → Navega músicas → Menu → "Adicionar à Playlist" → Escolhe playlist → View de playlists mostra contadores → "Carregar" adiciona todas à fila
- **Critérios de sucesso**: Persistência, múltiplas playlists, edição/exclusão, preview visual

### Player com Visualizador
- **Funcionalidade**: Vídeo YouTube em tela cheia com visualizador de microfone sincronizado e sistema de pontuação
- **Propósito**: Experiência imersiva de karaokê profissional
- **Gatilho**: Qualquer música é selecionada
- **Progressão**: Música selecionada → Stage carrega → Vídeo YouTube em iframe → Visualizador ativa → Barras reagem ao áudio → Pontuação aumenta → Fim da música → Modal de resultados
- **Critérios de sucesso**: Carregamento rápido, tratamento de erros YouTube (Error 153), visualizador fluido, pontuação visível

## Edge Case Handling

- **Vídeo Restrito (Error 153)**: Modal com explicação clara, botão "Abrir no YouTube", botão "Pular Música"
- **Vídeo Não Encontrado**: Erro com opção de pular
- **Sem Permissão de Microfone**: Banner explicando que visualizador precisa de acesso, botão retry, player continua funcionando
- **Favoritos Vazios**: Estado vazio com coração e instrução "Toque no coração em qualquer música"
- **Playlists Vazias**: Estado vazio com ícone musical e botão "Criar Playlist"
- **Fila Vazia**: Estado vazio com "Escolha sua primeira música!"
- **Click Múltiplos Rápidos**: Debounce para prevenir duplicatas
- **Duplicatas**: Sistema previne adicionar mesma música duas vezes

## Design Direction

Design moderno e sofisticado com fundo escuro rico, gradientes suaves e elementos que brilham sutilmente. Interface limpa mas vibrante, transmitindo profissionalismo e energia. Usuários devem se sentir em um ambiente premium com tipografia clara e transições suaves.

## Color Selection

Paleta escura moderna com violetas vibrantes e magentas elétricos.

- **Primary Color**: Violeta Vibrante `oklch(0.70 0.20 280)` - Energia e criatividade, usado em CTAs e estados ativos
- **Secondary Colors**: 
  - Cinza Escuro Azulado `oklch(0.22 0.04 260)` - Contraste e estrutura
  - Fundo Profundo `oklch(0.12 0.02 260)` - Background imersivo
- **Accent Color**: Magenta Elétrica `oklch(0.75 0.25 340)` - Badges de fila, destaque e celebrações
- **Foreground/Background Pairings**: 
  - Background: Violeta/White text - Ratio >7:1 ✓
  - Primary: White text - Ratio >4.5:1 ✓
  - Accent: White text - Ratio >4.5:1 ✓

## Font Selection

Tipografia moderna e altamente legível com Inter como família principal.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold / 32px / letter-spacing 0.15em / uppercase
  - H2 (Categories): Inter SemiBold / 22px
  - H3 (Song Titles): Inter SemiBold / 16px
  - Body: Inter Regular / 14px / line-height 1.6
  - UI Labels: Inter Medium / 13px

## Animations

Animações suaves e propositais: transições fade (300ms), hovers com scale sutil (1.02), badges pulse suave, drawer com ease-out, visualizador fluido reagindo ao áudio, botões com brilho em hover.

## Component Selection

- **Components**: 
  - `Card` - Músicas e playlists com glass effect e hover glow
  - `Button` - Primary violet, ghost secundário, icon buttons
  - `Input` - Busca com focus glow
  - `Drawer` - Fila deslizando de baixo
  - `Dialog` - Resultados e criação de playlists
  - `DropdownMenu` - Menu de músicas
  - `Badge` - Contador de fila com pulse
  - Navegação fixa inferior (Home, Favoritos, Playlists)
  
- **States**: 
  - Buttons: Default → Hover (scale + glow) → Active → Disabled
  - Cards: Default → Hover (lift + glow + play icon overlay)
  - Queue items: Hover mostra overlay play + controles
  
- **Icon Selection**: 
  - Microphone (palco), MagnifyingGlass (busca), Queue (fila), Play (reprodução e overlay), Plus (adicionar), Heart (favoritos), House (home), Playlist, ArrowUp/Down (reordenar), X (remover), Trash (limpar)
  
- **Spacing**: 
  - Card padding: p-4
  - Section gaps: gap-6
  - Button padding: px-6 py-3
  - Grid gaps: gap-6
  - Container: max-w-6xl px-4
  
- **Mobile**: 
  - Single column <768px
  - 2 columns tablet
  - 3 columns desktop
  - Fixed bottom navigation
  - Full-screen player
  - Responsive drawer
