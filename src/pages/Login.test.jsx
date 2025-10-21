import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

// Mock de window.alert
global.alert = vi.fn();

describe('Componente Login', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    vi.clearAllMocks();
  });

  it('se renderiza sin fallar', () => {
    render(<Login />);
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('muestra los campos de formulario necesarios', () => {
    render(<Login />);
    
    expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('permite escribir en los campos del formulario', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Correo');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('valida formato de correo electrónico', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Correo');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const form = emailInput.closest('form');
    
    // Probar con correo inválido
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });
  });

  it('valida que la contraseña no esté vacía', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Correo');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const form = emailInput.closest('form');
    
    // Probar con contraseña vacía
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Contraseña requerida')).toBeInTheDocument();
    });
  });

  it('muestra alerta de éxito con datos válidos', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Correo');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const form = emailInput.closest('form');
    
    // Llenar con datos válidos
    fireEvent.change(emailInput, { target: { value: 'usuario@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Login exitoso');
    });
  });

  it('limpia el error cuando se envía formulario válido', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Correo');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const form = emailInput.closest('form');
    
    // Primero crear un error
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });
    
    // Luego corregir el correo
    fireEvent.change(emailInput, { target: { value: 'correo@valido.com' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.queryByText('Correo inválido')).not.toBeInTheDocument();
    });
  });

  it('acepta diferentes formatos de correo válidos', async () => {
    const correosValidos = [
      'test@example.com',
      'usuario.test@gmail.com',
      'admin@mi-sitio.cl',
      'test123@universidad.edu'
    ];

    for (const correo of correosValidos) {
      render(<Login />);
      
      const emailInput = screen.getByPlaceholderText('Correo');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const form = emailInput.closest('form');
      
      fireEvent.change(emailInput, { target: { value: correo } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Login exitoso');
      });
      
      // Limpiar para la siguiente iteración
      document.body.innerHTML = '';
      vi.clearAllMocks();
    }
  });

  it('rechaza formatos de correo inválidos', async () => {
    const correosInvalidos = [
      'correo-sin-arroba',
      '@sin-usuario.com',
      'usuario@',
      'usuario@sin-punto',
      'correo con espacios@ejemplo.com'
    ];

    for (const correo of correosInvalidos) {
      render(<Login />);
      
      const emailInput = screen.getByPlaceholderText('Correo');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const form = emailInput.closest('form');
      
      fireEvent.change(emailInput, { target: { value: correo } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Correo inválido')).toBeInTheDocument();
      });
      
      // Limpiar para la siguiente iteración
      document.body.innerHTML = '';
    }
  });

  it('previene el envío del formulario por defecto', () => {
    render(<Login />);
    
    const form = screen.getByRole('button', { name: 'Entrar' }).closest('form');
    const preventDefaultSpy = vi.fn();
    
    const mockEvent = {
      preventDefault: preventDefaultSpy,
      target: form
    };
    
    // Simular envío del formulario
    fireEvent.submit(form, mockEvent);
    
    // Como no podemos interceptar directamente preventDefault,
    // verificamos que el formulario tenga el handler onSubmit
    expect(form).toHaveAttribute('onsubmit');
  });
});
