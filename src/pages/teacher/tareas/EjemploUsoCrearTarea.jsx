// Ejemplo de uso del modal CrearTareaModal con Firebase Storage
// Este archivo muestra cómo integrar el modal en un componente padre

import React, { useState } from 'react';
import CrearTareaModal from './modales/CrearTareaModal';
import { useCrearTarea } from '../../../hooks/useCrearTarea';

const EjemploUsoCrearTarea = () => {
  const [showModal, setShowModal] = useState(false);
  const { crearTarea } = useCrearTarea();

  // Función que se ejecuta cuando se crea una tarea
  const handleCrearTarea = async (tareaData) => {
    try {
      console.log('📝 Datos de tarea recibidos:', tareaData);

      // Aquí puedes hacer validaciones adicionales si es necesario
      // ...

      // Crear la tarea usando el hook
      const resultado = await crearTarea(tareaData);

      console.log('✅ Tarea creada exitosamente:', resultado);

      // Aquí puedes actualizar el estado local, recargar listas, etc.
      // ...

      // Cerrar el modal
      setShowModal(false);

    } catch (error) {
      console.error('❌ Error al crear tarea:', error);
      // El hook ya maneja los errores con toast, pero puedes agregar lógica adicional aquí
    }
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Crear Nueva Tarea
      </button>

      {/* Modal de crear tarea */}
      <CrearTareaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCrearTarea}
      />
    </div>
  );
};

export default EjemploUsoCrearTarea;
