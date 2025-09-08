// src/hooks/queries/useAnotacionesQueries.js
import { useQuery } from '@tanstack/react-query';
import anotacionService from '../../services/anotacionService';

/**
 * Keys para las queries de anotaciones
 */
export const ANOTACIONES_QUERY_KEYS = {
  all: ['anotaciones'],
  byWorker: (idTrabajador) => [...ANOTACIONES_QUERY_KEYS.all, 'trabajador', idTrabajador],
  byStudent: (idEstudiante) => [...ANOTACIONES_QUERY_KEYS.all, 'estudiante', idEstudiante],
};

/**
 * Hook para obtener anotaciones de un trabajador específico
 */
export const useAnotacionesByTrabajador = (idTrabajador, options = {}) => {
  return useQuery({
    queryKey: ANOTACIONES_QUERY_KEYS.byWorker(idTrabajador),
    queryFn: async () => {
      try {
        console.log('🔍 Ejecutando query anotaciones para trabajador:', idTrabajador);
        const resultado = await anotacionService.getByWorker(idTrabajador);
        console.log('✅ Resultado anotaciones por trabajador:', resultado);
        
        // El endpoint devuelve la estructura: { success: true, message: "...", anotaciones: [...] }
        if (resultado?.success && resultado?.anotaciones) {
          console.log('✅ Anotaciones encontradas:', resultado.anotaciones);
          return resultado.anotaciones;
        }
        
        // Extraer datos según otras estructuras posibles
        if (resultado?.info?.data) {
          return resultado.info.data;
        }
        
        if (resultado?.data) {
          return resultado.data;
        }
        
        if (Array.isArray(resultado)) {
          return resultado;
        }
        
        return [];
      } catch (error) {
        console.error('❌ Error en useAnotacionesByTrabajador:', error);
        
        // En desarrollo, devolver datos mock si el backend no está disponible
        if (process.env.NODE_ENV === 'development' && error.message.includes('Error al obtener')) {
          console.log('🔧 Backend no disponible, usando datos mock para anotaciones');
          return [
            {
              id: '1',
              titulo: 'Excelente participación en clase',
              contenido: 'El estudiante mostró gran interés y participación activa durante la clase de matemáticas.',
              fecha_creacion: '2024-12-15T10:30:00.000Z',
              categoria: 'academico',
              prioridad: 'alta',
              estudiante: {
                nombres: 'Ana María',
                apellidos: 'García López',
                seccion: 'A',
                grado: '5to'
              }
            },
            {
              id: '2',
              titulo: 'Mejora en comprensión lectora',
              contenido: 'Se observa progreso significativo en las habilidades de comprensión lectora del estudiante.',
              fecha_creacion: '2024-12-14T14:15:00.000Z',
              categoria: 'academico',
              prioridad: 'media',
              estudiante: {
                nombres: 'Carlos José',
                apellidos: 'Rodríguez Silva',
                seccion: 'B',
                grado: '5to'
              }
            }
          ];
        }
        
        throw error;
      }
    },
    enabled: !!idTrabajador, // Solo ejecutar si hay idTrabajador
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    ...options
  });
};

/**
 * Hook para obtener anotaciones de un estudiante específico
 */
export const useAnotacionesByEstudiante = (idEstudiante, options = {}) => {
  return useQuery({
    queryKey: ANOTACIONES_QUERY_KEYS.byStudent(idEstudiante),
    queryFn: async () => {
      try {
        console.log('🔍 Ejecutando query anotaciones para estudiante:', idEstudiante);
        const resultado = await anotacionService.getByStudent(idEstudiante);
        console.log('✅ Resultado anotaciones por estudiante:', resultado);
        
        // Extraer datos según la estructura de respuesta
        if (resultado?.info?.data) {
          return resultado.info.data;
        }
        
        if (resultado?.data) {
          return resultado.data;
        }
        
        if (Array.isArray(resultado)) {
          return resultado;
        }
        
        return [];
      } catch (error) {
        console.error('❌ Error en useAnotacionesByEstudiante:', error);
        throw error;
      }
    },
    enabled: !!idEstudiante, // Solo ejecutar si hay idEstudiante
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    ...options
  });
};
