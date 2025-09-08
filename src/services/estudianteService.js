import axios from 'axios';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Crear instancia de axios con configuración base
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
    console.error('Error en estudianteService:', error);
    
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Servicio para gestión de estudiantes
 */
export const estudianteService = {
  /**
   * Obtener estudiantes por aula
   * @param {string} idAula - ID del aula
   * @returns {Promise} Lista de estudiantes del aula
   */
  getEstudiantesPorAula: async (idAula) => {
    try {
      const response = await api.get(`/estudiante/aula/${idAula}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estudiantes por aula:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiantes del aula');
    }
  }
};
