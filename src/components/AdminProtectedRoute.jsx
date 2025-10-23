// src/components/AdminProtectedRoute.jsx
import React from 'react';

/**
 * Componente AdminProtectedRoute
 * Protege rutas administrativas verificando el rol del usuario
 * Redirige a login si no es administrador
 */
function AdminProtectedRoute({ children, userRole, userLoggedIn, onNavigate }) {
  // Verificar si el usuario está logueado y es administrador
  if (!userLoggedIn || userRole !== 'admin') {
    return (
      <div style={unauthorizedStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>🚫 Acceso Restringido</h2>
          <p style={messageStyle}>
            Esta página está reservada para administradores.
          </p>
          <p style={messageStyle}>
            Por favor, inicie sesión con una cuenta de administrador para continuar.
          </p>
          <button 
            onClick={() => onNavigate('login')} 
            style={buttonStyle}
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // Si es administrador, mostrar el contenido protegido
  return children;
}

/* =========================
   Estilos inline
   ========================= */

const unauthorizedStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'var(--color-bg-light)',
  fontFamily: 'Arial, sans-serif',
  color: 'var(--color-text-light)',
};

const cardStyle = {
  background: '#B4E2ED',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  color: 'grey',
  width: '100%',
  maxWidth: '500px',
  border: '1px solid #646cff',
  textAlign: 'center',
};

const titleStyle = {
  color: '#194C57',
  marginBottom: '1rem',
  fontSize: '1.8rem',
  fontWeight: '600',
};

const messageStyle = {
  color: 'grey',
  marginBottom: '1rem',
  fontSize: '1rem',
  lineHeight: '1.5',
};

const buttonStyle = {
  padding: '0.8rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  background: '#194C57',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.2s',
  marginTop: '1rem',
};

export default AdminProtectedRoute;
