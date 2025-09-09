const promociones = [
  "Hasta 45% OFF Editorial Planeta",
  "Hasta 45% OFF Penguin Random House",
  "Hasta 45% OFF Editorial Zig Zag",
  "Outlet $5000",
  "Packs Planeta 60% OFF",
  "BOLSILLO 30% OFF",
  "AUTORES CHILENOS HASTA 45% OFF",
  "LIQUIDACIÓN 30% OFF",
  "LIQUIDACIÓN CONTRAPUNTO HASTA 30% OFF",
  "BOOKET 30% OFF"
];
const juegosAccesorios = [
  "Complementos",
  "Accesorios",
  "Escritura",
  "Entretención",
  "Juegos",
  "Especiales",
  "Deco",
  "Moda",
  "Papelería",
  "Láminas",
  "Libretas",
  "Mapas",
  "Organizadores"
];
import React, { useState } from "react";

const categorias = [
  "Arte y Arquitectura",
  "Bellas Artes",
  "Diseño",
  "Fotografía",
  "Musica",
  "Ciencias",
  "Ciencias Médicas",
  "Ingeniería Y Tecnología",
  "Ciencias Humanas",
  "Ciencias Sociales",
  "Derecho",
  "Historia Y Geografía",
  "Psicología",
  "Religión",
  "Computación e Informática",
  "Cuerpo y Mente",
  "Economía y Administración",
  "Deporte",
  "Infantil y Juvenil",
  "Literatura",
  "Comics y Manga"
];

function SidebarCategorias({ horizontal = false }) {
  const [open, setOpen] = useState(false);

  // Estilos para modo horizontal (Header)
  const dynamicSidebarStyle = horizontal
    ? { display: 'inline-block', position: 'relative', background: '#fff', color: '#213547', minHeight: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #194C57', borderRadius: '10px', zIndex: 1, padding: '0.5rem 0', marginLeft: '0.5rem' }
    : { ...sidebarStyle, minHeight: open ? 'calc(100vh - 80px)' : 'auto', height: open ? undefined : 'auto' };

  const btnStyle = horizontal
    ? { ...toggleBtnStyle, background: 'var(--color-primary)', color: 'var(--color-text-btn)', borderRadius: '0', fontSize: '1rem', padding: '0.5rem 1rem', width: 'auto', textAlign: 'center' }
    : toggleBtnStyle;

  const menuListStyle = horizontal
  ? { ...listStyle, position: 'absolute', top: '100%', left: 0, background: '#fff', color: '#213547', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #194C57', minWidth: '220px', maxHeight: 'none', overflowY: 'visible', zIndex: 9999, margin: 0, padding: '0.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderRadius: '10px' }
    : listStyle;

  // Mostrar el menú al pasar el mouse por encima del botón
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  const [openJuegos, setOpenJuegos] = useState(false);
  const [openPromos, setOpenPromos] = useState(false);
  return (
    <aside style={{ ...dynamicSidebarStyle, zIndex: 99999, position: 'relative' }}>
      <div style={{ position: 'relative', display: 'inline-block', zIndex: 99999, marginRight: '1rem' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button style={btnStyle} onClick={() => setOpen((o) => !o)}>
          Categorías
        </button>
        {open && (
          <ul style={menuListStyle}>
            {categorias.map((cat) => (
              <li key={cat} style={itemStyle}>{cat}</li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ position: 'relative', display: 'inline-block', zIndex: 99999, marginRight: '1rem' }} onMouseEnter={() => setOpenJuegos(true)} onMouseLeave={() => setOpenJuegos(false)}>
        <button style={btnStyle} onClick={() => setOpenJuegos((o) => !o)}>
          Juegos y Accesorios
        </button>
        {openJuegos && (
          <ul style={menuListStyle}>
            {juegosAccesorios.map((item) => (
              <li key={item} style={itemStyle}>{item}</li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ position: 'relative', display: 'inline-block', zIndex: 99999 }} onMouseEnter={() => setOpenPromos(true)} onMouseLeave={() => setOpenPromos(false)}>
        <button style={btnStyle} onClick={() => setOpenPromos((o) => !o)}>
          Promociones
        </button>
        {openPromos && (
          <ul style={menuListStyle}>
            {promociones.map((promo) => (
              <li key={promo} style={itemStyle}>{promo}</li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

const sidebarStyle = {
  position: 'fixed',
  top: '80px',
  left: 0,
  width: '260px',
  background: '#fff',
  color: '#213547',
  borderRight: '2px solid var(--color-primary)',
  minHeight: 'calc(100vh - 80px)',
  zIndex: 10,
  boxShadow: '2px 0 8px rgba(0,0,0,0.07)',
  fontFamily: 'inherit',
  transition: 'background 0.3s, color 0.3s',
};

const toggleBtnStyle = {
  width: '100%',
  padding: '1rem',
  background: 'var(--color-primary)',
  color: 'var(--color-text-btn)', // variable que cambia según modo
  border: 'none',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  cursor: 'pointer',
  textAlign: 'left',
  borderRadius: '0',
  transition: 'background 0.3s, color 0.3s',
};

const listStyle = {
  listStyle: 'none',
  margin: 0,
  padding: '0.5rem 1rem',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
};

const itemStyle = {
  padding: '0.7rem 1.2rem',
  borderBottom: '1px solid #eee',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

export default SidebarCategorias;
