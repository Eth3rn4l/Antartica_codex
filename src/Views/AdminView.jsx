import React from 'react';

function AdminView() {
  // Simplified admin landing: navigation to dedicated admin pages
  const raw = localStorage.getItem('currentUser');
  const currentUser = raw ? JSON.parse(raw) : null;
  return (
    <div style={{ ...containerStyle, paddingTop: '2.5rem', alignItems: 'stretch' }}>
      <div style={{ ...cardStyle, margin: '0 auto', maxWidth: 900, padding: '2.5rem' }}>
        <h2 style={{ ...titleStyle, marginTop: 0 }}>Panel de Administración</h2>
        <div style={contentStyle}>
          <p style={{ fontSize: '1.05rem' }}>Bienvenido Administrador</p>
          <p>Usa las secciones dedicadas para administrar libros y usuarios.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button onClick={() => window.location.href = '/admin/books'} style={{ padding: '0.8rem 1.2rem', fontWeight: 600, backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Controles de libros</button>
            <button onClick={() => window.location.href = '/admin/users'} style={{ padding: '0.8rem 1.2rem', fontWeight: 600, backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Gestión de usuarios</button>
          </div>

          {/* Información del admin debajo de las opciones */}
          <div style={{ marginTop: '1.75rem', padding: '1rem', borderRadius: 8, background: '#3dacacff', border: '1px solid #cfecee' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#194C57' }}>Información del administrador</h4>
            {currentUser ? (
              <div style={{ color: '#194C57' }}>
                <div><strong>Nombre:</strong> {currentUser.nombre || '-'}</div>
                <div><strong>Email:</strong> {currentUser.email}</div>
                <div><strong>Rol:</strong> {currentUser.role}</div>
              </div>
            ) : (
              <div style={{ color: '#666' }}>No hay información del administrador disponible. Inicia sesión para ver más detalles.</div>
            )}
          </div>
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
