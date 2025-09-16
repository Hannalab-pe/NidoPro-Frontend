import axios from 'axios';

// Base URL del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';

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
   * Obtener trabajadores con contrato de planilla
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} Lista de trabajadores con contrato planilla
   */
  obtenerTrabajadoresTipoContratoPlanilla: async (filters = {}) => {
    try {
      console.log('👥 Obteniendo trabajadores con contrato planilla...', filters);

      const response = await api.get('/trabajador/tipo-contrato-planilla');
      console.log('✅ Respuesta del backend para trabajadores con contrato planilla:', response.data);

      // La respuesta ya es un array de trabajadores
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Si viene envuelto en un objeto
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener trabajadores con contrato planilla:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener trabajadores con contrato planilla');
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
   * Generar planillas mensuales con trabajadores específicos
   * @param {Object} datosGeneracion - Datos para generar las planillas
   * @param {number} datosGeneracion.mes - Mes para las planillas
   * @param {number} datosGeneracion.anio - Año para las planillas
   * @param {string} datosGeneracion.fechaPagoProgramada - Fecha programada de pago
   * @param {Array} datosGeneracion.trabajadores - Array de IDs de trabajadores
   * @param {string} datosGeneracion.generadoPor - ID del trabajador que genera
   * @returns {Promise<Object>} Respuesta de la generación
   */
  generarPlanillasConTrabajadores: async (datosGeneracion) => {
    try {
      console.log('📝 Generando planillas con trabajadores...', datosGeneracion);

      // Validaciones básicas
      if (!datosGeneracion.trabajadores || datosGeneracion.trabajadores.length === 0) {
        throw new Error('Debe seleccionar al menos un trabajador');
      }

      if (!datosGeneracion.generadoPor) {
        throw new Error('ID del generador es requerido');
      }

      if (!datosGeneracion.mes || !datosGeneracion.anio) {
        throw new Error('Mes y año son requeridos');
      }

      const payload = {
        mes: datosGeneracion.mes,
        anio: datosGeneracion.anio,
        fechaPagoProgramada: datosGeneracion.fechaPagoProgramada,
        trabajadores: datosGeneracion.trabajadores,
        generadoPor: datosGeneracion.generadoPor
      };

      const response = await api.post('/planilla-mensual/generar-con-trabajadores', payload);

      console.log('✅ Planillas generadas exitosamente:', response.data);

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Planillas generadas exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al generar planillas:', error);

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          'Error al generar las planillas';

      throw new Error(errorMessage);
    }
  },

  /**
   * Obtener planilla por período (mes/año)
   * @param {number|string} mes - Mes de la planilla
   * @param {number|string} anio - Año de la planilla
   * @returns {Promise<Object>} Planilla del período especificado
   */
  obtenerPlanillaPorPeriodo: async (mes, anio) => {
    try {
      console.log('� Obteniendo planilla por período:', { mes, anio });

      const response = await api.get(`/planilla-mensual/periodo/${mes}/${anio}`);
      console.log('✅ Planilla obtenida por período:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener planilla por período:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener planilla por período');
    }
  },

  /**
   * Agregar trabajadores a una planilla existente
   * @param {string} idPlanilla - ID de la planilla
   * @param {Array} trabajadores - Array de IDs de trabajadores
   * @param {string} generadoPor - ID del trabajador que genera
   * @returns {Promise<Object>} Respuesta de la operación
   */
  agregarTrabajadoresAPlanilla: async (idPlanilla, trabajadores, generadoPor) => {
    try {
      console.log('➕ Agregando trabajadores a planilla:', { idPlanilla, trabajadores, generadoPor });

      const payload = {
        trabajadores: trabajadores,
        generadoPor: generadoPor
      };

      const response = await api.patch(`/planilla-mensual/${idPlanilla}/agregar-trabajadores`, payload);
      console.log('✅ Trabajadores agregados a planilla exitosamente:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Error al agregar trabajadores a planilla:', error);
      throw new Error(error.response?.data?.message || 'Error al agregar trabajadores a planilla');
    }
  },
};

export default planillaService;
