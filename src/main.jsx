import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';

// Inicializar usuarios por defecto (admin y cliente) si no existen
// Nota: esto sólo afecta al localStorage del navegador donde se ejecute la app
try {
  const usersRaw = localStorage.getItem('users');
  const users = usersRaw ? JSON.parse(usersRaw) : [];
  const ensureUser = (userObj) => {
    if (!users.find((u) => u.email === userObj.email)) {
      users.push(userObj);
    }
  };
  ensureUser({ email: 'admin@admin.com', password: 'admin123', role: 'admin', nombre: 'Administrador', apellido: '' });
  // Usuario cliente de prueba con datos completos (incluye RUT pedido)
  ensureUser({
    email: 'cliente@cliente.com',
    password: 'cliente123',
    role: 'client',
    nombre: 'Cliente',
    apellido: 'Prueba',
    telefono: '+56912345678',
    region: 'Metropolitana',
    comuna: 'Santiago',
    rut: '20.142.499-2'
  });
  // Completar datos de usuarios existentes si les faltan campos (merge no overwrite)
  const defaults = [
    { email: 'cliente@cliente.com', nombre: 'Cliente', apellido: 'Prueba', telefono: '+56912345678', region: 'Metropolitana', comuna: 'Santiago', rut: '20.142.499-2', role: 'client', password: 'cliente123' },
    { email: 'admin@admin.com', nombre: 'Administrador', apellido: '', role: 'admin', password: 'admin123' }
  ];
  defaults.forEach((def) => {
    const idx = users.findIndex((u) => u.email === def.email);
    if (idx !== -1) {
      const u = users[idx];
      let changed = false;
      Object.keys(def).forEach((k) => {
        if (u[k] === undefined || u[k] === null || u[k] === '') {
          u[k] = def[k];
          changed = true;
        }
      });
      if (changed) users[idx] = u;
    }
  });
  localStorage.setItem('users', JSON.stringify(users));
} catch {
  // Si localStorage no está disponible en este entorno, ignorar
  // (en producción se debe usar un backend seguro)
  // console.warn('No se pudo inicializar usuarios por defecto');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
