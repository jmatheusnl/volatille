# AGENTS.md — Volatille

Este arquivo define o contexto operacional para agentes de IA trabalhando neste repositório. Deve ser lido antes de propor mudanças, abrir PRs, ajustar código ou sugerir decisões de arquitetura.

Este projeto é a entrega do desafio **"Minha Loja no Ar"** (Bootcamp AI/R · Trilha Commerce). O critério de avaliação não é apenas código funcionando — é a capacidade da pessoa responsável de **explicar e defender cada decisão técnica** em vídeo e em uma call individual. Por isso, este documento prioriza soluções simples e explicáveis sobre soluções "espertas" e opacas, e registra o *porquê* das decisões não-óbvias, não só o *o quê*.

## 1. Visão do projeto

Volatille é uma loja de difusores de ambiente, com o lema "Aromas que acolhem". A marca é inspirada em um negócio real de fabricação artesanal de difusores. A proposta visual e de conteúdo é transmitir acolhimento e bem-estar através de aromas, com identidade própria — nome, paleta, produtos e textos não reutilizam nenhum exemplo de aula.

A implementação usa **Vite + React + TypeScript** e segue o conceito de **headless commerce em miniatura**: o catálogo é carregado em runtime a partir de `public/products.json` via `fetch`, sem nenhum produto hardcoded em componente, HTML ou lógica de renderização.

## 2. Requisitos obrigatórios (não negociáveis)

Estes itens são avaliados diretamente e não podem ser quebrados por nenhuma refatoração:

- Catálogo em `public/products.json`, carregado via `fetch` em runtime, com no mínimo 6 produtos.
- Proibido hardcodar produto em componente React, HTML ou lógica de renderização.
- Busca ou filtro por categoria funcionando de fato na interface.
- Site funcionando como build estático (`vite build`), pronto para hospedagem em S3/CloudFront ou GitHub Pages.
- Layout responsivo, testado em mobile.
- Identidade visual e produtos exclusivos da Volatille.
- Página `/como-fiz` com o vídeo de explicação embutido.

Se qualquer sugestão de implementação conflitar com um desses pontos, a ação correta é **interromper e avisar antes de aplicar a mudança** — não assumir que a pessoa vai revisar depois.

## 3. Arquitetura atual

- **Vite + React + TypeScript**, sem backend próprio — tudo client-side, consumindo o catálogo estático.
- **Roteamento via `react-router-dom`** (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `useLocation`, `useNavigate`), com `basename` vindo de `import.meta.env.BASE_URL` para funcionar tanto na raiz (AWS) quanto em subpasta (`/volatille/` no GitHub Pages).
  - Rotas ativas: `/` (vitrine) e `/como-fiz`. Qualquer rota não mapeada redireciona para `/` via `<Navigate to="/" replace />`.
  - `ScrollToTop`: componente sem UI (retorna `null`) que rola a página para o topo a cada troca de rota, ou até uma âncora específica quando a URL tem hash (ex: `/#catalogo`), usando um pequeno `setTimeout` para garantir que o DOM de destino já esteja montado.
- **Catálogo dinâmico** via hook `useProducts()`, consumindo `products.json`.
- **Carrinho fictício** via hook `useCart()` (sem pagamento real), com UI em `CartFab` (botão flutuante) e `CartModal` (resumo). É um diferencial do desafio, não requisito mínimo — não deve justificar a introdução de um backend real.
- Página inicial: `Hero` + `Catalog` + `CartFab` + `CartModal`.
- **Sem Docker.** O app é 100% estático após o build; não há runtime em produção, então container não agrega nada aqui.
- **Dark mode fora de escopo.** Não propor nem implementar.

## 4. Vídeo de apresentação por ambiente

A página `/como-fiz` precisa exibir o vídeo de explicação (5–8 min) de forma diferente em cada ambiente de hospedagem, controlado por variáveis de ambiente lidas em tempo de build pelo Vite:

| Arquivo | `VITE_VIDEO_MODE` | Comportamento |
|---|---|---|
| `.env` (dev local) | `local` | Player HTML5, esperando arquivo em `public/video/` |
| `.env.production` (AWS) | `local` | Player HTML5, arquivo servido diretamente do S3 (bônus de vídeo auto-hospedado) |
| `.env.gh-pages` (GitHub Pages) | `youtube` | `iframe` do YouTube não listado, via `VITE_YOUTUBE_VIDEO_ID` |

