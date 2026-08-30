import { useCallback, useEffect, useState } from 'react'
import type { UseCartResult } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import { scrollToSection } from '../utils/scrollToSection'
import './CartModal.css'

type CartModalProps = {
  isOpen: boolean
  onClose: () => void
  cart: UseCartResult
}

export function CartModal({ isOpen, onClose, cart }: CartModalProps) {
  // Estado interno para alternar entre a visualização da sacola e a tela de confirmação
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)

  const handleClose = useCallback(() => {
    setIsOrderConfirmed(false)
    onClose()
  }, [onClose])

  // Fecha o modal e faz a rolagem suave até a seção de catálogo
  const handleNavigateToCatalog = () => {
    handleClose()
    scrollToSection('catalogo')
  }

  // Trata tecla Escape para acessibilidade e bloqueia scroll de fundo
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  // Ao finalizar compra fictícia: alterna para a tela de confirmação e limpa a sacola
  const handleCheckout = () => {
    setIsOrderConfirmed(true)
    cart.clearCart()
  }

  return (
    <div
      className="cart-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <div
        className="cart-modal__overlay"
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside className="cart-modal__panel">
        <header className="cart-modal__header">
          <h2 id="cart-modal-title" className="cart-modal__title">
            {isOrderConfirmed ? 'Pedido Confirmado' : 'Sua Sacola'}
          </h2>
          <button
            type="button"
            className="cart-modal__close-btn"
            onClick={handleClose}
            aria-label="Fechar sacola"
          >
            ✕
          </button>
        </header>

        <div className="cart-modal__body">
          {isOrderConfirmed ? (
            <div className="cart-modal__confirmation">
              <p className="ornament" aria-hidden="true">
                ♡
              </p>
              <h3 className="cart-modal__confirmation-heading">
                Obrigado pelo seu pedido!
              </h3>
              <p className="cart-modal__confirmation-text">
                Seus difusores artesanais da Volatille serão separados com todo o
                cuidado para acolher o seu ambiente com aromas únicos.
              </p>
              <p className="cart-modal__confirmation-notice">
                (Este é um pedido demonstrativo do bootcamp. Nenhum pagamento
                real foi cobrado.)
              </p>
              <button
                type="button"
                className="cart-modal__primary-btn"
                onClick={handleNavigateToCatalog}
              >
                Continuar comprando
              </button>
            </div>
          ) : cart.isEmpty ? (
            <div className="cart-modal__empty">
              <p className="catalog__status">Sua sacola está vazia.</p>
              <p className="cart-modal__empty-lead">
                Explore nossos aromas e adicione difusores para transformar sua casa.
              </p>
              <button
                type="button"
                className="cart-modal__primary-btn"
                onClick={handleNavigateToCatalog}
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            <div className="cart-modal__content">
              <div className="cart-modal__toolbar">
                <span className="cart-modal__toolbar-count">
                  {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'itens'}
                </span>
                <button
                  type="button"
                  className="cart-modal__clear-btn"
                  onClick={cart.clearCart}
                  aria-label="Esvaziar toda a sacola"
                >
                  Limpar sacola
                </button>
              </div>

              <ul className="cart-modal__list">
                {cart.items.map(({ product, quantity }) => {
                  const imageSrc = product.image.startsWith('/')
                    ? `${import.meta.env.BASE_URL}${product.image.slice(1)}`
                    : product.image

                  return (
                    <li key={product.id} className="cart-modal__item">
                      <div className="cart-modal__item-photo">
                        <img
                          src={imageSrc}
                          alt={`Difusor ${product.scent} ${product.size}`}
                        />
                      </div>

                      <div className="cart-modal__item-info">
                        <div className="cart-modal__item-header">
                          <div className="cart-modal__item-titles">
                            <p className="cart-modal__item-size">{product.size}</p>
                            <h4 className="cart-modal__item-scent">
                              {product.scent}
                            </h4>
                            <p className="cart-modal__item-unit-price">
                              Unitário: {formatPrice(product.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="cart-modal__remove-btn"
                            onClick={() => cart.removeFromCart(product.id)}
                            aria-label={`Remover ${product.scent} ${product.size} da sacola`}
                            title="Remover produto"
                          >
                            <svg
                              className="cart-modal__remove-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>

                        <div className="cart-modal__item-actions">
                          <div
                            className="cart-modal__qty-controls"
                            role="group"
                            aria-label={`Quantidade para ${product.scent}`}
                          >
                            <button
                              type="button"
                              className="cart-modal__qty-btn"
                              onClick={() => cart.updateQuantity(product.id, -1)}
                              aria-label={`Diminuir quantidade de ${product.scent}`}
                            >
                              −
                            </button>
                            <span className="cart-modal__qty-value">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              className="cart-modal__qty-btn"
                              onClick={() => cart.updateQuantity(product.id, 1)}
                              aria-label={`Aumentar quantidade de ${product.scent}`}
                            >
                              +
                            </button>
                          </div>

                          <p className="cart-modal__item-subtotal">
                            {formatPrice(product.price * quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <footer className="cart-modal__footer">
                <div className="cart-modal__total-row">
                  <span className="cart-modal__total-label">Valor total</span>
                  <span className="cart-modal__total-value">
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  className="cart-modal__primary-btn"
                  onClick={handleCheckout}
                >
                  Finalizar compra
                </button>
              </footer>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
