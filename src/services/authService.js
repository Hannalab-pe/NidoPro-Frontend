// Simulación de API de autenticación
import usersData from '../data/users.json';

const API_BASE_URL = 'http://localhost:3000/api'; // URL del backend

export const authService = {
  async login(credentials) {
    try {
      // Simulación de autenticación con datos locales
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de red
      
      const user = usersData.users.find(
        u => u.username === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      const roleInfo = usersData.roles[user.role];

      return {
        token: `fake-jwt-token-${user.id}`,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          fullName: user.fullName,
          role: user.role,
          roleInfo: roleInfo,
          avatar: user.avatar,
          permissions: user.permissions,
          // Datos específicos según el rol
          ...(user.aula && { aula: user.aula }),
          ...(user.grado && { grado: user.grado }),
          ...(user.children && { children: user.children }),
          ...(user.specialty && { specialty: user.specialty })
        }
      };
    } catch (error) {
      if (error.message === 'Credenciales inválidas') {
        throw error;
      }
      throw new Error('Error de conexión. Intenta nuevamente.');
    }
  },

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  },

  async validateToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Obtener todos los roles disponibles
  getRoles() {
    return usersData.roles;
  },

  // Obtener usuarios de prueba para desarrollo
  getTestUsers() {
    return usersData.users.map(user => ({
      username: user.username,
      role: user.role,
      name: user.name
    }));
  }
};
