import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Cart from './components/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Ayuda from './pages/Ayuda.jsx';
import Contact from './pages/Contact.jsx';
import SobreNosotros from './pages/SobreNosotros.jsx';
import AdminView from './pages/AdminView.jsx';
import AdminBooks from './pages/AdminBooks.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import ClienteView from './pages/ClienteView.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Profile from './pages/Profile.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './App.css';

const TITLES = {
  '/': 'Antártica - Home',
  '/login': 'Antártica - Login',
  '/register': 'Antártica - Registro',
  '/ayuda': 'Antártica - Ayuda',
  '/contact': 'Antártica - Contacto',
  '/sobrenosotros': 'Antártica - Sobre Nosotros',
};

function App() {
  const location = useLocation();

  useEffect(() => {
    const title = TITLES[location.pathname] || 'Antártica - Tienda de Libros';
    document.title = title;
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={[ 'client', 'admin' ]}><Cart /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route
          path="/adminview"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <ErrorBoundary>
                <AdminView />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <ErrorBoundary>
                <AdminBooks />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <ErrorBoundary>
                <AdminUsers />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <ErrorBoundary>
                <ClienteView />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={[ 'client', 'admin' ]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
