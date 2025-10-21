// src/pages/Login.jsx
import React, { useState } from 'react';
import { validateEmail, validateRequired } from '../utils/validadores.js';

/**
 * Componente Login
 * Permite al usuario iniciar sesión ingresando correo y contraseña.
 * Valida formato de correo y que la contraseña no esté vacía.
 */
function Login() {
  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Estado para mostrar mensajes de error
  const [errors, setErrors] = useState({});

  /**
   * handleChange
   * Actualiza el estado del formulario cuando el usuario escribe en un input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * validate
   * Valida todos los campos del formulario usando utils/validators.js
   */
  const validate = (data) => {
    const newErrors = {};

    // Validar email
    if (!validateRequired(data.email)) {
      newErrors.email = 'Correo requerido';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Correo inválido';
    }

    // Validar password
    if (!validateRequired(data.password)) {
      newErrors.password = 'Contraseña requerida';
    }

    return newErrors;
  };

  /**
   * handleSubmit
   * Valida y procesa el formulario al enviar.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar usando las funciones de validators.js
    const newErrors = validate(formData);
    console.log('Login validation - formData:', formData);
    console.log('Login validation - newErrors:', newErrors);
    setErrors(newErrors);

    // Si hay errores, no continuar
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Limpiar errores y mostrar datos (simulación de login)
    console.log('Usuario logueado:', formData);
    alert('Login exitoso');
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Título de la tarjeta */}
        <h2 style={titleStyle}>Iniciar Sesión</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {errors.email && <span style={errorStyle}>{errors.email}</span>}
          
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {errors.password && <span style={errorStyle}>{errors.password}</span>}

          {/* Botón de envío */}
          <button type="submit" style={buttonStyle}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   Estilos inline adaptados de Ayuda.jsx
   ========================= */

// Contenedor principal centrado con fondo
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'var(--color-bg-light)', // mismo fondo que Ayuda.jsx
  fontFamily: 'Arial, sans-serif',
  color: 'var(--color-text-light)',
};

// Tarjeta de formulario con borde y sombra
const cardStyle = {
  background: '#B4E2ED', // fondo azul claro
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  color: 'grey',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #646cff', // borde morado
};

// Título centrado dentro de la tarjeta
const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '1.6rem',
  letterSpacing: '0.5px',
  color: '#194C57', // color azul oscuro como en Ayuda.jsx
};

// Formulario en columna con espacio entre inputs
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

// Inputs con borde morado, fondo blanco y texto gris
const inputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: '1px solid #646cff',
  outline: 'none',
  fontSize: '1rem',
  background: '#fff',
  color: 'grey',
};

// Mensaje de error centrado y en rojo
const errorStyle = {
  color: '#f87171', // rojo para error
  fontSize: '0.85rem',
  textAlign: 'center',
};

// Botón azul con efecto hover (transición)
const buttonStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#194C57', // azul oscuro como en Ayuda.jsx
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.2s',
};

export default Login;