Regras importantes:

- **O arquivo `.mp4` nunca deve ser commitado.** `public/video/*` está no `.gitignore` de propósito: o GitHub bloqueia arquivos acima de 100 MB, e mesmo abaixo disso não vale a pena — um vídeo de tela com código legível dificilmente comprime o suficiente para caber com folga, e o `dist/` do GitHub Pages tem teto de 1 GB. O arquivo de vídeo deve ser enviado **manualmente** para o bucket S3 (fora do fluxo do Git), nunca pelo CI/CD.
- Enquanto `VITE_YOUTUBE_VIDEO_ID` estiver vazio ou igual a `PENDENTE` (placeholder inicial, antes do vídeo existir), o componente `ComoFiz` deve mostrar um estado de "vídeo em breve" (fundo com a imagem do hero + selo), nunca tentar renderizar um `iframe` quebrado.
- Fluxo correto de publicação: gravar → publicar no YouTube como não listado → copiar o ID real → atualizar `.env.gh-pages` → commit/push → conferir que o vídeo toca em ambas as URLs antes de considerar a entrega pronta.

## 5. Estrutura do repositório

```text
/
├── public/
│   ├── products.json
│   ├── video/                  # .mp4 local — nunca commitado (.gitignore)
│   └── images/
│       ├── products/
│       └── diagrams/           # SVGs de arquitetura (bônus BFF)
├── src/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .github/workflows/          # CI/CD: deploy-aws.yml, deploy-gh-pages.yml
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── eslint.config.js
├── .env / .env.production / .env.gh-pages
├── .gitignore
├── AGENTS.md
└── README.md
```

Diretrizes de organização:

- `public/products.json` é a fonte de verdade do catálogo.
- Componentes em PascalCase, um componente por arquivo, CSS do componente ao lado (`ProductCard.tsx` + `ProductCard.css`); estilo global em `src/index.css`.
- Hooks customizados com prefixo `use`, camelCase (`useProducts.ts`, `useCart.ts`).
- Tipos e interfaces agrupados em `src/types/`.
- Sem subpastas por feature — o projeto é pequeno, priorizar clareza sobre estrutura elaborada.

## 6. Deploy e CI/CD

Dois ambientes publicados em paralelo, com propósitos diferentes: **AWS** é onde a arquitetura é montada e controlada manualmente (o que o desafio pede para explicar em detalhe), **GitHub Pages** é o plano B gerenciado, sem infraestrutura própria para configurar.

### AWS (S3 + CloudFront) — `.github/workflows/deploy-aws.yml`

- Autenticação via OIDC (`aws-actions/configure-aws-credentials`, `role-to-assume`) — sem access keys estáticas em secrets.
- `npm run build` gera `dist/`.
- `aws s3 sync dist/ s3://volatille-loja --delete --exclude "video/*"` — o `--exclude "video/*"` é **obrigatório**: como o vídeo nunca está no `dist/` gerado pelo CI (não está versionado no Git), o `--delete` apagaria o vídeo enviado manualmente ao bucket se essa exclusão não estivesse presente.
- Invalidação do CloudFront (`aws cloudfront create-invalidation --paths "/*"`) após o sync, para não servir cache antigo.
- **Configuração manual necessária no CloudFront** (fora do CI/CD, feita uma vez no console): *Custom error responses* para os códigos **403** e **404**, redirecionando para `/index.html` com **HTTP 200**. Sem isso, dar refresh em qualquer rota que não seja `/` (ex: `/como-fiz`) resulta em erro — o S3 não tem o conceito de rotas client-side, e por segurança costuma devolver 403 (não 404) para objetos inexistentes.

### GitHub Pages — `.github/workflows/deploy-gh-pages.yml`

- `npm run build:gh-pages` (usa `.env.gh-pages`, com `base` configurado para a subpasta do repositório).
- Publicação via `peaceiris/actions-gh-pages`, branch `gh-pages`.
- Como o SPA usa roteamento client-side, o GitHub Pages precisa do par de scripts `index.html` ↔ `404.html` que reescreve a rota via query string (técnica "spa-github-pages"), já que aqui não existe equivalente à configuração de error pages do CloudFront.

## 7. Segurança e arquivos ignorados

`.gitignore` cobre, além dos padrões de build/editor:

