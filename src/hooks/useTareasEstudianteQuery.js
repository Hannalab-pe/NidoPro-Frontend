import { useQuery } from '@tanstack/react-query';
import { tareaService } from '../services/tareaService';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestionar las tareas de un estudiante usando React Query
 */
export const useTareasEstudianteQuery = () => {
  
  /**
   * Obtener idEstudiante del localStorage
   */
  const getIdEstudiante = () => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        throw new Error('No se encontró información de autenticación');
      }

      const authData = JSON.parse(authStorage);
      const idEstudiante = authData?.state?.user?.entidadId;

      if (!idEstudiante) {
        throw new Error('No se pudo obtener el ID del estudiante del token');
      }

      return idEstudiante;
    } catch (error) {
      console.error('❌ Error al obtener ID del estudiante:', error);
      throw error;
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

    // Obtener el ID del estudiante actual para filtrar entregas
    const idEstudianteActual = getIdEstudiante();

    return tareasBackend.map(tarea => {
      // Buscar la entrega del estudiante actual específicamente
      const miEntrega = tarea.tareaEntregas?.find(entrega => 
        entrega.idEstudiante === idEstudianteActual || 
        entrega.estudiante?.idEstudiante === idEstudianteActual ||
        entrega.idEstudiante === parseInt(idEstudianteActual) ||
        entrega.estudiante?.idEstudiante === parseInt(idEstudianteActual)
      ) || null; // No usar fallback, mejor ser explícito
      
      // Debug: mostrar información de entregas
      console.log(`🔍 [HOOK] Tarea ${tarea.idTarea}:`);
      console.log(`   - Total entregas: ${tarea.tareaEntregas?.length || 0}`);
      console.log(`   - Mi entrega encontrada:`, miEntrega ? 'SÍ' : 'NO');
      console.log(`   - Estado de mi entrega:`, miEntrega?.estado);
      console.log(`   - Realizó tarea:`, miEntrega?.realizoTarea);
      console.log(`   - Estado general de tarea:`, tarea.estado);
      
      const tareaTransformada = {
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
        status: miEntrega ? mapearEstado(miEntrega.estado) : mapearEstado(tarea.estado),
        estado: miEntrega ? mapearEstado(miEntrega.estado) : mapearEstado(tarea.estado),
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
        
        // Archivo adjunto de la tarea (del profesor)
        archivoUrl: tarea.archivoUrl || tarea.archivo_url || tarea.fileUrl || tarea.file_url,
        
        // Estado de entrega
        realizoTarea: miEntrega?.realizoTarea || miEntrega?.estado === 'entregado' || miEntrega?.estado === 'completado' || false,
        completedAt: miEntrega?.realizoTarea || miEntrega?.estado === 'entregado' || miEntrega?.estado === 'completado' ? miEntrega?.fechaEntrega : null,
        
        // Datos adicionales para UI
        emoji: getEmojiBySubject(tarea.aula?.idGrado?.descripcion),
        timeEstimate: '30 min', // Por defecto
        
        // Fechas para comparación
        isOverdue: new Date(tarea.fechaEntrega) < new Date() && !miEntrega?.realizoTarea,
        daysLeft: Math.ceil((new Date(tarea.fechaEntrega) - new Date()) / (1000 * 60 * 60 * 24))
      };
      
      // Debug: mostrar estado final
      console.log(`✅ [HOOK] Tarea ${tarea.idTarea} transformada:`);
      console.log(`   - Status final: ${tareaTransformada.status}`);
      console.log(`   - Realizó tarea: ${tareaTransformada.realizoTarea}`);
      console.log(`   - CompletedAt: ${tareaTransformada.completedAt}`);
      
      return tareaTransformada;
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
   * Función para cargar tareas usando el servicio
   */
  const cargarTareasEstudiante = async () => {
    try {
      const idEstudiante = getIdEstudiante();
      const tareasArray = await tareaService.obtenerTareasPorEstudiante(idEstudiante);
      
      // Debug: mostrar datos del backend
      console.log('🔍 [HOOK] Datos del backend:', tareasArray);
      if (tareasArray && tareasArray.length > 0) {
        console.log('🔍 [HOOK] Primera tarea del backend:', tareasArray[0]);
        console.log('🔍 [HOOK] Campos de archivo en primera tarea:', {
          archivoUrl: tareasArray[0].archivoUrl,
          archivo_url: tareasArray[0].archivo_url,
          fileUrl: tareasArray[0].fileUrl,
          file_url: tareasArray[0].file_url
        });
      }
      
      // Transformar datos
      const tareasTransformadas = transformarTareas(tareasArray);
      return tareasTransformadas || [];
      
    } catch (error) {
      console.error('❌ [HOOK TAREAS ESTUDIANTE] Error al cargar tareas:', error);
      toast.error('Error al cargar las tareas');
      throw error;
    }
  };

  // Query de React Query
  const {
    data: tareas = [],
    isLoading: loading,
    error,
    refetch: refrescarTareas,
    isRefetching
  } = useQuery({
    queryKey: ['tareas-estudiante'],
    queryFn: cargarTareasEstudiante,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('❌ [REACT QUERY] Error en query de tareas:', error);
    }
  });

  return {
    tareas,
    loading: loading || isRefetching,
    error: error?.message || null,
    refrescarTareas,
    isRefetching
  };
};

export default useTareasEstudianteQuery;
