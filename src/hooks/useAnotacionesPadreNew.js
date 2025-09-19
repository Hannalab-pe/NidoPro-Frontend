import { useQuery } from '@tanstack/react-query';
import { anotacionService } from '../services/anotacionService';
import { useAuthStore } from '../store';

// Hook para obtener las anotaciones del estudiante (usuario padre logueado)
export const useAnotacionesPadre = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['anotaciones-estudiante', user?.entidadId],
    queryFn: async () => {
      if (!user?.entidadId) {
        throw new Error('Usuario no tiene entidadId (ID de estudiante)');
      }
      
      
      // Obtener anotaciones directamente usando el entidadId del usuario
      const response = await anotacionService.getAnotacionesByEstudiante(user.entidadId);
      
      // El backend devuelve: { success: true, message: "...", anotaciones: [...] }
      // Extraer el array de anotaciones y mapear los datos
      if (response && response.anotaciones && Array.isArray(response.anotaciones)) {
        const anotacionesMapeadas = response.anotaciones.map(anotacion => ({
          id: anotacion.idAnotacionAlumno,
          titulo: anotacion.titulo,
          observacion: anotacion.observacion,
          fecha: anotacion.fechaObservacion,
          categoria: 'informativo', // Valor por defecto ya que el backend no envía categoría
          profesor: `${anotacion.trabajador?.nombre || ''} ${anotacion.trabajador?.apellido || ''}`.trim(),
          curso: anotacion.curso?.nombreCurso || 'Sin curso',
          fechaCreacion: anotacion.fechaCreacion,
          estaActivo: anotacion.estaActivo
        }));
        
        console.log('📋 Anotaciones mapeadas:', anotacionesMapeadas);
        return anotacionesMapeadas;
      }
      
      // Si nada funciona, devolver array vacío
      return [];
    },
    enabled: !!user?.entidadId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener anotaciones de un estudiante específico
export const useAnotacionesEstudiante = (estudianteId) => {
  return useQuery({
    queryKey: ['anotaciones-estudiante', estudianteId],
    queryFn: async () => {
      if (!estudianteId) {
        throw new Error('ID de estudiante requerido');
      }
      
      const response = await anotacionService.getAnotacionesByEstudiante(estudianteId);
      return response;
    },
    enabled: !!estudianteId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener estadísticas de anotaciones
export const useEstadisticasAnotaciones = (estudianteId) => {
  return useQuery({
    queryKey: ['estadisticas-anotaciones', estudianteId],
    queryFn: async () => {
      if (!estudianteId) {
        throw new Error('ID de estudiante requerido');
      }
      
      const anotaciones = await anotacionService.getAnotacionesByEstudiante(estudianteId);
      
      // Calcular estadísticas
      const stats = {
        total: anotaciones.length,
        comportamiento: anotaciones.filter(a => a.categoria === 'comportamiento').length,
        academico: anotaciones.filter(a => a.categoria === 'academico').length,
        positivo: anotaciones.filter(a => a.categoria === 'positivo').length,
        informativo: anotaciones.filter(a => a.categoria === 'informativo').length,
        recientes: anotaciones.filter(a => {
          const fechaAnotacion = new Date(a.fecha);
          const haceUnaSemana = new Date();
          haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
          return fechaAnotacion >= haceUnaSemana;
        }).length
      };
      
      return stats;
    },
    enabled: !!estudianteId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
