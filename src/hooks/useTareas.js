import { useState, useEffect } from 'react';
import { tareaService } from '../services/tareaService';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestionar tareas
 */
export const useTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar todas las tareas
   */
  const cargarTareas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [HOOK TAREAS] Cargando tareas...');
      
      const tareasData = await tareaService.obtenerTareas();
      console.log('📚 [HOOK TAREAS] Tareas obtenidas:', tareasData);
      
      setTareas(tareasData || []);
    } catch (error) {
      console.error('❌ [HOOK TAREAS] Error al cargar tareas:', error);
      setError(error.message);
      toast.error('Error al cargar las tareas');
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear una nueva tarea
   */
  const crearTarea = async (tareaData) => {
    try {
      console.log('🚀 [HOOK TAREAS] Creando nueva tarea:', tareaData);
      
      const nuevaTarea = await tareaService.crearTarea(tareaData);
      console.log('✅ [HOOK TAREAS] Tarea creada exitosamente:', nuevaTarea);
      
      // Actualizar la lista local
      setTareas(prev => [nuevaTarea, ...prev]);
      
      toast.success('Tarea creada exitosamente', {
        description: 'La tarea ha sido asignada a todos los estudiantes del aula'
      });
      
      return nuevaTarea;
    } catch (error) {
      console.error('❌ [HOOK TAREAS] Error al crear tarea:', error);
      toast.error('Error al crear la tarea', {
        description: error.message
      });
      throw error;
    }
  };

  /**
   * Actualizar una tarea existente
   */
  const actualizarTarea = async (idTarea, tareaData) => {
    try {
      console.log('🔄 [HOOK TAREAS] Actualizando tarea:', idTarea, tareaData);
      
      const tareaActualizada = await tareaService.actualizarTarea(idTarea, tareaData);
      console.log('✅ [HOOK TAREAS] Tarea actualizada exitosamente:', tareaActualizada);
      
      // Actualizar la lista local
      setTareas(prev => prev.map(tarea => 
        tarea.id === idTarea ? tareaActualizada : tarea
      ));
      
      toast.success('Tarea actualizada exitosamente');
      
      return tareaActualizada;
    } catch (error) {
      console.error('❌ [HOOK TAREAS] Error al actualizar tarea:', error);
      toast.error('Error al actualizar la tarea', {
        description: error.message
      });
      throw error;
    }
  };

  /**
   * Eliminar una tarea
   */
  const eliminarTarea = async (idTarea) => {
    try {
      console.log('🗑️ [HOOK TAREAS] Eliminando tarea:', idTarea);
      
      await tareaService.eliminarTarea(idTarea);
      console.log('✅ [HOOK TAREAS] Tarea eliminada exitosamente');
      
      // Actualizar la lista local
      setTareas(prev => prev.filter(tarea => tarea.id !== idTarea));
      
      toast.success('Tarea eliminada exitosamente');
      
    } catch (error) {
      console.error('❌ [HOOK TAREAS] Error al eliminar tarea:', error);
      toast.error('Error al eliminar la tarea', {
        description: error.message
      });
      throw error;
    }
  };

  /**
   * Obtener una tarea por ID
   */
  const obtenerTareaPorId = async (idTarea) => {
    try {
      console.log('🔍 [HOOK TAREAS] Obteniendo tarea por ID:', idTarea);
      
      const tarea = await tareaService.obtenerTareaPorId(idTarea);
      console.log('📝 [HOOK TAREAS] Tarea obtenida:', tarea);
      
      return tarea;
    } catch (error) {
      console.error('❌ [HOOK TAREAS] Error al obtener tarea:', error);
      toast.error('Error al obtener la tarea', {
        description: error.message
      });
      throw error;
    }
  };

  // Cargar tareas al inicializar el hook
  useEffect(() => {
    cargarTareas();
  }, []);

  return {
    tareas,
    loading,
    error,
    cargarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    obtenerTareaPorId
  };
};
