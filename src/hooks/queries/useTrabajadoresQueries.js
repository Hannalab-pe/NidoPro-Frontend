// src/hooks/queries/useTrabajadoresQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import trabajadorService from '../../services/trabajadorService';

// Query Keys para trabajadores
export const trabajadoresKeys = {
  all: ['trabajadores'],
  lists: () => [...trabajadoresKeys.all, 'list'],
  list: (filters) => [...trabajadoresKeys.lists(), { filters }],
  details: () => [...trabajadoresKeys.all, 'detail'],
  detail: (id) => [...trabajadoresKeys.details(), id],
};

/**
 * Hook para obtener todos los trabajadores con cache automático
 * @param {Object} filters - Filtros opcionales para la consulta
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const useTrabajadores = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: trabajadoresKeys.list(filters),
    queryFn: () => trabajadorService.getAllTrabajadores(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
};

/**
 * Hook para obtener un trabajador específico por ID
 * @param {string|number} id - ID del trabajador
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const useTrabajador = (id, options = {}) => {
  return useQuery({
    queryKey: trabajadoresKeys.detail(id),
    queryFn: () => trabajadorService.getTrabajadorById(id),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para crear un nuevo trabajador
 */
export const useCreateTrabajador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trabajadorData) => trabajadorService.createTrabajador(trabajadorData),
    onMutate: () => {
      // Toast de loading
      const loadingToast = toast.loading('Creando trabajador...', {
        description: 'Guardando datos...'
      });
      return { loadingToast };
    },
    onSuccess: (newTrabajador, variables, context) => {
      // Invalidar y refetch todas las listas de trabajadores
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      
      // Toast de éxito
      toast.success('¡Trabajador creado exitosamente!', {
        id: context.loadingToast,
        description: `${newTrabajador.nombre} ${newTrabajador.apellido} ha sido agregado al sistema`
      });
      
      console.log('✅ Trabajador creado y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al crear trabajador', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al crear trabajador:', error);
    },
  });
};

/**
 * Hook para actualizar un trabajador existente
 */
export const useUpdateTrabajador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => trabajadorService.updateTrabajador(id, data),
    onMutate: () => {
      const loadingToast = toast.loading('Actualizando trabajador...', {
        description: 'Guardando cambios...'
      });
      return { loadingToast };
    },
    onSuccess: (updatedTrabajador, variables, context) => {
      // Invalidar listas y detalle específico
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.detail(variables.id) });
      
      toast.success('Trabajador actualizado exitosamente', {
        id: context.loadingToast,
        description: `Los datos de ${updatedTrabajador.nombre} ${updatedTrabajador.apellido} han sido actualizados`
      });
      
      console.log('✅ Trabajador actualizado y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al actualizar trabajador', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al actualizar trabajador:', error);
    },
  });
};

/**
 * Hook para eliminar un trabajador
 */
export const useDeleteTrabajador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => trabajadorService.deleteTrabajador(id),
    onMutate: () => {
      const loadingToast = toast.loading('Eliminando trabajador...', {
        description: 'Procesando eliminación...'
      });
      return { loadingToast };
    },
    onSuccess: (data, id, context) => {
      // Invalidar listas y remover detalle específico
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      queryClient.removeQueries({ queryKey: trabajadoresKeys.detail(id) });
      
      toast.success('Trabajador eliminado exitosamente', {
        id: context.loadingToast,
        description: 'El registro ha sido eliminado del sistema'
      });
      
      console.log('✅ Trabajador eliminado y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al eliminar trabajador', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al eliminar trabajador:', error);
    },
  });
};

/**
 * Hook para cambiar el estado de un trabajador (activar/desactivar)
 */
export const useToggleTrabajadorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trabajador }) => {
      console.log('🔄 Toggleando estado del trabajador:', trabajador);
      
      // Obtener el ID correcto del trabajador (puede ser idTrabajador o id)
      const trabajadorId = trabajador.idTrabajador || trabajador.id;
      
      if (!trabajadorId) {
        console.error('❌ No se encontró ID del trabajador:', trabajador);
        throw new Error('ID del trabajador no encontrado');
      }
      
      console.log('🔄 ID del trabajador para toggle:', trabajadorId);
      
      // Usar la función correcta del servicio que llama al DELETE endpoint
      return trabajadorService.toggleTrabajadorStatus(trabajadorId);
    },
    onMutate: ({ trabajador }) => {
      const action = trabajador.estaActivo ? 'desactivando' : 'activando';
      const loadingToast = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} trabajador...`, {
        description: 'Procesando solicitud...'
      });
      return { loadingToast, trabajador };
    },
    onSuccess: (response, variables, context) => {
      // Invalidar listas y detalle específico
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.detail(variables.trabajador.idTrabajador || variables.trabajador.id) });
      
      // Determinar el estado según la respuesta del backend
      const wasActive = context.trabajador.estaActivo;
      const status = wasActive ? 'desactivado' : 'activado';
      
      toast.success(`Trabajador ${status} exitosamente`, {
        id: context.loadingToast,
        description: `${context.trabajador.nombre} ${context.trabajador.apellido} ha sido ${status}`
      });
      
      console.log(`✅ Trabajador ${status} y cache invalidado`);
    },
    onError: (error, variables, context) => {
      const action = context.trabajador.estaActivo ? 'desactivar' : 'activar';
      toast.error(`Error al ${action} trabajador`, {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error(`❌ Error al ${action} trabajador:`, error);
    },
  });
};

/**
 * Hook para invalidar manualmente el cache de trabajadores
 */
export const useInvalidateTrabajadores = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.all });
      console.log('🗑️ Cache completo de trabajadores invalidado');
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      console.log('🗑️ Cache de listas de trabajadores invalidado');
    },
    invalidateDetail: (id) => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.detail(id) });
      console.log(`🗑️ Cache de trabajador ${id} invalidado`);
    },
  };
};
