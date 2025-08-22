// src/services/api/matriculaService.js
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
 * Servicio para gestionar matrícula de estudiantes
 */
export const matriculaService = {
  /**
   * Obtener todos los estudiantes matriculados
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de estudiantes
   */
  async getStudents(params = {}) {
    try {
      console.log('📚 Obteniendo estudiantes matriculados...');
      
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/estudiante?${queryString}` : '/estudiante';
      
      const response = await api.get(url);
      console.log('✅ Estudiantes obtenidos exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estudiantes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiantes');
    }
  },

  /**
   * Obtener un estudiante por ID
   * @param {string|number} id - ID del estudiante
   * @returns {Promise<Object>} Datos del estudiante
   */
  async getStudentById(id) {
    try {
      const response = await api.get(`/estudiante/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estudiante:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiante');
    }
  },

  /**
   * Matricular un nuevo estudiante
   * @param {Object} studentData - Datos del estudiante
   * @returns {Promise<Object>} Estudiante matriculado
   */
  async createStudent(matriculaData) {
    try {
      console.log('📤 Enviando datos de matrícula al backend:', matriculaData);
      
      // Validar estructura de datos requerida
      if (!matriculaData.apoderadoData || !matriculaData.estudianteData) {
        throw new Error('Faltan datos del apoderado o estudiante');
      }

      // Validar campos obligatorios
      const requiredMatriculaFields = ['costoMatricula', 'fechaIngreso', 'idGrado'];
      const requiredApoderadoFields = ['nombre', 'apellido', 'tipoDocumentoIdentidad', 'documentoIdentidad'];
      const requiredEstudianteFields = ['nombre', 'apellido', 'nroDocumento', 'idRol'];

      const missingMatriculaFields = requiredMatriculaFields.filter(field => !matriculaData[field]);
      const missingApoderadoFields = requiredApoderadoFields.filter(field => !matriculaData.apoderadoData[field]);
      const missingEstudianteFields = requiredEstudianteFields.filter(field => !matriculaData.estudianteData[field]);

      const allMissingFields = [
        ...missingMatriculaFields.map(f => `matrícula.${f}`),
        ...missingApoderadoFields.map(f => `apoderado.${f}`),
        ...missingEstudianteFields.map(f => `estudiante.${f}`)
      ];

      if (allMissingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${allMissingFields.join(', ')}`);
      }

      // Enviar datos estructurados al backend
      const response = await api.post('/matricula', matriculaData);
      console.log('✅ Matrícula creada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al crear matrícula');
    }
  },

  /**
   * Actualizar información de un estudiante matriculado
   * @param {string|number} id - ID del estudiante
   * @param {Object} studentData - Datos actualizados del estudiante
   * @returns {Promise<Object>} Estudiante actualizado
   */
  async updateStudent(id, studentData) {
    try {
      console.log('📤 Actualizando estudiante:', id, studentData);
      
      // Preparar datos para actualización
      const payload = {
        // Información personal del estudiante
        name: studentData.name?.trim(),
        lastName: studentData.lastName?.trim(),
        email: studentData.email?.trim(),
        phone: studentData.phone?.trim(),
        address: studentData.address?.trim(),
        birthDate: studentData.birthDate,
        grade: studentData.grade,
        
        // Información del padre/madre o acudiente
        parentName: studentData.parentName?.trim(),
        parentPhone: studentData.parentPhone?.trim(),
        parentEmail: studentData.parentEmail?.trim(),
        
        // Información médica (opcional)
        medicalConditions: studentData.medicalConditions?.trim() || null,
        allergies: studentData.allergies?.trim() || null,
        
        // Notas adicionales
        notes: studentData.notes?.trim() || null,
        
        // Foto
        photo: studentData.photo || null,
        
        // Fecha de actualización
        lastUpdated: new Date().toISOString()
      };

      // Remover campos undefined
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await api.put(`/students/${id}`, payload);
      console.log('✅ Estudiante actualizado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar estudiante:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar estudiante');
    }
  },

  /**
   * Eliminar matrícula de un estudiante
   * @param {string|number} id - ID del estudiante
   * @returns {Promise<boolean>} Confirmación de eliminación
   */
  async deleteStudent(id) {
    try {
      console.log('🗑️ Eliminando estudiante:', id);
      
      await api.delete(`/students/${id}`);
      console.log('✅ Estudiante eliminado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar estudiante:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar estudiante');
    }
  },

  /**
   * Cambiar estado de un estudiante (activo/inactivo)
   * @param {string|number} id - ID del estudiante
   * @param {string} status - Nuevo estado ('active' | 'inactive')
   * @returns {Promise<Object>} Estudiante actualizado
   */
  async updateStudentStatus(id, status) {
    try {
      console.log('🔄 Cambiando estado del estudiante:', id, 'a', status);
      
      const response = await api.patch(`/students/${id}/status`, { status });
      console.log('✅ Estado del estudiante actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar estado del estudiante:', error);
      throw new Error(error.response?.data?.message || 'Error al cambiar estado del estudiante');
    }
  },

  /**
   * Obtener estadísticas de matrícula
   * @returns {Promise<Object>} Estadísticas de matrícula
   */
  async getEnrollmentStats() {
    try {
      const response = await api.get('/students/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  /**
   * Buscar estudiantes por criterios específicos
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @returns {Promise<Array>} Lista de estudiantes encontrados
   */
  async searchStudents(searchCriteria) {
    try {
      const response = await api.post('/students/search', searchCriteria);
      return response.data;
    } catch (error) {
      console.error('Error al buscar estudiantes:', error);
      throw new Error(error.response?.data?.message || 'Error al buscar estudiantes');
    }
  },

  /**
   * Exportar datos de matrícula
   * @param {Object} filters - Filtros para la exportación
   * @param {string} format - Formato de exportación ('excel' | 'pdf' | 'csv')
   * @returns {Promise<Blob>} Archivo de exportación
   */
  async exportEnrollmentData(filters = {}, format = 'excel') {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      params.append('format', format);

      const response = await api.get(`/students/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al exportar datos de matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al exportar datos');
    }
  },

  /**
   * Importar datos de matrícula desde archivo
   * @param {File} file - Archivo con datos de estudiantes
   * @returns {Promise<Object>} Resultado de la importación
   */
  async importEnrollmentData(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/students/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al importar datos de matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al importar datos');
    }
  },

  /**
   * Generar código único de estudiante
   * @returns {string} Código de estudiante
   */
  generateStudentCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `EST${year}${random}`;
  },

  /**
   * Obtener semestre actual
   * @returns {number} Número del semestre (1 o 2)
   */
  getCurrentSemester() {
    const month = new Date().getMonth() + 1;
    return month <= 6 ? 1 : 2;
  }
};

export default matriculaService;
