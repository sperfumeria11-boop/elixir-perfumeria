import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const formattedPrice = product.price.toLocaleString('es-CO');
  const formattedDiscount = product.discount_price?.toLocaleString('es-CO');

  const discountPercent = product.on_sale && product.discount_price
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : null;

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart(product);
  }

  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-card__image" />
        ) : (
          <span className="product-card__placeholder-icon">🧴</span>
        )}
        {product.on_sale && discountPercent && (
          <span className="product-card__sale-badge">Oferta -{discountPercent}%</span>
        )}
      </div>
      <div className="product-card__info">
        <p className="product-card__stock">✓ En Stock</p>
        <h3 className="product-card__name">{product.name}</h3>
        {product.on_sale && product.discount_price ? (
          <div className="product-card__prices">
            <s className="product-card__original-price">${formattedPrice}</s>
            <span className="product-card__discount-price">${formattedDiscount}</span>
          </div>
        ) : (
          <p className="product-card__price">${formattedPrice}</p>
        )}
        <button className="product-card__add-btn" onClick={handleAddToCart}>
          + Agregar
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;