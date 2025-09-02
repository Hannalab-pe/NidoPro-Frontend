import React from 'react';
import { toast } from 'sonner';

const AsignacionDebug = () => {
  const crearAsignacionPrueba = async () => {
    try {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('auth-storage'))?.state?.user;
      
      if (!usuario) {
        toast.error('No hay usuario logueado');
        return;
      }

      // Crear datos de prueba para asignación
      const asignacionPrueba = {
        idTrabajador: usuario.id, // ID del usuario actual
        idAula: 1, // ID de un aula existente (ajustar según tu BD)
        fechaAsignacion: new Date().toISOString(),
        estadoActivo: true
      };

      console.log('🔧 Creando asignación de prueba para:', usuario);
      console.log('🔧 Datos de asignación:', asignacionPrueba);

      const response = await fetch('/api/v1/asignacion-aula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(asignacionPrueba)
      });

      if (response.ok) {
        toast.success('Asignación de prueba creada exitosamente');
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.message || 'No se pudo crear la asignación'}`);
      }
    } catch (error) {
      console.error('Error creando asignación de prueba:', error);
      toast.error('Error al crear asignación de prueba');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-blue-800 font-medium">Debug: Sin aulas asignadas</h3>
          <p className="text-blue-600 text-sm">
            El usuario actual no tiene aulas asignadas. Crear asignación de prueba.
          </p>
        </div>
        <button
          onClick={crearAsignacionPrueba}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Crear Asignación de Prueba
        </button>
      </div>
    </div>
  );
};

export default AsignacionDebug;
