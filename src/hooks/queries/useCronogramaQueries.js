// src/hooks/queries/useCronogramaQueries.js
import { useQuery } from '@tanstack/react-query';
import cronogramaService from '../../services/cronogramaService';

/**
 * Keys para las queries del cronograma
 */
export const CRONOGRAMA_QUERY_KEYS = {
  all: ['cronograma'],
  byAula: (idAula) => [...CRONOGRAMA_QUERY_KEYS.all, 'aula', idAula],
  byMultiplesAulas: (idsAulas) => [...CRONOGRAMA_QUERY_KEYS.all, 'multiplesAulas', idsAulas],
};

/**
 * Hook para obtener cronograma de un aula específica
 */
export const useCronogramaPorAula = (idAula, options = {}) => {
  return useQuery({
    queryKey: CRONOGRAMA_QUERY_KEYS.byAula(idAula),
    queryFn: async () => {
      try {
        console.log('🔍 Ejecutando query cronograma para aula:', idAula);
        const resultado = await cronogramaService.getCronogramaPorAula(idAula);
        console.log('✅ Resultado cronograma por aula:', resultado);
        return resultado;
      } catch (error) {
        console.error('❌ Error en useCronogramaPorAula:', error);
        throw error;
      }
    },
    enabled: !!idAula, // Solo ejecutar si hay idAula
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    ...options
  });
};

/**
 * Hook para obtener cronograma de múltiples aulas
 * Útil para docentes que tienen asignadas varias aulas
 */
export const useCronogramaMultiplesAulas = (idsAulas, options = {}) => {
  return useQuery({
    queryKey: CRONOGRAMA_QUERY_KEYS.byMultiplesAulas(idsAulas),
    queryFn: async () => {
      try {
        console.log('🔍 Ejecutando query cronograma para múltiples aulas:', idsAulas);
        const resultado = await cronogramaService.getCronogramaMultiplesAulas(idsAulas);
        console.log('✅ Resultado cronograma múltiples aulas:', resultado);
        return resultado;
      } catch (error) {
        console.error('❌ Error en useCronogramaMultiplesAulas:', error);
        throw error;
      }
    },
    enabled: !!idsAulas && Array.isArray(idsAulas) && idsAulas.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    ...options
  });
};

/**
 * Hook para obtener cronograma completo del docente
 * Combina las aulas asignadas con sus respectivos cronogramas
 */
export const useCronogramaDocente = (aulasTrabajadorData, options = {}) => {
  // Extraer el array de aulas desde la estructura de respuesta
  let aulasTrabajador = [];
  
  if (Array.isArray(aulasTrabajadorData)) {
    // Si ya es un array, usarlo directamente
    aulasTrabajador = aulasTrabajadorData;
  } else if (aulasTrabajadorData?.aulas && Array.isArray(aulasTrabajadorData.aulas)) {
    // Si tiene la estructura { success: true, aulas: [...] }
    aulasTrabajador = aulasTrabajadorData.aulas;
  } else if (aulasTrabajadorData?.data && Array.isArray(aulasTrabajadorData.data)) {
    // Si tiene la estructura { data: [...] }
    aulasTrabajador = aulasTrabajadorData.data;
  }

  console.log('🔍 [useCronogramaDocente] Datos recibidos:', aulasTrabajadorData);
  console.log('🔍 [useCronogramaDocente] Aulas extraídas:', aulasTrabajador);
  
  // Extraer solo los IDs de las aulas
  const idsAulas = aulasTrabajador?.map(aula => aula.id_aula || aula.idAula || aula.id) || [];
  
  console.log('🔍 [useCronogramaDocente] IDs de aulas:', idsAulas);
  
  return useCronogramaMultiplesAulas(idsAulas, {
    ...options,
    enabled: !!aulasTrabajador && Array.isArray(aulasTrabajador) && aulasTrabajador.length > 0,
  });
};
