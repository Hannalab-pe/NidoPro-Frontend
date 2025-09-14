// src/hooks/usePlanilla.js
import { useState, useCallback, useMemo } from 'react';
import {
  useTrabajadoresSinPlanilla,
  usePlanillasMensuales,
  useCreatePlanilla,
  useAprobarPlanillasMasivo,
  useInvalidatePlanillas
} from './queries/usePlanillaQueries';
import planillaService from '../services/planillaService';
import { useAuthStore } from '../store';

/**
 * Hook personalizado para gestionar planillas
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const usePlanilla = (initialFilters = {}) => {
  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    mes: '',
    anio: '',
    estado: '',
    search: '',
    ...initialFilters
  });

  // Obtener usuario del store
  const { user } = useAuthStore();

  // Queries y mutations de TanStack Query
  const {
    data: trabajadoresSinPlanilla = [],
    isLoading: loadingTrabajadoresSinPlanilla,
    error: errorTrabajadoresSinPlanilla,
    refetch: refetchTrabajadoresSinPlanilla
  } = useTrabajadoresSinPlanilla(filters);

  const {
    data: planillasMensuales,
    isLoading: loadingPlanillasMensuales,
    error: errorPlanillasMensuales,
    refetch: refetchPlanillasMensuales
  } = usePlanillasMensuales(filters);

  const createMutation = useCreatePlanilla();
  const aprobarMasivoMutation = useAprobarPlanillasMasivo();
  const { invalidateAll, invalidateLists, invalidateTrabajadoresSinPlanilla } = useInvalidatePlanillas();

  // --- Sección de Estadísticas ---
  /**
   * Calcular y memorizar estadísticas de planillas
   */
  const statistics = useMemo(() => {
    const trabajadoresSinPlanillaCount = Array.isArray(trabajadoresSinPlanilla) ? trabajadoresSinPlanilla.length : 0;
    const planillasCount = planillasMensuales?.planillas?.length || 0;

    return {
      trabajadoresSinPlanilla: trabajadoresSinPlanillaCount,
      planillasMensuales: planillasCount,
      totalRegistros: trabajadoresSinPlanillaCount + planillasCount,
    };
  }, [trabajadoresSinPlanilla, planillasMensuales]);
  // --- Fin de la Sección de Estadísticas ---

  // Funciones CRUD usando mutations
  const createPlanilla = useCallback(async (planillaData) => {
    return createMutation.mutateAsync(planillaData);
  }, [createMutation]);

  const aprobarPlanillasMasivo = useCallback(async (datosAprobacion) => {
    return aprobarMasivoMutation.mutateAsync(datosAprobacion);
  }, [aprobarMasivoMutation]);

  // Nueva función para generar planillas con trabajadores seleccionados
  const generarPlanillasConTrabajadores = useCallback(async (trabajadoresSeleccionados) => {
    if (!trabajadoresSeleccionados || trabajadoresSeleccionados.length === 0) {
      throw new Error('Debe seleccionar al menos un trabajador');
    }

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const currentDate = new Date();
    const payload = {
      mes: currentDate.getMonth() + 1, // getMonth() devuelve 0-11, sumamos 1
      anio: currentDate.getFullYear(),
      fechaPagoProgramada: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0], // último día del mes
      trabajadores: trabajadoresSeleccionados,
      generadoPor: user?.entidadId || user?.id
    };

    console.log('Generando planillas con payload:', payload);

    // Llamada real al servicio
    const response = await planillaService.generarPlanillasConTrabajadores(payload);

    // Invalidar las queries para refrescar los datos
    invalidateAll();

    return response;
  }, [user, invalidateAll]);

  // Funciones de filtrado y búsqueda
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      mes: '',
      anio: '',
      estado: '',
      search: ''
    });
  }, []);

  const searchTrabajadores = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  const filterByMes = useCallback((mes) => {
    updateFilters({ mes });
  }, [updateFilters]);

  const filterByAnio = useCallback((anio) => {
    updateFilters({ anio });
  }, [updateFilters]);

  const filterByEstado = useCallback((estado) => {
    updateFilters({ estado });
  }, [updateFilters]);

  // Estados derivados
  const creating = createMutation.isPending;
  const approving = aprobarMasivoMutation.isPending;
  const loading = loadingTrabajadoresSinPlanilla || loadingPlanillasMensuales;
  const error = errorTrabajadoresSinPlanilla || errorPlanillasMensuales;

  // Funciones de utilidad
  const fetchTrabajadoresSinPlanilla = useCallback(async (customFilters = {}) => {
    if (Object.keys(customFilters).length > 0) {
      updateFilters(customFilters);
    } else {
      return refetchTrabajadoresSinPlanilla();
    }
  }, [refetchTrabajadoresSinPlanilla, updateFilters]);

  const fetchPlanillasMensuales = useCallback(async (customFilters = {}) => {
    if (Object.keys(customFilters).length > 0) {
      updateFilters(customFilters);
    } else {
      return refetchPlanillasMensuales();
    }
  }, [refetchPlanillasMensuales, updateFilters]);

  const refreshAll = useCallback(() => {
    refetchTrabajadoresSinPlanilla();
    refetchPlanillasMensuales();
  }, [refetchTrabajadoresSinPlanilla, refetchPlanillasMensuales]);

  // Objeto de retorno del hook
  return {
    // Estados
    trabajadoresSinPlanilla,
    planillasMensuales: planillasMensuales?.planillas || [],
    loading,
    creating,
    approving,
    filters,
    error,
    statistics,

    // Funciones CRUD
    createPlanilla,
    aprobarPlanillasMasivo,
    generarPlanillasConTrabajadores,

    // Funciones de búsqueda y filtrado
    searchTrabajadores,
    filterByMes,
    filterByAnio,
    filterByEstado,
    updateFilters,
    resetFilters,

    // Funciones de utilidad
    fetchTrabajadoresSinPlanilla,
    fetchPlanillasMensuales,
    refreshAll,

    // Funciones de cache
    invalidateCache: invalidateAll,
    invalidateLists,
    invalidateTrabajadoresSinPlanilla,

    // Estados computados
    hasTrabajadoresSinPlanilla: Array.isArray(trabajadoresSinPlanilla) && trabajadoresSinPlanilla.length > 0,
    hasPlanillasMensuales: planillasMensuales?.planillas?.length > 0,
    isOperating: creating || approving,
    isCached: true, // TanStack Query maneja el cache automáticamente
  };
};

export default usePlanilla;