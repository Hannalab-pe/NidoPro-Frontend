// src/services/aulaService.js
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
    console.log('🔐 Token enviado en request:', token ? 'Token presente' : 'Sin token');
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
 * Servicio para gestionar aulas
 */
export const aulaService = {
  /**
   * Obtener todas las aulas
   * @param {Object} filters - Filtros opcionales (seccion, cantidadEstudiantes, etc.)
   * @returns {Promise<Array>} Lista de aulas
   */
  async getAllAulas(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.seccion) params.append('seccion', filters.seccion);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.capacidad) params.append('capacidad', filters.capacidad);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/aula?${params.toString()}`);
      console.log('Respuesta del front:', response.data);
      
      // Extraer datos del objeto info.data si existe
      return response.data?.info?.data || response.data?.info || response.data || [];
    } catch (error) {
      console.error('Error al obtener aulas:', error);
      throw error;
    }
  },

  /**
   * Obtener un aula por ID
   * @param {string|number} id - ID del aula
   * @returns {Promise<Object>} Datos del aula
   */
  async getAulaById(id) {
    try {
      const response = await api.get(`/aula/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener aula:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener aula');
    }
  },

  /**
   * Crear una nueva aula
   * @param {Object} aulaData - Datos del aula
   * @returns {Promise<Object>} Aula creada
   */
  async createAula(aulaData) {
    try {
      console.log('📤 Enviando datos del aula al backend:', aulaData);
      
      // Validar datos requeridos
      const requiredFields = ['seccion', 'cantidadEstudiantes'];
      const missingFields = requiredFields.filter(field => !aulaData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Preparar datos para el backend
      const payload = {
        seccion: aulaData.seccion.trim(),
        cantidadEstudiantes: parseInt(aulaData.cantidadEstudiantes),
        descripcion: aulaData.descripcion || null,
        capacidadMaxima: aulaData.capacidadMaxima ? parseInt(aulaData.capacidadMaxima) : null,
        equipamiento: aulaData.equipamiento || null,
        ubicacion: aulaData.ubicacion || null,
        estado: aulaData.estado || 'activa'
      };

      const response = await api.post('/aula', payload);
      console.log('✅ Aula creada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear aula:', error);
      throw new Error(error.response?.data?.message || 'Error al crear aula');
    }
  },

  /**
   * Actualizar un aula existente
   * @param {string|number} id - ID del aula
   * @param {Object} aulaData - Datos actualizados del aula
   * @returns {Promise<Object>} Aula actualizada
   */
  async updateAula(id, aulaData) {
    try {
      console.log('📤 Actualizando aula:', id, aulaData);
      
      // Preparar datos para el backend
      const payload = {
        seccion: aulaData.seccion?.trim(),
        cantidadEstudiantes: aulaData.cantidadEstudiantes ? parseInt(aulaData.cantidadEstudiantes) : undefined,
        descripcion: aulaData.descripcion,
        capacidadMaxima: aulaData.capacidadMaxima ? parseInt(aulaData.capacidadMaxima) : undefined,
        equipamiento: aulaData.equipamiento,
        ubicacion: aulaData.ubicacion,
        estado: aulaData.estado
      };

      // Remover campos undefined
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await api.put(`/aula/${id}`, payload);
      console.log('✅ Aula actualizada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar aula:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar aula');
    }
  },

  /**
   * Eliminar un aula
   * @param {string|number} id - ID del aula
   * @returns {Promise<void>}
   */
  async deleteAula(id) {
    try {
      console.log('🗑️ Eliminando aula:', id);
      await api.delete(`/aula/${id}`);
      console.log('✅ Aula eliminada exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar aula:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar aula');
    }
  },

  /**
   * Cambiar el estado de un aula (activa/inactiva)
   * @param {string|number} id - ID del aula
   * @param {string} estado - Nuevo estado ('activa' | 'inactiva')
   * @returns {Promise<Object>} Aula actualizada
   */
  async changeAulaStatus(id, estado) {
    try {
      console.log('🔄 Cambiando estado del aula:', id, estado);
      const response = await api.patch(`/aula/${id}/status`, { estado });
      console.log('✅ Estado cambiado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar estado del aula:', error);
      throw new Error(error.response?.data?.message || 'Error al cambiar estado del aula');
    }
  },

  /**
   * Obtener aulas por sección
   * @param {string} seccion - Sección a filtrar
   * @returns {Promise<Array>} Lista de aulas de la sección
   */
  async getAulasBySeccion(seccion) {
    try {
      const response = await api.get(`/aula/seccion/${seccion}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener aulas por sección:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener aulas por sección');
    }
  },

  /**
   * Buscar aulas por sección o descripción
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array>} Lista de aulas que coinciden
   */
  async searchAulas(query) {
    try {
      const response = await api.get(`/aula/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar aulas:', error);
      throw new Error(error.response?.data?.message || 'Error al buscar aulas');
    }
  },

  /**
   * Obtener estadísticas de aulas
   * @returns {Promise<Object>} Estadísticas de aulas
   */
  async getAulaStats() {
    try {
      const response = await api.get('/aula/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  /**
   * Obtener aulas asignadas a un trabajador específico
   * @param {string|number} idTrabajador - ID del trabajador
   * @returns {Promise<Array>} Lista de aulas asignadas al trabajador
   */
  async getAulasByTrabajador(idTrabajador) {
    try {
      console.log('📤 Obteniendo aulas para trabajador:', idTrabajador);
      
      const response = await api.get(`/trabajador/aulas/${idTrabajador}`);
      console.log('📥 Respuesta completa de aulas por trabajador:', response.data);
      
      // La respuesta tiene la estructura: { success: true, message: "...", aulas: [...] }
      if (response.data?.success && response.data?.aulas) {
        console.log('✅ Aulas encontradas:', response.data.aulas);
        return response.data;
      }
      
      // Fallbacks para otras estructuras posibles
      if (response.data?.info?.data) {
        return response.data.info.data;
      }
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.log('⚠️ No se encontraron aulas en la respuesta');
      return { success: false, aulas: [] };
    } catch (error) {
      console.error('Error al obtener aulas por trabajador:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener aulas del trabajador');
    }
  },

  /**
   * Obtener estudiantes de un aula específica
   * @param {string|number} idAula - ID del aula
   * @returns {Promise<Object>} Lista de estudiantes del aula
   */
  async obtenerEstudiantesPorAula(idAula) {
    try {
      console.log('📤 Obteniendo estudiantes del aula:', idAula);
      
      const response = await api.get(`/estudiante/aula/${idAula}`);
      console.log('📥 Respuesta completa de estudiantes por aula:', response.data);
      
      // La respuesta tiene la estructura: { success: true, message: "...", estudiantes: [...] }
      if (response.data?.success && response.data?.estudiantes) {
        console.log('✅ Estudiantes encontrados:', response.data.estudiantes);
        return response.data;
      }
      
      // Fallbacks para otras estructuras posibles
      if (response.data?.info?.data) {
        return { success: true, estudiantes: response.data.info.data };
      }
      
      if (response.data?.data) {
        return { success: true, estudiantes: response.data.data };
      }
      
      if (Array.isArray(response.data)) {
        return { success: true, estudiantes: response.data };
      }
      
      console.log('⚠️ No se encontraron estudiantes en la respuesta');
      return { success: false, estudiantes: [] };
    } catch (error) {
      console.error('❌ Error al obtener estudiantes del aula:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiantes del aula');
    }
  }
};

export default aulaService;
