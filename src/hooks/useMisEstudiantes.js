// src/hooks/useMisEstudiantes.js
import { useQuery } from '@tanstack/react-query';
import { trabajadorService } from '../services/trabajadorService';
import { estudianteService } from '../services/estudianteService';

// Query keys para Mis Estudiantes
export const misEstudiantesKeys = {
  all: ['mis-estudiantes'],
  aulas: () => [...misEstudiantesKeys.all, 'aulas'],
  estudiantes: () => [...misEstudiantesKeys.all, 'estudiantes'],
  estudiante: (id) => [...misEstudiantesKeys.estudiantes(), id],
};

/**
 * Hook personalizado para gestionar los estudiantes de un docente usando TanStack Query
 * Obtiene las aulas asignadas al docente y luego todos los estudiantes de esas aulas
 * Incluye caching automático y manejo de estado optimizado
 */
export const useMisEstudiantes = () => {
  // Obtener el ID del trabajador del localStorage
  const getTrabajadorId = () => {
    try {
      console.log('🔍 Buscando ID del trabajador en localStorage...');

      // Intentar primero con persist:auth (Redux Persist)
      let authData = localStorage.getItem('persist:auth');
      if (authData) {
        console.log('📦 Encontrado persist:auth');
        const parsed = JSON.parse(authData);
        if (parsed.user) {
          const user = JSON.parse(parsed.user);
          if (user.entidadId) {
            console.log('✅ ID encontrado en persist:auth.user.entidadId:', user.entidadId);
            return user.entidadId;
          }
        }
      }

      // Intentar con auth-storage (parece ser la clave correcta)
      authData = localStorage.getItem('auth-storage');
      if (authData) {
        console.log('📦 Encontrado auth-storage');
        const parsed = JSON.parse(authData);
        console.log('🔍 Contenido de auth-storage:', parsed);

        // Buscar en diferentes estructuras posibles
        if (parsed.state && parsed.state.user && parsed.state.user.entidadId) {
          console.log('✅ ID encontrado en auth-storage.state.user.entidadId:', parsed.state.user.entidadId);
          return parsed.state.user.entidadId;
        }

        if (parsed.user && parsed.user.entidadId) {
          console.log('✅ ID encontrado en auth-storage.user.entidadId:', parsed.user.entidadId);
          return parsed.user.entidadId;
        }

        if (parsed.entidadId) {
          console.log('✅ ID encontrado en auth-storage.entidadId:', parsed.entidadId);
          return parsed.entidadId;
        }
      }

      // Intentar con otras claves posibles
      const possibleKeys = ['user', 'usuario', 'trabajador'];
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`📦 Encontrado ${key}`);
          const parsed = JSON.parse(data);
          if (parsed.entidadId) {
            console.log(`✅ ID encontrado en ${key}.entidadId:`, parsed.entidadId);
            return parsed.entidadId;
          }
        }
      }

      console.log('🔍 Todas las claves en localStorage:', Object.keys(localStorage));
      console.log('❌ No se encontró entidadId en ninguna ubicación');
      return null;
    } catch (error) {
      console.error('Error al obtener ID del trabajador:', error);
      return null;
    }
  };

  const trabajadorId = getTrabajadorId();

  // Query para obtener aulas del trabajador
  const aulasQuery = useQuery({
    queryKey: misEstudiantesKeys.aulas(),
    queryFn: async () => {
      if (!trabajadorId) {
        throw new Error('No se pudo obtener el ID del trabajador');
      }

      console.log('🏫 Obteniendo aulas del trabajador...');
      const response = await trabajadorService.getAulasPorTrabajador(trabajadorId);
      console.log('📚 Aulas obtenidas:', response);

      return response?.aulas || [];
    },
    enabled: !!trabajadorId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Query para obtener estudiantes de las aulas
  const estudiantesQuery = useQuery({
    queryKey: misEstudiantesKeys.estudiantes(),
    queryFn: async () => {
      const aulasData = aulasQuery.data;

      if (!aulasData || aulasData.length === 0) {
        console.log('ℹ️ No hay aulas asignadas al trabajador');
        return [];
      }

      console.log('👨‍🎓 Obteniendo estudiantes de las aulas...');
      const allEstudiantes = [];

      for (const aula of aulasData) {
        try {
          console.log(`📖 Obteniendo estudiantes del aula: ${aula.nombre} (${aula.id_aula})`);
          const estudiantesResponse = await estudianteService.getEstudiantesPorAula(aula.id_aula);
          console.log(`✅ Estudiantes del aula ${aula.nombre}:`, estudiantesResponse);

          const estudiantesAula = estudiantesResponse?.estudiantes || [];

          // Agregar información del aula a cada estudiante
          const estudiantesConAula = estudiantesAula.map(estudiante => ({
            ...estudiante,
            aula: {
              id: aula.id_aula,
              nombre: aula.nombre,
              seccion: aula.seccion,
              grado: aula.grado
            }
          }));

          allEstudiantes.push(...estudiantesConAula);
        } catch (error) {
          console.error(`❌ Error al obtener estudiantes del aula ${aula.nombre}:`, error);
          // Continuar con las demás aulas aunque una falle
        }
      }

      console.log('📊 Todos los estudiantes obtenidos:', allEstudiantes);
      return allEstudiantes;
    },
    enabled: !!aulasQuery.data && aulasQuery.data.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Estados combinados
  const isLoading = aulasQuery.isLoading || estudiantesQuery.isLoading;
  const isError = aulasQuery.isError || estudiantesQuery.isError;
  const error = aulasQuery.error || estudiantesQuery.error;

  // Datos
  const estudiantes = estudiantesQuery.data || [];
  const aulas = aulasQuery.data || [];

  // Función para refrescar los datos
  const refreshEstudiantes = () => {
    aulasQuery.refetch();
    estudiantesQuery.refetch();
  };

  // Calcular estadísticas
  const statistics = {
    total: estudiantes.length,
    porAula: estudiantes.reduce((acc, estudiante) => {
      const aulaNombre = estudiante.aula?.nombre || 'Sin aula';
      acc[aulaNombre] = (acc[aulaNombre] || 0) + 1;
      return acc;
    }, {}),
    aulasAsignadas: aulas.length,
    isLoading,
    isError,
    error
  };

  return {
    estudiantes,
    aulas,
    loading: isLoading,
    error: error?.message || null,
    statistics,
    refreshEstudiantes,
    // Estados adicionales de TanStack Query
    isRefetching: aulasQuery.isRefetching || estudiantesQuery.isRefetching,
    isStale: aulasQuery.isStale || estudiantesQuery.isStale,
  };
};
