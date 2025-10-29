import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Ayuda from './pages/Ayuda';
import Contacto from './pages/Contacto';
import SobreNosotros from './pages/SobreNosotros';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminView from './pages/AdminView';

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
    <Router>
      <Header
        userLoggedIn={userLoggedIn}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={currentPage === 'home' && <Home />} />
        <Route path="/login" element={currentPage === 'login' && <Login />} />
        <Route path="/register" element={currentPage === 'register' && <Register />} />
        <Route path="/ayuda" element={currentPage === 'ayuda' && <Ayuda />} />
        <Route path="/contact" element={currentPage === 'contact' && <Contacto />} />
        <Route path="/sobrenosotros" element={currentPage === 'sobrenosotros' && <SobreNosotros />} />
        <Route path="/adminview" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

export default App;
