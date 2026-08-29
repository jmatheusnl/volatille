import { Catalog } from './components/Catalog'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { useProducts } from './hooks/useProducts'

function App() {
  const { products, status } = useProducts()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog products={products} status={status} />
      </main>
      <Footer />
    </>
  )
}

export default App
