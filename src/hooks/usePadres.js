// src/hooks/usePadres.js
import { useState, useCallback, useMemo } from 'react'; // <-- Agregar useMemo
import {
  usePadres as usePadresQuery,
  useCreatePadre,
  useUpdatePadre,
  useDeletePadre,
  useTogglePadreStatus
} from './queries/usePadresQueries';

/**
 * Hook personalizado para gestionar padres/apoderados usando TanStack Query
 * Proporciona todas las funcionalidades CRUD, gestión de estado y estadísticas
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
  const uploading = creating || updating;

  // --- Sección de Estadísticas ---
  /**
   * Calcular y memorizar estadísticas de los padres
   */
  const statistics = useMemo(() => {
    if (!parents || parents.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byRelation: {},
        byParticipation: {},
        withChildren: 0
      };
    }

    const total = parents.length;
    const active = parents.filter(p => p.estaActivo).length;
    const inactive = total - active;

    // Agrupar por relación (asume una propiedad 'relacion' en el objeto padre)
    const byRelation = parents.reduce((acc, parent) => {
      const relation = parent.relacion || 'Sin relación';
      acc[relation] = (acc[relation] || 0) + 1;
      return acc;
    }, {});
    
    // Agrupar por nivel de participación (asume una propiedad 'participacion')
    const byParticipation = parents.reduce((acc, parent) => {
        const level = parent.participacion || 'Sin definir';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    // Contar padres que tienen hijos asignados (asume un array 'hijos' no vacío)
    const withChildren = parents.filter(p => p.hijos && p.hijos.length > 0).length;

    return {
      total,
      active,
      inactive,
      byRelation,
      byParticipation,
      withChildren
    };
  }, [parents]);
  // --- Fin de la Sección de Estadísticas ---

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
  const changeParentStatus = useCallback(async (id) => {
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
    const parent = parents.find(p => p.id === parentId || p.idApoderado === parentId);
    return parent?.hijos || [];
  }, [parents]);

  /**
   * Asignar hijo a padre (funcionalidad futura)
   */
  const assignChildToParent = useCallback(async (parentId, studentId) => {
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
    statistics, // <-- Agregas esto aquí

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

    // Funciones adicionales
    refreshParents,
    getParentById,
    getParentChildren,
    assignChildToParent,
    
    // Se reemplazan las funciones de estadísticas por el objeto 'statistics'
    // getActiveParents, getInactiveParents, etc. ya no son necesarios
    
    // Estados computados
    hasParents: parents.length > 0,
    isOperating: creating || updating || deleting || uploading,
    isCached: true,
  };
};

export default usePadres;