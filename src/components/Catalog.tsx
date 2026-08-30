import { useMemo, useState } from 'react'
import type { Product } from '../types/Product'
import type { CatalogStatus } from '../hooks/useProducts'
import { CategoryFilter } from './CategoryFilter'
import { ProductCard } from './ProductCard'
import { SearchInput } from './SearchInput'
import { SizeFilter } from './SizeFilter'
import './Catalog.css'

type CatalogProps = {
  products: Product[]
  status: CatalogStatus
  onAddToCart?: (product: Product) => void
}

function uniqueCategories(products: Product[]): string[] {
  const names = new Set<string>()
  for (const product of products) {
    for (const category of product.categories) {
      names.add(category)
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

function uniqueSizes(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.size))]
}

export function Catalog({ products, status, onAddToCart }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const categories = useMemo(() => uniqueCategories(products), [products])
  const sizeOptions = useMemo(() => uniqueSizes(products), [products])
  const normalizedSearch = searchTerm.trim().toLowerCase()

  // A ordem do JSON já coloca 30ml e 100ml do mesmo aroma em sequência;
  // o filtro só esconde itens, sem reordenar, para os pares permanecerem lado a lado.
  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === null || product.categories.includes(selectedCategory)
      const matchesSize = selectedSize === null || product.size === selectedSize
      const matchesSearch =
        normalizedSearch === '' || product.scent.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSize && matchesSearch
    })
  }, [products, selectedCategory, selectedSize, normalizedSearch])

  return (
    <section id="catalogo" className="catalog" aria-labelledby="catalog-title">
      <header className="catalog__intro">
        <p className="ornament" aria-hidden="true">
          ♡
        </p>
        <h2 id="catalog-title">Catálogo</h2>
        <p className="catalog__lead">
          Cada aroma em dois tamanhos. Filtre pelas famílias olfativas para
          encontrar o que combina com a sua casa.
        </p>
      </header>

      {status === 'loading' && (
        <p className="catalog__status" role="status">
          Carregando o catálogo…
        </p>
      )}

      {status === 'error' && (
        <p className="catalog__status" role="alert">
          Não foi possível carregar o catálogo. Tente novamente em instantes.
        </p>
      )}

      {status === 'ready' && (
        <>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />

          <div className="catalog__filter-group">
            <span className="catalog__group-label">Categoria</span>
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <div className="catalog__filter-group">
            <span className="catalog__group-label">Tamanho</span>
            <SizeFilter
              sizes={sizeOptions}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>

          {visibleProducts.length === 0 ? (
            <p className="catalog__status">
              Nenhum difusor encontrado com os filtros atuais.
            </p>
          ) : (
            <ul className="catalog__grid">
              {visibleProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
