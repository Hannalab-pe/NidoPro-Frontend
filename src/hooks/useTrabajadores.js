// src/hooks/useTrabajadores.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import trabajadorService from '../services/trabajadorService';

/**
 * Hook personalizado para gestionar trabajadores
 * Proporciona todas las funcionalidades CRUD y gestión de estado
 */
export const useTrabajadores = () => {
  // Estados principales
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para operaciones específicas
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    tipoDocumento: '',
    estaActivo: '',
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
   * Obtener todos los trabajadores
   */
  const fetchTrabajadores = useCallback(async (customFilters = {}) => {
    setLoading(true);
    
    try {
      const appliedFilters = { ...filters, ...customFilters };
      const data = await trabajadorService.getAllTrabajadores(appliedFilters);
      console.log('👨‍💼 Trabajadores cargados:', data.length);
      console.log('📊 Datos recibidos:', data);
      
      // Forzar actualización del estado
      setTrabajadores([...data]);
    } catch (error) {
      handleError(error, 'cargar trabajadores');
    } finally {
      setLoading(false);
    }
  }, [filters, handleError]);


  /**
   * Crear un nuevo trabajador
   */
  const createTrabajador = useCallback(async (trabajadorData) => {
    setCreating(true);
    
    // Toast de carga
    const loadingToast = toast.loading('Creando trabajador...', {
      description: 'Guardando datos...'
    });
    
    try {
      console.log('🔄 Iniciando creación de trabajador...');
      
      // Crear trabajador en el backend
      console.log('💾 Guardando trabajador en el backend...');
      const newTrabajador = await trabajadorService.createTrabajador(trabajadorData);
      
      // Recargar la lista completa para obtener datos actualizados del backend
      console.log('🔄 Recargando lista después de crear trabajador...');
      await fetchTrabajadores();
      
      console.log('✅ Lista recargada exitosamente');
      
      // Toast de éxito
      toast.success('¡Trabajador creado exitosamente!', {
        id: loadingToast,
        description: `${newTrabajador.nombre} ${newTrabajador.apellido} ha sido agregado al sistema`
      });
      
      return newTrabajador;
      
    } catch (error) {
      toast.error('Error al crear trabajador', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'crear trabajador');
      throw error;
    } finally {
      setCreating(false);
    }
  }, [handleError]);

  /**
   * Actualizar un trabajador existente
   */
  const updateTrabajador = useCallback(async (id, trabajadorData) => {
    setUpdating(true);
    
    const loadingToast = toast.loading('Actualizando trabajador...', {
      description: 'Guardando cambios...'
    });
    
    try {
      console.log('🔄 Actualizando trabajador:', id);
      
      // Actualizar en el backend
      const updatedTrabajador = await trabajadorService.updateTrabajador(id, trabajadorData);
      
      // Actualizar lista local
      setTrabajadores(prevTrabajadores => 
        prevTrabajadores.map(trabajador => 
          trabajador.id === id ? updatedTrabajador : trabajador
        )
      );
      
      toast.success('Trabajador actualizado exitosamente', {
        id: loadingToast,
        description: `Los datos de ${updatedTrabajador.nombre} ${updatedTrabajador.apellido} han sido actualizados`
      });
      
      return updatedTrabajador;
      
    } catch (error) {
      toast.error('Error al actualizar trabajador', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'actualizar trabajador');
      throw error;
    } finally {
      setUpdating(false);
    }
  }, [handleError]);

  /**
   * Eliminar un trabajador
   */
  const deleteTrabajador = useCallback(async (id) => {
    setDeleting(true);
    
    const loadingToast = toast.loading('Eliminando trabajador...', {
      description: 'Procesando eliminación...'
    });
    
    try {
      console.log('🗑️ Eliminando trabajador:', id);
      await trabajadorService.deleteTrabajador(id);
      
      // Remover de la lista local
      setTrabajadores(prevTrabajadores => 
        prevTrabajadores.filter(trabajador => trabajador.id !== id)
      );
      
      toast.success('Trabajador eliminado exitosamente', {
        id: loadingToast,
        description: 'El registro ha sido eliminado del sistema'
      });
      
    } catch (error) {
      toast.error('Error al eliminar trabajador', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'eliminar trabajador');
      throw error;
    } finally {
      setDeleting(false);
    }
  }, [handleError]);

  /**
   * Cambiar estado de un trabajador (activar/desactivar)
   */
  const toggleTrabajadorStatus = useCallback(async (trabajador) => {
    setDeleting(true);
    
    const action = trabajador.estaActivo ? 'desactivando' : 'activando';
    const loadingToast = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} trabajador...`, {
      description: 'Procesando solicitud...'
    });
    
    try {
      await trabajadorService.toggleTrabajadorStatus(trabajador.idTrabajador);
      
      // Recargar la lista completa para obtener datos actualizados del backend
      console.log('🔄 Recargando lista después de toggle status...');
      await fetchTrabajadores();
      console.log('✅ Lista recargada después de toggle status');
      
      // Toast de éxito
      const newStatus = trabajador.estaActivo ? 'desactivado' : 'activado';
      toast.success(`¡Trabajador ${newStatus} exitosamente!`, {
        id: loadingToast,
        description: `${trabajador.nombre} ${trabajador.apellido} ha sido ${newStatus}`
      });
      
    } catch (error) {
      toast.error(`Error al ${action} trabajador`, {
        id: loadingToast,
        description: error.message
      });
      handleError(error, `${action} trabajador`);
      throw error;
    } finally {
      setDeleting(false);
    }
  }, [handleError, fetchTrabajadores]);

  /**
   * Cambiar estado de un trabajador
   */
  const changeTrabajadorStatus = useCallback(async (id, status) => {
    const statusMap = {
      'active': 'Activando',
      'inactive': 'Desactivando',
    };
    
    const loadingToast = toast.loading('Cambiando estado...', {
      description: `${statusMap[status] || 'Actualizando'} trabajador...`
    });
    
    try {
      console.log('🔄 Cambiando estado del trabajador:', id, status);
      const updatedTrabajador = await trabajadorService.changeTrabajadorStatus(id, status);
      
      // Actualizar lista local
      setTrabajadores(prevTrabajadores => 
        prevTrabajadores.map(trabajador => 
          trabajador.id === id ? updatedTrabajador : trabajador
        )
      );
      
      const statusText = status === 'active' ? 'activado' : 
                        status === 'inactive' ? 'desactivado' : 'actualizado';
      toast.success(`Trabajador ${statusText} exitosamente`, {
        id: loadingToast,
        description: `${updatedTrabajador.nombre} ${updatedTrabajador.apellido} ha sido ${statusText}`
      });
      
      return updatedTrabajador;
      
    } catch (error) {
      toast.error('Error al cambiar estado', {
        id: loadingToast,
        description: error.message
      });
      handleError(error, 'cambiar estado del trabajador');
      throw error;
    }
  }, [handleError]);

  /**
   * Buscar trabajadores
   */
  const searchTrabajadores = useCallback(async (query) => {
    setLoading(true);
    
    try {
      const results = await trabajadorService.searchTrabajadores(query);
      setTrabajadores(results);
      console.log('🔍 Resultados de búsqueda:', results.length);
      
      if (results.length === 0) {
        toast.info('No se encontraron trabajadores', {
          description: `No hay resultados para "${query}"`
        });
      }
    } catch (error) {
      handleError(error, 'buscar trabajadores');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Filtrar trabajadores por tipo de documento
   */
  const filterByTipoDocumento = useCallback(async (tipoDocumento) => {
    setLoading(true);
    
    try {
      if (tipoDocumento) {
        const results = await trabajadorService.getTrabajadoresByTipoDocumento(tipoDocumento);
        setTrabajadores(results);
        toast.success(`Filtrado por ${tipoDocumento}`, {
          description: `${results.length} trabajadores encontrados`
        });
      } else {
        await fetchTrabajadores();
        toast.info('Filtros eliminados', {
          description: 'Mostrando todos los trabajadores'
        });
      }
    } catch (error) {
      handleError(error, 'filtrar trabajadores por tipo de documento');
    } finally {
      setLoading(false);
    }
  }, [fetchTrabajadores, handleError]);

  /**
   * Filtrar trabajadores por estado
   */
  const filterByEstado = useCallback(async (estado) => {
    setLoading(true);
    
    try {
      if (estado) {
        const results = await trabajadorService.getTrabajadoresByEstado(estado);
        setTrabajadores(results);
        toast.success(`Filtrado por ${estado}`, {
          description: `${results.length} trabajadores encontrados`
        });
      } else {
        await fetchTrabajadores();
      }
    } catch (error) {
      handleError(error, 'filtrar trabajadores por estado');
    } finally {
      setLoading(false);
    }
  }, [fetchTrabajadores, handleError]);

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
      tipoDocumento: '',
      estaActivo: '',
      search: ''
    });
  }, []);

  /**
   * Refrescar lista de trabajadores
   */
  const refreshTrabajadores = useCallback(async () => {
    console.log('🔄 Forzando recarga de trabajadores...');
    await fetchTrabajadores();
  }, [fetchTrabajadores]);

  /**
   * Obtener un trabajador por ID
   */
  const getTrabajadorById = useCallback(async (id) => {
    try {
      return await trabajadorService.getTrabajadorById(id);
    } catch (error) {
      handleError(error, 'obtener trabajador');
      throw error;
    }
  }, [handleError]);

  // Cargar trabajadores al montar el componente
  useEffect(() => {
    fetchTrabajadores();
  }, []);

  // Objeto de retorno del hook
  return {
    // Estados
    trabajadores,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,

    // Funciones CRUD
    createTrabajador,
    updateTrabajador,
    toggleTrabajadorStatus,
    changeTrabajadorStatus,
    
    // Funciones de búsqueda y filtrado
    searchTrabajadores,
    filterByTipoDocumento,
    filterByEstado,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchTrabajadores,
    refreshTrabajadores,
    getTrabajadorById,

    // Funciones derivadas
    getActiveTrabajadores: () => trabajadores.filter(t => t.estaActivo === true),
    getInactiveTrabajadores: () => trabajadores.filter(t => t.estaActivo === false),
    getTotalTrabajadores: () => trabajadores.length,
    
    // Estados computados
    hasTrabajadores: trabajadores.length > 0,
    isOperating: creating || updating || deleting || uploading,
  };
};

export default useTrabajadores;