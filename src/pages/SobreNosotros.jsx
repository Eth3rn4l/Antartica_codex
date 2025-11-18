// src/pages/SobreNosotros.jsx
import React from "react";
import Footer from '../components/Footer';

/**
 * Componente SobreNosotros
 * Muestra información de la empresa, misión, visión y datos de contacto.
 */
function SobreNosotros() {
  return (
    <div style={{ ...containerStyle, flexDirection: 'column', minHeight: '100vh' }}>
      <div style={cardStyle}>
        {/* Título principal */}
        <h2 style={titleStyle}>Sobre Nosotros</h2>

        {/* Sección: Quiénes somos */}
        <p style={descStyle}><strong>Quienes somos</strong></p>
        <p style={descStyle}>
          Somos la cadena de librerías más grande y más antigua de Chile. Abrimos nuestra primera tienda de Parque Arauco en abril del año 1982 y hoy contamos con 28 sucursales físicas (20 en Santiago y 8 en regiones), además de la tienda online.<br /><br />
          Tenemos un gran surtido de productos disponibles, para así satisfacer a la amplia gama de clientes con más de 168.000 productos distintos.<br /><br />
          Detrás de nuestras tiendas hay un gran equipo conformado por personas amantes de la lectura, altamente calificadas por nuestros clientes en encuestas de satisfacción.<br /><br />
          Como empresa estamos comprometidos con nuestros clientes en continuar acercando la lectura a más personas y seguir siendo una librería familiar y cálida, pero a la vez actualizada y moderna, donde puedes encontrar lo que necesites de la forma más rápida y amigable posible, gracias a la incorporación y uso de nuevas tecnologías.
        </p>

        {/* Sección: Misión */}
        <p style={descStyle}><strong>Misión</strong></p>
        <p style={descStyle}>
          Nuestra misión es fomentar la lectura y el acceso al conocimiento, ofreciendo una experiencia de compra cercana, confiable y moderna, tanto en nuestras sucursales físicas como en nuestra tienda online. Buscamos ser un referente cultural en Chile, promoviendo la educación y el desarrollo personal de nuestros clientes.
        </p>

        {/* Sección: Visión */}
        <p style={descStyle}><strong>Visión</strong></p>
        <p style={descStyle}>
          Nuestra visión es ser la librería líder en Chile y Latinoamérica, reconocida por su compromiso con la calidad, la innovación tecnológica y la satisfacción del cliente. Aspiramos a acercar la lectura a cada rincón del país, creando un impacto positivo en la sociedad y consolidando nuestra marca como un símbolo de cultura y conocimiento.
        </p>

        {/* Información adicional */}
        <div style={infoBox}>
          <p><strong>Razón Social:</strong> Librería Antártica Ltda.</p>
          <p><strong>Rut:</strong> 88.679.500-9</p>
          <p><strong>Representante Legal:</strong> Carlos Hernán Aguirre Costa</p>
          <p><strong>Rut Representante Legal:</strong> 13.433.197-6</p>
          <p><strong>Dirección Casa Matriz:</strong> San Francisco 116 – Santiago Centro</p>
          <p><strong>Teléfono:</strong> +56 226178845</p>
          <p><strong>Redes Sociales:</strong></p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <a href="https://instagram.com/antarticalibros" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                Instagram: @antarticalibros
              </a>
            </li>
            <li>
              <a href="https://facebook.com/LibreriaAntartica" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                Facebook: @LibreriaAntartica (Antártica Libros)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Estilos adaptados de Ayuda.jsx
   ========================= */

// Contenedor principal centrado
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'var(--color-bg-light)', // mismo fondo que Ayuda.jsx
  fontFamily: 'Arial, sans-serif',
  color: 'var(--color-text-light)',
};

// Tarjeta blanca con borde y sombra
const cardStyle = {
  background: '#B4E2ED', // azul claro como Ayuda.jsx
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: '700px',
  border: '1px solid #646cff', // borde morado
  color: 'grey',
};

// Título centrado con azul oscuro
const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '2rem',
  letterSpacing: '0.5px',
  color: '#194C57',
};

// Estilo para los párrafos descriptivos
const descStyle = {
  marginBottom: '1rem',
  fontSize: '1.1rem',
  color: '#333',
};

// Caja de información adicional con borde
const infoBox = {
  marginTop: '2rem',
  background: '#f9f9f9',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #646cff',
  color: '#333',
};

// Estilo de enlaces en la sección de redes sociales
const linkStyle = {
  color: '#194C57',
  textDecoration: 'none',
  fontWeight: '500',
};

export default SobreNosotros;
