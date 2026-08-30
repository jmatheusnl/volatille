import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartFab } from './components/CartFab'
import { CartModal } from './components/CartModal'
import { Catalog } from './components/Catalog'
import { ComoFiz } from './components/ComoFiz'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ScrollToTop } from './components/ScrollToTop'
import { useCart } from './hooks/useCart'
import { useProducts } from './hooks/useProducts'

function StoreFront() {
  const { products, status } = useProducts()
  const cart = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <Hero />
      <Catalog
        products={products}
        status={status}
        onAddToCart={cart.addToCart}
      />

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

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<StoreFront />} />
          <Route path="/como-fiz" element={<ComoFiz />} />
          {/* Redirecionamento fallback para qualquer rota não mapeada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
