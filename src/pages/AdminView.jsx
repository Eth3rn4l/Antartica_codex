import React from 'react';

function AdminView() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Panel de Administración</h2>
        <div style={contentStyle}>
          <p>Bienvenido Administrador</p>
          {/* Aquí puedes agregar más contenido del panel admin */}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'var(--color-bg-light)',
  fontFamily: 'Arial, sans-serif',
};

const cardStyle = {
  background: '#B4E2ED',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: '800px',
  border: '1px solid #646cff',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '1.6rem',
  color: '#194C57',
};

const contentStyle = {
  color: '#194C57',
  fontSize: '1.1rem',
};

export default AdminView;