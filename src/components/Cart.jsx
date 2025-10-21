// Importación de React y hooks necesarios
import React, { useState, useEffect } from 'react';

// Componente funcional Cart que recibe props: cartItems y removeFromCart
function Cart({ cartItems: propCart, removeFromCart: propRemove }) {
  // Estado local 'cartItems' que mantiene los productos en el carrito
  const [cartItems, setCartItems] = useState([]);

  // useEffect se ejecuta una vez al montar el componente
  // Obtiene los productos guardados en localStorage bajo la clave 'cart'
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart)); // Actualiza el estado con los productos guardados
  }, []); // Array vacío [] indica que solo se ejecuta al montar

  // Función para eliminar un producto del carrito
  const removeFromCart = (index) => {
    // Filtra los productos, eliminando el que tiene el índice indicado
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated); // Actualiza el estado local
    localStorage.setItem('cart', JSON.stringify(updated)); // Actualiza el localStorage
    if (propRemove) propRemove(index); // Llama a la función pasada por props si existe
  };

  // Calcula el total de precios de todos los productos en el carrito
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

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

// Exportación del componente para poder usarlo en otros archivos
export default Cart;
