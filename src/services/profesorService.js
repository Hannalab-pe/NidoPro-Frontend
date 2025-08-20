// src/services/api/profesoresService.js
import axios from 'axios';

// Base URL del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
 * Servicio para gestionar profesores
 */
export const profesorService = {
  /**
   * Obtener todos los profesores
   * @param {Object} filters - Filtros opcionales (status, subject, schedule, etc.)
   * @returns {Promise<Array>} Lista de profesores
   */
  async getAllTeachers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros a los parámetros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/teachers?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener profesores:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener profesores');
    }
  },

  /**
   * Obtener un profesor por ID
   * @param {string|number} id - ID del profesor
   * @returns {Promise<Object>} Datos del profesor
   */
  async getTeacherById(id) {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener profesor');
    }
  },

  /**
   * Crear un nuevo profesor
   * @param {Object} teacherData - Datos del profesor
   * @returns {Promise<Object>} Profesor creado
   */
  async createTeacher(teacherData) {
    try {
      console.log('📤 Enviando datos del profesor al backend:', teacherData);
      
      // Validar datos requeridos
      const requiredFields = ['name', 'email', 'phone', 'subject', 'degree', 'address', 'schedule'];
      const missingFields = requiredFields.filter(field => !teacherData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Preparar datos para el backend
      const payload = {
        // Información personal
        name: teacherData.name.trim(),
        email: teacherData.email.trim(),
        phone: teacherData.phone.trim(),
        address: teacherData.address.trim(),
        
        // Información académica
        subject: teacherData.subject,
        degree: teacherData.degree.trim(),
        experience: Number(teacherData.experience) || 0,
        schedule: teacherData.schedule,
        
        // Información adicional
        specializations: Array.isArray(teacherData.specializations) 
          ? teacherData.specializations 
          : (teacherData.specializations ? 
              teacherData.specializations.split(',').map(s => s.trim()).filter(s => s) 
              : []),
        notes: teacherData.notes?.trim() || null,
        
        // Foto
        photo: teacherData.photo || null,
        
        // Campos adicionales
        status: 'active',
        rating: 0,
        students: 0,
        classes: [],
        registrationDate: new Date().toISOString().split('T')[0]
      };

      const response = await api.post('/teachers', payload);
      console.log('✅ Profesor creado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al crear profesor');
    }
  },

  /**
   * Actualizar un profesor existente
   * @param {string|number} id - ID del profesor
   * @param {Object} teacherData - Datos actualizados del profesor
   * @returns {Promise<Object>} Profesor actualizado
   */
  async updateTeacher(id, teacherData) {
    try {
      console.log('📤 Actualizando profesor:', id, teacherData);
      
      // Preparar datos para el backend
      const payload = {
        name: teacherData.name?.trim(),
        email: teacherData.email?.trim(),
        phone: teacherData.phone?.trim(),
        address: teacherData.address?.trim(),
        subject: teacherData.subject,
        degree: teacherData.degree?.trim(),
        experience: teacherData.experience ? Number(teacherData.experience) : undefined,
        schedule: teacherData.schedule,
        specializations: teacherData.specializations ? (
          Array.isArray(teacherData.specializations) 
            ? teacherData.specializations 
            : teacherData.specializations.split(',').map(s => s.trim()).filter(s => s)
        ) : undefined,
        notes: teacherData.notes?.trim(),
        photo: teacherData.photo,
        status: teacherData.status,
        rating: teacherData.rating ? Number(teacherData.rating) : undefined,
        students: teacherData.students ? Number(teacherData.students) : undefined,
        classes: teacherData.classes
      };

      // Remover campos undefined
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await api.put(`/teachers/${id}`, payload);
      console.log('✅ Profesor actualizado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar profesor');
    }
  },

  /**
   * Eliminar un profesor
   * @param {string|number} id - ID del profesor
   * @returns {Promise<void>}
   */
  async deleteTeacher(id) {
    try {
      console.log('🗑️ Eliminando profesor:', id);
      await api.delete(`/teachers/${id}`);
      console.log('✅ Profesor eliminado exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar profesor');
    }
  },

  /**
   * Cambiar el estado de un profesor (activo/inactivo/licencia)
   * @param {string|number} id - ID del profesor
   * @param {string} status - Nuevo estado ('active' | 'inactive' | 'leave')
   * @returns {Promise<Object>} Profesor actualizado
   */
  async changeTeacherStatus(id, status) {
    try {
      console.log('🔄 Cambiando estado del profesor:', id, status);
      const response = await api.patch(`/teachers/${id}/status`, { status });
      console.log('✅ Estado cambiado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar estado del profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al cambiar estado del profesor');
    }
  },

  /**
   * Obtener profesores por materia
   * @param {string} subject - Materia a filtrar
   * @returns {Promise<Array>} Lista de profesores de esa materia
   */
  async getTeachersBySubject(subject) {
    try {
      const response = await api.get(`/teachers/subject/${encodeURIComponent(subject)}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener profesores por materia:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener profesores por materia');
    }
  },

  /**
   * Obtener profesores por horario
   * @param {string} schedule - Horario a filtrar ('Mañana' | 'Tarde' | 'Completo')
   * @returns {Promise<Array>} Lista de profesores con ese horario
   */
  async getTeachersBySchedule(schedule) {
    try {
      const response = await api.get(`/teachers/schedule/${encodeURIComponent(schedule)}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener profesores por horario:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener profesores por horario');
    }
  },

  /**
   * Buscar profesores por nombre, materia o email
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array>} Lista de profesores que coinciden
   */
  async searchTeachers(query) {
    try {
      const response = await api.get(`/teachers/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar profesores:', error);
      throw new Error(error.response?.data?.message || 'Error al buscar profesores');
    }
  },

  /**
   * Obtener clases asignadas a un profesor
   * @param {string|number} teacherId - ID del profesor
   * @returns {Promise<Array>} Lista de clases del profesor
   */
  async getTeacherClasses(teacherId) {
    try {
      const response = await api.get(`/teachers/${teacherId}/classes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener clases del profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener clases del profesor');
    }
  },

  /**
   * Asignar clases a un profesor
   * @param {string|number} teacherId - ID del profesor
   * @param {Array} classIds - IDs de las clases a asignar
   * @returns {Promise<Object>} Resultado de la asignación
   */
  async assignClassesToTeacher(teacherId, classIds) {
    try {
      const response = await api.post(`/teachers/${teacherId}/classes`, { classIds });
      return response.data;
    } catch (error) {
      console.error('Error al asignar clases al profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al asignar clases al profesor');
    }
  },

  /**
   * Remover clases de un profesor
   * @param {string|number} teacherId - ID del profesor
   * @param {Array} classIds - IDs de las clases a remover
   * @returns {Promise<void>}
   */
  async removeClassesFromTeacher(teacherId, classIds) {
    try {
      await api.delete(`/teachers/${teacherId}/classes`, { data: { classIds } });
    } catch (error) {
      console.error('Error al remover clases del profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al remover clases del profesor');
    }
  },

  /**
   * Actualizar calificación de un profesor
   * @param {string|number} teacherId - ID del profesor
   * @param {number} rating - Nueva calificación (1-5)
   * @returns {Promise<Object>} Profesor actualizado
   */
  async updateTeacherRating(teacherId, rating) {
    try {
      console.log('🔄 Actualizando calificación del profesor:', teacherId, rating);
      
      if (rating < 1 || rating > 5) {
        throw new Error('La calificación debe estar entre 1 y 5');
      }
      
      const response = await api.patch(`/teachers/${teacherId}/rating`, { rating });
      console.log('✅ Calificación actualizada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar calificación:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar calificación');
    }
  },

  /**
   * Obtener horario de un profesor
   * @param {string|number} teacherId - ID del profesor
   * @returns {Promise<Object>} Horario del profesor
   */
  async getTeacherSchedule(teacherId) {
    try {
      const response = await api.get(`/teachers/${teacherId}/schedule`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener horario del profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener horario del profesor');
    }
  },

  /**
   * Obtener estadísticas de profesores
   * @returns {Promise<Object>} Estadísticas de profesores
   */
  async getTeacherStats() {
    try {
      const response = await api.get('/teachers/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  /**
   * Obtener evaluaciones de un profesor
   * @param {string|number} teacherId - ID del profesor
   * @returns {Promise<Array>} Lista de evaluaciones
   */
  async getTeacherEvaluations(teacherId) {
    try {
      const response = await api.get(`/teachers/${teacherId}/evaluations`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener evaluaciones del profesor:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener evaluaciones del profesor');
    }
  },

  /**
   * Crear una nueva evaluación para un profesor
   * @param {string|number} teacherId - ID del profesor
   * @param {Object} evaluationData - Datos de la evaluación
   * @returns {Promise<Object>} Evaluación creada
   */
  async createTeacherEvaluation(teacherId, evaluationData) {
    try {
      const response = await api.post(`/teachers/${teacherId}/evaluations`, evaluationData);
      return response.data;
    } catch (error) {
      console.error('Error al crear evaluación:', error);
      throw new Error(error.response?.data?.message || 'Error al crear evaluación');
    }
  },

  /**
   * Exportar profesores a CSV
   * @param {Object} filters - Filtros para la exportación
   * @returns {Promise<Blob>} Archivo CSV
   */
  async exportTeachersToCSV(filters = {}) {
    try {
      console.log('📤 Exportando profesores a CSV...');
      const params = new URLSearchParams(filters);
      const response = await api.get(`/teachers/export/csv?${params.toString()}`, {
        responseType: 'blob'
      });
      console.log('✅ Exportación completada');
      return response.data;
    } catch (error) {
      console.error('❌ Error al exportar profesores:', error);
      throw new Error(error.response?.data?.message || 'Error al exportar profesores');
    }
  },

  /**
   * Importar profesores desde CSV
   * @param {File} file - Archivo CSV
   * @returns {Promise<Object>} Resultado de la importación
   */
  async importTeachersFromCSV(file) {
    try {
      console.log('📥 Importando profesores desde CSV...');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/teachers/import/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('✅ Importación completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al importar profesores:', error);
      throw new Error(error.response?.data?.message || 'Error al importar profesores');
    }
  }
};

export default profesorService;