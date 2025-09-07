// src/pages/Ayuda.jsx
import React, { useState } from "react";

function Ayuda() {
  const faqs = [
    {
      question: "¿Cómo puedo comprar un libro?",
      answer:
        "Debes crear una cuenta, agregar el libro que desees al carrito y finalizar la compra seleccionando el método de pago.",
    },
    {
      question: "¿Cuáles son los métodos de pago disponibles?",
      answer:
        "Aceptamos tarjetas de débito, crédito y transferencias electrónicas. También puedes pagar con billeteras digitales como MercadoPago.",
    },
    {
      question: "¿Hacen envíos a regiones?",
      answer:
        "Sí, realizamos envíos a todo Chile a través de servicios de courier. El costo se calcula automáticamente al finalizar la compra.",
    },
    {
      question: "¿Cuánto demora en llegar mi pedido?",
      answer:
        "El tiempo de entrega depende de tu ubicación. En Santiago los envíos tardan entre 2 y 3 días hábiles, mientras que en regiones puede tardar hasta 7 días hábiles.",
    },
    {
      question: "¿Puedo devolver un libro si no me gustó?",
      answer:
        "Solo aceptamos devoluciones por fallas de impresión o daño en el envío. En ese caso, debes contactarnos en un plazo máximo de 7 días.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Centro de Ayuda</h1>
        <p style={descStyle}>
          Aquí encontrarás las respuestas a las preguntas más frecuentes sobre nuestra librería en línea.
        </p>

        <div style={faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} style={faqItem}>
              <div style={faqQuestion} onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <span>{openIndex === index ? "−" : "+"}</span>
              </div>
              {openIndex === index && <div style={faqAnswer}>{faq.answer}</div>}
            </div>
          ))}
        </div>

        <div style={contactBox}>
          <h2 style={contactTitle}>¿No encontraste tu respuesta?</h2>
          <p style={contactDesc}>Escríbenos tu duda y nuestro equipo te responderá lo antes posible.</p>
          <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Tu nombre" style={inputStyle} required />
            <input type="email" placeholder="Tu correo" style={inputStyle} required />
            <textarea placeholder="Escribe tu consulta..." rows="4" style={textareaStyle} required />
            <button type="submit" style={buttonStyle}>Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Estilos inline consistentes con Login.jsx
   ========================= */

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "2rem 1rem",
  background: "#fff",
  fontFamily: "Arial, sans-serif",
  color: "grey",
};

const cardStyle = {
  background: "#B4E2ED",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  color: "grey",
  width: "100%",
  maxWidth: "800px",
  border: "1px solid #646cff",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "1rem",
  fontWeight: "600",
  fontSize: "2rem",
  letterSpacing: "0.5px",
  color: "#023e8a",
};

const descStyle = {
  textAlign: "center",
  marginBottom: "2rem",
  fontSize: "1.1rem",
  color: "#555",
};

const faqContainer = {
  marginBottom: "2rem",
};

const faqItem = {
  marginBottom: "1rem",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #646cff",
};

const faqQuestion = {
  background: "#646cff",
  color: "white",
  padding: "1rem",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};

const faqAnswer = {
  background: "#f9f9f9",
  padding: "1rem",
  color: "#333",
};

const contactBox = {
  borderTop: "2px solid #646cff",
  paddingTop: "1.5rem",
};

const contactTitle = {
  fontWeight: "600",
  fontSize: "1.4rem",
  marginBottom: "0.5rem",
};

const contactDesc = {
  marginBottom: "1rem",
  color: "#555",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "8px",
  border: "1px solid #646cff",
  outline: "none",
  fontSize: "1rem",
  background: "#fff",
  color: "grey",
};

const textareaStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "8px",
  border: "1px solid #646cff",
  outline: "none",
  fontSize: "1rem",
  background: "#fff",
  color: "grey",
};

const buttonStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "8px",
  border: "none",
  background: "#646cff",
  color: "white",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background 0.3s, transform 0.2s",
};

export default Ayuda;
