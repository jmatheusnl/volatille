import { useMemo, useState } from 'react'
import type { Product } from '../types/Product'
import type { CatalogStatus } from '../hooks/useProducts'
import { CategoryFilter } from './CategoryFilter'
import { ProductCard } from './ProductCard'
import './Catalog.css'

type CatalogProps = {
  products: Product[]
  status: CatalogStatus
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

export function Catalog({ products, status }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => uniqueCategories(products), [products])

  // A ordem do JSON já coloca 30ml e 100ml do mesmo aroma em sequência;
  // o filtro só esconde itens, sem reordenar, para os pares permanecerem lado a lado.
  const visibleProducts = useMemo(() => {
    if (selectedCategory === null) {
      return products
    }
    return products.filter((product) =>
      product.categories.includes(selectedCategory),
    )
  }, [products, selectedCategory])

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
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {visibleProducts.length === 0 ? (
            <p className="catalog__status">
              Nenhum difusor encontrado nesta categoria.
            </p>
          ) : (
            <ul className="catalog__grid">
              {visibleProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
