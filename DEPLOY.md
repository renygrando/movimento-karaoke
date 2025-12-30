# Guia de Deploy no Easypanel

Este guia explica como fazer o deploy do Movimento Karaoke no Easypanel.

## Pré-requisitos

- Conta no Easypanel
- Acesso ao seu servidor/projeto no Easypanel
- Repositório Git (GitHub, GitLab, etc.) com o código

## Método 1: Deploy via Git (Recomendado)

### 1. Configure o Repositório Git

Se ainda não tiver, inicialize o repositório e faça o push para o GitHub/GitLab:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <seu-repositorio>
git push -u origin main
```

### 2. No Easypanel

1. **Crie um novo App**
   - Acesse seu projeto no Easypanel
   - Clique em "Create" → "App"
   - Dê um nome: `movimento-karaoke`

2. **Configure o Source**
   - Source Type: **Git**
   - Repository: Cole a URL do seu repositório
   - Branch: `main` (ou sua branch principal)
   - Build Method: **Dockerfile**

3. **Configurações de Build**
   - Build Context Path: `/`
   - Dockerfile Path: `./Dockerfile`

4. **Configurações de Deploy**
   - Port: `80`
   - Protocolo: HTTP

5. **Domínio**
   - Configure um domínio customizado ou use o domínio fornecido pelo Easypanel
   - Exemplo: `karaoke.seudominio.com`

6. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build e deploy completar

## Método 2: Deploy via Docker Image

### 1. Build Local

```bash
# Build da imagem
docker build -t movimento-karaoke:latest .

# Test local (opcional)
docker run -p 8080:80 movimento-karaoke:latest
```

### 2. Push para Registry

```bash
# Login no Docker Hub (ou outro registry)
docker login

# Tag da imagem
docker tag movimento-karaoke:latest seu-usuario/movimento-karaoke:latest

# Push
docker push seu-usuario/movimento-karaoke:latest
```

### 3. No Easypanel

1. Crie um novo App
2. Source Type: **Docker Image**
3. Image: `seu-usuario/movimento-karaoke:latest`
4. Port: `80`
5. Deploy

## Variáveis de Ambiente (Opcional)

Se seu projeto usar variáveis de ambiente (como API keys do YouTube), configure-as no Easypanel:

1. Na página do App, vá para "Environment"
2. Adicione as variáveis necessárias:
   ```
   VITE_YOUTUBE_API_KEY=sua_chave_aqui
   ```

**Nota**: Para variáveis que começam com `VITE_`, você precisará rebuildar a imagem após adicionar, pois são usadas em build time.

## Verificação

Após o deploy:

1. ✅ Acesse o domínio configurado
2. ✅ Verifique se o app carrega corretamente
3. ✅ Teste a busca de músicas
4. ✅ Teste a reprodução de vídeos
5. ✅ Verifique se o PWA pode ser instalado

## Atualizações

### Deploy Automático (Git)
- Cada push para a branch configurada acionará um novo deploy automaticamente

### Deploy Manual
- No Easypanel, vá até seu app e clique em "Rebuild"

## Troubleshooting

### App não inicia
- Verifique os logs no Easypanel
- Confirme se a porta 80 está correta
- Verifique se o build completou com sucesso

### Assets não carregam
- Verifique as configurações do nginx
- Confirme se o Vite build gerou os arquivos corretamente

### Service Worker não funciona
- Certifique-se de usar HTTPS (obrigatório para PWA)
- Verifique se o arquivo `sw.js` está acessível em `/sw.js`

### YouTube não funciona
- Verifique se as variáveis de ambiente estão corretas
- Confirme se a API do YouTube está configurada corretamente

## Recursos Adicionais

- [Documentação Easypanel](https://easypanel.io/docs)
- [Documentação Vite](https://vitejs.dev)
- [Documentação PWA](https://web.dev/progressive-web-apps/)

## Suporte

Para problemas específicos do deploy, entre em contato com o suporte do Easypanel ou abra uma issue no repositório do projeto.
