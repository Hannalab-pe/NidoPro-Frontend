// src/hooks/useClases.js
import { useState, useMemo } from 'react';
import {
  useClasesQuery,
  useClaseQuery,
  useClaseStatsQuery,
  useCreateClaseMutation,
  useUpdateClaseMutation,
  useDeleteClaseMutation,
  useChangeClaseStatusMutation
} from './queries/useClasesQueries';

/**
 * Hook principal para gestión de clases
 * Combina queries y mutations con lógica de estado local
 */
export const useClasesHook = () => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrado, setSelectedGrado] = useState('all');
  const [selectedTurno, setSelectedTurno] = useState('all');

  // Queries
  const {
    data: clases = [],
    isLoading: loading,
    error,
    refetch
  } = useClasesQuery(filters);

  const {
    data: stats = {},
    isLoading: statsLoading
  } = useClaseStatsQuery();

  // Mutations
  const createClaseMutation = useCreateClaseMutation();
  const updateClaseMutation = useUpdateClaseMutation();
  const deleteClaseMutation = useDeleteClaseMutation();
  const changeStatusMutation = useChangeClaseStatusMutation();

  // Datos filtrados
  const filteredClases = useMemo(() => {
    if (!Array.isArray(clases)) return [];
    let filtered = [...clases];

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(clase =>
        clase.nombre?.toLowerCase().includes(term) ||
        clase.grado?.toLowerCase().includes(term) ||
        clase.seccion?.toLowerCase().includes(term) ||
        clase.profesor?.nombre?.toLowerCase().includes(term) ||
        clase.aula?.ubicacion?.toLowerCase().includes(term)
      );
    }

    // Filtro por grado
    if (selectedGrado && selectedGrado !== 'all') {
      filtered = filtered.filter(clase => clase.grado === selectedGrado);
    }

    // Filtro por turno
    if (selectedTurno && selectedTurno !== 'all') {
      filtered = filtered.filter(clase => clase.turno === selectedTurno);
    }

    return filtered;
  }, [clases, searchTerm, selectedGrado, selectedTurno]);

  // Funciones de utilidad
  const getTotalClases = () => {
    if (!Array.isArray(clases)) return 0;
    return stats.totalClases || clases.length;
  };
  
  const getTotalEstudiantes = () => {
    if (!Array.isArray(clases)) return 0;
    return stats.totalEstudiantes || clases.reduce((sum, clase) => sum + (clase.cantidadEstudiantes || 0), 0);
  };
  
  const getPromedioAsistencia = () => {
    if (!Array.isArray(clases)) return 0;
    if (stats.promedioAsistencia) return stats.promedioAsistencia;
    if (clases.length === 0) return 0;
    return clases.reduce((sum, clase) => sum + (clase.asistencia || 0), 0) / clases.length;
  };
  
  const getClasesActivas = () => {
    if (!Array.isArray(clases)) return 0;
    return stats.clasesActivas || clases.filter(clase => clase.estado === 'activa').length;
  };

  const getClasesByGrado = () => {
    const grados = {};
    clases.forEach(clase => {
      const grado = clase.grado || 'Sin grado';
      grados[grado] = (grados[grado] || 0) + 1;
    });
    return grados;
  };

  const getClasesByTurno = () => {
    const turnos = {};
    clases.forEach(clase => {
      const turno = clase.turno || 'Sin turno';
      turnos[turno] = (turnos[turno] || 0) + 1;
    });
    return turnos;
  };

  // Funciones CRUD
  const createClase = async (claseData) => {
    try {
      await createClaseMutation.mutateAsync(claseData);
      return true;
    } catch (error) {
      console.error('Error al crear clase:', error);
      return false;
    }
  };

  const updateClase = async (id, claseData) => {
    try {
      await updateClaseMutation.mutateAsync({ id, data: claseData });
      return true;
    } catch (error) {
      console.error('Error al actualizar clase:', error);
      return false;
    }
  };

  const deleteClase = async (id) => {
    try {
      await deleteClaseMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error('Error al eliminar clase:', error);
      return false;
    }
  };

  const changeClaseStatus = async (id, estado) => {
    try {
      await changeStatusMutation.mutateAsync({ id, estado });
      return true;
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      return false;
    }
  };

  // Funciones de filtrado
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSelectedGrado('all');
    setSelectedTurno('all');
  };

  const searchClases = (term) => {
    setSearchTerm(term);
  };

  const filterByGrado = (grado) => {
    setSelectedGrado(grado);
  };

  const filterByTurno = (turno) => {
    setSelectedTurno(turno);
  };

  return {
    // Datos
    clases: filteredClases,
    allClases: clases,
    loading,
    error,
    stats,
    statsLoading,

    // Estados de filtros
    searchTerm,
    selectedGrado,
    selectedTurno,
    filters,

    // Funciones de datos
    getTotalClases,
    getTotalEstudiantes,
    getPromedioAsistencia,
    getClasesActivas,
    getClasesByGrado,
    getClasesByTurno,

    // Funciones CRUD
    createClase,
    updateClase,
    deleteClase,
    changeClaseStatus,
    refetch,

    // Funciones de filtrado
    updateFilters,
    clearFilters,
    searchClases,
    filterByGrado,
    filterByTurno,

    // Estados de mutations
    isCreating: createClaseMutation.isPending,
    isUpdating: updateClaseMutation.isPending,
    isDeleting: deleteClaseMutation.isPending,
    isChangingStatus: changeStatusMutation.isPending
  };
};

/**
 * Hook para obtener una clase específica por ID
 */
export const useClase = (id) => {
  const {
    data: clase,
    isLoading: loading,
    error,
    refetch
  } = useClaseQuery(id);

  return {
    clase,
    loading,
    error,
    refetch
  };
};

export default useClasesHook;
