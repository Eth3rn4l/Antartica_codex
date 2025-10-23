import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Cart';

// Mock del localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('Componente Cart', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('se renderiza sin fallar', () => {
    render(<Cart />);
    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
  });

  it('muestra mensaje cuando el carrito está vacío', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<Cart />);
    expect(screen.getByText('No hay productos en el carrito.')).toBeInTheDocument();
  });

  it('carga productos desde localStorage al inicializar', () => {
    const mockCart = [
      { title: 'Libro 1', price: 15000, image: '/test.jpg' },
      { title: 'Libro 2', price: 20000, image: '/test2.jpg' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(<Cart />);
    
    expect(screen.getByText('Libro 1 - $15000')).toBeInTheDocument();
    expect(screen.getByText('Libro 2 - $20000')).toBeInTheDocument();
  });

  it('calcula el total correctamente', () => {
    const mockCart = [
      { title: 'Libro 1', price: 15000, image: '/test.jpg' },
      { title: 'Libro 2', price: 20000, image: '/test2.jpg' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(<Cart />);
    
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$35000')).toBeInTheDocument();
  });

  it('elimina un producto del carrito', () => {
    const mockCart = [
      { title: 'Libro 1', price: 15000, image: '/test.jpg' },
      { title: 'Libro 2', price: 20000, image: '/test2.jpg' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(<Cart />);
    
    // Verificar que ambos libros están presentes
    expect(screen.getByText('Libro 1 - $15000')).toBeInTheDocument();
    expect(screen.getByText('Libro 2 - $20000')).toBeInTheDocument();
    
    // Hacer clic en el primer botón "Eliminar"
    const eliminarButtons = screen.getAllByText('Eliminar');
    fireEvent.click(eliminarButtons[0]);
    
    // Verificar que se guardó en localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ title: 'Libro 2', price: 20000, image: '/test2.jpg' }])
    );
  });

  it('actualiza el total después de eliminar un producto', () => {
    const mockCart = [
      { title: 'Libro 1', price: 15000, image: '/test.jpg' },
      { title: 'Libro 2', price: 20000, image: '/test2.jpg' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(<Cart />);
    
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$35000')).toBeInTheDocument();
    
    // Eliminar un producto
    const eliminarButtons = screen.getAllByText('Eliminar');
    fireEvent.click(eliminarButtons[0]);
    
    // El total debería actualizarse
    expect(screen.getByText('$20000')).toBeInTheDocument();
  });

  it('llama a la función propRemove cuando se pasa por props', () => {
    const mockRemove = vi.fn();
    const mockCart = [
      { title: 'Libro 1', price: 15000, image: '/test.jpg' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(<Cart removeFromCart={mockRemove} />);
    
    const eliminarButton = screen.getByText('Eliminar');
    fireEvent.click(eliminarButton);
    
    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('muestra las imágenes de los productos', () => {
    const mockCart = [
      { title: 'Libro 1', price: 15000, image: '/test.jpg' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(<Cart />);
    
    const imagen = screen.getByAltText('Libro 1');
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute('src', '/test.jpg');
  });
});
