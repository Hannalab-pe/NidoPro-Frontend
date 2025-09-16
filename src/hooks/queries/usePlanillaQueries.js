// src/hooks/queries/usePlanillaQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import planillaService from '../../services/planillaService';

// Query Keys para planillas
export const planillaKeys = {
  all: ['planillas'],
  lists: () => [...planillaKeys.all, 'list'],
  list: (filters) => [...planillaKeys.lists(), { filters }],
  trabajadoresSinPlanilla: (filters) => [...planillaKeys.all, 'trabajadores-sin-planilla', { filters }],
  details: () => [...planillaKeys.all, 'detail'],
  detail: (id) => [...planillaKeys.details(), id],
};

/**
 * Hook para obtener trabajadores con contrato de planilla
 * @param {Object} filters - Filtros opcionales para la consulta
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const useTrabajadoresTipoContratoPlanilla = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: planillaKeys.trabajadoresSinPlanilla(filters),
    queryFn: () => planillaService.obtenerTrabajadoresTipoContratoPlanilla(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
};

/**
 * Hook para obtener todas las planillas mensuales
 * @param {Object} filters - Filtros opcionales para la consulta
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const usePlanillasMensuales = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: planillaKeys.list(filters),
    queryFn: () => planillaService.obtenerPlanillasMensuales(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para obtener detalle de una planilla específica
 * @param {string} id - ID de la planilla
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const useDetallePlanilla = (id, options = {}) => {
  return useQuery({
    queryKey: planillaKeys.detail(id),
    queryFn: () => planillaService.obtenerDetallePlanilla(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para crear una nueva planilla
 */
export const useCreatePlanilla = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planillaData) => planillaService.createPlanilla(planillaData),
    onMutate: () => {
      const loadingToast = toast.loading('Creando planilla...', {
        description: 'Guardando datos...'
      });
      return { loadingToast };
    },
    onSuccess: (newPlanilla, variables, context) => {
      // Invalidar listas de planillas y trabajadores sin planilla
      queryClient.invalidateQueries({ queryKey: planillaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planillaKeys.trabajadoresSinPlanilla() });

      toast.success('¡Planilla creada exitosamente!', {
        id: context.loadingToast,
        description: 'La planilla ha sido registrada en el sistema'
      });

      console.log('✅ Planilla creada y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al crear planilla', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al crear planilla:', error);
    },
  });
};

/**
 * Hook para aprobar planillas masivamente
 */
export const useAprobarPlanillasMasivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datosAprobacion) => planillaService.aprobarPlanillasMasivo(datosAprobacion),
    onMutate: () => {
      const loadingToast = toast.loading('Aprobando planillas...', {
        description: 'Procesando aprobación masiva...'
      });
      return { loadingToast };
    },
    onSuccess: (result, variables, context) => {
      // Invalidar listas de planillas
      queryClient.invalidateQueries({ queryKey: planillaKeys.lists() });

      toast.success('Planillas aprobadas exitosamente', {
        id: context.loadingToast,
        description: `${variables.idsPlanillas.length} planillas han sido aprobadas`
      });

      console.log('✅ Planillas aprobadas masivamente y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al aprobar planillas', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al aprobar planillas:', error);
    },
  });
};

/**
 * Hook para obtener planilla por período
 * @param {number|string} mes - Mes de la planilla
 * @param {number|string} anio - Año de la planilla
 * @param {Object} options - Opciones adicionales para useQuery
 */
export const usePlanillaPorPeriodo = (mes, anio, options = {}) => {
  return useQuery({
    queryKey: [...planillaKeys.all, 'periodo', mes, anio],
    queryFn: () => planillaService.obtenerPlanillaPorPeriodo(mes, anio),
    enabled: !!mes && !!anio, // Solo ejecutar si mes y año están definidos
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para agregar trabajadores a una planilla existente
 */
export const useAgregarTrabajadoresAPlanilla = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idPlanilla, trabajadores, generadoPor }) =>
      planillaService.agregarTrabajadoresAPlanilla(idPlanilla, trabajadores, generadoPor),
    onMutate: () => {
      const loadingToast = toast.loading('Agregando trabajadores a planilla...', {
        description: 'Procesando solicitud...'
      });
      return { loadingToast };
    },
    onSuccess: (data, variables, context) => {
      // Invalidar listas y detalle específico
      queryClient.invalidateQueries({ queryKey: planillaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planillaKeys.detail(variables.idPlanilla) });
      queryClient.invalidateQueries({ queryKey: planillaKeys.trabajadoresSinPlanilla() });

      toast.success('Trabajadores agregados exitosamente', {
        id: context.loadingToast,
        description: `${variables.trabajadores.length} trabajadores agregados a la planilla`
      });

      console.log('✅ Trabajadores agregados a planilla y cache invalidado');
    },
    onError: (error, variables, context) => {
      toast.error('Error al agregar trabajadores', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
      console.error('❌ Error al agregar trabajadores a planilla:', error);
    },
  });
};

/**
 * Hook para invalidar manualmente el cache de planillas
 */
export const useInvalidatePlanillas = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: planillaKeys.all });
      console.log('🗑️ Cache completo de planillas invalidado');
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: planillaKeys.lists() });
      console.log('🗑️ Cache de listas de planillas invalidado');
    },
    invalidateTrabajadoresSinPlanilla: () => {
      queryClient.invalidateQueries({ queryKey: planillaKeys.trabajadoresSinPlanilla() });
      console.log('🗑️ Cache de trabajadores sin planilla invalidado');
    },
    invalidateDetail: (id) => {
      queryClient.invalidateQueries({ queryKey: planillaKeys.detail(id) });
      console.log(`🗑️ Cache de planilla ${id} invalidado`);
    },
  };
};