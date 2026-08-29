import { useEffect, useState } from 'react'
import type { Product } from '../types/Product'

export type CatalogStatus = 'loading' | 'ready' | 'error'

type UseProductsResult = {
  products: Product[]
  status: CatalogStatus
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'scent' in value &&
    typeof value.scent === 'string' &&
    'description' in value &&
    typeof value.description === 'string' &&
    'size' in value &&
    typeof value.size === 'string' &&
    'price' in value &&
    typeof value.price === 'number' &&
    'categories' in value &&
    Array.isArray(value.categories) &&
    'image' in value &&
    typeof value.image === 'string'
  )
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<CatalogStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()

    // Fetch em runtime (não import) para o catálogo continuar
    // funcionando depois do build estático, como JSON servido à parte.
    const catalogUrl = `${import.meta.env.BASE_URL}products.json`

    fetch(catalogUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return (await response.json()) as unknown
      })
      .then((data) => {
        if (!Array.isArray(data) || !data.every(isProduct)) {
          throw new Error('Catálogo em formato inesperado')
        }
        setProducts(data)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setStatus('error')
      })

    return () => controller.abort()
  }, [])

  return { products, status }
}
