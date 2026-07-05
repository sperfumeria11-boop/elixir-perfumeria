import { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    icon: '🌟',
    question: '¿Qué son los perfumes 1.1 premium?',
    answer: 'Son fragancias de alta calidad inspiradas en los perfumes originales de las mejores marcas del mundo. Tienen una fijación y proyección excelente, prácticamente indistinguibles del original.',
  },
  {
    icon: '🚚',
    question: '¿Cuál es el tiempo de entrega y el costo del envío?',
    answer: 'Los envíos se realizan a todo Colombia. El tiempo de entrega es de 2 a 5 días hábiles dependiendo de tu ciudad. El costo del envío se coordina por WhatsApp según tu ubicación.',
  },
  {
    icon: '💳',
    question: '¿Qué métodos de pago tienen disponibles?',
    answer: 'Aceptamos contraentrega (50% al confirmar, 50% al recibir), Nequi, Daviplata y transferencia bancaria PSE. Coordinamos los detalles por WhatsApp.',
  },
  {
    icon: '🔒',
    question: '¿Es seguro comprar en Elixir Perfumería?',
    answer: 'Sí, totalmente. Tenemos clientes satisfechos en toda Colombia. Trabajamos con total transparencia y garantizamos la calidad de cada producto que enviamos.',
  },
  {
    icon: '🌸',
    question: '¿Qué pasa si necesito ayuda para elegir mi aroma ideal?',
    answer: 'Escríbenos por WhatsApp y te asesoramos de forma personalizada y gratuita. Cuéntanos tus gustos, la ocasión y tu presupuesto, y te recomendamos el perfume perfecto.',
  },
  {
    icon: '🧴',
    question: '¿Qué es un Decant?',
    answer: 'Un decant es una pequeña muestra de un perfume original, extraída directamente del frasco. Es ideal para probar una fragancia antes de comprar el tamaño completo.',
  },
  {
    icon: '⭐',
    question: '¿Qué garantía tengo sobre la calidad del perfume?',
    answer: 'Garantizamos que todos nuestros productos son de alta calidad. Si tienes algún problema con tu pedido, contáctanos por WhatsApp y lo resolvemos de inmediato.',
  },
];

const WHATSAPP_NUMBER = '573058971401';
const whatsappMsg = encodeURIComponent('Hola! Tengo una pregunta sobre Elixir Perfumería 🌸');

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="faq">
      <div className="container">
        <div className="faq__header">
          <span className="faq__eyebrow">✨ Centro de ayuda</span>
          <h2 className="faq__title">Preguntas Frecuentes</h2>
          <p className="faq__subtitle">Resolvemos todas tus dudas para que compres con total confianza</p>
        </div>

        <div className="faq__list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq__item ${openIndex === index ? 'faq__item--open' : ''}`}
            >
              <button className="faq__question" onClick={() => toggle(index)}>
                <div className="faq__icon-wrap">{faq.icon}</div>
                <span>{faq.question}</span>
                <div className="faq__toggle">+</div>
              </button>
              <div className={`faq__answer-wrap ${openIndex === index ? 'faq__answer-wrap--open' : ''}`}>
                <p className="faq__answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq__bottom">
          <p>¿No encontraste lo que buscabas? ¡Escríbenos directamente! 💬</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="faq__whatsapp-btn"
          >
            💬 Hablar con un asesor
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;