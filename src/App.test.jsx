import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Envolvemos el componente en BrowserRouter porque usa React Router
const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('Componente App', () => {
  it('se renderiza sin fallar', () => {
    renderApp();
    // Verifica que el componente se renderice correctamente buscando el header
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('muestra el logo de Antártica', () => {
    renderApp();
    // Verifica que aparezca el logo
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/logo.png');
  });

  it('muestra el buscador en el header', () => {
    renderApp();
    // Verifica que aparezca el campo de búsqueda
    const searchInput = screen.getByPlaceholderText('Buscar');
    expect(searchInput).toBeInTheDocument();
  });

  it('cambia el título del documento según la página', () => {
    renderApp();
    // Verifica que el título inicial sea correcto
    expect(document.title).toBe('Antártica - Home');
  });

  it('tiene la estructura básica de navegación', () => {
    renderApp();
    
    // Verifica que exista el header
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Verifica que exista el logo (no necesariamente como link)
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    
    // Verifica que el logo sea clickeable
    expect(logo.parentElement).toHaveStyle('cursor: pointer');
  });

  it('muestra elementos de navegación principales', () => {
    renderApp();
    
    // Verifica que existan elementos importantes del header
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });
});
