// src/hooks/useParents.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { padreService } from '../services/padreService';
import { uploadStudentImage } from '../services/cloudinaryService'; // Reutilizamos el mismo servicio

/**
 * Hook personalizado para gestionar padres/apoderados
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const usePadres = () => {
  // Estados principales
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para operaciones específicas
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    relation: '',
    status: '',
    participationLevel: '',
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
   * Obtener todos los padres
   */
  const fetchParents = useCallback(async (customFilters = {}) => {
    setLoading(true);
    
    try {
      const appliedFilters = { ...filters, ...customFilters };
      const data = await padreService.getAllParents(appliedFilters);
      setParents(data);
      console.log('👨‍👩‍👧‍👦 Padres cargados:', data.length);
    } catch (error) {
      handleError(error, 'cargar padres');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError]);

  /**
   * Crear un nuevo padre con upload de imagen
   */
  const createParent = useCallback(async (parentData) => {
    setCreating(true);
    
    // Toast de carga
    const loadingToast = toast.loading('Creando padre/apoderado...', {
      description: 'Subiendo imagen y guardando datos...'
    });
    
    try {
      console.log('🔄 Iniciando creación de padre...');
      
      // Si hay una imagen, subirla primero a Cloudinary
      let photoData = null;
      if (parentData.photoFile) {
        console.log('📷 Subiendo imagen a Cloudinary...');
        setUploading(true);
        
        // Actualizar toast de carga
        toast.loading('Subiendo imagen...', { 
          id: loadingToast,
          description: 'Procesando imagen del padre/apoderado...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(parentData.photoFile);
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
          throw new Error('Error al subir la imagen del padre/apoderado');
        } finally {
          setUploading(false);
        }
      }

      // Actualizar toast de carga
      toast.loading('Guardando padre/apoderado...', { 
        id: loadingToast,
        description: 'Creando registro en la base de datos...'
      });

      // Preparar datos del padre
      const finalParentData = {
        ...parentData,
        photo: photoData || parentData.photo || null
      };

      // Remover el archivo de la imagen ya que ya fue procesado
      delete finalParentData.photoFile;

      // Crear padre en el backend
      console.log('💾 Guardando padre en el backend...');
      const newParent = await padreService.createParent(finalParentData);
      
      // Actualizar lista local
      setParents(prevParents => [newParent, ...prevParents]);
      
      // Toast de éxito
      toast.success('¡Padre/apoderado creado exitosamente!', {
        id: loadingToast,
        description: `${newParent.name} ha sido agregado al sistema`
      });
      
      return newParent;
      
    } catch (error) {
      toast.error('Error al crear padre/apoderado', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'crear padre');
      throw error;
    } finally {
      setCreating(false);
      setUploading(false);
    }
  }, [handleError]);

  /**
   * Actualizar un padre existente
   */
  const updateParent = useCallback(async (id, parentData) => {
    setUpdating(true);
    
    const loadingToast = toast.loading('Actualizando padre/apoderado...', {
      description: 'Guardando cambios...'
    });
    
    try {
      console.log('🔄 Actualizando padre:', id);
      
      // Si hay una nueva imagen, subirla primero
      let photoData = parentData.photo;
      if (parentData.photoFile) {
        console.log('📷 Subiendo nueva imagen...');
        setUploading(true);
        
        toast.loading('Subiendo nueva imagen...', {
          id: loadingToast,
          description: 'Procesando imagen actualizada...'
        });
        
        try {
          const uploadResult = await uploadStudentImage(parentData.photoFile);
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
      const finalParentData = {
        ...parentData,
        photo: photoData
      };
      delete finalParentData.photoFile;

      // Actualizar en el backend
      const updatedParent = await padreService.updateParent(id, finalParentData);
      
      // Actualizar lista local
      setParents(prevParents => 
        prevParents.map(parent => 
          parent.id === id ? updatedParent : parent
        )
      );
      
      toast.success('Padre/apoderado actualizado exitosamente', {
        id: loadingToast,
        description: `Los datos de ${updatedParent.name} han sido actualizados`
      });
      
      return updatedParent;
      
    } catch (error) {
      toast.error('Error al actualizar padre/apoderado', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'actualizar padre');
      throw error;
    } finally {
      setUpdating(false);
      setUploading(false);
    }
  }, [handleError]);

  /**
   * Eliminar un padre
   */
  const deleteParent = useCallback(async (id) => {
    setDeleting(true);
    
    const loadingToast = toast.loading('Eliminando padre/apoderado...', {
      description: 'Procesando eliminación...'
    });
    
    try {
      console.log('🗑️ Eliminando padre:', id);
      await padreService.deleteParent(id);
      
      // Remover de la lista local
      setParents(prevParents => 
        prevParents.filter(parent => parent.id !== id)
      );
      
      toast.success('Padre/apoderado eliminado exitosamente', {
        id: loadingToast,
        description: 'El registro ha sido eliminado del sistema'
      });
      
    } catch (error) {
      toast.error('Error al eliminar padre/apoderado', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'eliminar padre');
      throw error;
    } finally {
      setDeleting(false);
    }
  }, [handleError]);

  /**
   * Cambiar estado de un padre
   */
  const changeParentStatus = useCallback(async (id, status) => {
    const loadingToast = toast.loading('Cambiando estado...', {
      description: `${status === 'active' ? 'Activando' : 'Desactivando'} padre/apoderado...`
    });
    
    try {
      console.log('🔄 Cambiando estado del padre:', id, status);
      const updatedParent = await padreService.changeParentStatus(id, status);
      
      // Actualizar lista local
      setParents(prevParents => 
        prevParents.map(parent => 
          parent.id === id ? updatedParent : parent
        )
      );
      
      const statusText = status === 'active' ? 'activado' : 'desactivado';
      toast.success(`Padre/apoderado ${statusText} exitosamente`, {
        id: loadingToast,
        description: `${updatedParent.name} ha sido ${statusText}`
      });
      
      return updatedParent;
      
    } catch (error) {
      toast.error('Error al cambiar estado', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'cambiar estado del padre');
      throw error;
    }
  }, [handleError]);

  /**
   * Buscar padres
   */
  const searchParents = useCallback(async (query) => {
    setLoading(true);
    
    try {
      const results = await padreService.searchParents(query);
      setParents(results);
      console.log('🔍 Resultados de búsqueda:', results.length);
      
      if (results.length === 0) {
        toast.info('No se encontraron padres', {
          description: `No hay resultados para "${query}"`
        });
      }
    } catch (error) {
      handleError(error, 'buscar padres');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Filtrar padres por relación
   */
  const filterByRelation = useCallback(async (relation) => {
    setLoading(true);
    
    try {
      if (relation) {
        const results = await padreService.getParentsByRelation(relation);
        setParents(results);
        toast.success(`Filtrado por ${relation}`, {
          description: `${results.length} padres encontrados`
        });
      } else {
        await fetchParents();
        toast.info('Filtros eliminados', {
          description: 'Mostrando todos los padres'
        });
      }
    } catch (error) {
      handleError(error, 'filtrar padres por relación');
    } finally {
      setLoading(false);
    }
  }, [fetchParents, handleError]);

  /**
   * Filtrar padres por nivel de participación
   */
  const filterByParticipation = useCallback(async (level) => {
    setLoading(true);
    
    try {
      if (level) {
        const results = await padreService.getParentsByParticipation(level);
        setParents(results);
        toast.success(`Filtrado por participación ${level}`, {
          description: `${results.length} padres encontrados`
        });
      } else {
        await fetchParents();
      }
    } catch (error) {
      handleError(error, 'filtrar padres por participación');
    } finally {
      setLoading(false);
    }
  }, [fetchParents, handleError]);

  /**
   * Obtener hijos de un padre
   */
  const getParentChildren = useCallback(async (parentId) => {
    try {
      return await padreService.getParentChildren(parentId);
    } catch (error) {
      handleError(error, 'obtener hijos del padre');
      throw error;
    }
  }, [handleError]);

  /**
   * Asignar hijo a padre
   */
  const assignChildToParent = useCallback(async (parentId, studentId) => {
    try {
      const result = await padreService.assignChildToParent(parentId, studentId);
      toast.success('Hijo asignado exitosamente', {
        description: 'La relación ha sido establecida'
      });
      return result;
    } catch (error) {
      handleError(error, 'asignar hijo al padre');
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
    try {
      return await padreService.getParentById(id);
    } catch (error) {
      handleError(error, 'obtener padre');
      throw error;
    }
  }, [handleError]);

  // Cargar padres al montar el componente
  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

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

    // Funciones CRUD
    createParent,
    updateParent,
    deleteParent,
    changeParentStatus,
    
    // Funciones de búsqueda y filtrado
    searchParents,
    filterByRelation,
    filterByParticipation,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchParents,
    refreshParents,
    getParentById,
    getParentChildren,
    assignChildToParent,

    // Funciones derivadas
    getActiveParents: () => parents.filter(p => p.status === 'active'),
    getInactiveParents: () => parents.filter(p => p.status === 'inactive'),
    getParentsByRelation: (relation) => parents.filter(p => p.relation === relation),
    getHighParticipationParents: () => parents.filter(p => p.participationLevel === 'high'),
    getMediumParticipationParents: () => parents.filter(p => p.participationLevel === 'medium'),
    getLowParticipationParents: () => parents.filter(p => p.participationLevel === 'low'),
    getTotalParents: () => parents.length,
    
    // Estados computados
    hasParents: parents.length > 0,
    isOperating: creating || updating || deleting || uploading,
  };
};

export default usePadres;