// src/hooks/usePensiones.js
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import pensionService from '../services/pensionService';

// Query Keys para pensiones
const pensionesKeys = {
  all: ['pensiones'],
  lists: () => [...pensionesKeys.all, 'list'],
  list: (filters) => [...pensionesKeys.lists(), { filters }],
  details: () => [...pensionesKeys.all, 'detail'],
  detail: (id) => [...pensionesKeys.details(), id],
  byStudent: (studentId) => [...pensionesKeys.all, 'student', studentId],
  byMonth: (mes, anio) => [...pensionesKeys.all, 'month', mes, anio],
  statistics: () => [...pensionesKeys.all, 'statistics']
};

/**
 * Hook personalizado para gestionar pensiones con TanStack Query
 * Combina queries, mutations, cache y lógica de negocio en un solo lugar
 */
export const usePensiones = (initialFilters = {}) => {
  const queryClient = useQueryClient();
  
  // Estado para filtros y búsqueda
  const [filters, setFilters] = useState({
    estadoPago: '',
    mes: '',
    anio: '',
    estudiante: '',
    search: '',
    ...initialFilters
  });

  // Query principal para obtener pensiones
  const { 
    data: rawPensiones, 
    isLoading: loading, 
    error,
    refetch: refetchPensiones 
  } = useQuery({
    queryKey: pensionesKeys.list(filters),
    queryFn: async () => {
      const response = await pensionService.getAllPensiones(filters);

      // Normalizar siempre a array
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.data)) return response.data;
      if (Array.isArray(response?.results)) return response.results;
      if (Array.isArray(response?.info?.data)) return response.info.data; // 👈 tu caso real

      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ✅ Asegurar array y convertir monto a número
  const pensiones = Array.isArray(rawPensiones) 
    ? rawPensiones.map(p => ({
        ...p,
        monto: p.monto ? Number(p.monto) : 0
      }))
    : [];

  // Mutations con cache automático
  const createMutation = useMutation({
    mutationFn: (pensionData) => pensionService.createPension(pensionData),
    onMutate: () => {
      const loadingToast = toast.loading('Registrando pensión...', {
        description: 'Guardando datos financieros...'
      });
      return { loadingToast };
    },
    onSuccess: (newPension, variables, context) => {
      queryClient.invalidateQueries({ queryKey: pensionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.statistics() });
      
      if (newPension.idEstudiante) {
        queryClient.invalidateQueries({ queryKey: pensionesKeys.byStudent(newPension.idEstudiante) });
      }
      
      toast.success('Pensión registrada exitosamente', {
        id: context.loadingToast,
        description: `Pensión de S/ ${newPension.monto} para ${newPension.mes}/${newPension.anio} creada`
      });
    },
    onError: (error, variables, context) => {
      toast.error('Error al registrar pensión', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => pensionService.updatePension(id, data),
    onMutate: () => {
      const loadingToast = toast.loading('Actualizando pensión...', {
        description: 'Guardando cambios...'
      });
      return { loadingToast };
    },
    onSuccess: (updatedPension, variables, context) => {
      queryClient.invalidateQueries({ queryKey: pensionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.statistics() });
      
      if (updatedPension.idEstudiante) {
        queryClient.invalidateQueries({ queryKey: pensionesKeys.byStudent(updatedPension.idEstudiante) });
      }
      
      toast.success('Pensión actualizada exitosamente', {
        id: context.loadingToast,
        description: `Estado de pago: ${updatedPension.estadoPago}`
      });
    },
    onError: (error, variables, context) => {
      toast.error('Error al actualizar pensión', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => pensionService.deletePension(id),
    onMutate: () => {
      const loadingToast = toast.loading('Eliminando pensión...', {
        description: 'Procesando eliminación...'
      });
      return { loadingToast };
    },
    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries({ queryKey: pensionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.statistics() });
      queryClient.removeQueries({ queryKey: pensionesKeys.detail(id) });
      
      toast.success('Pensión eliminada exitosamente', {
        id: context.loadingToast,
        description: 'El registro financiero ha sido eliminado del sistema'
      });
    },
    onError: (error, variables, context) => {
      toast.error('Error al eliminar pensión', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ pension }) => {
      let newStatus;
      switch (pension.estadoPago) {
        case 'pendiente':
          newStatus = 'pagado';
          break;
        case 'pagado':
          newStatus = 'vencido';
          break;
        case 'vencido':
          newStatus = 'pendiente';
          break;
        default:
          newStatus = 'pendiente';
      }
      
      return pensionService.updatePension(pension.id, { 
        ...pension, 
        estadoPago: newStatus,
        fechaPago: newStatus === 'pagado' ? new Date().toISOString() : null
      });
    },
    onMutate: ({ pension }) => {
      const loadingToast = toast.loading('Cambiando estado de pago...', {
        description: 'Procesando solicitud...'
      });
      return { loadingToast, pension };
    },
    onSuccess: (updatedPension, variables, context) => {
      queryClient.invalidateQueries({ queryKey: pensionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.detail(variables.pension.id) });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.statistics() });
      
      if (updatedPension.idEstudiante) {
        queryClient.invalidateQueries({ queryKey: pensionesKeys.byStudent(updatedPension.idEstudiante) });
      }
      
      const statusText = {
        'pagado': 'marcada como pagada',
        'pendiente': 'marcada como pendiente',
        'vencido': 'marcada como vencida'
      };
      
      toast.success('Estado actualizado exitosamente', {
        id: context.loadingToast,
        description: `La pensión ha sido ${statusText[updatedPension.estadoPago]}`
      });
    },
    onError: (error, variables, context) => {
      toast.error('Error al cambiar estado de pago', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: ({ id, paymentData }) => pensionService.updatePension(id, {
      estadoPago: 'pagado',
      fechaPago: new Date().toISOString(),
      metodoPago: paymentData.metodoPago,
      referenciaPago: paymentData.referenciaPago,
      ...paymentData
    }),
    onMutate: () => {
      const loadingToast = toast.loading('Procesando pago...', {
        description: 'Registrando pago recibido...'
      });
      return { loadingToast };
    },
    onSuccess: (updatedPension, variables, context) => {
      queryClient.invalidateQueries({ queryKey: pensionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: pensionesKeys.statistics() });
      
      if (updatedPension.idEstudiante) {
        queryClient.invalidateQueries({ queryKey: pensionesKeys.byStudent(updatedPension.idEstudiante) });
      }
      
      toast.success('Pago registrado exitosamente', {
        id: context.loadingToast,
        description: `S/ ${updatedPension.monto} - ${updatedPension.metodoPago || 'Efectivo'}`
      });
    },
    onError: (error, variables, context) => {
      toast.error('Error al procesar pago', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
    },
  });

  // Estadísticas financieras calculadas
  const statistics = useMemo(() => {
    if (!pensiones || pensiones.length === 0) {
      return {
        total: 0,
        totalIngresos: 0,
        totalPendientes: 0,
        totalVencidos: 0,
        totalPagados: 0,
        porcentajePagados: 0,
        porcentajePendientes: 0,
        porcentajeVencidos: 0,
        byMonth: {},
        byStudent: {},
        averageAmount: 0,
        recentPayments: 0
      };
    }

    const total = pensiones.length;
    
    const totalPagados = pensiones.filter(p => p.estadoPago === 'pagado').length;
    const totalPendientes = pensiones.filter(p => p.estadoPago === 'pendiente').length;
    const totalVencidos = pensiones.filter(p => p.estadoPago === 'vencido').length;

    const totalIngresos = pensiones
      .filter(p => p.estadoPago === 'pagado')
      .reduce((sum, p) => sum + (p.monto || 0), 0);
    
    const totalPendientesMonto = pensiones
      .filter(p => p.estadoPago === 'pendiente')
      .reduce((sum, p) => sum + (p.monto || 0), 0);
    
    const totalVencidosMonto = pensiones
      .filter(p => p.estadoPago === 'vencido')
      .reduce((sum, p) => sum + (p.monto || 0), 0);

    const porcentajePagados = total > 0 ? (totalPagados / total) * 100 : 0;
    const porcentajePendientes = total > 0 ? (totalPendientes / total) * 100 : 0;
    const porcentajeVencidos = total > 0 ? (totalVencidos / total) * 100 : 0;

    const byMonth = pensiones.reduce((acc, pension) => {
      const monthKey = `${pension.mes}-${pension.anio}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, pagados: 0, pendientes: 0, vencidos: 0, monto: 0 };
      }
      acc[monthKey].total += 1;
      acc[monthKey][pension.estadoPago] += 1;
      acc[monthKey].monto += pension.monto || 0;
      return acc;
    }, {});

    const byStudent = pensiones.reduce((acc, pension) => {
      const studentId = pension.idEstudiante || 'sin-estudiante';
      if (!acc[studentId]) {
        acc[studentId] = { total: 0, pagados: 0, pendientes: 0, vencidos: 0, monto: 0 };
      }
      acc[studentId].total += 1;
      acc[studentId][pension.estadoPago] += 1;
      acc[studentId].monto += pension.monto || 0;
      return acc;
    }, {});

    const averageAmount = total > 0 ? pensiones.reduce((sum, p) => sum + (p.monto || 0), 0) / total : 0;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const recentPayments = pensiones.filter(p => 
      p.estadoPago === 'pagado' && new Date(p.fechaPago) > oneMonthAgo
    ).length;

    return {
      total,
      totalIngresos,
      totalPendientes: totalPendientesMonto,
      totalVencidos: totalVencidosMonto,
      totalPagados,
      porcentajePagados,
      porcentajePendientes,
      porcentajeVencidos,
      byMonth,
      byStudent,
      averageAmount,
      recentPayments,
    };
  }, [pensiones]);

  // Funciones CRUD usando mutations
  const createPension = useCallback(async (pensionData) => {
    return createMutation.mutateAsync(pensionData);
  }, [createMutation]);

  const updatePension = useCallback(async (id, pensionData) => {
    return updateMutation.mutateAsync({ id, data: pensionData });
  }, [updateMutation]);

  const deletePension = useCallback(async (id) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const togglePensionStatus = useCallback(async (pension) => {
    return toggleStatusMutation.mutateAsync({ pension });
  }, [toggleStatusMutation]);

  const markAsPaid = useCallback(async (id, paymentData) => {
    return markAsPaidMutation.mutateAsync({ id, paymentData });
  }, [markAsPaidMutation]);

  // Funciones de filtrado y búsqueda
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      estadoPago: '',
      mes: '',
      anio: '',
      estudiante: '',
      search: ''
    });
  }, []);

  const searchPensiones = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  const filterByEstadoPago = useCallback((estadoPago) => {
    updateFilters({ estadoPago });
  }, [updateFilters]);

  const filterByMes = useCallback((mes) => {
    updateFilters({ mes });
  }, [updateFilters]);

  const filterByAnio = useCallback((anio) => {
    updateFilters({ anio });
  }, [updateFilters]);

  const filterByEstudiante = useCallback((estudiante) => {
    updateFilters({ estudiante });
  }, [updateFilters]);

  // Estados derivados
  const creating = createMutation.isPending;
  const updating = updateMutation.isPending;
  const deleting = deleteMutation.isPending;
  const uploading = false; // Para compatibilidad
  
  // Funciones de utilidad
  const fetchPensiones = useCallback(async (customFilters = {}) => {
    if (Object.keys(customFilters).length > 0) {
      updateFilters(customFilters);
    } else {
      return refetchPensiones();
    }
  }, [refetchPensiones, updateFilters]);

  const refreshPensiones = useCallback(() => {
    return refetchPensiones();
  }, [refetchPensiones]);

  // Funciones específicas para estadísticas financieras
  const getTotalIngresos = useCallback(() => {
    return statistics.totalIngresos;
  }, [statistics.totalIngresos]);

  const getTotalPendientes = useCallback(() => {
    return statistics.totalPendientes;
  }, [statistics.totalPendientes]);

  const getTotalVencidos = useCallback(() => {
    return statistics.totalVencidos;
  }, [statistics.totalVencidos]);

  const getPorcentajePagados = useCallback(() => {
    return Math.round(statistics.porcentajePagados);
  }, [statistics.porcentajePagados]);

  const getAverageAmount = useCallback(() => {
    return statistics.averageAmount;
  }, [statistics.averageAmount]);

  // Funciones de cache manual
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: pensionesKeys.all });
  }, [queryClient]);

  const invalidateLists = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: pensionesKeys.lists() });
  }, [queryClient]);

  const invalidateDetail = useCallback((id) => {
    queryClient.invalidateQueries({ queryKey: pensionesKeys.detail(id) });
  }, [queryClient]);

  // Objeto de retorno del hook
  return {
    // Estados
    pensiones,
    loading,
    creating,
    updating,
    deleting,
    uploading,
    filters,
    error,
    statistics,

    // Funciones CRUD
    createPension,
    updatePension,
    deletePension,
    togglePensionStatus,
    markAsPaid,
    
    // Funciones de búsqueda y filtrado
    searchPensiones,
    filterByEstadoPago,
    filterByMes,
    filterByAnio,
    filterByEstudiante,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchPensiones,
    refreshPensiones,
    
    // Funciones de cache
    invalidateCache: invalidateAll,
    invalidateLists,
    invalidateDetail,
    
    // Funciones derivadas para pensiones
    getPagadas: () => pensiones.filter(p => p.estadoPago === 'pagado'),
    getPendientes: () => pensiones.filter(p => p.estadoPago === 'pendiente'),
    getVencidas: () => pensiones.filter(p => p.estadoPago === 'vencido'),
    getPensionsByEstudiante: (idEstudiante) => pensiones.filter(p => p.idEstudiante === idEstudiante),
    getPensionsByMonth: (mes, anio) => pensiones.filter(p => p.mes === mes && p.anio === anio),
    
    // Funciones de estadísticas específicas
    getTotalIngresos,
    getTotalPendientes,
    getTotalVencidos,
    getPorcentajePagados,
    getAverageAmount,
    
    // Estados computados
    hasPensiones: pensiones.length > 0,
    isOperating: creating || updating || deleting || uploading,
    isCached: true, // TanStack Query maneja el cache automáticamente
  };
};

export default usePensiones;