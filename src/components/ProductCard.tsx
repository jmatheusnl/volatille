import type { Product } from '../types/Product'
import { formatPrice } from '../utils/formatPrice'
import './ProductCard.css'

type ProductCardProps = {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const imageSrc = product.image.startsWith('/')
    ? `${import.meta.env.BASE_URL}${product.image.slice(1)}`
    : product.image

  return (
    <article className="product-card">
      <div className="product-card__photo">
        <img src={imageSrc} alt={`Difusor ${product.scent} ${product.size}`} />
      </div>
      <div className="product-card__body">
        <p className="product-card__size">{product.size}</p>
        <h3 className="product-card__scent">{product.scent}</h3>
        <p className="product-card__description">{product.description}</p>
        <ul className="product-card__tags">
          {product.categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
        <div className="product-card__footer">
          <p className="product-card__price">{formatPrice(product.price)}</p>
          {onAddToCart && (
            <button
              type="button"
              className="product-card__add-btn"
              onClick={() => onAddToCart(product)}
              aria-label={`Adicionar difusor ${product.scent} ${product.size} à sacola`}
            >
              Adicionar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
