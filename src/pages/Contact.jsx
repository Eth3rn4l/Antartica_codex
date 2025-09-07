// src/pages/Contact.jsx
import React from "react";

function Contact() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Contacto</h1>
        <p style={descStyle}>
          Aquí puedes encontrar nuestros datos de contacto y enviarnos tus consultas directamente.
        </p>

        {/* Información de contacto */}
        <div style={infoBox}>
          <h2 style={infoTitle}>Correo</h2>
          <p style={infoText}>contacto@libreriaonline.cl</p>

          <h2 style={infoTitle}>Teléfono</h2>
          <p style={infoText}>+56 9 1234 5678</p>

          <h2 style={infoTitle}>Redes Sociales</h2>
          <p style={infoText}>
            Instagram: @libreriaonline <br />
            Facebook: /libreriaonline <br />
            Twitter: @libreriaonline
          </p>
        </div>

        {/* Formulario de contacto */}
        <div style={contactBox}>
          <h2 style={contactTitle}>Envíanos un mensaje</h2>
          <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Tu nombre" style={inputStyle} required />
            <input type="email" placeholder="Tu correo" style={inputStyle} required />
            <textarea placeholder="Escribe tu mensaje..." rows="4" style={textareaStyle} required />
            <button type="submit" style={buttonStyle}>Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Estilos inline
   ========================= */
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
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

const infoBox = {
  marginBottom: "2rem",
  background: "#e0f7fa",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #646cff",
};

const infoTitle = {
  fontWeight: "600",
  marginBottom: "0.3rem",
};

const infoText = {
  marginBottom: "1rem",
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

export default Contact;
