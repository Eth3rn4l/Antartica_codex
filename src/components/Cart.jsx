// Importación de React y hooks necesarios
import React from 'react';
import { useCarritoContext } from '../context/CarritoContext.jsx';

// Componente funcional Cart que recibe props: cartItems y removeFromCart
function Cart({ removeFromCart: _propRemove }) {
  const cartContext = useCarritoContext();
  const cartItems = cartContext?.items || [];

  // Función para eliminar un producto del carrito
  const removeFromCart = (index) => {
    const item = cartItems[index];
    if (!item) return;
    if (!cartContext?.removeItem) return;
    cartContext.removeItem(item.id)
      .then(() => {
        if (_propRemove) _propRemove(index);
      })
      .catch((e) => alert(e.message));
  };

  // Función para procesar el pago (checkout)
  const handleCheckout = async () => {
    if (!cartContext?.checkout) return;
    cartContext.checkout()
      .catch((e) => {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (Array.isArray(localCart) && localCart.length === 0) {
          alert('Compra Hecha!');
          return;
        }
        alert(e.message);
      });
  };

  // Calcula el total de precios de todos los productos en el carrito
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  // Renderizado del componente
  return (
    <div style={cartContainerStyle}>
      <h3>Carrito de Compras</h3>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p> // Mensaje si no hay productos
      ) : (
        <>
          {/* Lista de productos en el carrito */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index} style={itemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Imagen del producto */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '50px', height: '70px', objectFit: 'cover' }} 
                  />
                  {/* Título y precio del producto */}
                  <span>{item.title} - ${item.price}</span>
                </div>
                {/* Botón para eliminar el producto */}
                <button style={removeButtonStyle} onClick={() => removeFromCart(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          {/* Total del carrito */}
          <p><strong>Total: </strong>${total}</p>
          {/* Mostrar botón Pagar solo para usuarios role 'client' */}
          {(() => {
            try {
              const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
              if (u && u.role === 'client') {
                return (
                  <div style={{ marginTop: '1rem' }}>
                    <button style={checkoutButtonStyle} onClick={handleCheckout}>Pagar</button>
                  </div>
                );
              }
            } catch { /* ignore parse errors */ }
            return null;
          })()}
        </>
      )}
    </div>
  );
}

// Estilos del contenedor del carrito
const cartContainerStyle = { 
  padding: '2rem', 
  border: '1px solid #646cff', 
  borderRadius: '8px', 
  backgroundColor: '#B4E2ED', 
  color: 'white', 
  margin: '2rem auto', 
  maxWidth: '800px' 
};

// Estilos para cada item del carrito
const itemStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '1rem' 
};

// Estilos del botón de eliminar
const removeButtonStyle = { 
  backgroundColor: '#ff4d4d', 
  border: 'none', 
  borderRadius: '4px', 
  padding: '0.3rem 0.6rem', 
  color: 'white', 
  cursor: 'pointer' 
};

const checkoutButtonStyle = {
  backgroundColor: '#28a745',
  border: 'none',
  borderRadius: '6px',
  padding: '0.6rem 1.2rem',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
};

// Exportación del componente para poder usarlo en otros archivos
export default Cart;
