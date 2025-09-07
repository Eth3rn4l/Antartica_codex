import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './components/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Ayuda from './pages/Ayuda';
import Contact from './pages/Contact';
import Footer from './Footer'; // Importa el Footer

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ayuda" element={<Ayuda />} /> {/* <--- Ruta */}
        <Route path="/contact" element={<Contact />} /> {/* <--- Ruta */}
      </Routes>
      <Footer /> {/* Agrega el Footer aquí */}
    </BrowserRouter>
  </StrictMode>
);
