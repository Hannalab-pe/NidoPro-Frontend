// src/services/api/matriculaService.js
import axios from 'axios';

// Base URL del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

console.log('🌐 API Base URL configurada:', API_BASE_URL);

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
    console.log('📤 Request config:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data ? 'Data present' : 'No data'
    });
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
   * Obtener todas las matrículas con información completa
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de matrículas con estudiantes y apoderados
   */
  async getMatriculas(params = {}) {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      // Usar el nuevo endpoint que incluye toda la información
      const url = queryString ? `/matricula/estudiantes-con-apoderados?${queryString}` : '/matricula/estudiantes-con-apoderados';
      
      const response = await api.get(url);
      
      // Verificar estructura de la respuesta
      if (response.data) {
        // Intentar extraer datos de diferentes estructuras posibles
        let matriculas = [];
        
        if (Array.isArray(response.data)) {
          matriculas = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          matriculas = response.data.data;
        } else if (response.data.info && Array.isArray(response.data.info)) {
          matriculas = response.data.info;
        } else if (response.data.info && response.data.info.data && Array.isArray(response.data.info.data)) {
          matriculas = response.data.info.data;
        } else if (response.data.matriculas && Array.isArray(response.data.matriculas)) {
          matriculas = response.data.matriculas;
        }
        
        // Devolver la estructura esperada por el hook
        const result = {
          data: matriculas,
          total: matriculas.length,
          success: true
        };
        
        return result;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener matrículas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener matrículas');
    }
  },

  /**
   * Obtener un estudiante por ID con contactos de emergencia completos
   * @param {string|number} id - ID del estudiante
   * @returns {Promise<Object>} Datos del estudiante con contactos
   */
  async getStudentById(id) {
    try {
      console.log('📚 Obteniendo estudiante completo por ID:', id);
      const response = await api.get(`/estudiante/${id}`);
      console.log('✅ Estudiante obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estudiante:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiante');
    }
  },

  /**
   * Obtener matrícula completa por ID del estudiante
   * @param {string|number} estudianteId - ID del estudiante
   * @returns {Promise<Object>} Datos completos de la matrícula
   */
  async getMatriculaByEstudianteId(estudianteId) {
    try {
      console.log('📚 Obteniendo matrícula completa por ID de estudiante:', estudianteId);
      
      // Primero obtener todas las matrículas
      const response = await api.get('/matricula/estudiantes-con-apoderados');
      const matriculas = response.data?.info?.data || response.data?.data || response.data || [];
      
      // Encontrar la matrícula específica del estudiante
      const matricula = matriculas.find(m => 
        m.idEstudiante?.idEstudiante === estudianteId || 
        m.idEstudiante?.id === estudianteId
      );
      
      if (!matricula) {
        throw new Error('Matrícula no encontrada para este estudiante');
      }

      console.log('✅ Matrícula completa obtenida:', matricula);
      
      // Si no tiene contactos de emergencia, hacer llamada adicional
      if (!matricula.idEstudiante?.contactosEmergencia || matricula.idEstudiante.contactosEmergencia.length === 0) {
        console.log('📞 Contactos vacíos, obteniendo información completa del estudiante...');
        try {
          const estudianteCompleto = await this.getStudentById(estudianteId);
          if (estudianteCompleto.estudiante?.contactosEmergencia) {
            matricula.idEstudiante.contactosEmergencia = estudianteCompleto.estudiante.contactosEmergencia;
            console.log('✅ Contactos de emergencia agregados:', matricula.idEstudiante.contactosEmergencia);
          }
        } catch (contactError) {
          console.warn('⚠️ No se pudieron obtener contactos de emergencia:', contactError);
        }
      }
      
      return matricula;
    } catch (error) {
      console.error('❌ Error al obtener matrícula completa:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener matrícula completa');
    }
  },

  /**
   * Matricular un nuevo estudiante (legacy)
   * @param {Object} matriculaData - Datos de la matrícula
   * @returns {Promise<Object>} Estudiante matriculado
   */
  async createStudent(matriculaData) {
    try {
      // Solo loggear lo esencial
      console.log('📤 ENVIANDO AL BACKEND - Contactos:', matriculaData.estudianteData?.contactosEmergencia);
      
      // Validar estructura de datos requerida
      if (!matriculaData.apoderadoData || !matriculaData.estudianteData) {
        throw new Error('Faltan datos del apoderado o estudiante');
      }

      // Enviar datos estructurados al backend
      const response = await api.post('/matricula', matriculaData);
      console.log('✅ RESPUESTA DEL BACKEND - Contactos recibidos:', response.data?.estudiante?.contactosEmergencia || response.data?.data?.estudiante?.contactosEmergencia);
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
      
      // Debug específico para contactos de emergencia
      if (matriculaData.estudianteData?.contactosEmergencia) {
        console.log('🚨 CONTACTOS DE EMERGENCIA enviados:', matriculaData.estudianteData.contactosEmergencia);
        console.log('🚨 Cantidad de contactos:', matriculaData.estudianteData.contactosEmergencia.length);
        
        // Validar estructura de cada contacto
        matriculaData.estudianteData.contactosEmergencia.forEach((contacto, index) => {
          console.log(`🚨 Contacto ${index + 1}:`, {
            nombre: contacto.nombre,
            apellido: contacto.apellido,
            telefono: contacto.telefono,
            email: contacto.email,
            tipoContacto: contacto.tipoContacto,
            esPrincipal: contacto.esPrincipal,
            prioridad: contacto.prioridad
          });
        });
      }

      // Validar datos antes del envío
      if (!matriculaData.estudianteData) {
        throw new Error('Faltan datos del estudiante');
      }

      if (!matriculaData.apoderadoData) {
        throw new Error('Faltan datos del apoderado');
      }

      if (!matriculaData.estudianteData.contactosEmergencia || !Array.isArray(matriculaData.estudianteData.contactosEmergencia)) {
        throw new Error('Los contactos de emergencia son requeridos y deben ser un array');
      }

      if (matriculaData.estudianteData.contactosEmergencia.length === 0) {
        throw new Error('Debe proporcionar al menos un contacto de emergencia');
      }

      // Validar cada contacto
      matriculaData.estudianteData.contactosEmergencia.forEach((contacto, index) => {
        if (!contacto.nombre || !contacto.apellido || !contacto.telefono || !contacto.email) {
          throw new Error(`El contacto ${index + 1} debe tener nombre, apellido, teléfono y email`);
        }
      });

      console.log('📋 Datos finales a enviar al backend:', JSON.stringify(matriculaData, null, 2));
      console.log('🌐 Enviando POST a:', `${API_BASE_URL}/matricula`);
      
      const response = await api.post('/matricula', matriculaData);
      console.log('✅ Matrícula creada exitosamente:', response.data);
      
      // Verificar si los contactos están en la respuesta - buscar en todas las estructuras posibles
      console.log('🔍 Buscando contactos en la respuesta...');
      
      const responseData = response.data;
      
      // Buscar en diferentes estructuras posibles
      let contactosEncontrados = null;
      
      if (responseData?.info?.data?.idEstudiante?.contactosEmergencia) {
        contactosEncontrados = responseData.info.data.idEstudiante.contactosEmergencia;
        console.log('✅ Contactos encontrados en info.data.idEstudiante:', contactosEncontrados);
      } else if (responseData?.data?.idEstudiante?.contactosEmergencia) {
        contactosEncontrados = responseData.data.idEstudiante.contactosEmergencia;
        console.log('✅ Contactos encontrados en data.idEstudiante:', contactosEncontrados);
      } else if (responseData?.info?.data?.estudiante?.contactosEmergencia) {
        contactosEncontrados = responseData.info.data.estudiante.contactosEmergencia;
        console.log('✅ Contactos encontrados en info.data.estudiante:', contactosEncontrados);
      } else if (responseData?.data?.estudiante?.contactosEmergencia) {
        contactosEncontrados = responseData.data.estudiante.contactosEmergencia;
        console.log('✅ Contactos encontrados en data.estudiante:', contactosEncontrados);
      } else {
        console.log('⚠️ No se encontraron contactos en la respuesta del backend');
        console.log('🔍 Estructura completa de respuesta:', JSON.stringify(responseData, null, 2));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear matrícula:', error);
      console.error('💥 Detalles del error del servidor:', error.response?.data);
      console.error('💥 Status del error:', error.response?.status);
      console.error('💥 Headers del error:', error.response?.headers);
      
      // Mostrar el mensaje específico del backend si existe
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error al crear matrícula';
      
      throw new Error(errorMessage);
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
