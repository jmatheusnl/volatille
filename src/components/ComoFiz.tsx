import { useNavigate } from 'react-router-dom'
import './ComoFiz.css'

// Variáveis lidas em tempo de build pelo Vite — cada modo injeta o valor correto:
//   npm run build          → VITE_VIDEO_MODE=local   (player HTML5, arquivo hospedado no S3)
//   npm run build:gh-pages → VITE_VIDEO_MODE=youtube (iframe YouTube, sem arquivo pesado no repo)
const VIDEO_MODE = import.meta.env.VITE_VIDEO_MODE as string
const YOUTUBE_ID = import.meta.env.VITE_YOUTUBE_VIDEO_ID as string

// Considera "pendente" se o ID não existir ou ainda for o placeholder
const isYoutubePending = VIDEO_MODE === 'youtube' && (!YOUTUBE_ID || YOUTUBE_ID === 'PENDENTE')

export function ComoFiz() {
  const navigate = useNavigate()

  return (
    <div className="comofiz">
      {/* Topo / Apresentação */}
      <section className="comofiz__hero" aria-labelledby="comofiz-title">
        <div className="comofiz__container">
          <button
            type="button"
            className="comofiz__back-btn"
            onClick={() => navigate('/#inicio')}
            aria-label="Voltar para a página inicial da loja"
          >
            ← Voltar para a loja
          </button>

          <p className="ornament" aria-hidden="true">
            ♡
          </p>
          <h1 id="comofiz-title">Como Fiz Este Projeto</h1>
          <p className="comofiz__subtitle">
            Bastidores da construção da <strong>Volatille</strong> · Desafio <em>Minha Loja no Ar</em> (Bootcamp AI/R · Trilha Commerce)
          </p>
        </div>
      </section>

      <div className="comofiz__container comofiz__content">
        {/* Seção 1: Vídeo de Explicação */}
        <section className="comofiz__section" aria-labelledby="video-section-title">
          <header className="comofiz__section-header">
            {/* Badge diferente de acordo com o ambiente de deploy */}
            <div className="comofiz__badge">
              {VIDEO_MODE === 'youtube'
                ? 'Vídeo de Apresentação'
                : 'Bônus: Vídeo Auto-Hospedado (+10 pts)'}
            </div>
            <h2 id="video-section-title">1. Vídeo de Apresentação e Demonstração</h2>
            <p className="comofiz__section-lead">
              Gravação ao vivo navegando pelo código e pela loja em produção, detalhando as decisões técnicas tomadas ao longo do projeto.
            </p>
          </header>

          <div className="comofiz__video-card">
            <div className="comofiz__video-player-wrapper">
              {VIDEO_MODE === 'youtube' ? (
                /* GitHub Pages: iframe YouTube não listado — sem upload pesado de arquivo */
                isYoutubePending ? (
                  /* Vídeo ainda não publicado: mostra fundo com a imagem do hero */
                  <div
                    className="comofiz__video-pending"
                    style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero.jpg)` }}
                  >
                    <span className="comofiz__video-pending-label">Vídeo em breve</span>
                  </div>
                ) : (
                  <iframe
                    className="comofiz__video-player"
                    src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
                    title="Vídeo de Apresentação — Volatille"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                /* AWS S3 / Local: player HTML5 com arquivo servido diretamente do bucket */
                <video
                  className="comofiz__video-player"
                  controls
                  preload="metadata"
                  poster={`${import.meta.env.BASE_URL}images/hero.jpg`}
                >
                  <source
                    src={`${import.meta.env.BASE_URL}video/explicacao.mp4`}
                    type="video/mp4"
                  />
                  <source
                    src={`${import.meta.env.BASE_URL}video/como-fiz.mp4`}
                    type="video/mp4"
                  />
                  Seu navegador não suporta a tag de vídeo.
                </video>
              )}
            </div>
          </div>

          {/* Roteiro das 5 Perguntas */}
          <div className="comofiz__questions-grid">
            <div className="comofiz__question-card">
              <span className="comofiz__question-num">Pergunta 01</span>
              <h3>Estrutura & Organização</h3>
              <p>
                O que foi construído na Volatille e como os arquivos estão organizados em <code>components/</code>, <code>hooks/</code>, <code>types/</code> e <code>utils/</code> com tipagem estrita em TypeScript.
              </p>
            </div>

            <div className="comofiz__question-card">
              <span className="comofiz__question-num">Pergunta 02</span>
              <h3>Headless Commerce</h3>
              <p>
                Separação total entre front-end e catálogo. Os produtos residem em <code>products.json</code> e são consumidos em runtime via <code>fetch()</code> através do hook <code>useProducts()</code>.
              </p>
            </div>

            <div className="comofiz__question-card">
              <span className="comofiz__question-num">Pergunta 03</span>
              <h3>Arquitetura AWS & Cache</h3>
              <p>
                Jornada do clique: Navegador → CloudFront (CDN com cache nas bordas) → S3 (origem estática). O cache absorve acessos massivos sem onerar o bucket.
              </p>
            </div>

            <div className="comofiz__question-card">
              <span className="comofiz__question-num">Pergunta 04</span>
              <h3>Auditoria Lighthouse</h3>
              <p>
                Demonstração ao vivo dos scores de Performance, Acessibilidade, Melhores Práticas e SEO, com análise crítica de pontos de melhoria.
              </p>
            </div>

            <div className="comofiz__question-card comofiz__question-card--wide">
              <span className="comofiz__question-num">Pergunta 05</span>
              <h3>Oportunidades de IA & Desafios Reais</h3>
              <p>
                Onde plugar IA no e-commerce (busca semântica por estado de espírito/ambiente, recomendador olfativo personalizado) e reflexão sobre os maiores desafios enfrentados na implementação.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 2: Diagramas de Arquitetura BFF (Bônus +10) */}
        <section className="comofiz__section" aria-labelledby="bff-section-title">
          <header className="comofiz__section-header">
            <div className="comofiz__badge">Bônus: Desenho de Arquitetura (+10 pts)</div>
            <h2 id="bff-section-title">2. Expansão de Arquitetura: Padrão BFF (Backend for Frontend)</h2>
            <p className="comofiz__section-lead">
              O padrão <strong>BFF</strong> cria uma camada intermediária especializada para cada tipo de cliente (web vs. aplicativo mobile), permitindo entregar payloads adaptados, reduzir consumo de dados em conexões móveis e isolar particularidades de cada plataforma.
            </p>
          </header>

          <div className="comofiz__diagrams-grid">
            {/* Diagrama 1: Arquitetura Atual com Mobile + BFF */}
            <article className="comofiz__diagram-card">
              <div className="comofiz__diagram-card-header">
                <h3>Cenário 1: Arquitetura Atual com App Mobile + BFF</h3>
                <span className="comofiz__tag">Consumindo S3 / JSON</span>
              </div>
              <p className="comofiz__diagram-description">
                Neste cenário, a loja web continua sendo servida via <strong>CloudFront</strong> acessando o <code>products.json</code> no <strong>S3</strong>. Um aplicativo mobile hipotético se conecta a um <strong>BFF dedicado</strong>, que lê o mesmo catálogo estático no S3 e pode enriquecer, filtrar ou formatar respostas otimizadas para telas menores.
              </p>
              <div className="comofiz__diagram-image-wrapper">
                <img
                  src={`${import.meta.env.BASE_URL}images/diagrams/arquitetura-futura-bff.svg`}
                  alt="Diagrama de arquitetura da Volatille com site web via CloudFront e app mobile via BFF acessando products.json no S3"
                  className="comofiz__diagram-img"
                  loading="lazy"
                />
              </div>
            </article>

            {/* Diagrama 2: Arquitetura Futura com Backend e Banco de Dados */}
            <article className="comofiz__diagram-card">
              <div className="comofiz__diagram-card-header">
                <h3>Cenário 2: Arquitetura com Backend Compartilhado e BD</h3>
                <span className="comofiz__tag">Padrão Corporativo Completo</span>
              </div>
              <p className="comofiz__diagram-description">
                Em uma escala futura com regras de negócio dinâmicas (checkout, autenticação, controle de estoque em tempo real), tanto a Web quanto o App Mobile possuem seus respectivos <strong>BFFs (Web BFF e Mobile BFF)</strong> consumindo uma <strong>API / Backend compartilhado</strong> conectado ao <strong>Banco de Dados</strong>.
              </p>
              <div className="comofiz__diagram-image-wrapper">
                <img
                  src={`${import.meta.env.BASE_URL}images/diagrams/arquitetura-atual-bff.svg`}
                  alt="Diagrama de arquitetura avançada com Web BFF e Mobile BFF comunicando-se com Backend compartilhado e Banco de Dados"
                  className="comofiz__diagram-img"
                  loading="lazy"
                />
              </div>
            </article>
          </div>
        </section>

        {/* Chamada para Voltar */}
        <section className="comofiz__footer-cta">
          <button
            type="button"
            className="comofiz__cta-button"
            onClick={() => navigate('/#catalogo')}
          >
            Ver o Catálogo da Volatille
          </button>
        </section>
      </div>
    </div>
  )
}