- `.env`, `.env.local`, `.env.*.local` — configuração pessoal/local não deve forçar o mesmo valor para todo mundo que clonar o repositório. Os arquivos `.env.production` e `.env.gh-pages` **são** versionados de propósito: representam configuração pública e intencional de cada ambiente de deploy (não contêm segredo algum, apenas `VITE_VIDEO_MODE` e `VITE_YOUTUBE_VIDEO_ID`).
- `public/video/*` — ver seção 4.

Não há credenciais de AWS no repositório em nenhum momento: a autenticação do CI/CD é via OIDC (role assumido, sem chaves de acesso).

## 8. Convenções de código

- Conteúdo em português (nomes de produtos, aromas, textos de UI, mensagens ao usuário) — é a voz da marca, não muda.
- Identificadores de código em inglês (`Product`, `filterByCategory`, `ProductCard.tsx`, `useCart`).
- TypeScript com tipagem explícita para o modelo de produto e estruturas de dados.
- Componentes funcionais + hooks. Sem gerenciador de estado externo (Redux, Zustand) — o escopo não justifica.
- Comentários curtos explicando *por quê*, não *o quê* — o código já mostra o que faz.
- Nenhuma dependência nova sem necessidade real comprovada; avaliar sempre se o que já está no projeto resolve antes de instalar algo.
- Evitar "soluções espertas" que obscureçam a lógica — o valor do projeto está na explicabilidade, não na sofisticação.

## 9. Comandos e validação

- `npm run dev` — ambiente local (usa `.env`, modo `local`).
- `npm run build` — build de produção para AWS (usa `.env.production`).
- `npm run build:gh-pages` — build específico para GitHub Pages (usa `.env.gh-pages`, modo `youtube`).
- `npm run preview` — serve o `dist/` localmente, para simular o ambiente hospedado (útil para testar o `fetch` do `products.json` como em produção). Ao testar o build do GitHub Pages, é necessário considerar o `base` da subpasta — acessar a URL com o prefixo correto ou rodar o preview com `--base` equivalente, senão a página carrega em branco por 404 nos assets.
- `npm run lint` — ESLint.

**Regra de ouro:** qualquer mudança relevante deve ser validada com `npm run build` **e** `npm run lint` antes de considerar a tarefa concluída — um `dev` funcionando não garante que o build de produção também funciona.

## 10. Regras de contribuição para agentes de IA

- Antes de gerar código extenso, confirmar o plano se a tarefa for ambígua.
- Priorizar sempre, nesta ordem: (1) requisitos obrigatórios da seção 2 funcionando ponta a ponta, (2) os dois deploys funcionando, (3) diferenciais (carrinho, CI/CD, diagramas).
- Não abrir escopo para backend real, autenticação, banco de dados, Docker ou dark mode sem que a pessoa peça explicitamente.
- Preservar a lógica de catálogo headless e o comportamento de build estático em qualquer refatoração.
- Ao mexer no componente de vídeo (`ComoFiz`) ou nos workflows de deploy, revisar a seção 4 e 6 deste arquivo antes — são pontos com armadilhas já mapeadas (vídeo apagado pelo `--delete`, iframe quebrado com ID pendente, 404 em reload).
- Se uma decisão registrada aqui não bater mais com o estado real do código, avisar e sugerir atualizar este documento — não seguir a informação desatualizada.

## 11. Commits

Quem faz os commits é a pessoa dona do projeto — o agente não deve rodar `git commit` nem `git push` sozinho.

Ao sugerir mensagens de commit, usar **Conventional Commits**:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `style:` mudança visual/CSS sem alterar lógica
- `refactor:` reorganização sem mudar comportamento
- `docs:` documentação (README, AGENTS.md)
- `chore:` configuração, dependências

Preferir commits pequenos e atômicos — ajuda a explicar a evolução do projeto no vídeo (pergunta 1: "como o código está organizado").

## 12. Objetivo final

O critério de avaliação deste desafio não mede quem escreve o melhor código — mede quem entende e explica o que colocou no ar. Qualquer agente trabalhando neste repositório deve otimizar para simplicidade, coerência e explicabilidade, mantendo o foco na entrega e nos requisitos da seção 2, sem introduzir complexidade que a pessoa dona do projeto não conseguiria defender em uma call técnica de 10 minutos.