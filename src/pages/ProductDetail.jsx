import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getProductById } from '../lib/productService';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p className="not-found">Cargando...</p>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p className="not-found">Producto no encontrado.</p>
          <Link to="/" className="back-link">← Volver al catálogo</Link>
        </div>
      </>
    );
  }

  const formattedPrice = product.price.toLocaleString('es-CO');
  const formattedDiscount = product.discount_price?.toLocaleString('es-CO');

  function handleAddToCart() {
    addToCart(product);
    navigate('/carrito');
  }

  return (
    <>
      <Navbar />

      <div className="container product-detail">
        <Link to="/" className="back-link">← Volver al catálogo</Link>

        <div className="product-detail__grid">
          <div className="product-detail__image-wrap">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <span className="product-detail__placeholder-icon">🧴</span>
            )}
          </div>

          <div className="product-detail__info">
            <h1 className="product-detail__name">{product.name}</h1>

            {product.on_sale && product.discount_price ? (
              <div className="product-detail__prices">
                <s className="product-detail__original-price">${formattedPrice}</s>
                <span className="product-detail__discount-price">${formattedDiscount}</span>
              </div>
            ) : (
              <p className="product-detail__price">${formattedPrice}</p>
            )}

            <p className="product-detail__description">{product.description}</p>

            <div className="product-detail__meta">
              <div className="meta-item">
                <span className="meta-item__label">Familia olfativa</span>
                <span className="meta-item__value">{product.family}</span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">Duración</span>
                <span className="meta-item__value">{product.duration}</span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">Intensidad</span>
                <span className="meta-item__value">{product.intensity}</span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">Ocasión</span>
                <span className="meta-item__value">{product.occasion}</span>
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Agregar al pedido
            </button>
          </div>
        </div>

        {(product.notes_salida?.length > 0 || product.notes_corazon?.length > 0 || product.notes_fondo?.length > 0) && (
          <div className="olfactive-pyramid">
            <h2 className="olfactive-pyramid__title">Composición del perfume</h2>
            <div className="olfactive-pyramid__levels">
              {product.notes_salida?.length > 0 && (
                <div className="pyramid-level">
                  <span className="pyramid-level__label">Notas de salida</span>
                  <p className="pyramid-level__notes">{product.notes_salida.join(' · ')}</p>
                </div>
              )}
              {product.notes_corazon?.length > 0 && (
                <div className="pyramid-level">
                  <span className="pyramid-level__label">Notas de corazón</span>
                  <p className="pyramid-level__notes">{product.notes_corazon.join(' · ')}</p>
                </div>
              )}
              {product.notes_fondo?.length > 0 && (
                <div className="pyramid-level">
                  <span className="pyramid-level__label">Notas de fondo</span>
                  <p className="pyramid-level__notes">{product.notes_fondo.join(' · ')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;