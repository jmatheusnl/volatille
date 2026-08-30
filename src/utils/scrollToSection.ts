/**
 * Rola suavemente até uma seção da página identificada por seu ID
 * e remove o hash da URL (usando history.replaceState) para evitar
 * que futuros recarregamentos da página (F5) fiquem presos ao gancho.
 */
export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  } else if (sectionId === 'inicio') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Limpa o hash da barra de endereço para não prender o scroll
  if (window.location.hash) {
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    )
  }
}
