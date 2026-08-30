import type React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { scrollToSection } from '../utils/scrollToSection'
import './Header.css'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const isComoFiz = location.pathname.includes('/como-fiz')

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (location.pathname === '/') {
      scrollToSection('inicio')
    } else {
      navigate('/#inicio')
    }
  }

  const handleCatalogClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (location.pathname === '/') {
      scrollToSection('catalogo')
    } else {
      navigate('/#catalogo')
    }
  }

  return (
    <header className="site-header">
      <Link
        className="site-header__brand"
        to="/#inicio"
        onClick={handleBrandClick}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/logo-simbolo.png`}
          alt=""
        />
        <span className="site-header__name">Volatille</span>
      </Link>
      <nav className="site-header__nav" aria-label="Principal">
        <a
          href="/#catalogo"
          className="site-header__nav-link"
          onClick={handleCatalogClick}
        >
          Catálogo
        </a>
        <Link
          to="/como-fiz"
          className={`site-header__nav-link ${isComoFiz ? 'site-header__nav-link--active' : ''}`}
        >
          Como fiz
        </Link>
      </nav>
    </header>
  )
}
