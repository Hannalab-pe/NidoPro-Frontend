// src/hooks/useAulas.js
import { useState, useCallback } from 'react';
import {
  useAulas,
  useCreateAula,
  useUpdateAula,
  useDeleteAula,
  useToggleAulaStatus
} from './queries/useAulasQueries';

/**
 * Hook personalizado para gestionar aulas usando TanStack Query
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const useAulasHook = () => {
  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    seccion: '',
    estado: '',
    search: ''
  });

  // TanStack Query hooks
  const { data: aulas = [], isLoading: loading, refetch: fetchAulas } = useAulas(filters);
  const createMutation = useCreateAula();
  const updateMutation = useUpdateAula();
  const deleteMutation = useDeleteAula();
  const toggleStatusMutation = useToggleAulaStatus();

  // Estados de operaciones
  const creating = createMutation.isPending;
  const updating = updateMutation.isPending;
  const deleting = deleteMutation.isPending;
  const uploading = creating || updating;

  /**
   * Crear una nueva aula
   */
  const createAula = useCallback(async (aulaData) => {
    return createMutation.mutateAsync(aulaData);
  }, [createMutation]);

  /**
   * Actualizar un aula existente
   */
  const updateAula = useCallback(async (id, aulaData) => {
    return updateMutation.mutateAsync({ id, ...aulaData });
  }, [updateMutation]);

  /**
   * Eliminar un aula
   */
  const deleteAula = useCallback(async (id) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  /**
   * Cambiar estado de un aula
   */
  const changeAulaStatus = useCallback(async (id, estado) => {
    return toggleStatusMutation.mutateAsync({ id, estado });
  }, [toggleStatusMutation]);

  /**
   * Buscar aulas (actualizar filtros)
   */
  const searchAulas = useCallback(async (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  /**
   * Filtrar aulas por sección
   */
  const filterBySeccion = useCallback(async (seccion) => {
    setFilters(prev => ({ ...prev, seccion }));
  }, []);

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Resetear filtros
   */
  const resetFilters = useCallback(() => {
    setFilters({
      seccion: '',
      estado: '',
      search: ''
    });
  }, []);

  /**
   * Refrescar lista de aulas
   */
  const refreshAulas = useCallback(() => {
    fetchAulas();
  }, [fetchAulas]);

  /**
   * Obtener un aula por ID
   */
  const getAulaById = useCallback(async (id) => {
    const aula = aulas.find(a => a.id === id || a.idAula === id);
    return aula;
  }, [aulas]);

  // Objeto de retorno del hook
  return {
    // Estados
    aulas,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,

    // Funciones CRUD
    createAula,
    updateAula,
    deleteAula,
    changeAulaStatus,
    
    // Funciones de búsqueda y filtrado
    searchAulas,
    filterBySeccion,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchAulas,
    refreshAulas,
    getAulaById,

    // Funciones derivadas
    getActiveAulas: () => aulas.filter(a => a.estado === 'activa'),
    getInactiveAulas: () => aulas.filter(a => a.estado === 'inactiva'),
    getAulasBySeccion: (seccion) => aulas.filter(a => a.seccion === seccion),
    getTotalAulas: () => aulas.length,
    getTotalStudentsInAulas: () => aulas.reduce((total, aula) => total + (aula.cantidadEstudiantes || 0), 0),
    getAverageStudentsPerAula: () => {
      const total = aulas.reduce((sum, aula) => sum + (aula.cantidadEstudiantes || 0), 0);
      return aulas.length > 0 ? Math.round(total / aulas.length) : 0;
    },
    
    // Estados computados
    hasAulas: aulas.length > 0,
    isOperating: creating || updating || deleting || uploading,
    isCached: true, // TanStack Query maneja el cache automáticamente
  };
};

export default useAulasHook;

// Alias para compatibilidad con componentes que esperan useAulas
export { useAulasHook as useAulas };
