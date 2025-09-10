import axios from 'axios';

// Base URL del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en planillaService:', error);
    
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Servicio para gestionar planillas mensuales
 */
const planillaService = {
  /**
   * Obtener todas las planillas mensuales
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Object>} Respuesta con las planillas
   */
  obtenerPlanillasMensuales: async (filtros = {}) => {
    try {
      console.log('📋 Obteniendo planillas mensuales...', filtros);
      
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      
      if (filtros.mes) params.append('mes', filtros.mes);
      if (filtros.anio) params.append('anio', filtros.anio);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.idTrabajador) params.append('idTrabajador', filtros.idTrabajador);
      
      const url = `/planilla-mensual${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await api.get(url);
      
      console.log('✅ Planillas obtenidas exitosamente:', response.data);
      
      return {
        success: true,
        planillas: response.data.planillas || [],
        message: response.data.message || 'Planillas obtenidas correctamente'
      };
    } catch (error) {
      console.error('❌ Error al obtener planillas:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error al obtener las planillas mensuales';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Aprobar múltiples planillas de forma masiva
   * @param {Object} datosAprobacion - Datos para la aprobación masiva
   * @param {Array} datosAprobacion.idsPlanillas - Array de IDs de planillas a aprobar
   * @param {string} datosAprobacion.aprobadoPor - ID del trabajador que aprueba
   * @param {string} datosAprobacion.observaciones - Observaciones de la aprobación
   * @returns {Promise<Object>} Respuesta de la aprobación
   */
  aprobarPlanillasMasivo: async (datosAprobacion) => {
    try {
      console.log('✅ Aprobando planillas masivamente...', datosAprobacion);
      
      // Validaciones básicas
      if (!datosAprobacion.idsPlanillas || datosAprobacion.idsPlanillas.length === 0) {
        throw new Error('Debe seleccionar al menos una planilla para aprobar');
      }
      
      if (!datosAprobacion.aprobadoPor) {
        throw new Error('ID del aprobador es requerido');
      }
      
      const payload = {
        idsPlanillas: datosAprobacion.idsPlanillas,
        aprobadoPor: datosAprobacion.aprobadoPor,
        observaciones: datosAprobacion.observaciones || 'Planillas aprobadas masivamente'
      };
      
      const response = await api.patch('/planilla-mensual/aprobar-masivo', payload);
      
      console.log('✅ Planillas aprobadas exitosamente:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Planillas aprobadas exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al aprobar planillas:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error al aprobar las planillas';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Obtener detalle de una planilla específica
   * @param {string} idPlanilla - ID de la planilla
   * @returns {Promise<Object>} Detalle de la planilla
   */
  obtenerDetallePlanilla: async (idPlanilla) => {
    try {
      console.log('📋 Obteniendo detalle de planilla:', idPlanilla);
      
      if (!idPlanilla) {
        throw new Error('ID de planilla es requerido');
      }
      
      const response = await api.get(`/planilla-mensual/${idPlanilla}`);
      
      console.log('✅ Detalle de planilla obtenido:', response.data);
      
      return {
        success: true,
        planilla: response.data.planilla || response.data,
        message: response.data.message || 'Detalle obtenido correctamente'
      };
    } catch (error) {
      console.error('❌ Error al obtener detalle de planilla:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error al obtener el detalle de la planilla';
      
      throw new Error(errorMessage);
    }
  }
};

export default planillaService;
