import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Ayuda from './pages/Ayuda';
import Contact from './pages/Contact';
import SobreNosotros from './pages/SobreNosotros';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'register', 'help', 'contact', 'admin'
  const [userRole, setUserRole] = useState('guest'); // 'guest', 'client', 'admin'
  const [userEmail, setUserEmail] = useState('');

  const navigate = (page) => setCurrentPage(page);
  
  const handleLogin = (email) => {
    setUserLoggedIn(true);
    setUserRole('client');
    setUserEmail(email);
    setCurrentPage('home');
  };
  
  const handleAdminLogin = (email) => {
    setUserLoggedIn(true);
    setUserRole('admin');
    setUserEmail(email);
    setCurrentPage('admin');
  };
  
  const handleLogout = () => {
    setUserLoggedIn(false);
    setUserRole('guest');
    setUserEmail('');
    setCurrentPage('home');
    // Limpiar localStorage
    localStorage.removeItem('userSession');
  };

  // Cambiar el título según la página
  useEffect(() => {
    let title = 'Antártica - Tienda de Libros';
    if (currentPage === 'home') title = 'Antártica - Home';
    if (currentPage === 'login') title = 'Antártica - Login';
    if (currentPage === 'register') title = 'Antártica - Registro';
    if (currentPage === 'help') title = 'Antártica - Ayuda';
    if (currentPage === 'contact') title = 'Antártica - Contacto';
    if (currentPage === 'admin') title = 'Antártica - Administración';
    document.title = title;
  }, [currentPage]);

  // Verificar sesión guardada al cargar la aplicación
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.isLoggedIn) {
          setUserLoggedIn(true);
          setUserRole(session.role);
          setUserEmail(session.email);
          
          // Si es admin, ir al dashboard
          if (session.role === 'admin') {
            setCurrentPage('admin');
          }
        }
      } catch (error) {
        console.error('Error al recuperar sesión:', error);
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  return (
    <>
      <Header
        userLoggedIn={userLoggedIn}
        userRole={userRole}
        userEmail={userEmail}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && <Home />}
      {currentPage === 'login' && <Login onLogin={handleLogin} onAdminLogin={handleAdminLogin} />}
      {currentPage === 'register' && <Register />}
      {currentPage === 'ayuda' && <Ayuda />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'sobrenosotros' && <SobreNosotros />}
      {currentPage === 'admin' && (
        <AdminProtectedRoute 
          userRole={userRole} 
          userLoggedIn={userLoggedIn} 
          onNavigate={navigate}
        >
          <AdminDashboard userEmail={userEmail} onLogout={handleLogout} />
        </AdminProtectedRoute>
      )}
    </>
  );
}

export default App;
