import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './OrderConfirmed.css';

function OrderConfirmed() {
  return (
    <>
      <Navbar />
      <div className="container order-confirmed">
        <div className="order-confirmed__icon">✓</div>
        <h1>¡Pedido recibido!</h1>
        <p>
          Gracias por tu compra. Hemos recibido tu pedido y nos pondremos en contacto
          contigo muy pronto por WhatsApp para coordinar la entrega y el pago.
        </p>
        <Link to="/" className="back-to-home-btn">Volver al catálogo</Link>
      </div>
    </>
  );
}

export default OrderConfirmed;