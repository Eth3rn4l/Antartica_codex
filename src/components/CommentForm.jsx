// Importación de React y hook useState
import React, { useState } from 'react';

// Componente funcional CommentForm que recibe una prop 'onSubmit'
function CommentForm({ onSubmit }) {
  // Estado local para almacenar el comentario escrito
  const [comment, setComment] = useState('');
  // Estado local para almacenar la calificación, valor por defecto 5
  const [rating, setRating] = useState(5);

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Validación: el comentario no puede estar vacío
    if (!comment.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    // Llama a la función pasada por props, enviando comentario y calificación
    onSubmit({ comment, rating });

    // Resetea los campos del formulario a los valores iniciales
    setComment('');
    setRating(5);

    // Mensaje de confirmación al usuario
    alert('¡Gracias por tu comentario!');
  };

  // Renderizado del formulario
  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Deja tu comentario de satisfacción</h3>

      {/* Textarea para escribir el comentario */}
      <textarea
        placeholder="Escribe tu comentario..."
        value={comment} // Valor controlado por el estado
        onChange={(e) => setComment(e.target.value)} // Actualiza el estado al escribir
        required
        style={textareaStyle}
      />

      {/* Selector de calificación */}
      <label>
        Calificación:
        <select 
          value={rating} // Valor controlado por el estado
          onChange={(e) => setRating(Number(e.target.value))} // Convierte a número
          style={selectStyle}
        >
          {/* Opciones de 5 a 1 estrella */}
          {[5,4,3,2,1].map((num) => (
            <option key={num} value={num}>
              {num} estrella{num > 1 ? 's' : ''} {/* Plural si corresponde */}
            </option>
          ))}
        </select>
      </label>

      {/* Botón para enviar el comentario */}
      <button type="submit">Enviar comentario</button>
    </form>
  );
}

// Estilos en línea para el formulario
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: '1000px',
  width: '100%',
  marginTop: '2rem',
  padding: '1rem',
  border: '1px solid #646cff',
  borderRadius: '8px',
  backgroundColor: '#B4E2ED',
  color: 'white',
};

// Estilos en línea para el textarea
const textareaStyle = {
  minHeight: '120px',
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  resize: 'vertical', // Permite cambiar altura pero no ancho
};

// Estilos en línea para el select
const selectStyle = {
  marginLeft: '0.5rem',
  padding: '0.3rem',
};

// Exportación del componente para usarlo en otros archivos
export default CommentForm;
