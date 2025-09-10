import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { asistenciaService } from '../services/asistenciaService';

/**
 * Hook personalizado para gestión de asistencia de docentes
 */
export const useAsistenciaDocente = () => {
  console.log('🔄 Inicializando hook useAsistenciaDocente...');

  // Query para obtener las asignaciones de aula del docente actual
  const {
    data: asignacionesDocente = [],
    isLoading: loadingAsignaciones,
    error: errorAsignaciones,
    refetch: refetchAsignaciones
  } = useQuery({
    queryKey: ['asignaciones-docente'],
    queryFn: async () => {
      console.log('🔍 Obteniendo asignaciones del docente...');
      
      // Obtener todas las asignaciones
      const response = await asistenciaService.getAllAsignaciones();
      const todasAsignaciones = response?.asignacionesAula || [];
      
      // Filtrar solo las del docente actual
      const asignacionesDelDocente = asistenciaService.filtrarAsignacionesPorDocente(todasAsignaciones);
      
      console.log('✅ Asignaciones del docente obtenidas:', asignacionesDelDocente);
      return asignacionesDelDocente;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onSuccess: (data) => {
      console.log('🏫 Asignaciones del docente cargadas exitosamente:', data);
      console.log('🏫 Total de aulas asignadas:', data?.length || 0);
    },
    onError: (error) => {
      console.error('❌ Error al cargar asignaciones del docente:', error);
      toast.error('Error al cargar las aulas asignadas');
    }
  });

  // Función para obtener estudiantes de un aula específica
  const useEstudiantesAula = (idAula) => {
    return useQuery({
      queryKey: ['estudiantes-aula', idAula],
      queryFn: () => asistenciaService.getEstudiantesAula(idAula),
      enabled: !!idAula, // Solo ejecutar si hay idAula
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      onSuccess: (data) => {
        console.log('👥 Estructura de datos:', {
          tipo: typeof data,
          esArray: Array.isArray(data),
          keys: Object.keys(data || {}),
          info: data?.info,
          infoData: data?.info?.data,
          infoDataLength: data?.info?.data?.length || 0
        });
      },
      onError: (error) => {
        console.error('❌ Error al cargar estudiantes del aula:', error);
        toast.error('Error al cargar estudiantes del aula');
      }
    });
  };

  // Función helper para obtener las aulas del docente
  const getAulasDocente = () => {
    return asignacionesDocente.map(asignacion => ({
      idAula: asignacion.idAula?.idAula,
      seccion: asignacion.idAula?.seccion,
      cantidadEstudiantes: asignacion.idAula?.cantidadEstudiantes,
      fechaAsignacion: asignacion.fechaAsignacion,
      estadoActivo: asignacion.estadoActivo,
      idAsignacionAula: asignacion.idAsignacionAula
    }));
  };

  // Función helper para obtener información del aula seleccionada
  const getInfoAula = (aulaData) => {
    // Si se pasa un objeto aula completo, devolver su información
    if (aulaData && typeof aulaData === 'object' && aulaData.idAula) {
      return {
        nombre: `${aulaData.seccion}`,
        cantidadEstudiantes: aulaData.cantidadEstudiantes || 0
      };
    }
    
    // Si se pasa un ID, buscar en las asignaciones
    const asignacion = asignacionesDocente.find(
      asig => asig.idAula?.idAula === aulaData
    );
    
    if (asignacion?.idAula) {
      return {
        nombre: `${asignacion.idAula.seccion}`,
        cantidadEstudiantes: asignacion.idAula.cantidadEstudiantes || 0
      };
    }
    
    return { nombre: 'Aula desconocida', cantidadEstudiantes: 0 };
  };

  // Función helper para verificar si tiene aulas asignadas
  const tieneAulasAsignadas = () => {
    return asignacionesDocente.length > 0;
  };

  console.log('🔍 Hook retornando - asignaciones:', asignacionesDocente?.length || 0);

  return {
    // Datos
    asignacionesDocente,
    aulasDocente: getAulasDocente(),
    
    // Estados de carga
    loadingAsignaciones,
    
    // Errores
    errorAsignaciones,
    
    // Funciones
    refetchAsignaciones,
    useEstudiantesAula,
    getInfoAula,
    tieneAulasAsignadas,
    
    // Funciones helper
    totalAulasAsignadas: asignacionesDocente.length
  };
};

export default useAsistenciaDocente;
