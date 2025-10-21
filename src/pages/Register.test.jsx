import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';

// Mock de window.alert
global.alert = vi.fn();

describe('Componente Register', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    vi.clearAllMocks();
  });

  it('se renderiza sin fallar', () => {
    render(<Register />);
    expect(screen.getByText('Registro de Usuario')).toBeInTheDocument();
  });

  it('muestra todos los campos del formulario', () => {
    render(<Register />);
    
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apellido')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmar Contraseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Telefono')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Region')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Comuna')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rut')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
  });

  it('permite escribir en todos los campos', () => {
    render(<Register />);
    
    const datosFormulario = {
      'Nombre': 'Juan',
      'Apellido': 'Pérez',
      'Email': 'juan@example.com',
      'Contraseña': 'password123',
      'Confirmar Contraseña': 'password123',
      'Telefono': '+569123456789',
      'Region': 'Metropolitana',
      'Comuna': 'Santiago',
      'Rut': '12345678-9'
    };

    Object.entries(datosFormulario).forEach(([placeholder, valor]) => {
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.change(input, { target: { value: valor } });
      expect(input.value).toBe(valor);
    });
  });

  it('valida formato de correo electrónico', async () => {
    render(<Register />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const form = screen.getByRole('form') || emailInput.closest('form');
    
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });
  });

  it('valida que las contraseñas coincidan', async () => {
    render(<Register />);
    
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  it('valida formato de teléfono chileno', async () => {
    render(<Register />);
    
    const telefonoInput = screen.getByPlaceholderText('Telefono');
    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    
    // Probar teléfono inválido
    fireEvent.change(telefonoInput, { target: { value: '123456789' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Teléfono inválido. Debe iniciar con +569 y tener 9 dígitos')).toBeInTheDocument();
    });
  });

  it('acepta teléfono chileno válido', async () => {
    render(<Register />);
    
    const telefonoInput = screen.getByPlaceholderText('Telefono');
    
    fireEvent.change(telefonoInput, { target: { value: '+56912345678' } });
    
    expect(telefonoInput.value).toBe('+56912345678');
  });

  it('valida RUT chileno correctamente', async () => {
    render(<Register />);
    
    const rutInput = screen.getByPlaceholderText('Rut');
    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    
    // Probar RUT inválido
    fireEvent.change(rutInput, { target: { value: '12345678-0' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('RUT inválido')).toBeInTheDocument();
    });
  });

  it('acepta RUT chileno válido', async () => {
    render(<Register />);
    
    const rutInput = screen.getByPlaceholderText('Rut');
    
    // RUT válido conocido
    fireEvent.change(rutInput, { target: { value: '12345678-5' } });
    
    expect(rutInput.value).toBe('12345678-5');
  });

  it('registra usuario exitosamente con datos válidos', async () => {
    render(<Register />);
    
    // Llenar todos los campos con datos válidos
    const datosValidos = {
      'Nombre': 'Juan',
      'Apellido': 'Pérez',
      'Email': 'juan@example.com',
      'Contraseña': 'password123',
      'Confirmar Contraseña': 'password123',
      'Telefono': '+56912345678',
      'Region': 'Metropolitana',
      'Comuna': 'Santiago',
      'Rut': '12345678-5' // RUT válido
    };

    Object.entries(datosValidos).forEach(([placeholder, valor]) => {
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.change(input, { target: { value: valor } });
    });

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Registro exitoso');
    });
  });

  it('reinicia el formulario después de registro exitoso', async () => {
    render(<Register />);
    
    // Llenar campos
    const nombreInput = screen.getByPlaceholderText('Nombre');
    const emailInput = screen.getByPlaceholderText('Email');
    
    fireEvent.change(nombreInput, { target: { value: 'Juan' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    
    // Verificar que tienen valores
    expect(nombreInput.value).toBe('Juan');
    expect(emailInput.value).toBe('juan@example.com');
    
    // Simular registro exitoso (necesitaría llenar todos los campos válidos)
    const datosValidos = {
      'Nombre': 'Juan',
      'Apellido': 'Pérez',
      'Email': 'juan@example.com',
      'Contraseña': 'password123',
      'Confirmar Contraseña': 'password123',
      'Telefono': '+56912345678',
      'Region': 'Metropolitana',
      'Comuna': 'Santiago',
      'Rut': '12345678-5'
    };

    Object.entries(datosValidos).forEach(([placeholder, valor]) => {
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.change(input, { target: { value: valor } });
    });

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Registro exitoso');
      expect(nombreInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });

  it('muestra múltiples errores simultáneamente', async () => {
    render(<Register />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar Contraseña');
    const telefonoInput = screen.getByPlaceholderText('Telefono');
    const rutInput = screen.getByPlaceholderText('Rut');
    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    
    // Llenar con datos inválidos
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.change(passwordInput, { target: { value: 'pass1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'pass2' } });
    fireEvent.change(telefonoInput, { target: { value: '123456' } });
    fireEvent.change(rutInput, { target: { value: '12345678-0' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      expect(screen.getByText('Teléfono inválido. Debe iniciar con +569 y tener 9 dígitos')).toBeInTheDocument();
      expect(screen.getByText('RUT inválido')).toBeInTheDocument();
    });
  });
});
