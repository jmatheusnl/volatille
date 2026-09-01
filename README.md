# Volatille 🌷

**Aromas que acolhem.**

Loja de difusores de ambiente, construída como entrega do desafio **"Minha Loja no Ar"** (Bootcamp AI/R · Trilha Commerce). A marca é inspirada em um negócio real de fabricação artesanal de difusores, com identidade, produtos e textos próprios.

## 🔗 Loja no ar

| Ambiente | URL |
|---|---|
| **AWS (S3 + CloudFront)** | https://dvnncby8l3tya.cloudfront.net |
| **GitHub Pages** (plano B) | https://jmatheusnl.github.io/volatille/ |
| **Repositório** | https://github.com/jmatheusnl/volatille |

A página `/como-fiz` (ex: [dvnncby8l3tya.cloudfront.net/como-fiz](https://dvnncby8l3tya.cloudfront.net/como-fiz)) traz o vídeo de explicação do projeto.

## 🎥 Vídeo

📺 [Assista no YouTube](https://youtu.be/0RqYPBJYnq8) (não listado)

Também embutido na página [`/como-fiz`](https://dvnncby8l3tya.cloudfront.net/como-fiz).

O vídeo (5–8 min) navega ao vivo pelo código e pela loja publicada, respondendo:
1. O que foi construído e como o código está organizado
2. Por que o catálogo é separado do front (`products.json` + `fetch`) e o que isso tem a ver com *headless commerce*
3. Como cada peça mapearia para a AWS — o caminho navegador → CDN → origem
4. Auditoria do Lighthouse rodada ao vivo, com leitura crítica dos scores
5. Onde entraria IA nessa loja e o que foi mais difícil na construção

## ✅ Requisitos do desafio

- [x] Tema e identidade próprios (Volatille, paleta e produtos exclusivos)
- [x] Catálogo em `public/products.json` (8 itens), carregado via `fetch` — nenhum produto hardcoded
- [x] Busca/filtro por categoria funcionando na vitrine
- [x] Site estático (Vite + React + TypeScript)
- [x] Hospedado publicamente e de graça (AWS + GitHub Pages em paralelo)
- [x] Página `/como-fiz` com vídeo embutido
- [x] Diferenciais: carrinho fictício, CI/CD via GitHub Actions

## 🛠️ Stack

- **Vite + React + TypeScript** — 100% client-side, sem backend próprio
- **react-router-dom** — roteamento client-side (`/` e `/como-fiz`), com `basename` dinâmico para funcionar tanto na raiz (AWS) quanto em subpasta (`/volatille/` no GitHub Pages)
- **CSS puro**, sem framework de UI

## 🧩 Arquitetura — headless commerce em miniatura

O catálogo vive em `public/products.json`, é buscado em runtime via `fetch` pelo hook `useProducts()` e usado para montar a vitrine dinamicamente. A UI (React) não sabe nada sobre os produtos além do schema — é o mesmo princípio de headless commerce usado em plataformas reais, só que em escala mínima: **quem monta a vitrine é o JavaScript, lendo o catálogo**, não o HTML.

```
Navegador → fetch('/products.json') → useProducts() → Catalog → ProductCard[]
```

### Dois ambientes de deploy, propósitos diferentes

| | AWS (S3 + CloudFront) | GitHub Pages |
|---|---|---|
| Papel | Arquitetura montada e controlada manualmente | Plano B gerenciado, sem infra própria |
| Deploy | `deploy-aws.yml` — OIDC, `aws s3 sync` + invalidação do CloudFront | `deploy-gh-pages.yml` — `peaceiris/actions-gh-pages`, branch `gh-pages` |
| Vídeo | HTML5 player, servido diretamente do S3 (bônus auto-hospedado) | `iframe` do YouTube não listado |
| Rotas no refresh | *Custom error response* do CloudFront (403/404 → `/index.html`, HTTP 200) | Técnica `spa-github-pages` (`index.html` ↔ `404.html`) |

### CI/CD (GitHub Actions)

- Autenticação na AWS via **OIDC** — sem access keys estáticas em secrets
- `aws s3 sync dist/ s3://volatille-loja --delete --exclude "video/*"` — o vídeo é enviado manualmente ao bucket, fora do fluxo do Git (arquivos de tela com código legível não cabem no limite de 100 MB do GitHub)
- Invalidação do CloudFront após cada sync, para não servir cache antigo

## 📁 Estrutura do repositório

```text
/
├── public/
│   ├── products.json        # fonte de verdade do catálogo
│   ├── video/                # .mp4 local — nunca commitado
│   └── images/
│       ├── products/
│       └── diagrams/
├── src/
│   ├── components/
│   ├── hooks/                # useProducts, useCart
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .github/workflows/        # deploy-aws.yml, deploy-gh-pages.yml
├── .env / .env.production / .env.gh-pages
└── AGENTS.md
```

## 💻 Rodando localmente

```bash
npm install
npm run dev              # ambiente local, modo de vídeo "local"
```

Scripts disponíveis:

| Comando | Uso |
|---|---|
| `npm run dev` | Ambiente local (`.env`) |
| `npm run build` | Build de produção para AWS (`.env.production`) |
| `npm run build:gh-pages` | Build para GitHub Pages (`.env.gh-pages`, `base` de subpasta) |
| `npm run preview` | Serve o `dist/` localmente, simulando produção (útil pra testar o `fetch` do catálogo) |
| `npm run lint` | ESLint |

## 🔦 Lighthouse

**Primeira auditoria (30/08/2026):** identificou 6 pontos de melhoria — contraste, CLS, peso de imagem, cache, JS não utilizado e `robots.txt`/`llms.txt` reprovando só na AWS.

**Segunda auditoria, pós-correções:**

| Categoria | GitHub Pages | AWS (CloudFront) |
|---|---|---|
| Desempenho | 99 *(+5)* | 96 *(+3)* |
| Acessibilidade | 100 *(+4)* | 100 *(+4)* |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 *(+8)* |
| Navegação agêntica | 100 *(+6)* | 97 *(+36)* |

### O que foi corrigido

- **`public/robots.txt` e `public/llms.txt`** — resolveu de vez a reprovação por SEO e Navegação agêntica na AWS. O *custom error response* do CloudFront (necessário para as rotas client-side funcionarem no refresh) devolvia o HTML da SPA com status 200 para esses caminhos inexistentes; criar os arquivos reais elimina o fallback ali. Na AWS, `robots-txt` e `llms-txt` agora pontuam 100%.
- **Contraste do preço** (dourado sobre fundo claro) — corrigido nos dois ambientes, `color-contrast` agora em 100%.
- **`width`/`height` nas imagens de produto** — o Cumulative Layout Shift caiu de 0,109 → **0,003** no GitHub Pages e de 0,126 → **0,097** na AWS. Ainda sobrou um elemento sem dimensão fixa (o logo do hero), o que explica a AWS não chegar a 100% em Navegação agêntica — CLS entra como um dos critérios dessa categoria.
- **`Cache-Control` no S3** — a AWS foi de "nenhum cache configurado" para o audit de cache com **score máximo**; curiosamente agora é o GitHub Pages (cache padrão de 10 min da plataforma) que aparece com oportunidade de economia, situação invertida em relação à primeira rodada.

### O que segue como próximo passo (decisão consciente, não escondida)

- **Compressão/redimensionamento das imagens de produto** — o peso total da página ainda fica em ~14 MB nos dois ambientes (mesmas imagens, geradas em resolução muito acima do necessário). O audit de peso de página e o de entrega de imagens seguem com oportunidade de economia (~13,5 KiB adicionais de otimização de formato/tamanho por página). Requer um pipeline de reprocessamento das 8 imagens, não um ajuste de uma linha.
- **JavaScript não utilizado** — ainda ~24–28 KiB estimados de economia possível nos dois ambientes; fica como próxima investigação de bundle.
- **Logo do hero sem `width`/`height`** — único elemento restante sem dimensão fixa; pequeno ajuste que fecharia o CLS da AWS.

## 🚀 Diferenciais implementados

- Carrinho fictício (`useCart`, `CartFab`, `CartModal`) — sem pagamento real
- CI/CD completo nos dois ambientes de deploy

## 👤 Autor

**José Matheus Nogueira Luciano**
[GitHub](https://github.com/jmatheusnl) · [LinkedIn](https://www.linkedin.com/in/jmatheusnl/)

---

*Desafio Bootcamp AI/R · Trilha Commerce · agosto/2026*
