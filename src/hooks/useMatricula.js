// src/hooks/useMatricula.js
import { useState, useCallback, useMemo } from 'react';
import { 
  useMatriculas, 
  useCreateMatricula, 
  useUpdateMatricula, 
  useDeleteMatricula,
  // useMatriculaStats, // Comentado - endpoint no existe
  useToggleMatriculaStatus,
  useImportMatriculas,
  useExportMatriculas
} from './queries/useMatriculaQueries';

/**
 * Hook personalizado para gestionar matrícula de estudiantes
 * Ahora usa TanStack Query para caching y optimización
 */
export const useMatricula = () => {
  // Estado para filtros y búsqueda - usar filtros vacíos por defecto para mejor caching
  const [filters, setFilters] = useState({});

  // Queries con TanStack Query - solo pasar filtros no vacíos
  const { 
    data: students = [], 
    isLoading: loading, 
    error, 
    refetch: refetchMatriculas 
  } = useMatriculas(filters);
  
  
  const stats = {}; // useMatriculaStats(); // Comentado - endpoint no existe
  
  // Mutations
  const createMatriculaMutation = useCreateMatricula();
  const updateMatriculaMutation = useUpdateMatricula();
  const deleteMatriculaMutation = useDeleteMatricula();
  const toggleStatusMutation = useToggleMatriculaStatus();
  const importMutation = useImportMatriculas();
  const exportMutation = useExportMatriculas();
  
  // Estados de carga para operaciones específicas
  const creating = createMatriculaMutation.isPending;
  const updating = updateMatriculaMutation.isPending;
  const deleting = deleteMatriculaMutation.isPending;
  const uploading = false; // Manejado internamente por las mutations

  /**
   * Recargar datos manualmente
   */
  const loadMatriculas = useCallback(() => {
    refetchMatriculas();
  }, [refetchMatriculas]);

  /**
   * Crear nueva matrícula de estudiante
   */
  const createStudent = useCallback(async (studentData) => {
    return createMatriculaMutation.mutateAsync(studentData);
  }, [createMatriculaMutation]);

  /**
   * Actualizar matrícula existente
   */
  const updateStudent = useCallback(async (id, studentData) => {
    return updateMatriculaMutation.mutateAsync({ id, ...studentData });
  }, [updateMatriculaMutation]);

  /**
   * Eliminar matrícula
   */
  const deleteStudent = useCallback(async (id) => {
    return deleteMatriculaMutation.mutateAsync(id);
  }, [deleteMatriculaMutation]);

  /**
   * Cambiar estado de matrícula (activo/inactivo)
   */
  const toggleStudentStatus = useCallback(async (id) => {
    return toggleStatusMutation.mutateAsync(id);
  }, [toggleStatusMutation]);

  /**
   * Buscar estudiantes (ahora manejado por filtros)
   */
  const searchStudents = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  /**
   * Importar datos desde archivo
   */
  const importData = useCallback(async (file, format = 'excel') => {
    return importMutation.mutateAsync({ file, format });
  }, [importMutation]);

  /**
   * Exportar datos a archivo
   */
  const exportData = useCallback(async (format = 'excel', customFilters = {}) => {
    const appliedFilters = { ...filters, ...customFilters };
    return exportMutation.mutateAsync({ format, filters: appliedFilters });
  }, [filters, exportMutation]);

  /**
   * Calcular estadísticas locales
   */
  const statistics = useMemo(() => {
    if (!students || students.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byGrade: {},
        recentEnrollments: 0,
        averageAge: 0
      };
    }
    
    const total = students.length;
    const active = students.filter(s => s.estaActivo).length;
    const inactive = total - active;
    
    // Agrupar por grado
    const byGrade = students.reduce((acc, student) => {
      const grade = student.idGrado?.grado || 'Sin grado';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
    
    // Matrículas recientes (último mes)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const recentEnrollments = students.filter(s => 
      new Date(s.fechaIngreso) > oneMonthAgo
    ).length;
    
    return {
      total,
      active,
      inactive,
      byGrade,
      recentEnrollments,
      averageAge: 0 // Calcular si se necesita
    };
  }, [students]);

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Limpiar filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({
      grade: '',
      status: '',
      academicYear: '',
      search: ''
    });
  }, []);

  return {
    // Datos
    students,
    filters,
    statistics,
    
    // Estados de carga
    loading,
    creating,
    updating,
    deleting,
    uploading,
    error,
    
    // Operaciones CRUD
    loadMatriculas,
    createStudent,
    matricularEstudiante: createStudent, // Alias para compatibilidad
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    
    // Búsqueda y filtros
    searchStudents,
    updateFilters,
    clearFilters,
    
    // Importar/Exportar
    importData,
    exportData
  };
};

export default useMatricula;
