// src/hooks/useTeachers.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import profesoresService from '../services/profesorService';
import { uploadStudentImage } from '../services/cloudinaryService'; // Reutilizamos el mismo servicio

/**
 * Hook personalizado para gestionar profesores
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const useProfesores = () => {
  // Estados principales
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para operaciones específicas
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    subject: '',
    status: '',
    schedule: '',
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
   * Obtener todos los profesores
   */
  const fetchTeachers = useCallback(async (customFilters = {}) => {
    setLoading(true);
    
    try {
      const appliedFilters = { ...filters, ...customFilters };
      const data = await profesoresService.getAllTeachers(appliedFilters);
      setTeachers(data);
      console.log('👨‍🏫 Profesores cargados:', data.length);
    } catch (error) {
      handleError(error, 'cargar profesores');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError]);

  /**
   * Crear un nuevo profesor con upload de imagen
   */
  const createTeacher = useCallback(async (teacherData) => {
    setCreating(true);
    
    // Toast de carga
    const loadingToast = toast.loading('Creando profesor...', {
      description: 'Subiendo imagen y guardando datos...'
    });
    
    try {
      console.log('🔄 Iniciando creación de profesor...');
      
      // Si hay una imagen, subirla primero a Cloudinary
      let photoData = null;
      if (teacherData.photoFile) {
        console.log('📷 Subiendo imagen a Cloudinary...');
        setUploading(true);
        
        // Actualizar toast de carga
        toast.loading('Subiendo imagen...', { 
          id: loadingToast,
          description: 'Procesando imagen del profesor...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(teacherData.photoFile);
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
          throw new Error('Error al subir la imagen del profesor');
        } finally {
          setUploading(false);
        }
      }

      // Actualizar toast de carga
      toast.loading('Guardando profesor...', { 
        id: loadingToast,
        description: 'Creando registro en la base de datos...'
      });

      // Preparar datos del profesor
      const finalTeacherData = {
        ...teacherData,
        photo: photoData || teacherData.photo || null
      };

      // Remover el archivo de la imagen ya que ya fue procesado
      delete finalTeacherData.photoFile;

      // Crear profesor en el backend
      console.log('💾 Guardando profesor en el backend...');
      const newTeacher = await profesoresService.createTeacher(finalTeacherData);
      
      // Actualizar lista local
      setTeachers(prevTeachers => [newTeacher, ...prevTeachers]);
      
      // Toast de éxito
      toast.success('¡Profesor creado exitosamente!', {
        id: loadingToast,
        description: `${newTeacher.name} ha sido agregado al sistema`
      });
      
      return newTeacher;
      
    } catch (error) {
      toast.error('Error al crear profesor', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'crear profesor');
      throw error;
    } finally {
      setCreating(false);
      setUploading(false);
    }
  }, [handleError]);

  /**
   * Actualizar un profesor existente
   */
  const updateTeacher = useCallback(async (id, teacherData) => {
    setUpdating(true);
    
    const loadingToast = toast.loading('Actualizando profesor...', {
      description: 'Guardando cambios...'
    });
    
    try {
      console.log('🔄 Actualizando profesor:', id);
      
      // Si hay una nueva imagen, subirla primero
      let photoData = teacherData.photo;
      if (teacherData.photoFile) {
        console.log('📷 Subiendo nueva imagen...');
        setUploading(true);
        
        toast.loading('Subiendo nueva imagen...', {
          id: loadingToast,
          description: 'Procesando imagen actualizada...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(teacherData.photoFile);
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
      const finalTeacherData = {
        ...teacherData,
        photo: photoData
      };
      delete finalTeacherData.photoFile;

      // Actualizar en el backend
      const updatedTeacher = await profesoresService.updateTeacher(id, finalTeacherData);
      
      // Actualizar lista local
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.id === id ? updatedTeacher : teacher
        )
      );
      
      toast.success('Profesor actualizado exitosamente', {
        id: loadingToast,
        description: `Los datos de ${updatedTeacher.name} han sido actualizados`
      });
      
      return updatedTeacher;
      
    } catch (error) {
      toast.error('Error al actualizar profesor', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'actualizar profesor');
      throw error;
    } finally {
      setUpdating(false);
      setUploading(false);
    }
  }, [handleError]);

  /**
   * Eliminar un profesor
   */
  const deleteTeacher = useCallback(async (id) => {
    setDeleting(true);
    
    const loadingToast = toast.loading('Eliminando profesor...', {
      description: 'Procesando eliminación...'
    });
    
    try {
      console.log('🗑️ Eliminando profesor:', id);
      await profesoresService.deleteTeacher(id);
      
      // Remover de la lista local
      setTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher.id !== id)
      );
      
      toast.success('Profesor eliminado exitosamente', {
        id: loadingToast,
        description: 'El registro ha sido eliminado del sistema'
      });
      
    } catch (error) {
      toast.error('Error al eliminar profesor', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'eliminar profesor');
      throw error;
    } finally {
      setDeleting(false);
    }
  }, [handleError]);

  /**
   * Cambiar estado de un profesor
   */
  const changeTeacherStatus = useCallback(async (id, status) => {
    const statusMap = {
      'active': 'Activando',
      'inactive': 'Desactivando',
      'leave': 'Enviando a licencia'
    };
    
    const loadingToast = toast.loading('Cambiando estado...', {
      description: `${statusMap[status] || 'Actualizando'} profesor...`
    });
    
    try {
      console.log('🔄 Cambiando estado del profesor:', id, status);
      const updatedTeacher = await profesoresService.changeTeacherStatus(id, status);
      
      // Actualizar lista local
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.id === id ? updatedTeacher : teacher
        )
      );
      
      const statusText = status === 'active' ? 'activado' : 
                        status === 'inactive' ? 'desactivado' : 'enviado a licencia';
      toast.success(`Profesor ${statusText} exitosamente`, {
        id: loadingToast,
        description: `${updatedTeacher.name} ha sido ${statusText}`
      });
      
      return updatedTeacher;
      
    } catch (error) {
      toast.error('Error al cambiar estado', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'cambiar estado del profesor');
      throw error;
    }
  }, [handleError]);

  /**
   * Buscar profesores
   */
  const searchTeachers = useCallback(async (query) => {
    setLoading(true);
    
    try {
      const results = await profesoresService.searchTeachers(query);
      setTeachers(results);
      console.log('🔍 Resultados de búsqueda:', results.length);
      
      if (results.length === 0) {
        toast.info('No se encontraron profesores', {
          description: `No hay resultados para "${query}"`
        });
      }
    } catch (error) {
      handleError(error, 'buscar profesores');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Filtrar profesores por materia
   */
  const filterBySubject = useCallback(async (subject) => {
    setLoading(true);
    
    try {
      if (subject) {
        const results = await profesoresService.getTeachersBySubject(subject);
        setTeachers(results);
        toast.success(`Filtrado por ${subject}`, {
          description: `${results.length} profesores encontrados`
        });
      } else {
        await fetchTeachers();
        toast.info('Filtros eliminados', {
          description: 'Mostrando todos los profesores'
        });
      }
    } catch (error) {
      handleError(error, 'filtrar profesores por materia');
    } finally {
      setLoading(false);
    }
  }, [fetchTeachers, handleError]);

  /**
   * Filtrar profesores por horario
   */
  const filterBySchedule = useCallback(async (schedule) => {
    setLoading(true);
    
    try {
      if (schedule) {
        const results = await profesoresService.getTeachersBySchedule(schedule);
        setTeachers(results);
        toast.success(`Filtrado por horario ${schedule}`, {
          description: `${results.length} profesores encontrados`
        });
      } else {
        await fetchTeachers();
      }
    } catch (error) {
      handleError(error, 'filtrar profesores por horario');
    } finally {
      setLoading(false);
    }
  }, [fetchTeachers, handleError]);

  /**
   * Obtener clases de un profesor
   */
  const getTeacherClasses = useCallback(async (teacherId) => {
    try {
      return await profesoresService.getTeacherClasses(teacherId);
    } catch (error) {
      handleError(error, 'obtener clases del profesor');
      throw error;
    }
  }, [handleError]);

  /**
   * Asignar clases a profesor
   */
  const assignClassesToTeacher = useCallback(async (teacherId, classIds) => {
    try {
      const result = await profesoresService.assignClassesToTeacher(teacherId, classIds);
      toast.success('Clases asignadas exitosamente', {
        description: 'Las clases han sido asignadas al profesor'
      });
      return result;
    } catch (error) {
      handleError(error, 'asignar clases al profesor');
      throw error;
    }
  }, [handleError]);

  /**
   * Actualizar calificación de un profesor
   */
  const updateTeacherRating = useCallback(async (teacherId, rating) => {
    try {
      const updatedTeacher = await profesoresService.updateTeacherRating(teacherId, rating);
      
      // Actualizar lista local
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.id === teacherId ? updatedTeacher : teacher
        )
      );
      
      toast.success('Calificación actualizada', {
        description: `Nueva calificación: ${rating}/5`
      });
      
      return updatedTeacher;
    } catch (error) {
      handleError(error, 'actualizar calificación del profesor');
      throw error;
    }
  }, [handleError]);

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
      subject: '',
      status: '',
      schedule: '',
      search: ''
    });
  }, []);

  /**
   * Refrescar lista de profesores
   */
  const refreshTeachers = useCallback(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  /**
   * Obtener un profesor por ID
   */
  const getTeacherById = useCallback(async (id) => {
    try {
      return await profesoresService.getTeacherById(id);
    } catch (error) {
      handleError(error, 'obtener profesor');
      throw error;
    }
  }, [handleError]);

  /**
   * Exportar profesores a CSV
   */
  const exportTeachers = useCallback(async (exportFilters = {}) => {
    const loadingToast = toast.loading('Exportando profesores...', {
      description: 'Generando archivo CSV...'
    });
    
    try {
      const csvBlob = await profesoresService.exportTeachersToCSV(exportFilters);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profesores_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Profesores exportados exitosamente', {
        id: loadingToast,
        description: 'El archivo CSV ha sido descargado'
      });
    } catch (error) {
      toast.error('Error al exportar profesores', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'exportar profesores');
    }
  }, [handleError]);

  /**
   * Importar profesores desde CSV
   */
  const importTeachers = useCallback(async (file) => {
    const loadingToast = toast.loading('Importando profesores...', {
      description: 'Procesando archivo CSV...'
    });
    
    try {
      const result = await profesoresService.importTeachersFromCSV(file);
      
      // Refrescar lista
      await fetchTeachers();
      
      toast.success('Profesores importados exitosamente', {
        id: loadingToast,
        description: `${result.imported} profesores agregados, ${result.errors || 0} errores`
      });
      
      return result;
    } catch (error) {
      toast.error('Error al importar profesores', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'importar profesores');
      throw error;
    }
  }, [fetchTeachers, handleError]);

  // Cargar profesores al montar el componente
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Objeto de retorno del hook
  return {
    // Estados
    teachers,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,

    // Funciones CRUD
    createTeacher,
    updateTeacher,
    deleteTeacher,
    changeTeacherStatus,
    
    // Funciones de búsqueda y filtrado
    searchTeachers,
    filterBySubject,
    filterBySchedule,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchTeachers,
    refreshTeachers,
    getTeacherById,
    getTeacherClasses,
    assignClassesToTeacher,
    updateTeacherRating,
    exportTeachers,
    importTeachers,

    // Funciones derivadas
    getActiveTeachers: () => teachers.filter(t => t.status === 'active'),
    getInactiveTeachers: () => teachers.filter(t => t.status === 'inactive'),
    getTeachersOnLeave: () => teachers.filter(t => t.status === 'leave'),
    getTeachersBySubject: (subject) => teachers.filter(t => t.subject === subject),
    getTeachersBySchedule: (schedule) => teachers.filter(t => t.schedule === schedule),
    getTotalTeachers: () => teachers.length,
    getAverageExperience: () => {
      if (teachers.length === 0) return 0;
      const totalExp = teachers.reduce((sum, t) => sum + (Number(t.experience) || 0), 0);
      return Math.round(totalExp / teachers.length);
    },
    getAverageRating: () => {
      if (teachers.length === 0) return 0;
      const ratings = teachers.map(t => Number(t.rating) || 0).filter(r => r > 0);
      if (ratings.length === 0) return 0;
      const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      return Math.round(average * 10) / 10;
    },
    
    // Estados computados
    hasTeachers: teachers.length > 0,
    isOperating: creating || updating || deleting || uploading,
  };
};

export default useProfesores;