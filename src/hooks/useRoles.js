import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

// Configuración de la API
const API_BASE_URL = '/api/v1';

// Crear instancia de axios con configuración
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
  (response) => {
    // Verificar si la respuesta contiene HTML en lugar de JSON
    if (typeof response.data === 'string' && response.data.includes('<html>')) {
      console.error('❌ Respuesta HTML detectada en interceptor');
      if (import.meta.env.PROD) {
        // En producción, crear una respuesta vacía en lugar de fallar
        return {
          ...response,
          data: { roles: [], data: [] }
        };
      }
    }
    return response;
  },
  (error) => {
    console.error('Error en la respuesta del API de roles:', error);
    
    // Si el token expiró, redirigir al login (solo si no estamos ya en login)
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      console.warn('🔐 Token expirado, redirigiendo al login');
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      
      // En producción, usar reemplazo en lugar de asignación directa
      if (import.meta.env.PROD) {
        window.location.replace('/login');
      } else {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Función para obtener todos los roles
const fetchRoles = async () => {
  try {
    console.log('🔍 Iniciando petición a /api/v1/rol');
    
    const response = await api.get('/rol');
    
    console.log('📋 Respuesta completa de roles:', response);
    console.log('📋 Datos de roles:', response.data);
    console.log('📋 Tipo de respuesta:', typeof response.data);

    // Verificar que la respuesta sea válida y contenga datos
    if (!response.data) {
      console.warn('⚠️ Respuesta vacía del servidor');
      return [];
    }

    // Si la respuesta es HTML (string), indica problema de autenticación
    if (typeof response.data === 'string') {
      console.error('❌ Respuesta es HTML, posible problema de autenticación');
      // En producción, retornar array vacío en lugar de fallar
      if (import.meta.env.PROD) {
        console.warn('🏭 Modo producción: Retornando array vacío para roles');
        return [];
      }
      throw new Error('Respuesta inválida del servidor (HTML en lugar de JSON)');
    }

    // Intentar extraer el array de roles según diferentes estructuras posibles
    let rolesData = [];
    
    if (response.data.roles && Array.isArray(response.data.roles)) {
      rolesData = response.data.roles;
    } else if (response.data.info?.data && Array.isArray(response.data.info.data)) {
      rolesData = response.data.info.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      rolesData = response.data.data;
    } else if (Array.isArray(response.data)) {
      rolesData = response.data;
    }

    console.log('✅ Roles procesados:', rolesData);
    console.log('✅ Cantidad de roles:', rolesData.length);

    return rolesData;
  } catch (error) {
    console.error('❌ Error al obtener roles:', error);
    console.error('❌ Detalles del error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // En producción, manejar errores de forma más silenciosa
    if (import.meta.env.PROD) {
      console.warn('🏭 Producción: Error en roles manejado silenciosamente');
      return [];
    } else {
      toast.error('Error al cargar los roles');
    }
    
    // Retornar array vacío en lugar de fallar la aplicación
    return [];
  }
};

// Hook personalizado para gestión de roles
export const useRoles = () => {
  const {
    data: roles = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Helper para obtener rol por nombre
  const getRoleByName = (roleName) => {
    return roles.find(rol => rol.nombre === roleName || rol.rol === roleName);
  };

  // Helper para obtener ID de rol estudiante
  const getEstudianteRoleId = () => {
    const estudianteRole = getRoleByName('ESTUDIANTE');
    if (estudianteRole) {
      return estudianteRole.idRol || estudianteRole.id;
    }
    // Fallback UUID real del rol ESTUDIANTE
    return '35225955-5aeb-4df0-8014-1cdfbce9b41e';
  };

  return {
    roles,
    isLoading,
    isError,
    error,
    refetch,
    getRoleByName,
    getEstudianteRoleId
  };
};
