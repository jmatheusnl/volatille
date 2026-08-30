import { useEffect, useMemo, useState } from 'react'
import type { CartItem } from '../types/Cart'
import type { Product } from '../types/Product'

const STORAGE_KEY = 'volatille_cart'

// Validação em runtime para garantir que o que estiver no localStorage
// esteja no formato correto antes de hidratar o estado da aplicação.
function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  if (typeof candidate.quantity !== 'number' || candidate.quantity <= 0) {
    return false
  }

  const product = candidate.product
  if (typeof product !== 'object' || product === null) {
    return false
  }

  const p = product as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.scent === 'string' &&
    typeof p.size === 'string' &&
    typeof p.price === 'number' &&
    typeof p.image === 'string'
  )
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every(isCartItem)) {
      return parsed
    }
  } catch {
    // Caso o localStorage esteja bloqueado ou com dados corrompidos,
    // retorna array vazio para não quebrar a aplicação.
  }
  return []
}

export type UseCartResult = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isEmpty: boolean
  addToCart: (product: Product) => void
  updateQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

export function useCart(): UseCartResult {
  // Inicialização lazy lendo do localStorage uma única vez no mount
  const [items, setItems] = useState<CartItem[]>(loadInitialCart)

  // Persistência automática no localStorage a cada alteração do estado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignora erros de cota do localStorage para manter a UI funcionando
    }
  }, [items])

  // Adiciona produto ao carrinho: se já existir, soma a quantidade; se não, adiciona com 1
  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      )

      if (existingIndex >= 0) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevItems, { product, quantity: 1 }]
    })
  }

  // Altera quantidade de um item (+1 ou -1); se a quantidade chegar a 0, remove o item
  const updateQuantity = (productId: string, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter((item): item is CartItem => item !== null)
    )
  }

  // Remove o item diretamente do carrinho
  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    )
  }

  // Limpa todos os itens do carrinho e do localStorage
  const clearCart = () => {
    setItems([])
  }

  // Quantidade total de unidades no carrinho (soma das quantidades)
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  // Valor total monetário do carrinho (soma de preço x quantidade)
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  )

  const isEmpty = items.length === 0

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
}
