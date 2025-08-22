import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      loading: false,
      error: null,
      initialized: false,

      // Acciones de autenticación
      login: (userData) => {
        set({
          user: userData.user,
          token: userData.token,
          role: userData.role,
          permissions: userData.permissions || [],
          isAuthenticated: true,
          error: null,
        });
      },

      logout: async () => {
        try {
          // Llamar al servicio de logout para limpiar en el backend
          const { authService } = await import('../services/authService');
          await authService.logout();
        } catch (error) {
          console.log('Error al cerrar sesión en backend:', error);
        }
        
        // Limpiar estado de Zustand
        set({
          user: null,
          token: null,
          role: null,
          permissions: [],
          isAuthenticated: false,
          loading: false,
          error: null,
          initialized: false,
        });
        
        // Limpiar localStorage completamente
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        
        // Redirigir al login
        window.location.href = '/login';
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Actualizar perfil de usuario
      updateProfile: (profileData) => {
        set((state) => ({
          user: { ...state.user, ...profileData },
        }));
      },

      // Verificar si el usuario tiene un permiso específico
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      // Verificar si el usuario tiene un rol específico
      hasRole: (roleName) => {
        const { role } = get();
        return role?.nombre === roleName;
      },

      // Verificar si es admin
      isAdmin: () => {
        const { role } = get();
        return role?.nombre === 'admin' || role?.nombre === 'administrador';
      },

      // Verificar si es profesor/trabajador
      isTrabajador: () => {
        const { role } = get();
        return role?.nombre === 'profesor' || role?.nombre === 'trabajador';
      },

      // Verificar si es padre
      isPadre: () => {
        const { role } = get();
        return role?.nombre === 'padre' || role?.nombre === 'parent';
      },

      // Verificar si es especialista
      isEspecialista: () => {
        const { role } = get();
        return role?.nombre === 'especialista' || role?.nombre === 'specialist';
      },

      // Obtener el ID del rol para APIs
      getRoleId: () => {
        const { role } = get();
        return role?.id || null;
      },

      // Inicializar desde token existente
      initializeAuth: async () => {
        const { initialized } = get();
        if (initialized) return; // Evitar múltiples inicializaciones
        
        set({ loading: true, initialized: true });
        
        const token = localStorage.getItem('token');
        if (token) {
          // Para modo desarrollo, validar directamente sin backend
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
              set({ 
                user,
                token, 
                isAuthenticated: true, 
                role: user.role,
                permissions: user.permissions,
                loading: false 
              });
              return;
            }
          }
          
          // Para tokens reales, intentar validar con backend (sin bloquear si falla)
          try {
            const { authService } = await import('../services/authService');
            const validation = await authService.validateToken(token);
            
            if (validation.valid) {
              set({ 
                user: validation.user,
                token, 
                isAuthenticated: true, 
                role: validation.role,
                permissions: validation.permissions || [],
                loading: false 
              });
            } else {
              throw new Error('Token inválido');
            }
          } catch (error) {
            // Si falla la validación del backend, mantener token para desarrollo
            console.log('Backend no disponible, manteniendo sesión local');
            
            // Mantener el token y establecer usuario básico para desarrollo
            set({ 
              user: {
                id: 'dev-user',
                email: 'usuario@nidopro.com',
                nombre: 'Usuario',
                apellido: 'Desarrollo',
                role: { id: '1', nombre: 'admin' }
              },
              token, 
              isAuthenticated: true, 
              role: { id: '1', nombre: 'admin' },
              permissions: ['all'],
              loading: false,
              error: null
            });
          }
        } else {
          // Si no hay token, establecer loading como false
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage', // Nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
