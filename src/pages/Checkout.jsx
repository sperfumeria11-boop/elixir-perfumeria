import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const departamentos = [
  'Tolima', 'Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Cundinamarca',
  'Atlántico', 'Santander', 'Risaralda', 'Caldas', 'Huila', 'Otro',
];

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    apartamento: '',
    poblacion: '',
    departamento: 'Tolima',
    notas: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function buildOrderSummary() {
    return cartItems
      .map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}`)
      .join('\n');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      access_key: import.meta.env.VITE_WEB3FORMS_KEY,
      subject: `Nuevo pedido - ${formData.nombre} ${formData.apellidos}`,
      from_name: 'Elixir Perfumería - Pedidos',
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      direccion: formData.direccion,
      apartamento: formData.apartamento || 'N/A',
      poblacion: formData.poblacion,
      departamento: formData.departamento,
      notas: formData.notas || 'Sin notas',
      pedido: buildOrderSummary(),
      total: `$${totalPrice.toLocaleString('es-CO')}`,
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        clearCart();
        navigate('/pedido-confirmado');
      } else {
        setError('No se pudo enviar el pedido. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Hubo un problema de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const formattedTotal = totalPrice.toLocaleString('es-CO');

  return (
    <>
      <Navbar />

      <div className="container checkout">
        <h1 className="checkout__title">Detalles de envío</h1>

        <div className="checkout__grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>Nombre *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Apellidos *</label>
                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-field">
              <label>Teléfono / WhatsApp *</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label>Dirección *</label>
              <input
                type="text"
                name="direccion"
                placeholder="Nombre de la calle y número de la casa"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Apartamento, habitación, etc. (opcional)</label>
              <input type="text" name="apartamento" value={formData.apartamento} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Población *</label>
                <input type="text" name="poblacion" value={formData.poblacion} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Departamento *</label>
                <select name="departamento" value={formData.departamento} onChange={handleChange} required>
                  {departamentos.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Notas sobre tu pedido (opcional)</label>
              <textarea
                name="notas"
                placeholder="Notas especiales para la entrega"
                value={formData.notas}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button type="submit" className="checkout-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando pedido...' : 'Confirmar pedido'}
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Tu pedido</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name} × {item.quantity}</td>
                    <td>${(item.price * item.quantity).toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="checkout-summary__total">
              <span>Total</span>
              <span>${formattedTotal}</span>
            </div>

            <div className="checkout-summary__payment">
              <strong>Pago</strong>
              <p>Contraentrega o transferencia/Nequi. Coordinamos por WhatsApp al confirmar tu pedido.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;