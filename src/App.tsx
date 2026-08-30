import { useEffect, useState } from 'react'
import { CartFab } from './components/CartFab'
import { CartModal } from './components/CartModal'
import { Catalog } from './components/Catalog'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { useCart } from './hooks/useCart'
import { useProducts } from './hooks/useProducts'

function App() {
  const { products, status } = useProducts()
  const cart = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Remove qualquer hash residual da URL na montagem da página para
  // evitar que o navegador force a rolagem para o gancho ao recarregar (F5).
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      )
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog
          products={products}
          status={status}
          onAddToCart={cart.addToCart}
        />
      </main>
      <Footer />

      <CartFab
        totalItems={cart.totalItems}
        onClick={() => setIsCartOpen(true)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
      />
    </>
  )
}

export default App
