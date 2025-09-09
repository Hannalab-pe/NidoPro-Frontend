// src/hooks/queries/useEstudianteQueries.js
import { useQuery } from '@tanstack/react-query';
import { estudianteService } from '../../services/estudianteService';

// Claves de query para estudiantes
export const ESTUDIANTE_QUERY_KEYS = {
  all: ['estudiantes'],
  details: () => [...ESTUDIANTE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...ESTUDIANTE_QUERY_KEYS.details(), id],
  cronograma: (idAula) => ['cronograma', 'aula', idAula],
};

/**
 * Hook para obtener un estudiante específico por ID
 * @param {string} idEstudiante - ID del estudiante
 * @param {object} options - Opciones adicionales para la query
 * @returns {object} - Resultado de la query con los datos del estudiante
 */
export const useEstudiante = (idEstudiante, options = {}) => {
  return useQuery({
    queryKey: ESTUDIANTE_QUERY_KEYS.detail(idEstudiante),
    queryFn: () => estudianteService.obtenerEstudiantePorId(idEstudiante),
    enabled: !!idEstudiante,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    ...options
  });
};

/**
 * Hook para obtener el cronograma de un aula específica
 * @param {string} idAula - ID del aula
 * @param {object} options - Opciones adicionales para la query
 * @returns {object} - Resultado de la query con el cronograma del aula
 */
export const useCronogramaAula = (idAula, options = {}) => {
  return useQuery({
    queryKey: ESTUDIANTE_QUERY_KEYS.cronograma(idAula),
    queryFn: () => estudianteService.obtenerCronogramaPorAula(idAula),
    enabled: !!idAula,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    ...options
  });
};

/**
 * Hook combinado para obtener estudiante y su cronograma
 * Primero obtiene los datos del estudiante, extrae el ID del aula y luego obtiene el cronograma
 * @param {string} idEstudiante - ID del estudiante
 * @param {object} options - Opciones adicionales para las queries
 * @returns {object} - Resultado combinado con datos del estudiante y cronograma
 */
export const useEstudianteConCronograma = (idEstudiante, options = {}) => {
  // Primero obtenemos los datos del estudiante
  const { 
    data: estudianteData, 
    isLoading: loadingEstudiante, 
    error: errorEstudiante 
  } = useEstudiante(idEstudiante, { 
    enabled: !!idEstudiante,
    staleTime: 0 // Forzar refetch fresco
  });

  // Extraemos el ID del aula de los datos del estudiante
  // Intentamos múltiples rutas posibles
  let idAula = estudianteData?.matriculas?.[0]?.matriculaAula?.idAula || 
               estudianteData?.matriculas?.[0]?.matriculaAula?.aula?.idAula ||
               estudianteData?.matriculas?.[0]?.idAula ||
               estudianteData?.idAula ||
               estudianteData?.aula?.idAula ||
               estudianteData?.aulaActual?.idAula;

  // Obtenemos el cronograma del aula solo si tenemos un idAula válido
  const { 
    data: cronogramaData, 
    isLoading: loadingCronograma, 
    error: errorCronograma,
    refetch: refetchCronograma 
  } = useCronogramaAula(idAula, { 
    enabled: !!idAula && 
             idAula !== 'undefined' && 
             !!estudianteData && 
             !loadingEstudiante, // Solo ejecutar cuando tengamos datos del estudiante
    ...options 
  });

  return {
    // Datos del estudiante
    estudiante: estudianteData,
    isLoadingEstudiante: loadingEstudiante,
    errorEstudiante,
    
    // Datos del cronograma
    cronograma: cronogramaData || [],
    isLoadingCronograma: loadingCronograma,
    errorCronograma,
    
    // Estados combinados
    isLoading: loadingEstudiante || loadingCronograma,
    hasError: !!errorEstudiante || !!errorCronograma,
    errors: [errorEstudiante, errorCronograma].filter(Boolean),
    
    // Información del aula
    aulaInfo: {
      idAula,
      seccion: estudianteData?.matriculas?.[0]?.matriculaAula?.aula?.seccion,
      grado: estudianteData?.matriculas?.[0]?.matriculaAula?.aula?.idGrado?.grado,
      cantidadEstudiantes: estudianteData?.matriculas?.[0]?.matriculaAula?.aula?.cantidadEstudiantes
    },
    
    // Funciones de refetch
    refetchCronograma,
    refetchAll: () => {
      return Promise.all([
        useEstudiante(idEstudiante).refetch?.(),
        refetchCronograma()
      ]);
    }
  };
};
