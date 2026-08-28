# AGENTS.md — Volatille (Minha Loja no Ar)

Este arquivo dá contexto pra qualquer agente de IA (Cursor, Copilot, etc.) trabalhando neste repositório. Leia isto antes de sugerir ou aplicar qualquer mudança.

## 1. O que é este projeto

Uma mini-loja de difusores de aroma chamada **Volatille**, com o lema **"Aromas que acolhem"**. É a entrega de um desafio de bootcamp (AI/R · Trilha Commerce) cujo critério principal de nota **não é a qualidade do código em si, mas a capacidade da pessoa dona do projeto de explicar cada decisão em um vídeo de 5-8 min**. Ou seja: prefira soluções simples e explicáveis a soluções "espertas" e opacas. Comente o porquê das decisões não-óbvias.

A marca é inspirada no negócio real do namorado da pessoa dona do projeto, que fabrica os difusores.

## 2. Requisitos obrigatórios (não negociáveis)

Estes itens são avaliados diretamente e **não podem ser quebrados por nenhuma refatoração**:

- Catálogo de produtos vive em `products.json`, **separado do front**. Mínimo 6 produtos.
- **Proibido hardcodar produto no HTML/JSX.** A vitrine é montada 100% a partir do fetch do JSON (conceito de *headless commerce*).
- Busca **ou** filtro por categoria, funcionando de fato na UI.
- Site precisa funcionar como build estático (gerado via `vite build`), pronto pra ser hospedado em S3/CloudFront ou GitHub Pages.
- Layout responsivo (testado em mobile).
- Identidade visual e produtos são da Volatille — não reaproveitar exemplos genéricos de aula.

Se qualquer sugestão de código violar um desses pontos, **não aplique — avise antes**.

## 3. Stack técnica e decisões já tomadas

- **Vite + React + TypeScript** (scaffold já criado via `npm create vite@latest`).
- **Sem Docker.** Decisão consciente: o app é 100% estático depois do build, não existe runtime em produção, então container não agrega nada aqui. Não sugerir Dockerfile/docker-compose.
- **Hospedagem principal:** AWS S3 + CloudFront (primeira vez da pessoa usando AWS — pode precisar de ajuda passo a passo, sem assumir conhecimento prévio).
- **Plano B de hospedagem:** GitHub Pages, publicado em paralelo como rede de segurança.
- **CI/CD (se sobrar tempo):** GitHub Actions rodando `npm run build` e sincronizando `dist/` com o bucket S3 + invalidação do CloudFront. Prioridade alta entre os "diferenciais", mas não é obrigatório.
- **Carrinho e checkout são fictícios** (sem pagamento real) — usar `localStorage`/state do React, são "diferenciais", não requisito mínimo. Implementar só depois do essencial estar 100% funcionando.
- **Dark mode: fora de escopo**, não sugerir nem implementar.
- Sem necessidade de backend/API própria — tudo client-side consumindo o JSON estático.

## 4. Comandos do projeto

- `npm run dev` — sobe o servidor local (Vite).
- `npm run build` — gera o build de produção em `dist/`. **Rode isso antes de considerar qualquer tarefa "concluída"** — se o build quebrar (erro de TS, import errado), a tarefa não está pronta, mesmo que o `dev` pareça funcionar.
- `npm run preview` — serve o conteúdo de `dist/` localmente, útil pra simular o ambiente hospedado (ex: testar se o fetch do `products.json` funciona igual ao de produção).
- `npm run lint` — roda o ESLint (já configurado no scaffold do Vite). Use antes de fechar qualquer mudança maior.

## 5. Estrutura de pastas esperada

```
/
├── public/
│   └── products.json        # catálogo, carregado via fetch em runtime
├── src/
│   ├── components/          # Vitrine, ProductCard, SearchBar/CategoryFilter, etc.
│   ├── types/                # tipos TS do produto/catálogo
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── AGENTS.md
```

