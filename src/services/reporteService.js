// src/services/api/reporteService.js
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
    console.error('Error en la respuesta del API:', error);
    
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Servicio para gestionar la generación y descarga de reportes
 */
export const reporteService = {
  /**
   * Obtener la lista de reportes generados
   * @param {Object} filters - Filtros opcionales (ej: status, category, dateRange)
   * @returns {Promise<Array>} Lista de reportes
   */
  async getAllReportes(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/informe?${params.toString()}`);
      console.log('Respuesta del backend - informes:', response.data);
      
      if (response.data.success && response.data.informes) {
        return response.data.informes;
      }
      
      // Asume que la respuesta puede ser el array directamente
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener reportes');
    }
  },

  /**
   * Obtener los detalles de un reporte por su ID
   * @param {string|number} id - ID del reporte
   * @returns {Promise<Object>} Datos del reporte
   */
  async getInformeById(id) {
    try {
      const response = await api.get(`/informe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener informe por ID:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener informe');
    }
  },

  /**
   * Generar un nuevo reporte
   * @param {Object} reportData - Datos para generar el reporte (ej: type, filters, format)
   * @returns {Promise<Object>} Respuesta del servidor con los detalles del reporte generado
   */
  async generateInforme(reportData) {
    try {
      console.log('Enviando solicitud para generar informe:', reportData);

      // Validar datos requeridos
      const requiredFields = ['type'];
      const missingFields = requiredFields.filter(field => !reportData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const response = await api.post('/informes/generate', reportData);
      console.log('Respuesta del backend:', response.data);

      if (response.data.success && response.data.informe) {
        return response.data.informe;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al generar informe:', error);
      throw new Error(error.response?.data?.message || 'Error al generar informe');
    }
  },

  /**
   * Descargar un informe ya generado
   * @param {string|number} id - ID del reporte
   * @param {string} format - Formato del archivo (ej: 'pdf', 'csv', 'xlsx')
   * @returns {Promise<Blob>} Archivo del reporte
   */
  async downloadReport(id, format = 'pdf') {
    try {
      console.log(`Descargando reporte ID ${id} en formato ${format}`);
      const response = await api.get(`/reportes/${id}/download?format=${format}`, {
        responseType: 'blob' // Importante para manejar archivos
      });
      console.log('Descarga completada');
      return response.data;
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      throw new Error(error.response?.data?.message || 'Error al descargar reporte');
    }
  },

  /**
   * Obtener estadísticas de uso de reportes
   * @returns {Promise<Object>} Estadísticas de uso
   */
  async getReportStats() {
    try {
      const response = await api.get('/reportes/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de reportes:', error);
      throw new Error('Error al obtener estadísticas de reportes');
    }
  },
  
  /**
   * Eliminar un reporte generado
   * @param {string|number} id - ID del reporte a eliminar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async deleteReport(id) {
    try {
      const response = await api.delete(`/reportes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar reporte');
    }
  }
};

export default reporteService;