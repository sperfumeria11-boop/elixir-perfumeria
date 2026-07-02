import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  const formattedPrice = product.price.toLocaleString('es-CO');
  const formattedDiscount = product.discount_price?.toLocaleString('es-CO');

  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-card__image" />
        ) : (
          <span className="product-card__placeholder-icon">🧴</span>
        )}
        {product.on_sale && (
          <span className="product-card__sale-badge">Oferta</span>
        )}
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        {product.on_sale && product.discount_price ? (
          <div className="product-card__prices">
            <s className="product-card__original-price">${formattedPrice}</s>
            <span className="product-card__discount-price">${formattedDiscount}</span>
          </div>
        ) : (
          <p className="product-card__price">${formattedPrice}</p>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;