import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../utils/scrollToSection'

/**
 * Componente utilitário que gerencia a rolagem da página a cada mudança de rota.
 * - Rola para o topo ao acessar uma nova página (ex: /como-fiz).
 * - Rola suavemente até a âncora desejada se houver hash na URL (ex: /#catalogo).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const sectionId = hash.replace('#', '')
      // Pequeno timeout para garantir que o DOM da página alvo esteja montado
      const timer = setTimeout(() => {
        scrollToSection(sectionId)
      }, 50)
      return () => clearTimeout(timer)
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])

  return null
}
