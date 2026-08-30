export type OrderItemPayload = {
  productId: string
  scent: string
  size: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export type OrderPayload = {
  orderId: string
  createdAt: string
  currency: string
  items: OrderItemPayload[]
  totalItems: number
  totalAmount: number
  status: 'confirmed'
}
