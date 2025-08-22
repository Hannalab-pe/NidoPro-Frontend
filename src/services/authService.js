import axios from 'axios';

// Base URL del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1';

// Configuración de axios para auth
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Login con backend real
  async login(credentials) {
    try {
      console.log('🔐 Iniciando login con:', { usuario: credentials.email });
      
      const response = await authApi.post('/auth/login', {
        usuario: credentials.email,
        contrasena: credentials.password
      });

      const { data } = response;
      
      console.log('✅ Login exitoso:', data);
      
      // Estructura del backend real
      return {
        token: data.access_token,
        user: {
          id: data.usuario.sub,
          email: data.usuario.usuario,
          nombre: data.usuario.usuario,
          apellido: '',
          role: { 
            id: data.usuario.rol === 'Admin' ? '1' : '2', 
            nombre: data.usuario.rol === 'Admin' ? 'admin' : 'trabajador'
          },
          permissions: data.usuario.rol === 'Admin' ? ['all'] : ['read_students', 'write_students']
        },
        role: { 
          id: data.usuario.rol === 'Admin' ? '1' : '2', 
          nombre: data.usuario.rol === 'Admin' ? 'admin' : 'trabajador'
        },
        permissions: data.usuario.rol === 'Admin' ? ['all'] : ['read_students', 'write_students']
      };
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      }
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
      }
      
      throw new Error(error.response?.data?.message || 'Error de conexión. Intenta nuevamente.');
    }
  },

  // Login de desarrollo (fallback)
  async loginDev(credentials) {
    try {
      // Simulación para desarrollo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuarios de prueba
      const testUsers = {
        'admin@nidopro.com': {
          id: '1',
          email: 'admin@nidopro.com',
          nombre: 'Administrador',
          apellido: 'Sistema',
          role: { id: '1', nombre: 'admin' },
          permissions: ['all']
        },
        'trabajador@nidopro.com': {
          id: '2', 
          email: 'trabajador@nidopro.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          role: { id: '2', nombre: 'trabajador' },
          permissions: ['read_students', 'write_students']
        }
      };

      const user = testUsers[credentials.email];
      if (!user || credentials.password !== '123456') {
        throw new Error('Credenciales inválidas');
      }

      return {
        token: `dev-token-${user.id}`,
        user,
        role: user.role,
        permissions: user.permissions
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authApi.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    } finally {
      // Siempre limpiar el localStorage
      localStorage.removeItem('token');
    }
  },

  // Validar token
  async validateToken(token) {
    try {
      // Fallback para modo desarrollo primero
      if (token.startsWith('dev-token-')) {
        const userId = token.replace('dev-token-', '');
        const testUsers = {
          '1': {
            id: '1',
            email: 'admin@nidopro.com',
            nombre: 'Administrador',
            apellido: 'Sistema',
            role: { id: '1', nombre: 'admin' },
            permissions: ['all']
          },
          '2': {
            id: '2', 
            email: 'trabajador@nidopro.com',
            nombre: 'Juan',
            apellido: 'Pérez',
            role: { id: '2', nombre: 'trabajador' },
            permissions: ['read_students', 'write_students']
          }
        };
        
        const user = testUsers[userId];
        if (user) {
          return {
            valid: true,
            user,
            role: user.role,
            permissions: user.permissions
          };
        }
      }

      // Para tokens reales del backend
      const response = await authApi.get('/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const { data } = response;
      
      return {
        valid: true,
        user: {
          id: data.usuario.sub,
          email: data.usuario.usuario,
          nombre: data.usuario.usuario,
          apellido: '',
          role: { 
            id: data.usuario.rol === 'Admin' ? '1' : '2', 
            nombre: data.usuario.rol === 'Admin' ? 'admin' : 'trabajador'
          },
          permissions: data.usuario.rol === 'Admin' ? ['all'] : ['read_students', 'write_students']
        },
        role: { 
          id: data.usuario.rol === 'Admin' ? '1' : '2', 
          nombre: data.usuario.rol === 'Admin' ? 'admin' : 'trabajador'
        },
        permissions: data.usuario.rol === 'Admin' ? ['all'] : ['read_students', 'write_students']
      };
    } catch (error) {
      console.error('Token inválido:', error);
      return { valid: false };
    }
  },

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await authApi.get('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener perfil de usuario');
    }
  },

  // Actualizar perfil
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      const response = await authApi.put('/auth/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar perfil');
    }
  },

  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const token = localStorage.getItem('token');
      await authApi.put('/auth/change-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  }
};

// Interceptor para manejar errores de autenticación globalmente
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - solo limpiar localStorage
      // NO redirigir automáticamente para evitar loops
      localStorage.removeItem('token');
      console.log('Token expirado, limpiando localStorage');
    }
    return Promise.reject(error);
  }
);
