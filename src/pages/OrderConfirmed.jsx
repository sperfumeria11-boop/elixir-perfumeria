import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './OrderConfirmed.css';

const WHATSAPP_NUMBER = '573058971401';

function OrderConfirmed() {
  const [searchParams] = useSearchParams();
  const clientPhone = searchParams.get('tel') || '';
  const paymentMethod = searchParams.get('pago') || 'contraentrega';

  const messages = {
    contraentrega: `Hola! Acabo de confirmar mi pedido en Elixir Perfumería. Mi número de contacto es: ${clientPhone}. Quedo atento a la entrega 🙌`,
    nequi: `Hola! Acabo de confirmar mi pedido en Elixir Perfumería y quiero pagar por Nequi/Daviplata. Mi número es: ${clientPhone}. ¿Me confirmas el número para hacer el pago?`,
    pse: `Hola! Acabo de confirmar mi pedido en Elixir Perfumería y quiero pagar por transferencia bancaria. Mi número es: ${clientPhone}. ¿Me envías los datos bancarios?`,
  };

  const content = {
    contraentrega: {
      title: '¡Pedido confirmado!',
      text: 'Tu pedido está listo. Te contactaremos pronto para coordinar la fecha y hora de entrega.',
      cta: '📦 Confirmar entrega por WhatsApp',
    },
    nequi: {
      title: '¡Pedido confirmado!',
      text: 'Para completar tu compra, escríbenos por WhatsApp y te enviamos el número de Nequi o Daviplata para que realices el pago.',
      cta: '📱 Recibir número de Nequi por WhatsApp',
    },
    pse: {
      title: '¡Pedido confirmado!',
      text: 'Para completar tu compra, escríbenos por WhatsApp y te enviamos los datos bancarios para realizar la transferencia.',
      cta: '🏦 Recibir datos bancarios por WhatsApp',
    },
  };

  const current = content[paymentMethod] || content.contraentrega;
  const whatsappMsg = encodeURIComponent(messages[paymentMethod] || messages.contraentrega);

  return (
    <>
      <Navbar />
      <div className="container order-confirmed">
        <div className="order-confirmed__icon">✓</div>
        <h1>{current.title}</h1>
        <p>{current.text}</p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <span>💬</span> {current.cta}
        </a>

        <Link to="/" className="back-to-home-btn">Volver al catálogo</Link>
      </div>
    </>
  );
}

export default OrderConfirmed;