import Footer from '../Footer';
import React from "react";

function SobreNosotros() {
  return (
    <div style={{ ...containerStyle, flexDirection: 'column', minHeight: '100vh' }}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Sobre Nosotros</h2>
        <p style={descStyle}><strong>Quienes somos</strong></p>
        <p style={descStyle}>
          Somos la cadena de librerías más grande y más antigua de Chile. Abrimos nuestra primera tienda de Parque Arauco en abril del año 1982 y hoy contamos con 28 sucursales físicas (20 en Santiago y 8 en regiones), además de la tienda online.<br /><br />
          Tenemos un gran surtido de productos disponibles, para así satisfacer a la amplia gama de clientes con más de 168.000 productos distintos.<br /><br />
          Detrás de nuestras tiendas hay un gran equipo conformado por personas amantes de la lectura, altamente calificadas por nuestros clientes en encuestas de satisfacción.<br /><br />
          Como empresa estamos comprometidos con nuestros clientes en continuar acercando la lectura a más personas y seguir siendo una librería familiar y cálida, pero a la vez actualizada y moderna, donde puedes encontrar lo que necesites de la forma más rápida y amigable posible, gracias a la incorporación y uso de nuevas tecnologías.
        </p>
        <div style={infoBox}>
          <p><strong>Razón Social:</strong> Librería Antártica Ltda.</p>
          <p><strong>Rut:</strong> 88.679.500-9</p>
          <p><strong>Representante Legal:</strong> Carlos Hernán Aguirre Costa</p>
          <p><strong>Rut Representante Legal:</strong> 13.433.197-6</p>
          <p><strong>Dirección Casa Matriz:</strong> San Francisco 116 – Santiago Centro</p>
          <p><strong>Teléfono:</strong> +56 226178845</p>
          <p><strong>RRSS:</strong></p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <a href="https://instagram.com/antarticalibros" target="_blank" rel="noopener noreferrer" className="footer-social">Instagram: @antarticalibros</a>
            </li>
            <li>
              <a href="https://facebook.com/LibreriaAntartica" target="_blank" rel="noopener noreferrer" className="footer-social">Facebook: @LibreriaAntartica (Antártica Libros)</a>
            </li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: 'auto', width: '100%' }}>
        <Footer />
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'inherit',
  fontFamily: 'Arial, sans-serif',
  color: 'inherit',
};

const cardStyle = {
  background: 'inherit',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  color: 'inherit',
  width: '100%',
  maxWidth: '700px',
  border: '1px solid var(--color-primary)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '2rem',
  letterSpacing: '0.5px',
  color: 'var(--color-primary)',
};

const descStyle = {
  marginBottom: '1rem',
  fontSize: '1.1rem',
  color: 'inherit',
};

const infoBox = {
  marginTop: '2rem',
  background: 'inherit',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid var(--color-primary)',
  color: 'inherit',
};

export default SobreNosotros;
