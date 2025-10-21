import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  getCartItems,
  setCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartItemCount,
  getCartTotal
} from '../utils/almacenamiento.js';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Storage Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setLocalStorage', () => {
    it('debe guardar datos en localStorage correctamente', () => {
      const testData = { nombre: 'Juan', edad: 30 };
      
      const result = setLocalStorage('testKey', testData);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(testData)
      );
    });

    it('debe manejar errores al guardar', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = setLocalStorage('testKey', 'data');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getLocalStorage', () => {
    it('debe obtener datos de localStorage correctamente', () => {
      const testData = { nombre: 'Juan', edad: 30 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));

      const result = getLocalStorage('testKey');

      expect(result).toEqual(testData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
    });

    it('debe retornar valor por defecto si no existe la clave', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getLocalStorage('testKey', 'defaultValue');

      expect(result).toBe('defaultValue');
    });

    it('debe retornar valor por defecto si hay error al parsear', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue('invalid json');

      const result = getLocalStorage('testKey', 'defaultValue');

      expect(result).toBe('defaultValue');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('removeLocalStorage', () => {
    it('debe remover elemento de localStorage correctamente', () => {
      const result = removeLocalStorage('testKey');

      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('debe manejar errores al remover', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Remove error');
      });

      const result = removeLocalStorage('testKey');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('clearLocalStorage', () => {
    it('debe limpiar localStorage correctamente', () => {
      const result = clearLocalStorage();

      expect(result).toBe(true);
      expect(localStorageMock.clear).toHaveBeenCalled();
    });

    it('debe manejar errores al limpiar', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.clear.mockImplementation(() => {
        throw new Error('Clear error');
      });

      const result = clearLocalStorage();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getCartItems', () => {
    it('debe obtener elementos del carrito', () => {
      const cartItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 2 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cartItems));

      const result = getCartItems();

      expect(result).toEqual(cartItems);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('cartItems');
    });

    it('debe retornar array vacío si no hay elementos', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getCartItems();

      expect(result).toEqual([]);
    });
  });

  describe('setCartItems', () => {
    it('debe guardar elementos del carrito', () => {
      // Asegurarse de que setItem funcione correctamente para este test
      localStorageMock.setItem.mockImplementation(() => {});
      
      const cartItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 2 }
      ];

      const result = setCartItems(cartItems);

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cartItems',
        JSON.stringify(cartItems)
      );
    });
  });

  describe('addToCart', () => {
    it('debe agregar nuevo producto al carrito', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
      
      const product = { id: 1, name: 'Libro 1', price: 15000 };
      
      const result = addToCart(product);

      expect(result).toEqual([{ ...product, quantity: 1 }]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cartItems',
        JSON.stringify([{ ...product, quantity: 1 }])
      );
    });

    it('debe incrementar cantidad si producto ya existe', () => {
      const existingItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 1 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingItems));
      
      const product = { id: 1, name: 'Libro 1', price: 15000 };
      
      const result = addToCart(product);

      expect(result).toEqual([
        { id: 1, name: 'Libro 1', price: 15000, quantity: 2 }
      ]);
    });
  });

  describe('removeFromCart', () => {
    it('debe remover producto del carrito', () => {
      const existingItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 1 },
        { id: 2, name: 'Libro 2', price: 20000, quantity: 1 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingItems));

      const result = removeFromCart(1);

      expect(result).toEqual([
        { id: 2, name: 'Libro 2', price: 20000, quantity: 1 }
      ]);
    });
  });

  describe('updateCartItemQuantity', () => {
    it('debe actualizar cantidad del producto', () => {
      const existingItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 1 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingItems));

      const result = updateCartItemQuantity(1, 3);

      expect(result).toEqual([
        { id: 1, name: 'Libro 1', price: 15000, quantity: 3 }
      ]);
    });

    it('debe remover producto si cantidad es 0 o menor', () => {
      const existingItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 1 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingItems));

      const result = updateCartItemQuantity(1, 0);

      expect(result).toEqual([]);
    });
  });

  describe('getCartItemCount', () => {
    it('debe calcular total de productos en carrito', () => {
      const cartItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 2 },
        { id: 2, name: 'Libro 2', price: 20000, quantity: 1 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cartItems));

      const result = getCartItemCount();

      expect(result).toBe(3);
    });

    it('debe retornar 0 para carrito vacío', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const result = getCartItemCount();

      expect(result).toBe(0);
    });
  });

  describe('getCartTotal', () => {
    it('debe calcular total del precio del carrito', () => {
      const cartItems = [
        { id: 1, name: 'Libro 1', price: 15000, quantity: 2 },
        { id: 2, name: 'Libro 2', price: 20000, quantity: 1 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cartItems));

      const result = getCartTotal();

      expect(result).toBe(50000); // (15000 * 2) + (20000 * 1)
    });

    it('debe retornar 0 para carrito vacío', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const result = getCartTotal();

      expect(result).toBe(0);
    });
  });
});
