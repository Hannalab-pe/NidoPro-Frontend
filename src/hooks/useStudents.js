// src/hooks/useStudents.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { studentService } from '../services/studentService';
import { uploadStudentImage } from '../services/cloudinaryService';

/**
 * Hook personalizado para gestionar estudiantes
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const useStudents = () => {
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
   * Obtener todos los estudiantes
   */
  const fetchStudents = useCallback(async (customFilters = {}) => {
    setLoading(true);
    
    try {
      const appliedFilters = { ...filters, ...customFilters };
      const data = await studentService.getAllStudents(appliedFilters);
      setStudents(data);
      console.log('📚 Estudiantes cargados:', data.length);
    } catch (error) {
      handleError(error, 'cargar estudiantes');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError]);

  /**
   * Crear un nuevo estudiante con upload de imagen
   */
  const createStudent = useCallback(async (studentData) => {
    setCreating(true);
    
    // Toast de carga
    const loadingToast = toast.loading('Creando estudiante...', {
      description: 'Subiendo imagen y guardando datos...'
    });
    
    try {
      console.log('🔄 Iniciando creación de estudiante...');
      
      // Si hay una imagen, subirla primero a Cloudinary
      let photoData = null;
      if (studentData.photoFile) {
        console.log('📷 Subiendo imagen a Cloudinary...');
        setUploading(true);
        
        // Actualizar toast de carga
        toast.loading('Subiendo imagen...', { 
          id: loadingToast,
          description: 'Procesando imagen del estudiante...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(studentData.photoFile);
          photoData = {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            thumbnailUrl: uploadResult.thumbnailUrl,
            detailUrl: uploadResult.detailUrl
          };
          console.log('✅ Imagen subida exitosamente:', photoData);
        } catch (uploadError) {
          console.error('❌ Error al subir imagen:', uploadError);
          toast.error('Error al subir la imagen', { 
            id: loadingToast,
            description: 'Intenta con una imagen más pequeña'
          });
          throw new Error('Error al subir la imagen del estudiante');
        } finally {
          setUploading(false);
        }
      }

      // Actualizar toast de carga
      toast.loading('Guardando estudiante...', { 
        id: loadingToast,
        description: 'Creando registro en la base de datos...'
      });

      // Preparar datos del estudiante
      const finalStudentData = {
        ...studentData,
        photo: photoData || studentData.photo || null
      };

      // Remover el archivo de la imagen ya que ya fue procesado
      delete finalStudentData.photoFile;

      // Crear estudiante en el backend
      console.log('💾 Guardando estudiante en el backend...');
      const newStudent = await studentService.createStudent(finalStudentData);
      
      // Actualizar lista local
      setStudents(prevStudents => [newStudent, ...prevStudents]);
      
      // Toast de éxito
      toast.success('¡Estudiante creado exitosamente!', {
        id: loadingToast,
        description: `${newStudent.name} ha sido agregado al sistema`
      });
      
      return newStudent;
      
    } catch (error) {
      toast.error('Error al crear estudiante', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'crear estudiante');
      throw error;
    } finally {
      setCreating(false);
      setUploading(false);
    }
  }, [handleError, handleSuccess]);

  /**
   * Actualizar un estudiante existente
   */
  const updateStudent = useCallback(async (id, studentData) => {
    setUpdating(true);
    
    const loadingToast = toast.loading('Actualizando estudiante...', {
      description: 'Guardando cambios...'
    });
    
    try {
      console.log('🔄 Actualizando estudiante:', id);
      
      // Si hay una nueva imagen, subirla primero
      let photoData = studentData.photo;
      if (studentData.photoFile) {
        console.log('📷 Subiendo nueva imagen...');
        setUploading(true);
        
        toast.loading('Subiendo nueva imagen...', {
          id: loadingToast,
          description: 'Procesando imagen actualizada...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(studentData.photoFile);
          photoData = {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            thumbnailUrl: uploadResult.thumbnailUrl,
            detailUrl: uploadResult.detailUrl
          };
        } catch (uploadError) {
          console.error('❌ Error al subir nueva imagen:', uploadError);
          toast.error('Error al subir nueva imagen', {
            id: loadingToast,
            description: uploadError.message
          });
          throw new Error('Error al subir la nueva imagen');
        } finally {
          setUploading(false);
        }
      }

      // Preparar datos actualizados
      const finalStudentData = {
        ...studentData,
        photo: photoData
      };
      delete finalStudentData.photoFile;

      // Actualizar en el backend
      const updatedStudent = await studentService.updateStudent(id, finalStudentData);
      
      // Actualizar lista local
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id ? updatedStudent : student
        )
      );
      
      toast.success('Estudiante actualizado exitosamente', {
        id: loadingToast,
        description: `Los datos de ${updatedStudent.name} han sido actualizados`
      });
      
      return updatedStudent;
      
    } catch (error) {
      toast.error('Error al actualizar estudiante', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'actualizar estudiante');
      throw error;
    } finally {
      setUpdating(false);
      setUploading(false);
    }
  }, [handleError, handleSuccess]);

  /**
   * Eliminar un estudiante
   */
  const deleteStudent = useCallback(async (id) => {
    setDeleting(true);
    
    const loadingToast = toast.loading('Eliminando estudiante...', {
      description: 'Procesando eliminación...'
    });
    
    try {
      console.log('🗑️ Eliminando estudiante:', id);
      await studentService.deleteStudent(id);
      
      // Remover de la lista local
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== id)
      );
      
      toast.success('Estudiante eliminado exitosamente', {
        id: loadingToast,
        description: 'El registro ha sido eliminado del sistema'
      });
      
    } catch (error) {
      toast.error('Error al eliminar estudiante', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'eliminar estudiante');
      throw error;
    } finally {
      setDeleting(false);
    }
  }, [handleError, handleSuccess]);

  /**
   * Cambiar estado de un estudiante
   */
  const changeStudentStatus = useCallback(async (id, status) => {
    const loadingToast = toast.loading('Cambiando estado...', {
      description: `${status === 'active' ? 'Activando' : 'Desactivando'} estudiante...`
    });
    
    try {
      console.log('🔄 Cambiando estado del estudiante:', id, status);
      const updatedStudent = await studentService.changeStudentStatus(id, status);
      
      // Actualizar lista local
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id ? updatedStudent : student
        )
      );
      
      const statusText = status === 'active' ? 'activado' : 'desactivado';
      toast.success(`Estudiante ${statusText} exitosamente`, {
        id: loadingToast,
        description: `${updatedStudent.name} ha sido ${statusText}`
      });
      
      return updatedStudent;
      
    } catch (error) {
      toast.error('Error al cambiar estado', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'cambiar estado del estudiante');
      throw error;
    }
  }, [handleError, handleSuccess]);

  /**
   * Buscar estudiantes
   */
  const searchStudents = useCallback(async (query) => {
    setLoading(true);
    
    try {
      const results = await studentService.searchStudents(query);
      setStudents(results);
      console.log('🔍 Resultados de búsqueda:', results.length);
      
      if (results.length === 0) {
        toast.info('No se encontraron estudiantes', {
          description: `No hay resultados para "${query}"`
        });
      }
    } catch (error) {
      handleError(error, 'buscar estudiantes');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Filtrar estudiantes por grado
   */
  const filterByGrade = useCallback(async (grade) => {
    setLoading(true);
    
    try {
      if (grade) {
        const results = await studentService.getStudentsByGrade(grade);
        setStudents(results);
        toast.success(`Filtrado por ${grade}`, {
          description: `${results.length} estudiantes encontrados`
        });
      } else {
        await fetchStudents();
        toast.info('Filtros eliminados', {
          description: 'Mostrando todos los estudiantes'
        });
      }
    } catch (error) {
      handleError(error, 'filtrar estudiantes por grado');
    } finally {
      setLoading(false);
    }
  }, [fetchStudents, handleError]);

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
   * Obtener un estudiante por ID
   */
  const getStudentById = useCallback(async (id) => {
    try {
      return await studentService.getStudentById(id);
    } catch (error) {
      handleError(error, 'obtener estudiante');
      throw error;
    }
  }, [handleError]);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
    getActiveStudents: () => students.filter(s => s.status === 'active'),
    getInactiveStudents: () => students.filter(s => s.status === 'inactive'),
    getStudentsByGrade: (grade) => students.filter(s => s.grade === grade),
    getTotalStudents: () => students.length,
    
    // Estados computados
    hasStudents: students.length > 0,
    isOperating: creating || updating || deleting || uploading,
  };
};

export default useStudents;
