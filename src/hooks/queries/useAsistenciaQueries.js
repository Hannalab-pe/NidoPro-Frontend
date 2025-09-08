import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trabajadorService } from '../../services/trabajadorService';
import { estudianteService } from '../../services/estudianteService';
import { asistenciaService } from '../../services/asistenciaService';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

/**
 * Hook para obtener las aulas asignadas a un trabajador
 */
export const useAulasTrabajador = (idTrabajador) => {
  return useQuery({
    queryKey: ['aulas-trabajador', idTrabajador],
    queryFn: () => trabajadorService.getAulasPorTrabajador(idTrabajador),
    enabled: !!idTrabajador,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onSuccess: (data) => {
      console.log('🏫 Aulas del trabajador cargadas:', data);
    },
    onError: (error) => {
      console.error('❌ Error al cargar aulas del trabajador:', error);
      toast.error('Error al cargar las aulas asignadas');
    }
  });
};

/**
 * Hook para obtener estudiantes de un aula específica
 */
export const useEstudiantesAula = (idAula) => {
  return useQuery({
    queryKey: ['estudiantes-aula', idAula],
    queryFn: () => estudianteService.getEstudiantesPorAula(idAula),
    enabled: !!idAula,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onSuccess: (data) => {
      console.log('👥 Estudiantes del aula cargados:', data);
    },
    onError: (error) => {
      console.error('❌ Error al cargar estudiantes del aula:', error);
      toast.error('Error al cargar los estudiantes del aula');
    }
  });
};

/**
 * Hook para obtener asistencias existentes por aula y fecha
 */
export const useAsistenciasPorAulaYFecha = (idAula, fecha) => {
  return useQuery({
    queryKey: ['asistencias-aula-fecha', idAula, fecha],
    queryFn: () => asistenciaService.getAsistenciasPorAulaYFecha(idAula, fecha),
    enabled: !!(idAula && fecha),
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
    onError: (error) => {
      console.error('❌ Error al cargar asistencias existentes:', error);
      // No mostrar toast de error si simplemente no hay datos para esa fecha
      if (!error.message.includes('No se encontraron')) {
        toast.error('Error al cargar asistencias existentes');
      }
    }
  });
};

/**
 * Hook para registrar asistencia masiva
 */
export const useRegistrarAsistenciaMasiva = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asistenciaData) => asistenciaService.registrarAsistenciaMasiva(asistenciaData),
    onSuccess: (data, variables) => {
      console.log('✅ Asistencia registrada exitosamente:', data);
      toast.success('Asistencia registrada correctamente');
      
      // Invalidar queries relacionadas para actualizar los datos
      queryClient.invalidateQueries(['asistencia']);
      queryClient.invalidateQueries(['estudiantes-aula', variables.idAula]);
      queryClient.invalidateQueries(['asistencias-aula-fecha', variables.idAula]);
    },
    onError: (error) => {
      console.error('❌ Error al registrar asistencia:', error);
      toast.error(error.message || 'Error al registrar la asistencia');
    }
  });
};

/**
 * Hook completo para gestión de asistencia de profesores
 * Combina todas las funcionalidades necesarias
 */
export const useAsistenciaProfesor = () => {
  const { user } = useAuthStore();
  const trabajadorId = user?.entidadId || localStorage.getItem('entidadId');

  // Obtener aulas del profesor
  const {
    data: aulasData,
    isLoading: loadingAulas,
    error: errorAulas,
    refetch: refetchAulas
  } = useAulasTrabajador(trabajadorId);

  // Extraer la lista de aulas
  const aulas = aulasData?.aulas || aulasData?.data || [];

  // Hook para registrar asistencia
  const registrarAsistenciaMutation = useRegistrarAsistenciaMasiva();

  return {
    // Datos del profesor
    trabajadorId,
    
    // Aulas
    aulas,
    loadingAulas,
    errorAulas,
    refetchAulas,
    
    // Funciones de asistencia
    registrarAsistencia: registrarAsistenciaMutation.mutate,
    loadingRegistro: registrarAsistenciaMutation.isLoading,
    errorRegistro: registrarAsistenciaMutation.error,
    
    // Utilidades
    tieneAulas: aulas.length > 0,
    
    // Hooks auxiliares (para usar en componentes hijos)
    useEstudiantesAula,
  };
};
