import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Ayuda from './pages/Ayuda';
import Contact from './pages/Contact';
import SobreNosotros from './pages/SobreNosotros';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'register', 'help', 'contact'

  const navigate = (page) => setCurrentPage(page);
  const handleLogin = () => setUserLoggedIn(true);
  const handleLogout = () => {
    setUserLoggedIn(false);
    setCurrentPage('home');
  };

  // Cambiar el título según la página
  useEffect(() => {
    let title = 'Antártica - Tienda de Libros';
    if (currentPage === 'home') title = 'Antártica - Home';
    if (currentPage === 'login') title = 'Antártica - Login';
    if (currentPage === 'register') title = 'Antártica - Registro';
    if (currentPage === 'help') title = 'Antártica - Ayuda';
    if (currentPage === 'contact') title = 'Antártica - Contacto';
    document.title = title;
  }, [currentPage]);

  return (
    <>
      <Header
        userLoggedIn={userLoggedIn}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

  {currentPage === 'home' && <Home />}
  {currentPage === 'login' && <Login />}
  {currentPage === 'register' && <Register />}
  {currentPage === 'ayuda' && <Ayuda />}
  {currentPage === 'contact' && <Contact />}
  {currentPage === 'sobrenosotros' && <SobreNosotros />}
    </>
  );
}

export default App;
