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
      console.log('🔑 Token añadido a headers:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No se encontró token en localStorage');
    }
    console.log('📤 Request config:', config);
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
   * Obtener todas las matrículas
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de matrículas
   */
  async getMatriculas(params = {}) {
    try {
      console.log('📚 Obteniendo matrículas...');
      
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/matricula?${queryString}` : '/matricula';
      
      const response = await api.get(url);
      console.log('✅ Matrículas obtenidas exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener matrículas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener matrículas');
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
   * Matricular un nuevo estudiante (legacy)
   * @param {Object} matriculaData - Datos de la matrícula
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
   * Obtener matrícula por ID
   * @param {string|number} id - ID de la matrícula
   * @returns {Promise<Object>} Datos de la matrícula
   */
  async getMatriculaById(id) {
    try {
      console.log('📚 Obteniendo matrícula por ID:', id);
      const response = await api.get(`/matricula/${id}`);
      console.log('✅ Matrícula obtenida exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener matrícula');
    }
  },

  /**
   * Crear nueva matrícula
   * @param {Object} matriculaData - Datos de la matrícula
   * @returns {Promise<Object>} Matrícula creada
   */
  async createMatricula(matriculaData) {
    try {
      console.log('📤 Creando nueva matrícula:', matriculaData);
      const response = await api.post('/matricula', matriculaData);
      console.log('✅ Matrícula creada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al crear matrícula');
    }
  },

  /**
   * Actualizar matrícula existente
   * @param {string|number} id - ID de la matrícula
   * @param {Object} matriculaData - Datos actualizados de la matrícula
   * @returns {Promise<Object>} Matrícula actualizada
   */
  async updateMatricula(id, matriculaData) {
    try {
      console.log('📤 Actualizando matrícula:', id, matriculaData);
      
      // Los datos ya vienen estructurados desde el modal
      const payload = {
        ...matriculaData,
        fechaActualizacion: new Date().toISOString()
      };

      console.log('📋 Payload final para backend:', payload);

      const response = await api.patch(`/matricula/${id}`, payload);
      console.log('✅ Matrícula actualizada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar matrícula');
    }
  },

  /**
   * Actualizar información del estudiante
   * @param {string|number} id - ID del estudiante
   * @param {Object} estudianteData - Datos actualizados del estudiante
   * @returns {Promise<Object>} Estudiante actualizado
   */
  async updateEstudiante(id, estudianteData) {
    try {
      const payload = {
        nombre: estudianteData.nombre?.trim(),
        apellido: estudianteData.apellido?.trim(),
        nroDocumento: estudianteData.nroDocumento?.trim(),
        tipoDocumento: estudianteData.tipoDocumento,
        contactoEmergencia: estudianteData.contactoEmergencia?.trim(),
        nroEmergencia: estudianteData.nroEmergencia?.trim(),
        observaciones: estudianteData.observaciones?.trim() || null
      };

      // Remover campos undefined
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await api.patch(`/estudiante/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar estudiante');
    }
  },

  /**
   * Actualizar información del apoderado
   * @param {string|number} id - ID del apoderado
   * @param {Object} apoderadoData - Datos actualizados del apoderado
   * @returns {Promise<Object>} Apoderado actualizado
   */
  async updateApoderado(id, apoderadoData) {
    try {
      const payload = {
        nombre: apoderadoData.nombre?.trim(),
        apellido: apoderadoData.apellido?.trim(),
        numero: apoderadoData.numero?.trim(),
        correo: apoderadoData.correo?.trim(),
        direccion: apoderadoData.direccion?.trim() || null
      };

      // Remover campos undefined
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await api.patch(`/apoderado/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar apoderado');
    }
  },

  /**
   * Obtener todos los apoderados
   * @returns {Promise<Array>} Lista de apoderados
   */
  async getApoderados() {
    try {
      console.log('🔍 Obteniendo todos los apoderados...');
      const response = await api.get('/apoderado');
      console.log('📥 Respuesta completa de getApoderados:', response);
      console.log('📥 Data de getApoderados:', response.data);
      
      // Extraer la lista de apoderados de la estructura del backend
      let apoderados = [];
      
      if (response.data?.info?.apoderados) {
        apoderados = response.data.info.apoderados;
        console.log('📋 Encontrados apoderados en data.info.apoderados:', apoderados);
      } else if (response.data?.data) {
        apoderados = response.data.data;
        console.log('📋 Encontrados apoderados en data.data:', apoderados);
      } else if (Array.isArray(response.data)) {
        apoderados = response.data;
        console.log('📋 response.data es array directo:', apoderados);
      } else {
        console.log('📋 Estructura no reconocida, intentando extraer todas las propiedades:', response.data);
        // Buscar en todas las propiedades si hay algún array
        const values = Object.values(response.data || {});
        const arrayFound = values.find(value => Array.isArray(value));
        if (arrayFound) {
          apoderados = arrayFound;
          console.log('📋 Array encontrado en propiedades:', apoderados);
        }
      }
      
      console.log('📋 Lista final de apoderados:', apoderados);
      console.log('📋 Cantidad de apoderados:', apoderados.length);
      
      return Array.isArray(apoderados) ? apoderados : [];
    } catch (error) {
      console.error('❌ Error al obtener apoderados:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al obtener apoderados');
    }
  },

  /**
   * Obtener apoderado por ID
   * @param {string|number} id - ID del apoderado
   * @returns {Promise<Object>} Datos del apoderado
   */
  async getApoderadoById(id) {
    try {
      const response = await api.get(`/apoderado/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener apoderado');
    }
  },

  /**
   * Buscar apoderados por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Lista de apoderados que coinciden
   */
  async searchApoderados(searchTerm) {
    try {
      console.log('🔍 Buscando apoderados con término:', searchTerm);
      const response = await api.get('/apoderado');
      console.log('📥 Respuesta completa de searchApoderados:', response);
      console.log('📥 Data de searchApoderados:', response.data);
      
      // Extraer la lista de apoderados según la estructura del backend
      let apoderados = [];
      
      if (response.data?.info?.data) {
        apoderados = response.data.info.data;
        console.log('📋 Encontrados apoderados en data.info.data:', apoderados);
      } else if (response.data?.info?.apoderados) {
        apoderados = response.data.info.apoderados;
        console.log('📋 Encontrados apoderados en data.info.apoderados:', apoderados);
      } else if (response.data?.data) {
        apoderados = response.data.data;
        console.log('📋 Encontrados apoderados en data.data:', apoderados);
      } else if (Array.isArray(response.data)) {
        apoderados = response.data;
        console.log('📋 response.data es array directo:', apoderados);
      } else {
        console.log('📋 Estructura no reconocida, intentando extraer todas las propiedades:', response.data);
        // Buscar en todas las propiedades si hay algún array
        const values = Object.values(response.data || {});
        const arrayFound = values.find(value => Array.isArray(value));
        if (arrayFound) {
          apoderados = arrayFound;
          console.log('📋 Array encontrado en propiedades:', apoderados);
        }
      }
      
      console.log('� Lista final de apoderados:', apoderados);
      console.log('📋 Cantidad de apoderados:', apoderados.length);
      console.log('� Tipo de apoderados:', typeof apoderados);
      console.log('📋 Es array?:', Array.isArray(apoderados));
      
      // Validar que tenemos un array
      if (!Array.isArray(apoderados)) {
        console.log('❌ apoderados no es un array, devolviendo array vacío');
        return [];
      }
      
      // Filtrar por nombre o apellido
      const filtered = apoderados.filter(apoderado => {
        console.log('🔍 Revisando apoderado:', apoderado);
        console.log('🔍 Nombre:', apoderado.nombre || apoderado.nombres);
        console.log('🔍 Apellido:', apoderado.apellido || apoderado.apellidos);
        
        const matchNombre = apoderado.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchApellido = apoderado.apellido?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchNombres = apoderado.nombres?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchApellidos = apoderado.apellidos?.toLowerCase().includes(searchTerm.toLowerCase());
        
        console.log('✅ Match nombre:', matchNombre);
        console.log('✅ Match apellido:', matchApellido);
        console.log('✅ Match nombres:', matchNombres);
        console.log('✅ Match apellidos:', matchApellidos);
        
        return matchNombre || matchApellido || matchNombres || matchApellidos;
      });
      
      console.log('🎯 Resultados filtrados:', filtered);
      console.log('🎯 Cantidad de resultados:', filtered.length);
      
      return filtered;
    } catch (error) {
      console.error('❌ Error al buscar apoderados:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al buscar apoderados');
    }
  },

  /**
   * Eliminar matrícula
   * @param {string|number} id - ID de la matrícula
   * @returns {Promise<boolean>} Confirmación de eliminación
   */
  async deleteMatricula(id) {
    try {
      console.log('🗑️ Eliminando matrícula:', id);
      await api.delete(`/matricula/${id}`);
      console.log('✅ Matrícula eliminada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar matrícula');
    }
  },

  /**
   * Cambiar estado de una matrícula (activa/inactiva)
   * @param {string|number} id - ID de la matrícula
   * @returns {Promise<Object>} Matrícula actualizada
   */
  async toggleMatriculaStatus(id) {
    try {
      console.log('🔄 Cambiando estado de la matrícula:', id);
      const response = await api.patch(`/matricula/${id}/toggle-status`);
      console.log('✅ Estado de la matrícula actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar estado de la matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al cambiar estado de la matrícula');
    }
  },

  /**
   * Obtener estadísticas de matrícula
   * @returns {Promise<Object>} Estadísticas de matrícula
   */
  async getMatriculaStats() {
    try {
      console.log('📊 Obteniendo estadísticas de matrícula...');
      const response = await api.get('/matricula/stats');
      console.log('✅ Estadísticas obtenidas exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
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
  async exportMatriculas(filters = {}, format = 'excel') {
    try {
      console.log('📤 Exportando datos de matrícula...', { filters, format });
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      params.append('format', format);

      const response = await api.get(`/matricula/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      console.log('✅ Datos de matrícula exportados exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al exportar datos de matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al exportar datos');
    }
  },

  /**
   * Importar datos de matrícula desde archivo
   * @param {File} file - Archivo con datos de matrícula
   * @param {string} format - Formato del archivo ('excel' | 'csv')
   * @returns {Promise<Object>} Resultado de la importación
   */
  async importMatriculas(file, format = 'excel') {
    try {
      console.log('📥 Importando datos de matrícula...', { fileName: file.name, format });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);

      const response = await api.post('/matricula/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Datos de matrícula importados exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al importar datos de matrícula:', error);
      throw new Error(error.response?.data?.message || 'Error al importar datos');
    }
  },

  /**
   * Exportar datos de matrícula (legacy)
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
   * Importar datos de matrícula desde archivo (legacy)
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
