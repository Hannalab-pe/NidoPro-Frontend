import { useState, useEffect } from 'react';
import { tareaService } from '../services/tareaService';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestionar las tareas de un estudiante
 */
export const useTareasEstudiante = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar tareas del estudiante desde el API
   */
  const cargarTareasEstudiante = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener idEstudiante del localStorage
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        throw new Error('No se encontró información de autenticación');
      }

      const authData = JSON.parse(authStorage);
      const idEstudiante = authData?.state?.user?.entidadId;

      if (!idEstudiante) {
        throw new Error('No se pudo obtener el ID del estudiante del token');
      }

      const tareasArray = await tareaService.obtenerTareasPorEstudiante(idEstudiante);
      
      // Transformar datos si es necesario
      const tareasTransformadas = transformarTareas(tareasArray);
      setTareas(tareasTransformadas || []);
      
    } catch (error) {
      console.error('❌ [HOOK TAREAS ESTUDIANTE] Error al cargar tareas:', error);
      setError(error.message);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mapear estado del backend al frontend
   */
  const mapearEstado = (estadoBackend) => {
    const estadosMap = {
      'pendiente': 'pending',
      'completado': 'completed',
      'en_progreso': 'in_progress',
      'entregado': 'completed',
      'retrasado': 'overdue',
      'borrador': 'draft'
    };
    return estadosMap[estadoBackend] || 'pending';
  };

  /**
   * Transformar datos del backend al formato esperado por el componente
   */
  const transformarTareas = (tareasBackend) => {
    if (!Array.isArray(tareasBackend)) {
      console.warn('⚠️ [HOOK TAREAS ESTUDIANTE] Datos no son un array:', tareasBackend);
      return [];
    }

    return tareasBackend.map(tarea => {
      // Buscar la entrega del estudiante actual
      const miEntrega = tarea.tareaEntregas?.[0]; // Como es del estudiante específico, debería ser solo una
      
      return {
        id: tarea.idTarea,
        idTarea: tarea.idTarea,
        title: tarea.titulo,
        titulo: tarea.titulo,
        description: tarea.descripcion,
        descripcion: tarea.descripcion,
        subject: tarea.aula?.idGrado?.descripcion || 'Materia',
        materia: tarea.aula?.idGrado?.descripcion || 'Materia',
        dueDate: tarea.fechaEntrega,
        fechaEntrega: tarea.fechaEntrega,
        fechaAsignacion: tarea.fechaAsignacion,
        status: mapearEstado(miEntrega?.estado || tarea.estado),
        estado: mapearEstado(miEntrega?.estado || tarea.estado),
        priority: 'medium', // Por defecto, se puede ajustar si el backend lo provee
        prioridad: 'medium',
        
        // Información del aula y grado
        aula: `${tarea.aula?.idGrado?.grado || 'Sin grado'} - ${tarea.aula?.seccion || 'Sin sección'}`,
        aulaInfo: {
          idAula: tarea.aula?.idAula,
          seccion: tarea.aula?.seccion,
          grado: tarea.aula?.idGrado?.grado,
          descripcion: tarea.aula?.idGrado?.descripcion,
          cantidadEstudiantes: tarea.aula?.cantidadEstudiantes
        },
        
        // Información del profesor
        profesor: `${tarea.idTrabajador?.nombre || ''} ${tarea.idTrabajador?.apellido || ''}`.trim(),
        profesorInfo: {
          idTrabajador: tarea.idTrabajador?.idTrabajador,
          nombre: tarea.idTrabajador?.nombre,
          apellido: tarea.idTrabajador?.apellido,
          correo: tarea.idTrabajador?.correo,
          telefono: tarea.idTrabajador?.telefono
        },
        
        // Información de la entrega del estudiante
        entrega: {
          idTareaEntrega: miEntrega?.idTareaEntrega,
          fechaEntregaRealizada: miEntrega?.fechaEntrega,
          archivoUrl: miEntrega?.archivoUrl,
          estado: miEntrega?.estado,
          realizoTarea: miEntrega?.realizoTarea,
          observaciones: miEntrega?.observaciones
        },
        
        // Estado de entrega
        realizoTarea: miEntrega?.realizoTarea || false,
        completedAt: miEntrega?.realizoTarea ? miEntrega?.fechaEntrega : null,
        
        // Datos adicionales para UI
        emoji: getEmojiBySubject(tarea.aula?.idGrado?.descripcion),
        timeEstimate: '30 min', // Por defecto
        
        // Fechas para comparación
        isOverdue: new Date(tarea.fechaEntrega) < new Date() && !miEntrega?.realizoTarea,
        daysLeft: Math.ceil((new Date(tarea.fechaEntrega) - new Date()) / (1000 * 60 * 60 * 24))
      };
    });
  };

  /**
   * Obtener emoji según la materia
   */
  const getEmojiBySubject = (subject) => {
    const emojiMap = {
      'lenguaje': '📚',
      'español': '📚',
      'literatura': '📚',
      'matemáticas': '🔢',
      'matematica': '🔢',
      'ciencias': '🔬',
      'ciencia': '🔬',
      'historia': '📜',
      'geografía': '🌍',
      'geografia': '🌍',
      'educación física': '⚽',
      'educacion fisica': '⚽',
      'arte': '🎨',
      'música': '🎵',
      'musica': '🎵',
      'inglés': '🇬🇧',
      'ingles': '🇬🇧',
      'prenatal': '👶',
      'maternal': '🍼',
      'jardin': '🌻'
    };
    
    const subjectLower = subject?.toLowerCase() || '';
    return emojiMap[subjectLower] || '📝';
  };

  /**
   * Refrescar la lista de tareas
   */
  const refrescarTareas = async () => {
    await cargarTareasEstudiante();
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    cargarTareasEstudiante();
  }, []);

  return {
    tareas,
    loading,
    error,
    refrescarTareas,
    cargarTareasEstudiante
  };
};

export default useTareasEstudiante;
