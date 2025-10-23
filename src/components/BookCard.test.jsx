import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from './BookCard';

describe('Componente BookCard', () => {
  const mockBook = {
    title: 'El Principito',
    author: 'Antoine de Saint-Exupéry',
    price: 15000,
    image: '/assets/principito.png',
    description: 'Un clásico de la literatura universal que narra la historia de un pequeño príncipe.'
  };

  const mockAddToCart = vi.fn();

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  it('se renderiza sin fallar', () => {
    render(<BookCard book={mockBook} addToCart={mockAddToCart} />);
    expect(screen.getAllByText('El Principito')).toHaveLength(2); // Aparece en front y back
  });

  it('muestra la información del libro en la parte frontal', () => {
    render(<BookCard book={mockBook} addToCart={mockAddToCart} />);
    
    // Verificar imagen
    const imagen = screen.getByAltText('El Principito');
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute('src', '/assets/principito.png');
    expect(imagen).toHaveClass('book-image');
    
    // Verificar título (aparece dos veces: front y back)
    expect(screen.getAllByText('El Principito')).toHaveLength(2);
  });

  it('muestra la información detallada en la parte trasera', () => {
    render(<BookCard book={mockBook} addToCart={mockAddToCart} />);
    
    // Verificar autor
    expect(screen.getByText('Antoine de Saint-Exupéry')).toBeInTheDocument();
    expect(screen.getByText('Autor:', { exact: false })).toBeInTheDocument();
    
    // Verificar precio
    expect(screen.getByText('$15000')).toBeInTheDocument();
    expect(screen.getByText('Precio:', { exact: false })).toBeInTheDocument();
    
    // Verificar descripción
    expect(screen.getByText(/Un clásico de la literatura universal/)).toBeInTheDocument();
  });

  it('muestra el botón "Agregar al carrito"', () => {
    render(<BookCard book={mockBook} addToCart={mockAddToCart} />);
    
    const botonAgregar = screen.getByText('Agregar al carrito');
    expect(botonAgregar).toBeInTheDocument();
    expect(botonAgregar).toHaveClass('add-button');
  });

  it('llama a addToCart cuando se hace clic en el botón', () => {
    render(<BookCard book={mockBook} addToCart={mockAddToCart} />);
    
    const botonAgregar = screen.getByText('Agregar al carrito');
    fireEvent.click(botonAgregar);
    
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockBook);
  });

  it('maneja libros con información mínima', () => {
    const libroMinimo = {
      title: 'Libro Test',
      author: 'Autor Test',
      price: 10000,
      image: '/test.jpg',
      description: 'Descripción test'
    };

    render(<BookCard book={libroMinimo} addToCart={mockAddToCart} />);
    
    expect(screen.getAllByText('Libro Test')).toHaveLength(2);
    expect(screen.getByText('Autor Test')).toBeInTheDocument();
    expect(screen.getByText('$10000')).toBeInTheDocument();
    expect(screen.getByText('Descripción test')).toBeInTheDocument();
  });

  it('tiene la estructura CSS correcta para el flip effect', () => {
    render(<BookCard book={mockBook} addToCart={mockAddToCart} />);
    
    // Verificar clases CSS necesarias para el efecto flip
    const flipCard = document.querySelector('.flip-card');
    const flipCardInner = document.querySelector('.flip-card-inner');
    const flipCardFront = document.querySelector('.flip-card-front');
    const flipCardBack = document.querySelector('.flip-card-back');
    
    expect(flipCard).toBeInTheDocument();
    expect(flipCardInner).toBeInTheDocument();
    expect(flipCardFront).toBeInTheDocument();
    expect(flipCardBack).toBeInTheDocument();
  });

  it('funciona sin función addToCart', () => {
    // Probar que no falle si no se pasa la función
    expect(() => {
      render(<BookCard book={mockBook} />);
    }).not.toThrow();
    
    const botonAgregar = screen.getByText('Agregar al carrito');
    expect(botonAgregar).toBeInTheDocument();
  });
});
