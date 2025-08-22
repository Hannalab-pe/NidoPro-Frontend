// src/hooks/useTrabajadores.js
import { useState, useCallback } from 'react';
import { 
  useTrabajadores as useTrabajadoresQuery,
  useCreateTrabajador,
  useUpdateTrabajador,
  useDeleteTrabajador,
  useToggleTrabajadorStatus,
  useInvalidateTrabajadores
} from './queries/useTrabajadoresQueries';

/**
 * Hook personalizado para gestionar trabajadores con TanStack Query
 * Proporciona todas las funcionalidades CRUD y gestión de estado optimizada
 */
export const useTrabajadores = (initialFilters = {}) => {
  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    tipoDocumento: '',
    estaActivo: '',
    search: '',
    ...initialFilters
  });

  // Queries y mutations de TanStack Query
  const { 
    data: trabajadores = [], 
    isLoading: loading, 
    error,
    refetch: refetchTrabajadores 
  } = useTrabajadoresQuery(filters);
  
  const createMutation = useCreateTrabajador();
  const updateMutation = useUpdateTrabajador();
  const deleteMutation = useDeleteTrabajador();
  const toggleStatusMutation = useToggleTrabajadorStatus();
  const { invalidateAll, invalidateLists } = useInvalidateTrabajadores();

  // Funciones CRUD usando mutations
  const createTrabajador = useCallback(async (trabajadorData) => {
    return createMutation.mutateAsync(trabajadorData);
  }, [createMutation]);

  const updateTrabajador = useCallback(async (id, trabajadorData) => {
    return updateMutation.mutateAsync({ id, data: trabajadorData });
  }, [updateMutation]);

  const deleteTrabajador = useCallback(async (id) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const toggleTrabajadorStatus = useCallback(async (trabajador) => {
    return toggleStatusMutation.mutateAsync({ trabajador });
  }, [toggleStatusMutation]);

  // Funciones de filtrado y búsqueda
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      tipoDocumento: '',
      estaActivo: '',
      search: ''
    });
  }, []);

  const searchTrabajadores = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  const filterByTipoDocumento = useCallback((tipoDocumento) => {
    updateFilters({ tipoDocumento });
  }, [updateFilters]);

  const filterByEstado = useCallback((estaActivo) => {
    updateFilters({ estaActivo });
  }, [updateFilters]);

  // Estados derivados
  const creating = createMutation.isPending;
  const updating = updateMutation.isPending;
  const deleting = deleteMutation.isPending;
  const uploading = false; // Para compatibilidad
  
  // Funciones de utilidad
  const fetchTrabajadores = useCallback(async (customFilters = {}) => {
    if (Object.keys(customFilters).length > 0) {
      updateFilters(customFilters);
    } else {
      return refetchTrabajadores();
    }
  }, [refetchTrabajadores, updateFilters]);

  const refreshTrabajadores = useCallback(() => {
    return refetchTrabajadores();
  }, [refetchTrabajadores]);

  // Objeto de retorno del hook
  return {
    // Estados
    trabajadores,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,
    error,

    // Funciones CRUD
    createTrabajador,
    updateTrabajador,
    deleteTrabajador,
    toggleTrabajadorStatus,
    
    // Funciones de búsqueda y filtrado
    searchTrabajadores,
    filterByTipoDocumento,
    filterByEstado,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchTrabajadores,
    refreshTrabajadores,
    
    // Funciones de cache
    invalidateCache: invalidateAll,
    invalidateLists,
    
    // Funciones derivadas
    getActiveTrabajadores: () => trabajadores.filter(t => t.estaActivo === true),
    getInactiveTrabajadores: () => trabajadores.filter(t => t.estaActivo === false),
    getTotalTrabajadores: () => trabajadores.length,
    
    // Estados computados
    hasTrabajadores: trabajadores.length > 0,
    isOperating: creating || updating || deleting || uploading,
    isCached: true, // TanStack Query maneja el cache automáticamente
  };
};

export default useTrabajadores;