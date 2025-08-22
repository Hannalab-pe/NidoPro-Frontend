// src/hooks/useMatricula.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import matriculaService from '../services/matriculaService';
import { uploadStudentImage } from '../services/cloudinaryService'; // Reutilizamos el mismo servicio

/**
 * Hook personalizado para gestionar matrícula de estudiantes
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const useMatricula = () => {
  // Estados principales
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para operaciones específicas
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    grade: '',
    status: '',
    academicYear: '',
    search: ''
  });

  /**
   * Manejar errores de forma consistente con toast
   */
  const handleError = useCallback((error, operation = '') => {
    const errorMessage = error.message || `Error en ${operation}`;
    toast.error(errorMessage, {
      description: operation ? `Operación: ${operation}` : undefined,
      duration: 5000,
    });
    console.error(`❌ ${operation}:`, error);
  }, []);

  /**
   * Manejar mensajes de éxito con toast
   */
  const handleSuccess = useCallback((message, description = '') => {
    toast.success(message, {
      description: description || undefined,
      duration: 3000,
    });
    console.log(`✅ ${message}`);
  }, []);

  /**
   * Obtener todos los estudiantes matriculados
   */
  const fetchStudents = useCallback(async (customFilters = {}) => {
    setLoading(true);
    
    try {
      const appliedFilters = { ...filters, ...customFilters };
      const response = await matriculaService.getStudents(appliedFilters);
      
      // Extraer datos según la estructura de respuesta del backend
      const estudiantesData = response.info?.data || [];
      setStudents(Array.isArray(estudiantesData) ? estudiantesData : []);
      
      console.log('👨‍🎓 Estudiantes cargados:', estudiantesData.length);
    } catch (error) {
      handleError(error, 'cargar estudiantes');
      setStudents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [filters, handleError]);

  /**
   * Matricular un nuevo estudiante con upload de imagen
   */
  const createStudent = useCallback(async (data) => {
    setCreating(true);
    
    // Toast de carga
    const loadingToast = toast.loading('Matriculando estudiante...', {
      description: 'Subiendo imagen y guardando datos...'
    });
    
    try {
      console.log('🔄 Iniciando matrícula de estudiante...');
      
      // Si hay una imagen, subirla primero a Cloudinary
      let photoData = null;
      if (data.photoFile) {
        console.log('📷 Subiendo imagen a Cloudinary...');
        setUploading(true);
        
        // Actualizar toast de carga
        toast.loading('Subiendo imagen...', { 
          id: loadingToast,
          description: 'Procesando imagen del estudiante...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(data.photoFile);
          photoData = {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            thumbnailUrl: uploadResult.thumbnailUrl,
            detailUrl: uploadResult.detailUrl
          };
          console.log('✅ Imagen subida exitosamente:', photoData);
        } catch (uploadError) {
          console.error('❌ Error subiendo imagen:', uploadError);
          toast.error('Error al subir imagen', {
            id: loadingToast,
            description: uploadError.message
          });
          throw uploadError;
        } finally {
          setUploading(false);
        }
      }

      // Preparar datos finales - remover campos que no debe tener
      const finalStudentData = { ...data };
      
      // Remover campos que el backend no acepta
      delete finalStudentData.photo;
      delete finalStudentData.photoFile;

      // Actualizar toast de carga
      toast.loading('Guardando estudiante...', { 
        id: loadingToast,
        description: 'Creando registro en la base de datos...'
      });

      // Crear estudiante en el backend
      console.log('💾 Guardando estudiante en el backend...');
      const newStudent = await matriculaService.createStudent(finalStudentData);
      
      // Actualizar lista local - verificar que prevStudents sea un array
      setStudents(prevStudents => {
        const currentStudents = Array.isArray(prevStudents) ? prevStudents : [];
        return [newStudent.estudiante || newStudent, ...currentStudents];
      });
      
      // Toast de éxito
      const studentData = newStudent.estudiante || newStudent;
      toast.success('¡Estudiante matriculado exitosamente!', {
        id: loadingToast,
        description: `${studentData.nombre} ${studentData.apellido} ha sido matriculado correctamente`
      });
      
      return newStudent;
      
    } catch (error) {
      toast.error('Error al matricular estudiante', {
        id: loadingToast,
        description: error.message
      });
      throw error;
    } finally {
      setCreating(false);
    }
  }, []);

  /**
   * Actualizar información de un estudiante matriculado
   */
  const updateStudent = useCallback(async (studentId, data) => {
    setUpdating(true);
    
    // Toast de carga
    const loadingToast = toast.loading('Actualizando estudiante...', {
      description: 'Guardando cambios...'
    });
    
    try {
      console.log('🔄 Actualizando estudiante:', studentId);
      
      // Si hay una nueva imagen, subirla primero
      let photoData = data.photo;
      if (data.photoFile) {
        console.log('📷 Subiendo nueva imagen...');
        setUploading(true);
        
        toast.loading('Subiendo nueva imagen...', { 
          id: loadingToast,
          description: 'Procesando imagen actualizada...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(data.photoFile);
          photoData = {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            thumbnailUrl: uploadResult.thumbnailUrl,
            detailUrl: uploadResult.detailUrl
          };
        } catch (uploadError) {
          console.error('❌ Error al subir nueva imagen:', uploadError);
          toast.error('Error al subir la nueva imagen', { 
            id: loadingToast,
            description: 'Se mantendrá la imagen anterior'
          });
          // Continuar con la imagen anterior
        } finally {
          setUploading(false);
        }
      }

      // Preparar datos actualizados
      const finalStudentData = {
        ...data,
        photo: photoData
      };

      // Remover el archivo de la imagen
      delete finalStudentData.photoFile;

      // Actualizar en el backend
      const updatedStudent = await matriculaService.updateStudent(studentId, finalStudentData);
      
      // Actualizar lista local
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === studentId ? updatedStudent : student
        )
      );
      
      // Toast de éxito
      toast.success('¡Estudiante actualizado exitosamente!', {
        id: loadingToast,
        description: `Los datos de ${updatedStudent.name} ${updatedStudent.lastName} han sido actualizados`
      });
      
      return updatedStudent;
      
    } catch (error) {
      toast.error('Error al actualizar estudiante', {
        id: loadingToast,
        description: error.message
      });
      throw error;
    } finally {
      setUpdating(false);
    }
  }, []);

  /**
   * Eliminar matrícula de un estudiante
   */
  const deleteStudent = useCallback(async (studentId) => {
    setDeleting(true);
    
    // Toast de carga
    const loadingToast = toast.loading('Eliminando matrícula...', {
      description: 'Removiendo estudiante del sistema...'
    });
    
    try {
      console.log('🗑️ Eliminando estudiante:', studentId);
      
      // Eliminar del backend
      await matriculaService.deleteStudent(studentId);
      
      // Actualizar lista local
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== studentId)
      );
      
      // Toast de éxito
      toast.success('¡Matrícula eliminada exitosamente!', {
        id: loadingToast,
        description: 'El estudiante ha sido removido del sistema'
      });
      
      return true;
      
    } catch (error) {
      toast.error('Error al eliminar matrícula', {
        id: loadingToast,
        description: error.message
      });
      throw error;
    } finally {
      setDeleting(false);
    }
  }, []);

  /**
   * Cambiar estado de un estudiante
   */
  const updateStudentStatus = useCallback(async (studentId, status) => {
    try {
      console.log('🔄 Cambiando estado del estudiante:', studentId, 'a', status);
      
      const updatedStudent = await matriculaService.updateStudentStatus(studentId, status);
      
      // Actualizar lista local
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === studentId ? updatedStudent : student
        )
      );
      
      handleSuccess(
        `Estado cambiado a ${status === 'active' ? 'activo' : 'inactivo'}`,
        `El estudiante ha sido ${status === 'active' ? 'activado' : 'desactivado'}`
      );
      
      return updatedStudent;
      
    } catch (error) {
      handleError(error, 'cambiar estado del estudiante');
      throw error;
    }
  }, [handleSuccess, handleError]);

  /**
   * Buscar estudiantes
   */
  const searchStudents = useCallback(async (searchCriteria) => {
    setLoading(true);
    
    try {
      const results = await matriculaService.searchStudents(searchCriteria);
      setStudents(results);
      console.log('🔍 Búsqueda completada:', results.length, 'resultados');
      return results;
    } catch (error) {
      handleError(error, 'buscar estudiantes');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Exportar datos de matrícula
   */
  const exportData = useCallback(async (filters = {}, format = 'excel') => {
    try {
      const blob = await matriculaService.exportEnrollmentData(filters, format);
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `matricula_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      handleSuccess('Datos exportados exitosamente', `Archivo ${format.toUpperCase()} descargado`);
      
    } catch (error) {
      handleError(error, 'exportar datos de matrícula');
      throw error;
    }
  }, [handleSuccess, handleError]);

  /**
   * Importar datos de matrícula
   */
  const importData = useCallback(async (file) => {
    const loadingToast = toast.loading('Importando datos...', {
      description: 'Procesando archivo de matrícula...'
    });
    
    try {
      const result = await matriculaService.importEnrollmentData(file);
      
      // Recargar lista de estudiantes
      await fetchStudents();
      
      toast.success('¡Datos importados exitosamente!', {
        id: loadingToast,
        description: `${result.imported} estudiantes importados, ${result.errors || 0} errores`
      });
      
      return result;
      
    } catch (error) {
      toast.error('Error al importar datos', {
        id: loadingToast,
        description: error.message
      });
      throw error;
    }
  }, [fetchStudents]);

  // Funciones de utilidad para estadísticas
  const getActiveStudents = useCallback(() => {
    return Array.isArray(students) ? students.filter(student => student.status === 'active') : [];
  }, [students]);

  const getTotalStudents = useCallback(() => {
    return Array.isArray(students) ? students.length : 0;
  }, [students]);

  const getStudentsByGrade = useCallback(() => {
    if (!Array.isArray(students)) return [];
    const gradeGroups = students.reduce((acc, student) => {
      const grade = student.grade || 'Sin grado';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(gradeGroups);
  }, [students]);

  const getRecentEnrollments = useCallback(() => {
    if (!Array.isArray(students)) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return students.filter(student => {
      const enrollmentDate = new Date(student.enrollmentDate);
      return enrollmentDate >= thirtyDaysAgo;
    }).length;
  }, [students]);

  const getStudentsByStatus = useCallback(() => {
    if (!Array.isArray(students)) return {};
    return students.reduce((acc, student) => {
      const status = student.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [students]);

  const getAverageAge = useCallback(() => {
    if (!Array.isArray(students) || students.length === 0) return 0;
    
    const totalAge = students.reduce((sum, student) => {
      if (student.birthDate) {
        const age = new Date().getFullYear() - new Date(student.birthDate).getFullYear();
        return sum + age;
      }
      return sum;
    }, 0);
    
    return Math.round(totalAge / students.length);
  }, [students]);

  // Efecto para cargar estudiantes al montar el componente
  useEffect(() => {
    fetchStudents();
  }, []);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      grade: '',
      status: '',
      academicYear: '',
      search: ''
    });
  }, []);

  return {
    // Estados
    students,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,

    // Operaciones CRUD
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    updateStudentStatus,

    // Búsqueda y filtros
    searchStudents,
    updateFilters,
    clearFilters,

    // Importar/Exportar
    exportData,
    importData,

    // Estadísticas
    getActiveStudents,
    getTotalStudents,
    getStudentsByGrade,
    getRecentEnrollments,
    getStudentsByStatus,
    getAverageAge,

    // Utilidades
    handleError,
    handleSuccess
  };
};

export default useMatricula;
