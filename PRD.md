# Planning Guide

Uma aplicação web de karaokê focada em busca e reprodução de vídeos de karaokê do YouTube. Interface minimalista onde o player aparece sempre que uma música é selecionada, permitindo busca ilimitada e experiência fluida.

**Experience Qualities**:
1. **Simplificado** - Interface limpa focada em busca, resultados e player integrado
2. **Imersivo** - Player sempre visível abaixo da busca com visualizador de microfone e pontuação
3. **Direto** - Busca, clica e canta - sem navegação complexa ou menus extras

**Complexity Level**: Micro Tool (single-purpose application)
Aplicação single-page focada exclusivamente em busca e reprodução de karaokê do YouTube. Player permanece sempre visível na página principal após seleção.

## Essential Features

### Busca de Músicas do YouTube
- **Funcionalidade**: Barra de busca que pesquisa vídeos de karaokê no YouTube
- **Propósito**: Acesso ilimitado a milhões de músicas de karaokê disponíveis no YouTube
- **Gatilho**: Usuário digita nome da música ou artista e pressiona Enter ou clica em "Buscar"
- **Progressão**: Digita busca → Pressiona Enter/Click → API consulta YouTube → Resultados aparecem em grid → Clica em música → Player aparece abaixo da busca
- **Critérios de sucesso**: Busca rápida (<2s), resultados relevantes, thumbnails claras, feedback visual durante carregamento

### Player Integrado Sempre Visível
- **Funcionalidade**: Player de vídeo YouTube aparece na página principal acima dos resultados quando uma música é selecionada
- **Propósito**: Experiência contínua - cantar enquanto navega e escolhe próximas músicas
- **Gatilho**: Clique em qualquer card de música nos resultados
- **Progressão**: Clique em música → Player aparece no topo da página → Verificação de compatibilidade → Vídeo carrega → Reprodução inicia → Pontuação começa → Continua navegando resultados abaixo
- **Critérios de sucesso**: Player sempre visível, não muda de página, resultados permanecem acessíveis, fácil trocar de música

### Sistema de Pontuação com Combo
- **Funcionalidade**: Score aumenta automaticamente durante reprodução, combo multiplica pontos
- **Propósito**: Gamificação e engajamento durante a performance
- **Gatilho**: Player inicia reprodução
- **Progressão**: Música inicia → Score começa a aumentar (50-150 pontos/2.5s) → Combo aumenta a cada 3s → Multiplica pontuação → Display em tempo real
- **Critérios de sucesso**: Números visíveis, animações suaves, combo visual destaca momentos especiais

### Visualizador de Microfone
- **Funcionalidade**: Barras animadas que reagem ao áudio do microfone do usuário
- **Propósito**: Feedback visual da performance, sensação de karaokê profissional
- **Gatilho**: Player ativo
- **Progressão**: Player inicia → Solicita permissão de microfone → Visualizador ativa → Barras reagem ao volume/frequência → Exibe em tempo real
- **Critérios de sucesso**: Animação fluida, sincronização com áudio, funciona mesmo sem permissão (com mock)

## Edge Case Handling

- **Vídeo Restrito (Error 153)**: Modal com explicação clara, botão "Abrir no YouTube", botão "Fechar Player"
- **Vídeo Não Encontrado**: Erro com opção de fechar player e selecionar outra música
- **Sem Permissão de Microfone**: Visualizador continua com animação mock, sem bloquear experiência
- **Busca Vazia**: Mensagem amigável incentivando usuário a digitar nome de música ou artista
- **Sem Resultados**: Mensagem clara sugerindo tentar palavras-chave diferentes
- **Click Múltiplos Rápidos**: Debounce para prevenir múltiplas buscas simultâneas
- **Primeira Visita**: Mensagem de boas-vindas explicando como usar o sistema
- **Erro de Rede**: Mensagem clara de erro com opção de tentar novamente

## Design Direction

Design moderno e minimalista com fundo escuro rico e elementos luminosos que guiam o olhar. Interface limpa focada em busca e player, sem distrações. Violetas vibrantes e magentas criam energia, enquanto gradientes suaves mantêm sofisticação. Tipografia clara e espaçamento generoso transmitem profissionalismo.

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

Animações suaves e propositais: transições fade (300ms), hovers com scale sutil (1.02), player com verificação de compatibilidade animada, visualizador fluido reagindo ao áudio, score com efeito glow, combo com entrada rotacional dramática.

## Component Selection

- **Components**: 
  - `Card` - Resultados de busca com thumbnails e hover effects
  - `Button` - Primary violet para busca, ghost secundário para ações
  - `Input` - Busca com ícone e focus glow
  - `Dialog` - Modal de resultados ao fim da música
  - Glass cards para informações de música e visualizador
  - Navegação simplificada - apenas título e busca no topo
  
- **States**: 
  - Buttons: Default → Hover (scale + glow) → Active → Disabled
  - Cards: Default → Hover (lift + glow + play icon overlay)
  - Player: Loading → Ready → Error states com visual claro
  
- **Icon Selection**: 
  - MagnifyingGlass (busca), Play (cards), Lightning (combo), Warning (erros), YoutubeLogo (fallback), CircleNotch (loading)
  
- **Spacing**: 
  - Card padding: p-4
  - Section gaps: gap-8
  - Button padding: px-6 py-3
  - Grid gaps: gap-6
  - Container: max-w-6xl px-4
  
- **Mobile**: 
  - Single column <640px
  - 2 columns tablet
  - 3 columns desktop
  - Player aspect-video responsivo
  - Busca stack em mobile
