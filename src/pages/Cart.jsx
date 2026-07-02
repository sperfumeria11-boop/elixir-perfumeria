import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container cart-empty">
          <p>Tu carrito está vacío.</p>
          <Link to="/" className="back-link">← Ver catálogo</Link>
        </div>
      </>
    );
  }

  const formattedTotal = totalPrice.toLocaleString('es-CO');

  return (
    <>
      <Navbar />

      <div className="container cart">
        <h1 className="cart__title">Tu pedido</h1>

        <div className="cart__items">
          {cartItems.map((item) => {
            const formattedPrice = item.price.toLocaleString('es-CO');
            const formattedSubtotal = (item.price * item.quantity).toLocaleString('es-CO');

            return (
              <div key={item.id} className="cart-item">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="cart-item__image" />
                ) : (
                  <span style={{ fontSize: '32px' }}>🧴</span>
                )}

                <div className="cart-item__info">
                  <h3 className="cart-item__name">{item.name}</h3>
                  <p className="cart-item__price">${formattedPrice} c/u</p>
                </div>

                <div className="cart-item__quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <p className="cart-item__subtotal">${formattedSubtotal}</p>

                <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart__summary">
          <span>Total</span>
          <span className="cart__total">${formattedTotal}</span>
        </div>

        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
          Continuar con el pedido
        </button>

        <Link to="/" className="back-link">← Seguir viendo el catálogo</Link>
      </div>
    </>
  );
}

export default Cart;