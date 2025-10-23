// Importación de dependencias
import React, { useState } from "react";       // React y hook useState para manejar estado local
import SidebarCategorias from "./SidebarCategorias";
import "./SearchInline.css";
import "./Header.css";                         // Importación del CSS que contiene estilos para el header, input y buscador

// Componente funcional Header
function Header({ userLoggedIn, userRole, userEmail, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = React.useRef();
  const [cartItems, setCartItems] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const logoUrl = '/assets/logo.png';
  return (
      <header style={headerStyle}>
    <div style={{ width: '100%' }}>        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%' }}>
          <div 
            onClick={() => onNavigate('home')}
            style={{ cursor: 'pointer' }}
          >
            <img src={logoUrl} alt="Logo" style={{ height: '50px' }} />
          </div>
          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
            <SidebarCategorias horizontal={true} />
          </div>
          <div className="content-inline" style={{ flex: 1 }}>
            <div className="search-inline">
              <input name="txtSearch" className="search-inline--input" placeholder="Buscar" />
            </div>
          </div>
          
          {/* Mostrar información del usuario si está logueado */}
          {userLoggedIn && (
            <div style={{ color: 'white', fontSize: '0.9rem', marginRight: '1rem' }}>
              {userRole === 'admin' ? '👑 Admin:' : '👤 Usuario:'} {userEmail}
            </div>
          )}
          
          <div 
            onClick={() => onNavigate('cart')}
            style={{ ...cartIconContainer, cursor: 'pointer' }}
          >
            🛒
            {cartItems > 0 && <span style={cartCountStyle}>{cartItems}</span>}
          </div>
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => {
                clearTimeout(closeTimeout.current);
                setMenuOpen(true);
              }}
              onMouseLeave={() => {
                closeTimeout.current = setTimeout(() => setMenuOpen(false), 250);
              }}
            >
              <div
                style={hamburgerStyle}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </div>
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#fff',
                    color: '#213547',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '1px solid #194C57',
                    minWidth: '180px',
                    maxHeight: '350px',
                    overflowY: 'auto',
                    zIndex: 99999,
                    margin: 0,
                    padding: '0.5rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                  }}
                  onMouseEnter={() => {
                    clearTimeout(closeTimeout.current);
                    setMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    closeTimeout.current = setTimeout(() => setMenuOpen(false), 250);
                  }}
                >
                  {/* Menú dinámico según el estado del usuario */}
                  {!userLoggedIn ? (
                    <>
                      <div 
                        style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }} 
                        onClick={() => { onNavigate('login'); setMenuOpen(false); }}
                      >
                        Login
                      </div>
                      <div 
                        style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }} 
                        onClick={() => { onNavigate('register'); setMenuOpen(false); }}
                      >
                        Registro
                      </div>
                    </>
                  ) : (
                    <>
                      {userRole === 'admin' && (
                        <div 
                          style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }} 
                          onClick={() => { onNavigate('admin'); setMenuOpen(false); }}
                        >
                          📊 Dashboard Admin
                        </div>
                      )}
                      <div 
                        style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }} 
                        onClick={() => { onLogout(); setMenuOpen(false); }}
                      >
                        🚪 Cerrar Sesión
                      </div>
                    </>
                  )}
                  
                  <div 
                    style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }} 
                    onClick={() => { onNavigate('sobrenosotros'); setMenuOpen(false); }}
                  >
                    Sobre Nosotros
                  </div>
                  <div 
                    style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }} 
                    onClick={() => { onNavigate('ayuda'); setMenuOpen(false); }}
                  >
                    Ayuda
                  </div>
                  <div 
                    style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }} 
                    onClick={() => { onNavigate('contact'); setMenuOpen(false); }}
                  >
                    Contacto
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
}

/* ===========================================
   Estilos en línea
   =========================================== */

const headerStyle = {
  padding: "1rem",
  backgroundColor: "#194C57",
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const navStyle = {
  display: "flex",
  gap: "1rem", // Separación entre links
};

const rightBlockStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem", // Separación entre carrito y hamburguesa
};

    const hamburgerStyle = {
      fontSize: "28px",
      cursor: "pointer",
      color: "white",
      letterSpacing: '0.2em', // Alarga las líneas
    };

const menuStyle = {
  display: "flex",
  flexDirection: "column", // Apila los links verticalmente
  position: "absolute",
  top: "60px",
  right: "10px",
  background: "#194C57",
  padding: "1rem",
  borderRadius: "8px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "1rem",
};

const cartIconContainer = {
  position: "relative",
  fontSize: "24px",
  color: "white",
  textDecoration: "none",
};

const cartCountStyle = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  background: "red",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "white",
};

// Centrar buscador horizontalmente
const searchContainerStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1, // Asegura que quede por encima de otros elementos
};

export default Header;
