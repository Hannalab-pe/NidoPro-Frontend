import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { aulaService } from '../services/aulaService';
import { asignacionAulaService } from '../services/asignacionAulaService';

/**
 * Hook personalizado para gestión de aulas y asignaciones
 */
export const useAulasAsignacion = () => {
  console.log('🔄 Inicializando hook useAulasAsignacion...');
  const queryClient = useQueryClient();

  // Query para obtener todas las aulas disponibles
  const {
    data: aulas = [],
    isLoading: loadingAulas,
    error: errorAulas,
    refetch: refetchAulas
  } = useQuery({
    queryKey: ['aulas'],
    queryFn: () => aulaService.getAllAulas(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onSuccess: (data) => {
      console.log('🏫 Aulas cargadas exitosamente:', data);
      console.log('🏫 Total de aulas:', data?.length || 0);
      console.log('🏫 Tipo de datos recibidos:', typeof data);
      console.log('🏫 Es array?:', Array.isArray(data));
      if (data && data.length > 0) {
        console.log('🏫 Estructura de la primera aula:', data[0]);
        console.log('🏫 Propiedades de la primera aula:', Object.keys(data[0]));
      }
    },
    onError: (error) => {
      console.error('❌ Error al cargar aulas:', error);
      toast.error('Error al cargar las aulas disponibles');
    }
  });

  // Query para obtener todas las asignaciones de aula
  const {
    data: asignaciones = [],
    isLoading: loadingAsignaciones,
    error: errorAsignaciones,
    refetch: refetchAsignaciones
  } = useQuery({
    queryKey: ['asignaciones-aula'],
    queryFn: () => asignacionAulaService.getAllAsignaciones(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onSuccess: (data) => {
      console.log('🎯 Asignaciones cargadas exitosamente:', data);
      if (data?.asignacionesAula) {
        console.log('🎯 Total de asignaciones:', data.asignacionesAula.length);
        console.log('🎯 Estructura de asignaciones:', data.asignacionesAula);
      }
    },
    onError: (error) => {
      console.error('❌ Error al cargar asignaciones:', error);
      toast.error('Error al cargar las asignaciones de aula');
    }
  });

  // Mutation para crear asignación de aula
  const createAsignacionMutation = useMutation({
    mutationFn: (asignacionData) => asignacionAulaService.createAsignacion(asignacionData),
    onSuccess: (data) => {
      console.log('✅ Asignación creada exitosamente:', data);
      toast.success('Aula asignada correctamente al docente');
      
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries(['asignaciones-aula']);
      queryClient.invalidateQueries(['asignaciones']);
      queryClient.invalidateQueries(['trabajadores']);
    },
    onError: (error) => {
      console.error('❌ Error al crear asignación:', error);
      toast.error(error.message || 'Error al asignar aula al docente');
    }
  });

  // Mutation para actualizar asignación
  const updateAsignacionMutation = useMutation({
    mutationFn: ({ idAsignacion, updateData }) => 
      asignacionAulaService.updateAsignacion(idAsignacion, updateData),
    onSuccess: () => {
      toast.success('Asignación actualizada correctamente');
      queryClient.invalidateQueries(['asignaciones-aula']);
      queryClient.invalidateQueries(['asignaciones']);
      queryClient.invalidateQueries(['trabajadores']);
    },
    onError: (error) => {
      console.error('❌ Error al actualizar asignación:', error);
      toast.error(error.message || 'Error al actualizar asignación');
    }
  });

  // Mutation para eliminar asignación
  const deleteAsignacionMutation = useMutation({
    mutationFn: (idAsignacion) => asignacionAulaService.deleteAsignacion(idAsignacion),
    onSuccess: () => {
      toast.success('Asignación eliminada correctamente');
      queryClient.invalidateQueries(['asignaciones-aula']);
      queryClient.invalidateQueries(['asignaciones']);
      queryClient.invalidateQueries(['trabajadores']);
    },
    onError: (error) => {
      console.error('❌ Error al eliminar asignación:', error);
      toast.error(error.message || 'Error al eliminar asignación');
    }
  });

  // Función helper para obtener asignaciones por trabajador
  const getAsignacionesByTrabajador = (idTrabajador) => {
    return useQuery({
      queryKey: ['asignaciones', idTrabajador],
      queryFn: () => asignacionAulaService.getAsignacionesByTrabajador(idTrabajador),
      enabled: !!idTrabajador,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('Error al cargar asignaciones:', error);
        toast.error('Error al cargar asignaciones del trabajador');
      }
    });
  };

  // Función para crear asignación de aula para docente
  const asignarAulaADocente = async (idTrabajador, idAula) => {
    try {
      const asignacionData = {
        fechaAsignacion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        estadoActivo: true,
        idAula: idAula,
        idTrabajador: idTrabajador
      };

      console.log('🎯 Datos para asignación de aula:', asignacionData);
      console.log('🎯 Asignando aula al docente...');
      
      const result = await createAsignacionMutation.mutateAsync(asignacionData);
      console.log('✅ Aula asignada exitosamente:', result);
      
      toast.success('Aula asignada al docente exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error en asignarAulaADocente:', error);
      toast.error('Error al asignar aula al docente');
      throw error;
    }
  };

  // Función para obtener aulas disponibles (sin asignar)
  const getAulasDisponibles = () => {
    // TODO: Implementar lógica para filtrar aulas ya asignadas
    // Por ahora retorna todas las aulas
    return aulas;
  };

  // Función para obtener aulas por grado
  const fetchAulasPorGrado = async (idGrado) => {
    try {
      console.log('🎯 Obteniendo aulas para grado:', idGrado);
      
      // Si el idGrado no está definido, no hacer nada
      if (!idGrado) {
        console.log('⚠️ No se proporcionó idGrado');
        return;
      }

      // Por ahora, simplemente refrescar las aulas existentes
      // En el futuro se puede implementar un filtro por grado en el backend
      await refetchAulas();
      
      console.log('✅ Aulas refrescadas para grado:', idGrado);
    } catch (error) {
      console.error('❌ Error al obtener aulas por grado:', error);
      toast.error('Error al cargar aulas para el grado seleccionado');
    }
  };

  // Log para verificar qué se está retornando
  console.log('🔍 Hook retornando - aulas:', aulas, 'loadingAulas:', loadingAulas);

  return {
    // Datos
    aulas,
    asignaciones: asignaciones?.asignacionesAula || [],
    aulasDisponibles: getAulasDisponibles(),
    
    // Estados de carga
    loadingAulas,
    loadingAsignaciones,
    loadingAsignacion: createAsignacionMutation.isLoading,
    loadingUpdate: updateAsignacionMutation.isLoading,
    loadingDelete: deleteAsignacionMutation.isLoading,
    
    // Errores
    errorAulas,
    errorAsignaciones,
    errorAsignacion: createAsignacionMutation.error,
    
    // Funciones
    refetchAulas,
    refetchAsignaciones,
    fetchAulasPorGrado,
    asignarAulaADocente,
    getAsignacionesByTrabajador,
    
    // Mutations directas para casos avanzados
    createAsignacion: createAsignacionMutation.mutateAsync,
    updateAsignacion: updateAsignacionMutation.mutateAsync,
    deleteAsignacion: deleteAsignacionMutation.mutateAsync,
    
    // Estados de las mutations
    isCreatingAsignacion: createAsignacionMutation.isLoading,
    isUpdatingAsignacion: updateAsignacionMutation.isLoading,
    isDeletingAsignacion: deleteAsignacionMutation.isLoading
  };
};

export default useAulasAsignacion;
