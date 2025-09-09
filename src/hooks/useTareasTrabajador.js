import { useState, useEffect } from 'react';
import { tareaService } from '../services/tareaService';
import { getIdTrabajadorFromToken } from '../utils/tokenUtils';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestionar tareas de un trabajador específico
 */
export const useTareasTrabajador = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar tareas del trabajador desde el token
   */
  const cargarTareasTrabajador = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener ID del trabajador del token
      const idTrabajador = getIdTrabajadorFromToken();
      if (!idTrabajador) {
        throw new Error('No se pudo obtener el ID del trabajador del token');
      }

      console.log('🔍 [HOOK TAREAS TRABAJADOR] Cargando tareas para trabajador:', idTrabajador);
      
      const tareasData = await tareaService.obtenerTareasPorTrabajador(idTrabajador);
      console.log('📚 [HOOK TAREAS TRABAJADOR] Tareas obtenidas:', tareasData);
      
      // Transformar datos si es necesario
      const tareasTransformadas = transformarTareas(tareasData);
      setTareas(tareasTransformadas || []);
      
    } catch (error) {
      console.error('❌ [HOOK TAREAS TRABAJADOR] Error al cargar tareas:', error);
      setError(error.message);
      toast.error('Error al cargar las tareas', {
        description: error.message
      });
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Transformar datos del backend al formato esperado por el componente
   */
  const transformarTareas = (tareasBackend) => {
    if (!Array.isArray(tareasBackend)) {
      console.warn('⚠️ [HOOK TAREAS TRABAJADOR] Datos no son un array:', tareasBackend);
      return [];
    }

    return tareasBackend.map(tarea => ({
      id: tarea.id || tarea.idTarea,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaCreacion: tarea.fechaCreacion || tarea.created_at,
      fechaVencimiento: tarea.fechaEntrega,
      fechaEntrega: tarea.fechaEntrega,
      estado: mapearEstado(tarea.estado),
      prioridad: tarea.prioridad || 'media',
      
      // Información del aula (si viene del backend)
      aula: tarea.aula?.seccion || tarea.aulaSeccion || 'Sin asignar',
      idAula: tarea.idAula,
      
      // Estadísticas (valores por defecto si no vienen del backend)
      totalEstudiantes: tarea.totalEstudiantes || tarea.cantidadEstudiantes || 0,
      entregadas: tarea.entregadas || 0,
      pendientes: tarea.pendientes || tarea.totalEstudiantes || 0,
      calificadas: tarea.calificadas || 0,
      
      // Archivos adjuntos
      archivosAdjuntos: tarea.archivosAdjuntos || [],
      
      // Información adicional
      materia: tarea.materia || 'Sin materia',
      grado: tarea.grado || tarea.aula?.grado || 'Sin grado',
      instrucciones: tarea.instrucciones || tarea.descripcion,
      
      // Datos del backend
      idTrabajador: tarea.idTrabajador,
      trabajador: tarea.trabajador,
      
      // Metadatos
      _original: tarea // Guardar datos originales para debugging
    }));
  };

  /**
   * Mapear estado del backend al formato del frontend
   */
  const mapearEstado = (estadoBackend) => {
    const mapeoEstados = {
      'pendiente': 'activa',
      'activa': 'activa',
      'completada': 'vencida',
      'vencida': 'vencida',
      'borrador': 'borrador',
      'draft': 'borrador'
    };
    
    return mapeoEstados[estadoBackend?.toLowerCase()] || 'activa';
  };

  /**
   * Refrescar tareas
   */
  const refrescarTareas = () => {
    cargarTareasTrabajador();
  };

  /**
   * Crear nueva tarea y actualizar la lista
   */
  const crearTarea = async (tareaData) => {
    try {
      console.log('🚀 [HOOK TAREAS TRABAJADOR] Creando nueva tarea:', tareaData);
      
      const nuevaTarea = await tareaService.crearTarea(tareaData);
      console.log('✅ [HOOK TAREAS TRABAJADOR] Tarea creada exitosamente:', nuevaTarea);
      
      // Recargar todas las tareas para tener datos actualizados
      await cargarTareasTrabajador();
      
      toast.success('Tarea creada exitosamente', {
        description: 'La tarea ha sido asignada a todos los estudiantes del aula'
      });
      
      return nuevaTarea;
    } catch (error) {
      console.error('❌ [HOOK TAREAS TRABAJADOR] Error al crear tarea:', error);
      toast.error('Error al crear la tarea', {
        description: error.message
      });
      throw error;
    }
  };

  /**
   * Actualizar tarea y refrescar lista
   */
  const actualizarTarea = async (idTarea, tareaData) => {
    try {
      console.log('🔄 [HOOK TAREAS TRABAJADOR] Actualizando tarea:', idTarea, tareaData);
      
      const tareaActualizada = await tareaService.actualizarTarea(idTarea, tareaData);
      console.log('✅ [HOOK TAREAS TRABAJADOR] Tarea actualizada exitosamente:', tareaActualizada);
      
      // Recargar todas las tareas para tener datos actualizados
      await cargarTareasTrabajador();
      
      toast.success('Tarea actualizada exitosamente');
      
      return tareaActualizada;
    } catch (error) {
      console.error('❌ [HOOK TAREAS TRABAJADOR] Error al actualizar tarea:', error);
      toast.error('Error al actualizar la tarea', {
        description: error.message
      });
      throw error;
    }
  };

  /**
   * Eliminar tarea y refrescar lista
   */
  const eliminarTarea = async (idTarea) => {
    try {
      console.log('🗑️ [HOOK TAREAS TRABAJADOR] Eliminando tarea:', idTarea);
      
      await tareaService.eliminarTarea(idTarea);
      console.log('✅ [HOOK TAREAS TRABAJADOR] Tarea eliminada exitosamente');
      
      // Recargar todas las tareas para tener datos actualizados
      await cargarTareasTrabajador();
      
      toast.success('Tarea eliminada exitosamente');
      
    } catch (error) {
      console.error('❌ [HOOK TAREAS TRABAJADOR] Error al eliminar tarea:', error);
      toast.error('Error al eliminar la tarea', {
        description: error.message
      });
      throw error;
    }
  };

  // Cargar tareas al inicializar el hook
  useEffect(() => {
    cargarTareasTrabajador();
  }, []);

  return {
    tareas,
    loading,
    error,
    cargarTareasTrabajador,
    refrescarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
  };
};