`products.json` deve ficar em `public/` (ou equivalente servido estaticamente), nunca importado direto como módulo TS — o fetch em runtime é o ponto central do requisito de "headless commerce" e precisa continuar funcionando depois do build e hospedado.

**Nomenclatura de arquivos (padrão React + TS):**
- Componentes: PascalCase, um componente por arquivo, nome do arquivo = nome do componente (ex: `ProductCard.tsx`, `CategoryFilter.tsx`).
- Hooks customizados (se houver): camelCase com prefixo `use` (ex: `useProducts.ts`).
- Tipos/interfaces: PascalCase, agrupados em `types/` (ex: `types/Product.ts`).
- Pastas: lowercase, sem espaço (`components/`, `types/`). Projeto é pequeno, não precisa de subpastas por feature.
- CSS do componente fica ao lado dele (`ProductCard.tsx` + `ProductCard.css`); estilo global fica em `src/index.css`.

## 6. Convenções de código

- TypeScript com tipagem explícita para o modelo de produto (`Product`, `Category`, etc.) — isso facilita a pessoa explicar o catálogo no vídeo.
- Componentes funcionais + hooks. Nada de state manager externo (Redux, Zustand) — o escopo não justifica.
- Sem dependências novas sem necessidade real. Antes de instalar um pacote, avalie se dá pra resolver com o que já está no projeto.
- **Identificadores de código em inglês:** variáveis, funções, tipos, props, nomes de arquivo e componente (ex: `Product`, `filterByCategory`, `ProductCard.tsx`). Evita mistura com termos de bibliotecas/React, que já são em inglês.
- **Conteúdo em português:** nomes de produtos, aromas, textos de UI, mensagens pro usuário — isso é a voz da marca Volatille, não muda.
- Comentários no código podem ser em português, já que o objetivo principal deles aqui é a pessoa conseguir reler e explicar no vídeo.
- Comentários curtos explicando *por que*, não *o que* (o código já mostra o que faz).

## 7. Commits

Quem faz os commits é a pessoa dona do projeto, não o agente — não rode `git commit` nem `git push` sozinho.

Ao sugerir uma mensagem de commit (quando pedido), use o padrão **Conventional Commits**:
- `feat:` nova funcionalidade (ex: `feat: adiciona filtro por categoria`)
- `fix:` correção de bug
- `style:` mudança visual/CSS sem alterar lógica
- `refactor:` reorganização de código sem mudar comportamento
- `docs:` mudanças em documentação (README, AGENTS.md)
- `chore:` configuração, dependências, scaffold

Prefira commits pequenos e atômicos (uma mudança coesa por commit) em vez de um commit gigante no fim do dia — isso ajuda a pessoa a mostrar e explicar a evolução do projeto no vídeo (pergunta 1: "como o código está organizado").

## 8. Dados do catálogo

Já existem definidos: nomes de aromas, tamanhos e preços dos difusores. **Fotos reais ainda não existem** — a pessoa vai usar imagens geradas por IA ou banco de imagens genérico como placeholder. Ao montar `products.json`, deixe o campo de imagem fácil de trocar depois (ex: `image: string` com caminho relativo simples), sem lógica acoplada ao nome do arquivo.

## 9. Como me ajudar melhor

- Antes de gerar código extenso, confirme rapidamente o plano se a tarefa for ambígua.
- Priorize sempre: (1) requisitos obrigatórios da seção 2 funcionando end-to-end, (2) deploy funcionando, (3) diferenciais.
- Depois de qualquer mudança, rode `npm run build` e `npm run lint` pra confirmar que nada quebrou antes de dizer que terminou.
- Ao final de mudanças relevantes, resuma em 1-2 linhas o que foi feito e por quê — a pessoa precisa conseguir repetir essa explicação no vídeo de entrega.
- Se propuser algo fora do escopo definido aqui (nova lib, Docker, dark mode, backend), pare e pergunte antes.
- Se em algum momento perceber que uma decisão registrada aqui não bate mais com o que está sendo pedido ou com o código atual, avise e sugira atualizar este arquivo — não espere ser perguntado.