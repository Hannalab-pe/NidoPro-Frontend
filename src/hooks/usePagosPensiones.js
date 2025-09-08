// src/hooks/usePagosPensiones.js
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import pagosPensionService from '../services/pagosPensionService';

// Query Keys para pagos de pensiones
const pagosPensionKeys = {
  all: ['pagos-pensiones'],
  lists: () => [...pagosPensionKeys.all, 'list'],
  list: (filters) => [...pagosPensionKeys.lists(), { filters }],
  details: () => [...pagosPensionKeys.all, 'detail'],
  detail: (id) => [...pagosPensionKeys.details(), id],
  byStudent: (studentId) => [...pagosPensionKeys.all, 'student', studentId],
  statistics: () => [...pagosPensionKeys.all, 'statistics']
};

/**
 * Hook personalizado para gestionar pagos de pensiones con TanStack Query
 */
export const usePagosPensiones = (initialFilters = {}) => {
  const queryClient = useQueryClient();
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    estudiante: '',
    fechaInicio: '',
    fechaFin: '',
    metodoPago: '',
    search: '',
    ...initialFilters
  });

  // Query principal para obtener historial de pagos
  const { 
    data: rawPagos, 
    isLoading: loading, 
    error,
    refetch: refetchPagos 
  } = useQuery({
    queryKey: pagosPensionKeys.list(filters),
    queryFn: async () => {
      try {
        const response = await pagosPensionService.obtenerHistorialPagos(filters);
        
        // Normalizar siempre a array
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.pagos)) return response.pagos;
        
        return [];
      } catch (error) {
        console.warn('Endpoint de pagos no disponible, retornando array vacío:', error.message);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false, // No reintentar si falla
    enabled: false, // Deshabilitar hasta que el endpoint esté listo
  });

  // Asegurar array y convertir monto a número
  const pagos = Array.isArray(rawPagos) 
    ? rawPagos.map(p => ({
        ...p,
        monto: p.monto ? Number(p.monto) : 0
      }))
    : [];

  // Mutation para registrar pagos
  const registrarPagoMutation = useMutation({
    mutationFn: (pagoData) => pagosPensionService.registrarPago(pagoData),
    onMutate: () => {
      const loadingToast = toast.loading('Registrando pago...', {
        description: 'Procesando información del pago...'
      });
      return { loadingToast };
    },
    onSuccess: (newPago, variables, context) => {
      queryClient.invalidateQueries({ queryKey: pagosPensionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pagosPensionKeys.statistics() });
      
      if (newPago.idEstudiante) {
        queryClient.invalidateQueries({ queryKey: pagosPensionKeys.byStudent(newPago.idEstudiante) });
      }
      
      toast.success('Pago registrado exitosamente', {
        id: context.loadingToast,
        description: `Comprobante: ${newPago.numeroComprobante || 'Generado'} - S/ ${newPago.monto}`
      });
    },
    onError: (error, variables, context) => {
      toast.error('Error al registrar pago', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
    },
  });

  // Mutation para anular pagos
  const anularPagoMutation = useMutation({
    mutationFn: ({ id, motivo }) => pagosPensionService.anularPago(id, motivo),
    onMutate: () => {
      const loadingToast = toast.loading('Anulando pago...', {
        description: 'Procesando anulación...'
      });
      return { loadingToast };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: pagosPensionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pagosPensionKeys.statistics() });
      queryClient.removeQueries({ queryKey: pagosPensionKeys.detail(variables.id) });
      
      toast.success('Pago anulado exitosamente', {
        id: context.loadingToast,
        description: 'El pago ha sido anulado del sistema'
      });
    },
    onError: (error, variables, context) => {
      toast.error('Error al anular pago', {
        id: context?.loadingToast,
        description: error.message || 'Ha ocurrido un error inesperado'
      });
    },
  });

  // Estadísticas calculadas
  const statistics = useMemo(() => {
    if (!pagos || pagos.length === 0) {
      return {
        total: 0,
        totalIngresos: 0,
        totalPagos: 0,
        promedioMonto: 0,
        byMetodoPago: {},
        pagosPorMes: {},
        pagosRecientes: 0
      };
    }

    const total = pagos.length;
    const totalIngresos = pagos.reduce((sum, p) => sum + (p.monto || 0), 0);
    
    const byMetodoPago = pagos.reduce((acc, pago) => {
      const metodo = pago.metodoPago || 'Sin especificar';
      if (!acc[metodo]) {
        acc[metodo] = { count: 0, total: 0 };
      }
      acc[metodo].count += 1;
      acc[metodo].total += pago.monto || 0;
      return acc;
    }, {});

    const pagosPorMes = pagos.reduce((acc, pago) => {
      if (pago.fechaCreacion) {
        const fecha = new Date(pago.fechaCreacion);
        const monthKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
          acc[monthKey] = { count: 0, total: 0 };
        }
        acc[monthKey].count += 1;
        acc[monthKey].total += pago.monto || 0;
      }
      return acc;
    }, {});

    const promedioMonto = total > 0 ? totalIngresos / total : 0;

    // Pagos de las últimas 24 horas
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const pagosRecientes = pagos.filter(p => 
      p.fechaCreacion && new Date(p.fechaCreacion) > oneDayAgo
    ).length;

    return {
      total,
      totalIngresos,
      totalPagos: total,
      promedioMonto,
      byMetodoPago,
      pagosPorMes,
      pagosRecientes
    };
  }, [pagos]);

  // Funciones CRUD
  const registrarPago = useCallback(async (pagoData) => {
    return registrarPagoMutation.mutateAsync(pagoData);
  }, [registrarPagoMutation]);

  const anularPago = useCallback(async (id, motivo) => {
    return anularPagoMutation.mutateAsync({ id, motivo });
  }, [anularPagoMutation]);

  // Funciones de filtrado
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      estudiante: '',
      fechaInicio: '',
      fechaFin: '',
      metodoPago: '',
      search: ''
    });
  }, []);

  const searchPagos = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  const filterByMetodoPago = useCallback((metodoPago) => {
    updateFilters({ metodoPago });
  }, [updateFilters]);

  const filterByEstudiante = useCallback((estudiante) => {
    updateFilters({ estudiante });
  }, [updateFilters]);

  const filterByDateRange = useCallback((fechaInicio, fechaFin) => {
    updateFilters({ fechaInicio, fechaFin });
  }, [updateFilters]);

  // Estados derivados
  const registrando = registrarPagoMutation.isPending;
  const anulando = anularPagoMutation.isPending;
  
  // Funciones de utilidad
  const fetchPagos = useCallback(async (customFilters = {}) => {
    if (Object.keys(customFilters).length > 0) {
      updateFilters(customFilters);
    } else {
      return refetchPagos();
    }
  }, [refetchPagos, updateFilters]);

  const refreshPagos = useCallback(() => {
    return refetchPagos();
  }, [refetchPagos]);

  // Función para generar comprobante
  const generarComprobante = useCallback(async (pagoId) => {
    try {
      const blob = await pagosPensionService.generarComprobante(pagoId);
      
      // Crear URL para descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprobante-${pagoId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Comprobante descargado exitosamente');
    } catch (error) {
      toast.error('Error al generar comprobante', {
        description: error.message
      });
    }
  }, []);

  // Funciones de cache
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: pagosPensionKeys.all });
  }, [queryClient]);

  const invalidateLists = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: pagosPensionKeys.lists() });
  }, [queryClient]);

  // Objeto de retorno del hook
  return {
    // Estados
    pagos,
    loading,
    registrando,
    anulando,
    filters,
    error,
    statistics,

    // Funciones principales
    registrarPago,
    anularPago,
    generarComprobante,
    
    // Funciones de búsqueda y filtrado
    searchPagos,
    filterByMetodoPago,
    filterByEstudiante,
    filterByDateRange,
    updateFilters,
    resetFilters,
    
    // Funciones de utilidad
    fetchPagos,
    refreshPagos,
    
    // Funciones de cache
    invalidateCache: invalidateAll,
    invalidateLists,
    
    // Funciones derivadas
    getPagosByEstudiante: (idEstudiante) => pagos.filter(p => p.idEstudiante === idEstudiante),
    getPagosByMetodo: (metodoPago) => pagos.filter(p => p.metodoPago === metodoPago),
    getTotalIngresos: () => statistics.totalIngresos,
    getPromedioMonto: () => statistics.promedioMonto,
    
    // Estados computados
    hasPagos: pagos.length > 0,
    isOperating: registrando || anulando,
    isCached: true,
  };
};

export default usePagosPensiones;
