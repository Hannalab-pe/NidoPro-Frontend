// src/hooks/useStudents.js
import { useState, useCallback } from 'react';
import {
  useEstudiantes,
  useCreateEstudiante,
  useUpdateEstudiante,
  useDeleteEstudiante,
  useToggleEstudianteStatus
} from './queries/useEstudiantesQueries';

/**
 * Hook personalizado para gestionar estudiantes usando TanStack Query
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const useStudents = () => {
  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    grade: '',
    status: '',
    search: ''
  });

  // TanStack Query hooks
  const { data: students = [], isLoading: loading, refetch: fetchStudents } = useEstudiantes(filters);
  const createMutation = useCreateEstudiante();
  const updateMutation = useUpdateEstudiante();
  const deleteMutation = useDeleteEstudiante();
  const toggleStatusMutation = useToggleEstudianteStatus();

  // Estados de operaciones
  const creating = createMutation.isPending;
  const updating = updateMutation.isPending;
  const deleting = deleteMutation.isPending;
  const uploading = creating || updating; // Se maneja internamente en las mutaciones

  /**
   * Crear un nuevo estudiante
   */
  const createStudent = useCallback(async (studentData) => {
    return createMutation.mutateAsync(studentData);
  }, [createMutation]);

  /**
   * Actualizar un estudiante existente
   */
  const updateStudent = useCallback(async (id, studentData) => {
    return updateMutation.mutateAsync({ id, ...studentData });
  }, [updateMutation]);

  /**
   * Eliminar un estudiante
   */
  const deleteStudent = useCallback(async (id) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  /**
   * Cambiar estado de un estudiante
   */
  const changeStudentStatus = useCallback(async (id, status) => {
    // Para compatibilidad, convertir el status al toggle
    return toggleStatusMutation.mutateAsync(id);
  }, [toggleStatusMutation]);

  /**
   * Buscar estudiantes (actualizar filtros)
   */
  const searchStudents = useCallback(async (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  /**
   * Filtrar estudiantes por grado
   */
  const filterByGrade = useCallback(async (grade) => {
    setFilters(prev => ({ ...prev, grade }));
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
      grade: '',
      status: '',
      search: ''
    });
  }, []);

  /**
   * Refrescar lista de estudiantes
   */
  const refreshStudents = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  /**
   * Obtener un estudiante por ID (se puede implementar con useEstudiante)
   */
  const getStudentById = useCallback(async (id) => {
    // Esta función puede usar el hook useEstudiante cuando sea necesario
    const student = students.find(s => s.id === id || s.idEstudiante === id);
    return student;
  }, [students]);

  // Objeto de retorno del hook
  return {
    // Estados
    students,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,

    // Funciones CRUD
    createStudent,
    updateStudent,
    deleteStudent,
    changeStudentStatus,
    
    // Funciones de búsqueda y filtrado
    searchStudents,
    filterByGrade,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchStudents,
    refreshStudents,
    getStudentById,

    // Funciones derivadas
    getActiveStudents: () => students.filter(s => s.estaActivo === true),
    getInactiveStudents: () => students.filter(s => s.estaActivo === false),
    getStudentsByGrade: (grade) => students.filter(s => s.grado === grade),
    getTotalStudents: () => students.length,
    
    // Estados computados
    hasStudents: students.length > 0,
    isOperating: creating || updating || deleting || uploading,
    isCached: true, // TanStack Query maneja el cache automáticamente
  };
};

export default useStudents;
