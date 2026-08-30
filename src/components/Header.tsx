import './Header.css'

export function Header() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="#inicio">
        <img
          src={`${import.meta.env.BASE_URL}images/logo-simbolo.png`}
          alt=""
        />
        <span className="site-header__name">Volatille</span>
      </a>
      <nav className="site-header__nav" aria-label="Principal">
        <a href="#catalogo">Catálogo</a>
        <a href="#como-fiz">Como fiz</a>
      </nav>
    </header>
  )
}
