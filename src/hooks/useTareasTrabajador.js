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

      const tareasArray = await tareaService.obtenerTareasPorTrabajador(idTrabajador);
      
      // Transformar datos si es necesario
      const tareasTransformadas = transformarTareas(tareasArray);
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

    return tareasBackend.map(tarea => {
      // Calcular estadísticas basadas en tareaEntregas
      const totalEstudiantes = tarea.tareaEntregas?.length || 0;
      const entregadas = tarea.tareaEntregas?.filter(entrega => entrega.realizoTarea === true).length || 0;
      const pendientes = totalEstudiantes - entregadas;
      
      return {
        id: tarea.idTarea,
        idTarea: tarea.idTarea,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        fechaAsignacion: tarea.fechaAsignacion,
        fechaEntrega: tarea.fechaEntrega,
        estado: mapearEstado(tarea.estado),
        prioridad: tarea.prioridad || 'media', // Valor por defecto si no viene del backend
        
        // Información del aula
        aula: `${tarea.aula?.idGrado?.grado || 'Sin grado'} - ${tarea.aula?.seccion || 'Sin sección'}`,
        aulaInfo: {
          idAula: tarea.aula?.idAula,
          seccion: tarea.aula?.seccion,
          grado: tarea.aula?.idGrado?.grado,
          descripcion: tarea.aula?.idGrado?.descripcion,
          cantidadEstudiantes: tarea.aula?.cantidadEstudiantes
        },
        
        // Estadísticas calculadas
        totalEstudiantes,
        entregadas,
        pendientes,
        calificadas: 0, // Por ahora 0, se puede calcular si hay campo de calificación
        
        // Información del trabajador
        trabajadorInfo: {
          idTrabajador: tarea.idTrabajador?.idTrabajador,
          nombre: `${tarea.idTrabajador?.nombre || ''} ${tarea.idTrabajador?.apellido || ''}`.trim(),
          correo: tarea.idTrabajador?.correo,
          rol: tarea.idTrabajador?.idRol?.nombre
        },
        
        // Entregas de estudiantes
        entregas: tarea.tareaEntregas?.map(entrega => ({
          idTareaEntrega: entrega.idTareaEntrega,
          idEstudiante: entrega.idEstudiante,
          fechaEntrega: entrega.fechaEntrega,
          archivoUrl: entrega.archivoUrl,
          estado: entrega.estado,
          realizoTarea: entrega.realizoTarea,
          observaciones: entrega.observaciones,
          estudiante: {
            idEstudiante: entrega.idEstudiante2?.idEstudiante,
            nombre: entrega.idEstudiante2?.nombre,
            apellido: entrega.idEstudiante2?.apellido,
            nroDocumento: entrega.idEstudiante2?.nroDocumento,
            imagen: entrega.idEstudiante2?.imagen_estudiante
          }
        })) || [],
        
        // Datos originales para debugging
        _original: tarea
      };
    });
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
