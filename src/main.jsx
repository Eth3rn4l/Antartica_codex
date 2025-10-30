import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Cart from './components/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Ayuda from './pages/Ayuda';
import Contact from './pages/Contact';
import Footer from './Footer'; // Importa el Footer
import SobreNosotros from './pages/SobreNosotros'; // Importa el componente SobreNosotros
import AdminView from './pages/AdminView';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

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
} catch (e) {
  // Si localStorage no está disponible en este entorno, ignorar
  // (en producción se debe usar un backend seguro)
  // console.warn('No se pudo inicializar usuarios por defecto', e);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={[ 'client', 'admin' ]}><Cart /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ayuda" element={<Ayuda />} /> {/* <--- Ruta */}
        <Route path="/contact" element={<Contact />} /> {/* <--- Ruta */}
        <Route path="/sobrenosotros" element={<SobreNosotros />} /> {/* Agrega esta línea */}
  <Route path="/adminview" element={<ProtectedRoute allowedRoles={[ 'admin' ]}><ErrorBoundary><AdminView /></ErrorBoundary></ProtectedRoute>} />
  <Route path="/admin/books" element={<ProtectedRoute allowedRoles={[ 'admin' ]}><ErrorBoundary><AdminBooks /></ErrorBoundary></ProtectedRoute>} />
  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[ 'admin' ]}><ErrorBoundary><AdminUsers /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={[ 'client', 'admin' ]}><Profile /></ProtectedRoute>} />
      </Routes>
      <Footer /> {/* Agrega el Footer aquí */}
    </BrowserRouter>
  </StrictMode>
);
