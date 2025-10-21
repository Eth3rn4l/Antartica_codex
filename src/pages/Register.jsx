// src/pages/Register.jsx
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
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
   * handleSubmit
   * Se ejecuta al enviar el formulario, valida y muestra alerta si es correcto
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear objeto de errores
    const newErrors = {};

    // Validar campos requeridos
    if (!validateRequired(formData.nombre)) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!validateRequired(formData.apellido)) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    // Validar email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    // Validar contraseña
    if (!validateMinLength(formData.password, 8)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar confirmación de contraseña
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar teléfono chileno
    if (!validateChileanPhone(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido. Debe iniciar con +569 y tener 9 dígitos';
    }

    // Validar RUT chileno
    if (!validateRUT(formData.rut)) {
      newErrors.rut = 'RUT inválido';
    }

    // Validar región y comuna
    if (!validateRequired(formData.region)) {
      newErrors.region = 'La región es obligatoria';
    }

    if (!validateRequired(formData.comuna)) {
      newErrors.comuna = 'La comuna es obligatoria';
    }

    // Usar flushSync para forzar renderizado inmediato
    flushSync(() => {
      setErrors(newErrors);
    });
    
    const isValid = Object.keys(newErrors).length === 0;
    
    if (isValid) {
      console.log('Usuario registrado:', formData);
      alert('Registro exitoso');

      // Reinicia el formulario y limpia errores
      flushSync(() => {
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
        setErrors({});
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Registro de Usuario</h2>
        <form onSubmit={handleSubmit} style={formStyle} role="form">
          {["nombre", "apellido", "email", "password", "confirmPassword", "telefono", "region", "comuna", "rut"].map((field) => (
            <div key={field} style={inputContainerStyle}>
              <input
                type={field === 'password' || field === 'confirmPassword' ? 'password' : 'text'}
                name={field}
                placeholder={
                  field === 'password'
                    ? 'Contraseña'
                    : field === 'confirmPassword'
                    ? 'Confirmar Contraseña'
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={formData[field]}
                onChange={handleChange}
                style={inputStyle}
                required
              />
              {errors[field] && <span style={errorStyle} data-testid={`error-${field}`}>{errors[field]}</span>}
            </div>
          ))}
          <button type="submit" style={buttonStyle}>Registrar</button>
          {/* Debug: mostrar errores actuales siempre */}
          <div style={{marginTop: '1rem', fontSize: '0.8rem', color: 'red'}}>
            Debug - Errores en estado: {JSON.stringify(errors)}
          </div>
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

// Contenedor de cada input
const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
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
  display: 'block',
  fontWeight: '500'
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
