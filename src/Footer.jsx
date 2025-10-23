import React from 'react';

function Footer() {
  return (
    <footer style={footerBlockStyle}>
      <div style={footerRowStyle}>
        <a href="/sobrenosotros" className="footer-social" style={footerItemStyle}>Sobre Nosotros</a>
        <a href="/contact" className="footer-social" style={footerItemStyle}>Contacto</a>
        <span style={footerItemStyle}>© 2025 ArticStore. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
const footerBlockStyle = {
  background: '#194C57',
  color: '#fff',
  padding: '1rem 0',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const footerRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '2rem',
  width: '100%',
};

const footerItemStyle = {
  flex: 1,
  textAlign: 'center',
  fontSize: '1rem',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: '500',
};

const footerStyle = {
  padding: '1rem',
  backgroundColor: '#194C57',
  color: '#fff',
  textAlign: 'center',
  border: '2px solid var(--color-primary)',
  borderRadius: '10px',
};

export default Footer;
