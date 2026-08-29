import './Hero.css'

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__photo">
        <img
          src={`${import.meta.env.BASE_URL}images/hero.jpg`}
          alt="Difusor Volatille Chá Branco sobre tecido claro, com lavanda e cristais"
        />
      </div>
      <div className="hero__copy">
        <img
          className="hero__logo"
          src={`${import.meta.env.BASE_URL}images/logo.png`}
          alt="Volatille"
        />
        <p className="ornament" aria-hidden="true">
          ♡
        </p>
        <h1 id="hero-title">Aromas que acolhem</h1>
        <p className="hero__text">
          Difusores de ambiente pensados para o dia a dia: fragrâncias suaves,
          florais, cítricas e herbais, em dois tamanhos para cada aroma.
        </p>
        <a className="hero__cta" href="#catalogo">
          Ver catálogo
        </a>
      </div>
    </section>
  )
}
