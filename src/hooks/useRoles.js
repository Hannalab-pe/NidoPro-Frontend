// src/hooks/useRoles.js
import { useState, useCallback, useMemo } from 'react';
import {
  useRoles as useRolesQuery,
  useCreateRol,
  useUpdateRol,
  useDeleteRol,
  useToggleRolStatus
} from './queries/useRolesQueries';

/**
 * Hook personalizado para gestionar roles usando TanStack Query
 * Proporciona todas las funcionalidades CRUD, gestión de estado y estadísticas
 */
export const useRoles = () => {
  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10
  });

  // TanStack Query hooks
  const { data: roles = [], isLoading: loading, refetch: fetchRoles } = useRolesQuery(filters);
  const createMutation = useCreateRol();
  const updateMutation = useUpdateRol();
  const deleteMutation = useDeleteRol();
  const toggleStatusMutation = useToggleRolStatus();

  // Estados de operaciones
  const creating = createMutation.isPending;
  const updating = updateMutation.isPending;
  const deleting = deleteMutation.isPending;
  const uploading = creating || updating;

  // --- Sección de Estadísticas ---
  /**
   * Calcular y memorizar estadísticas de los roles
   */
  const statistics = useMemo(() => {
    if (!roles || roles.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0
      };
    }

    const total = roles.length;
    const active = roles.filter(rol => rol.estaActivo).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive
    };
  }, [roles]);
  // --- Fin de la Sección de Estadísticas ---

  /**
   * Crear un nuevo rol
   */
  const createRol = useCallback(async (rolData) => {
    return createMutation.mutateAsync(rolData);
  }, [createMutation]);

  /**
   * Actualizar un rol existente
   */
  const updateRol = useCallback(async (id, rolData) => {
    return updateMutation.mutateAsync({ id, ...rolData });
  }, [updateMutation]);

  /**
   * Eliminar un rol
   */
  const deleteRol = useCallback(async (id) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  /**
   * Cambiar estado de un rol
   */
  const toggleRolStatus = useCallback(async (id) => {
    return toggleStatusMutation.mutateAsync(id);
  }, [toggleStatusMutation]);

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Refrescar roles
   */
  const refreshRoles = useCallback(async () => {
    await fetchRoles();
  }, [fetchRoles]);

  return {
    // Datos
    roles,
    loading,
    statistics,

    // Estados de operaciones
    creating,
    updating,
    deleting,
    uploading,

    // Filtros
    filters,
    updateFilters,

    // Acciones
    createRol,
    updateRol,
    deleteRol,
    toggleRolStatus,
    refreshRoles
  };
};
