// src/services/cursoService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';

// Configurar axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
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
      console.log('📚 Obteniendo lista de cursos...');
      const response = await axiosInstance.get('/curso');
      console.log('✅ Cursos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener cursos:', error);
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
      console.log(`📚 Obteniendo curso con ID: ${id}`);
      const response = await axiosInstance.get(`/curso/${id}`);
      console.log('✅ Curso obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener curso ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener el curso');
    }
  },

  /**
   * Crear nuevo curso
   * @param {Object} cursoData - Datos del curso
   * @returns {Promise} Curso creado
   */
  async create(cursoData) {
    try {
      console.log('📝 Creando nuevo curso:', cursoData);
      const response = await axiosInstance.post('/curso', cursoData);
      console.log('✅ Curso creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear curso:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el curso');
    }
  },

  /**
   * Actualizar curso
   * @param {string} id - ID del curso
   * @param {Object} cursoData - Datos actualizados del curso
   * @returns {Promise} Curso actualizado
   */
  async update(id, cursoData) {
    try {
      console.log(`📝 Actualizando curso ${id}:`, cursoData);
      const response = await axiosInstance.patch(`/curso/${id}`, cursoData);
      console.log('✅ Curso actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al actualizar curso ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el curso');
    }
  },

  /**
   * Eliminar curso
   * @param {string} id - ID del curso
   * @returns {Promise} Resultado de la eliminación
   */
  async delete(id) {
    try {
      console.log(`🗑️ Eliminando curso ${id}`);
      const response = await axiosInstance.delete(`/curso/${id}`);
      console.log('✅ Curso eliminado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al eliminar curso ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el curso');
    }
  },

  /**
   * Obtener cursos por grado
   * @param {string} grado - Grado del curso
   * @returns {Promise} Lista de cursos del grado
   */
  async getByGrado(grado) {
    try {
      console.log(`📚 Obteniendo cursos del grado ${grado}`);
      const response = await axiosInstance.get(`/curso/grado/${grado}`);
      console.log('✅ Cursos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener cursos del grado ${grado}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener cursos por grado');
    }
  },

  /**
   * Obtener cursos activos
   * @returns {Promise} Lista de cursos activos
   */
  async getActivos() {
    try {
      console.log('📚 Obteniendo cursos activos');
      const response = await axiosInstance.get('/curso/activos');
      console.log('✅ Cursos activos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener cursos activos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener cursos activos');
    }
  },

  /**
   * Buscar cursos
   * @param {string} query - Término de búsqueda
   * @returns {Promise} Resultados de búsqueda
   */
  async search(query) {
    try {
      console.log(`🔍 Buscando cursos con query: ${query}`);
      const response = await axiosInstance.get('/curso/search', {
        params: { q: query }
      });
      console.log('✅ Resultados de búsqueda:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en búsqueda de cursos:', error);
      throw new Error(error.response?.data?.message || 'Error en búsqueda de cursos');
    }
  },

  /**
   * Obtener estadísticas de cursos
   * @returns {Promise} Estadísticas de cursos
   */
  async getEstadisticas() {
    try {
      console.log('📊 Obteniendo estadísticas de cursos');
      const response = await axiosInstance.get('/curso/estadisticas');
      console.log('✅ Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  /**
   * Obtener cursos con estudiantes matriculados
   * @returns {Promise} Lista de cursos con matrículas
   */
  async getConMatriculas() {
    try {
      console.log('📚 Obteniendo cursos con matrículas');
      const response = await axiosInstance.get('/curso/matriculas');
      console.log('✅ Cursos con matrículas obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener cursos con matrículas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener cursos con matrículas');
    }
  },

  /**
   * Matricular estudiante en curso
   * @param {string} cursoId - ID del curso
   * @param {string} estudianteId - ID del estudiante
   * @returns {Promise} Resultado de la matrícula
   */
  async matricularEstudiante(cursoId, estudianteId) {
    try {
      console.log(`👨‍🎓 Matriculando estudiante ${estudianteId} en curso ${cursoId}`);
      const response = await axiosInstance.post(`/curso/${cursoId}/matricular`, {
        estudianteId
      });
      console.log('✅ Estudiante matriculado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al matricular estudiante:', error);
      throw new Error(error.response?.data?.message || 'Error al matricular estudiante');
    }
  },

  /**
   * Desmatricular estudiante de curso
   * @param {string} cursoId - ID del curso
   * @param {string} estudianteId - ID del estudiante
   * @returns {Promise} Resultado de la desmatrícula
   */
  async desmatricularEstudiante(cursoId, estudianteId) {
    try {
      console.log(`👨‍🎓 Desmatriculando estudiante ${estudianteId} del curso ${cursoId}`);
      const response = await axiosInstance.delete(`/curso/${cursoId}/matricular/${estudianteId}`);
      console.log('✅ Estudiante desmatriculado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al desmatricular estudiante:', error);
      throw new Error(error.response?.data?.message || 'Error al desmatricular estudiante');
    }
  },

  /**
   * Obtener estudiantes de un curso
   * @param {string} cursoId - ID del curso
   * @returns {Promise} Lista de estudiantes
   */
  async getEstudiantes(cursoId) {
    try {
      console.log(`👨‍🎓 Obteniendo estudiantes del curso ${cursoId}`);
      const response = await axiosInstance.get(`/curso/${cursoId}/estudiantes`);
      console.log('✅ Estudiantes obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener estudiantes del curso ${cursoId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiantes');
    }
  },

  /**
   * Asignar profesor a curso
   * @param {string} cursoId - ID del curso
   * @param {string} profesorId - ID del profesor
   * @returns {Promise} Resultado de la asignación
   */
  async asignarProfesor(cursoId, profesorId) {
    try {
      console.log(`👨‍🏫 Asignando profesor ${profesorId} al curso ${cursoId}`);
      const response = await axiosInstance.post(`/curso/${cursoId}/profesor`, {
        profesorId
      });
      console.log('✅ Profesor asignado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al asignar profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al asignar profesor');
    }
  },

  /**
   * Remover profesor de curso
   * @param {string} cursoId - ID del curso
   * @param {string} profesorId - ID del profesor
   * @returns {Promise} Resultado de la remoción
   */
  async removerProfesor(cursoId, profesorId) {
    try {
      console.log(`👨‍🏫 Removiendo profesor ${profesorId} del curso ${cursoId}`);
      const response = await axiosInstance.delete(`/curso/${cursoId}/profesor/${profesorId}`);
      console.log('✅ Profesor removido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al remover profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al remover profesor');
    }
  },

  /**
   * Obtener profesores de un curso
   * @param {string} cursoId - ID del curso
   * @returns {Promise} Lista de profesores
   */
  async getProfesores(cursoId) {
    try {
      console.log(`👨‍🏫 Obteniendo profesores del curso ${cursoId}`);
      const response = await axiosInstance.get(`/curso/${cursoId}/profesores`);
      console.log('✅ Profesores obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener profesores del curso ${cursoId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener profesores');
    }
  }
};

export default cursoService;
