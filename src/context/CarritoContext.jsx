import { createContext, useContext } from 'react';
import useCarrito from '../hooks/useCarrito.js';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const cart = useCarrito();
  return (
    <CarritoContext.Provider value={cart}>
      {children}
    </CarritoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarritoContext() {
  return useContext(CarritoContext);
}

export default CarritoContext;
