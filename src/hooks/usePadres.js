// src/hooks/usePadres.js
import { useState, useCallback } from 'react';
import {
  usePadres as usePadresQuery,
  useCreatePadre,
  useUpdatePadre,
  useDeletePadre,
  useTogglePadreStatus
} from './queries/usePadresQueries';

/**
 * Hook personalizado para gestionar padres/apoderados usando TanStack Query
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const usePadres = () => {
  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    relation: '',
    status: '',
    participationLevel: '',
    search: ''
  });

  // TanStack Query hooks
  const { data: parents = [], isLoading: loading, refetch: fetchParents } = usePadresQuery(filters);
  const createMutation = useCreatePadre();
  const updateMutation = useUpdatePadre();
  const deleteMutation = useDeletePadre();
  const toggleStatusMutation = useTogglePadreStatus();

  // Estados de operaciones
  const creating = createMutation.isPending;
  const updating = updateMutation.isPending;
  const deleting = deleteMutation.isPending;
  const uploading = creating || updating; // Se maneja internamente en las mutaciones

  /**
   * Crear un nuevo padre
   */
  const createParent = useCallback(async (parentData) => {
    return createMutation.mutateAsync(parentData);
  }, [createMutation]);

  /**
   * Actualizar un padre existente
   */
  const updateParent = useCallback(async (id, parentData) => {
    return updateMutation.mutateAsync({ id, ...parentData });
  }, [updateMutation]);

  /**
   * Eliminar un padre
   */
  const deleteParent = useCallback(async (id) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  /**
   * Cambiar estado de un padre
   */
  const changeParentStatus = useCallback(async (id, status) => {
    // Para compatibilidad, convertir el status al toggle
    return toggleStatusMutation.mutateAsync(id);
  }, [toggleStatusMutation]);

  /**
   * Buscar padres (actualizar filtros)
   */
  const searchParents = useCallback(async (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  /**
   * Filtrar padres por relación
   */
  const filterByRelation = useCallback(async (relation) => {
    setFilters(prev => ({ ...prev, relation }));
  }, []);

  /**
   * Filtrar padres por nivel de participación
   */
  const filterByParticipation = useCallback(async (level) => {
    setFilters(prev => ({ ...prev, participationLevel: level }));
  }, []);

  /**
   * Obtener hijos de un padre (funcionalidad futura)
   */
  const getParentChildren = useCallback(async (parentId) => {
    // Esta funcionalidad se puede implementar con queries adicionales
    const parent = parents.find(p => p.id === parentId || p.idApoderado === parentId);
    return parent?.hijos || [];
  }, [parents]);

  /**
   * Asignar hijo a padre (funcionalidad futura)
   */
  const assignChildToParent = useCallback(async (parentId, studentId) => {
    // Esta funcionalidad se puede implementar con mutaciones adicionales
    console.log('Asignando hijo', studentId, 'al padre', parentId);
    return { parentId, studentId };
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
      relation: '',
      status: '',
      participationLevel: '',
      search: ''
    });
  }, []);

  /**
   * Refrescar lista de padres
   */
  const refreshParents = useCallback(() => {
    fetchParents();
  }, [fetchParents]);

  /**
   * Obtener un padre por ID
   */
  const getParentById = useCallback(async (id) => {
    const parent = parents.find(p => p.id === id || p.idApoderado === id);
    return parent;
  }, [parents]);

  // Objeto de retorno del hook
  return {
    // Estados
    parents,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,

    // Acciones CRUD
    createParent,
    updateParent,
    deleteParent,
    changeParentStatus,

    // Funciones de utilidad
    fetchParents,
    updateFilters,
    resetFilters,
    searchParents,
    filterByRelation,
    filterByParticipation,

    // Funciones de estadísticas
    getActiveParents: () => parents.filter(p => p.estaActivo === true),
    getInactiveParents: () => parents.filter(p => p.estaActivo === false),
    getTotalParents: () => parents.length,
    getParentsByRelation: (relation) => parents.filter(p => p.relacion === relation),
    getHighParticipationParents: () => parents.filter(p => p.participacion === 'alta'),
    getMediumParticipationParents: () => parents.filter(p => p.participacion === 'media'),
    getLowParticipationParents: () => parents.filter(p => p.participacion === 'baja'),
    
    // Funciones adicionales
    refreshParents,
    getParentById,
    getParentChildren,
    assignChildToParent,
    
    // Estados computados
    hasParents: parents.length > 0,
    isOperating: creating || updating || deleting || uploading,
    isCached: true, // TanStack Query maneja el cache automáticamente
  };
};

export default usePadres;