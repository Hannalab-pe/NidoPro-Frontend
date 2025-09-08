// src/services/cursoService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1';

// Configurar axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor para agregar token
axiosInstance.interceptors.request.use(
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

export const cursoService = {
  /**
   * Obtener todos los cursos
   * @returns {Promise} Lista de cursos
   */
  async getAll() {
    try {
      const response = await axiosInstance.get('/curso');
      return response.data;
    } catch (error) {
      console.error('Error fetching cursos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los cursos');
    }
  },

  /**
   * Obtener curso por ID
   * @param {string} id - ID del curso
   * @returns {Promise} Datos del curso
   */
  async getById(id) {
    try {
      const response = await axiosInstance.get(`/curso/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching curso:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el curso');
    }
  }
};

export default cursoService;
