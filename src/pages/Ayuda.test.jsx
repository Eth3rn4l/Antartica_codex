import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Ayuda from './Ayuda';

describe('Componente Ayuda', () => {
  it('renderiza el título del centro de ayuda', () => {
    render(<Ayuda />);
    expect(screen.getByText('Centro de Ayuda')).toBeInTheDocument();
  });

  it('renderiza el texto descriptivo', () => {
    render(<Ayuda />);
    expect(screen.getByText(/Aquí encontrarás las respuestas a las preguntas más frecuentes/)).toBeInTheDocument();
  });

  it('renderiza todas las preguntas frecuentes', () => {
    render(<Ayuda />);
    
    expect(screen.getByText('¿Cómo puedo comprar un libro?')).toBeInTheDocument();
    expect(screen.getByText('¿Cuáles son los métodos de pago disponibles?')).toBeInTheDocument();
    expect(screen.getByText('¿Hacen envíos a regiones?')).toBeInTheDocument();
    expect(screen.getByText('¿Cuánto demora en llegar mi pedido?')).toBeInTheDocument();
    expect(screen.getByText('¿Puedo devolver un libro si no me gustó?')).toBeInTheDocument();
  });

  it('alterna las respuestas cuando se hace clic en las preguntas', () => {
    render(<Ayuda />);
    
    const primeraPregunta = screen.getByText('¿Cómo puedo comprar un libro?');
    
    // Inicialmente, la respuesta no debe ser visible
    expect(screen.queryByText(/Debes crear una cuenta/)).not.toBeInTheDocument();
    
    // Hacer clic para expandir
    fireEvent.click(primeraPregunta);
    expect(screen.getByText(/Debes crear una cuenta/)).toBeInTheDocument();
    
    // Hacer clic de nuevo para colapsar
    fireEvent.click(primeraPregunta);
    expect(screen.queryByText(/Debes crear una cuenta/)).not.toBeInTheDocument();
  });

  it('muestra los iconos más/menos correctamente', () => {
    render(<Ayuda />);
    
    // Inicialmente debe mostrar iconos de más
    const iconosMas = screen.getAllByText('+');
    expect(iconosMas).toHaveLength(5);
    
    // Hacer clic en la primera pregunta
    const primeraPregunta = screen.getByText('¿Cómo puedo comprar un libro?');
    fireEvent.click(primeraPregunta);
    
    // Ahora debe tener un icono menos y cuatro iconos más
    expect(screen.getAllByText('+')).toHaveLength(4);
    expect(screen.getByText('−')).toBeInTheDocument();
  });

  it('renderiza los elementos del formulario de contacto', () => {
    render(<Ayuda />);
    
    expect(screen.getByText('¿No encontraste tu respuesta?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu correo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu consulta...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('previene el envío del formulario', () => {
    render(<Ayuda />);
    
    const formulario = screen.getByRole('button', { name: 'Enviar' }).closest('form');
    const manejadorEnvio = vi.fn();
    
    formulario.addEventListener('submit', manejadorEnvio);
    
    fireEvent.submit(formulario);
    
    expect(manejadorEnvio).toHaveBeenCalled();
  });
});
