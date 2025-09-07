import React from 'react';

function Footer() {
  return (
    <footer style={footerStyle}>
      © 2025 ArticStore. Todos los derechos reservados.
    </footer>
  );
}

const footerStyle = {
  padding: '1rem',
  backgroundColor: '#0077b6',
  color: 'white',
  textAlign: 'center',
};

export default Footer;
