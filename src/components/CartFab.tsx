import './CartFab.css'

type CartFabProps = {
  totalItems: number
  onClick: () => void
}

export function CartFab({ totalItems, onClick }: CartFabProps) {
  const hasItems = totalItems > 0
  const ariaLabel = hasItems
    ? `Abrir sacola de compras com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`
    : 'Abrir sacola de compras (vazia)'

  return (
    <button
      type="button"
      className={`cart-fab ${hasItems ? 'cart-fab--has-items' : 'cart-fab--empty'}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        className="cart-fab__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {hasItems && (
        <span className="cart-fab__badge" aria-hidden="true">
          {totalItems}
        </span>
      )}
    </button>
  )
}
