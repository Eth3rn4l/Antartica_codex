// src/pages/Register.jsx
import React, { useState } from 'react';
import {
  validateEmail,
  validateRUT,
  validateChileanPhone,
  validatePasswordMatch,
  validateRequired,
  validateMinLength
} from '../utils/validadores.js';

/**
 * Componente Register
 * Formulario de registro de usuario con validación de email, contraseña, teléfono y RUT chileno.
 */
function Register() {
  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    region: '',
    comuna: '',
    rut: '',
  });

  // Estado para almacenar los errores de validación por campo
  const [errors, setErrors] = useState({});

  /**
   * handleChange
   * Actualiza el estado formData cuando el usuario escribe en un input
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Función de validación separada para mayor claridad
   */
  const validateForm = (data) => {
    const newErrors = {};

    // Validar campos requeridos
    if (!validateRequired(data.nombre)) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!validateRequired(data.apellido)) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    // Validar email
    if (!validateRequired(data.email)) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Correo inválido';
    }

    // Validar contraseña
    if (!validateRequired(data.password)) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!validateMinLength(data.password, 8)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar confirmación de contraseña
    if (!validateRequired(data.confirmPassword)) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (!validatePasswordMatch(data.password, data.confirmPassword)) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar teléfono chileno
    if (!validateRequired(data.telefono)) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!validateChileanPhone(data.telefono)) {
      newErrors.telefono = 'Teléfono inválido. Debe iniciar con +569 y tener 9 dígitos';
    }

    // Validar RUT chileno
    if (!validateRequired(data.rut)) {
      newErrors.rut = 'El RUT es obligatorio';
    } else if (!validateRUT(data.rut)) {
      newErrors.rut = 'RUT inválido';
    }

    // Validar región y comuna
    if (!validateRequired(data.region)) {
      newErrors.region = 'La región es obligatoria';
    }

    if (!validateRequired(data.comuna)) {
      newErrors.comuna = 'La comuna es obligatoria';
    }

    return newErrors;
  };

  /**
   * handleSubmit
   * Se ejecuta al enviar el formulario, valida y muestra alerta si es correcto
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Debug logs
    console.log('Register validation - formData:', formData);
    
    // Validar formulario
    const newErrors = validateForm(formData);
    console.log('Register validation - newErrors:', newErrors);
    
    // Actualizar errores inmediatamente
    setErrors(newErrors);

    // Determinar si es válido
    const isValid = Object.keys(newErrors).length === 0;

    if (isValid) {
      console.log('Usuario registrado:', formData);
      alert('Registro exitoso');

      // Limpiar errores y reiniciar formulario
      setErrors({});
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        region: '',
        comuna: '',
        rut: '',
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Registro de Usuario</h2>
        <form onSubmit={handleSubmit} style={formStyle} role="form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-nombre">
            {errors.nombre || ''}
          </span>

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-apellido">
            {errors.apellido || ''}
          </span>

          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-email">
            {errors.email || ''}
          </span>

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-password">
            {errors.password || ''}
          </span>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-confirmPassword">
            {errors.confirmPassword || ''}
          </span>

          <input
            type="text"
            name="telefono"
            placeholder="Telefono"
            value={formData.telefono}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-telefono">
            {errors.telefono || ''}
          </span>

          <input
            type="text"
            name="region"
            placeholder="Region"
            value={formData.region}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-region">
            {errors.region || ''}
          </span>

          <input
            type="text"
            name="comuna"
            placeholder="Comuna"
            value={formData.comuna}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-comuna">
            {errors.comuna || ''}
          </span>

          <input
            type="text"
            name="rut"
            placeholder="Rut"
            value={formData.rut}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <span style={errorStyle} data-testid="error-rut">
            {errors.rut || ''}
          </span>

          <button type="submit" style={buttonStyle}>Registrar</button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   Estilos adaptados de Ayuda.jsx
   ========================= */

// Contenedor centrado
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'var(--color-bg-light)',
  fontFamily: 'Arial, sans-serif',
  color: 'var(--color-text-light)',
};

// Tarjeta de formulario con borde y sombra
const cardStyle = {
  background: '#B4E2ED',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: '450px',
  border: '1px solid #646cff',
  color: 'grey',
};

// Título centrado
const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '1.8rem',
  color: '#194C57',
};

// Formulario vertical con espacio
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

// Inputs con borde morado y fondo blanco
const inputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: '1px solid #646cff',
  background: '#fff',
  color: 'grey',
  outline: 'none',
};

// Mensajes de error en rojo
const errorStyle = {
  color: '#f87171',
  fontSize: '0.85rem',
  marginTop: '0.25rem',
  marginBottom: '0.5rem',
  display: 'block',
  fontWeight: '500',
  minHeight: '1.2em',
  visibility: 'visible'
};

// Botón azul principal
const buttonStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#194C57',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.2s',
};

export default Register;
