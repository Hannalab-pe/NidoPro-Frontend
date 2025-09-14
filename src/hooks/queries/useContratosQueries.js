// src/hooks/queries/useContratosQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import contratoService from '../../services/contratoService';

// Query Keys para contratos
export const contratosKeys = {
  all: ['contratos'],
  lists: () => [...contratosKeys.all, 'list'],
  list: (filters) => [...contratosKeys.lists(), { filters }],
  details: () => [...contratosKeys.all, 'detail'],
  detail: (id) => [...contratosKeys.details(), id],
};

/**
 * Hook para obtener todos los contratos con cache automático
 * @param {Object} filters - Filtros opcionales para la consulta
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const useContratos = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: contratosKeys.list(filters),
    queryFn: () => contratoService.getAllContratos(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
};

/**
 * Hook para obtener un contrato específico por ID
 * @param {string} id - ID del contrato
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const useContrato = (id, options = {}) => {
  return useQuery({
    queryKey: contratosKeys.detail(id),
    queryFn: () => contratoService.getContratoById(id),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para crear un nuevo contrato
 */
export const useCreateContrato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contratoData) => contratoService.createContrato(contratoData),
    onMutate: () => {
      // Toast de loading
      const loadingToast = toast.loading('Creando contrato...', {
        description: 'Guardando datos...'
      });
      return { loadingToast };
    },
    onSuccess: (newContrato, variables, context) => {
      // Invalidar y refetch todas las listas de contratos
      queryClient.invalidateQueries({ queryKey: contratosKeys.lists() });

      // Toast de éxito
      toast.success('¡Contrato creado exitosamente!', {
        id: context.loadingToast,
        description: `Contrato ${newContrato.numeroContrato} ha sido agregado al sistema`
      });

      console.log('✅ Contrato creado y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al crear contrato', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al crear contrato:', error);
    },
  });
};

/**
 * Hook para actualizar un contrato existente
 */
export const useUpdateContrato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => contratoService.updateContrato(id, data),
    onMutate: () => {
      const loadingToast = toast.loading('Actualizando contrato...', {
        description: 'Guardando cambios...'
      });
      return { loadingToast };
    },
    onSuccess: (updatedContrato, variables, context) => {
      // Invalidar listas y detalle específico
      queryClient.invalidateQueries({ queryKey: contratosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contratosKeys.detail(variables.id) });

      toast.success('Contrato actualizado exitosamente', {
        id: context.loadingToast,
        description: `El contrato ${updatedContrato.numeroContrato} ha sido actualizado`
      });

      console.log('✅ Contrato actualizado y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al actualizar contrato', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al actualizar contrato:', error);
    },
  });
};

/**
 * Hook para eliminar un contrato
 */
export const useDeleteContrato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => contratoService.deleteContrato(id),
    onMutate: () => {
      const loadingToast = toast.loading('Eliminando contrato...', {
        description: 'Procesando eliminación...'
      });
      return { loadingToast };
    },
    onSuccess: (data, id, context) => {
      // Invalidar listas y remover detalle específico
      queryClient.invalidateQueries({ queryKey: contratosKeys.lists() });
      queryClient.removeQueries({ queryKey: contratosKeys.detail(id) });

      toast.success('Contrato eliminado exitosamente', {
        id: context.loadingToast,
        description: 'El registro ha sido eliminado del sistema'
      });

      console.log('✅ Contrato eliminado y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al eliminar contrato', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al eliminar contrato:', error);
    },
  });
};

/**
 * Hook para finalizar un contrato
 */
export const useFinalizarContrato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => contratoService.finalizarContrato(id, data),
    onMutate: () => {
      const loadingToast = toast.loading('Finalizando contrato...', {
        description: 'Procesando finalización...'
      });
      return { loadingToast };
    },
    onSuccess: (finalizedContrato, variables, context) => {
      // Invalidar listas y detalle específico
      queryClient.invalidateQueries({ queryKey: contratosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contratosKeys.detail(variables.id) });

      toast.success('Contrato finalizado exitosamente', {
        id: context.loadingToast,
        description: `El contrato ${finalizedContrato.numeroContrato} ha sido finalizado`
      });

      console.log('✅ Contrato finalizado y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al finalizar contrato', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al finalizar contrato:', error);
    },
  });
};

/**
 * Hook para invalidar manualmente el cache de contratos
 */
export const useInvalidateContratos = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: contratosKeys.all });
      console.log('🗑️ Cache completo de contratos invalidado');
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: contratosKeys.lists() });
      console.log('🗑️ Cache de listas de contratos invalidado');
    },
    invalidateDetail: (id) => {
      queryClient.invalidateQueries({ queryKey: contratosKeys.detail(id) });
      console.log(`🗑️ Cache de contrato ${id} invalidado`);
    },
  };
};