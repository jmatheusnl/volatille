import type React from 'react'
import { scrollToSection } from '../utils/scrollToSection'
import './Header.css'

export function Header() {
  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    event.preventDefault()
    scrollToSection(sectionId)
  }

  return (
    <header className="site-header">
      <a
        className="site-header__brand"
        href="#inicio"
        onClick={(e) => handleNavClick(e, 'inicio')}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/logo-simbolo.png`}
          alt=""
        />
        <span className="site-header__name">Volatille</span>
      </a>
      <nav className="site-header__nav" aria-label="Principal">
        <a href="#catalogo" onClick={(e) => handleNavClick(e, 'catalogo')}>
          Catálogo
        </a>
        <a href="#como-fiz" onClick={(e) => handleNavClick(e, 'como-fiz')}>
          Como fiz
        </a>
      </nav>
    </header>
  )
}
