import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { storage } from '../utils';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      // Guardar datos de autenticación
      storage.set('userToken', response.token);
      storage.set('userData', response.user);
      
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      storage.remove('userToken');
      storage.remove('userData');
      navigate('/login');
    }
  };

  const isAuthenticated = () => {
    return !!storage.get('userToken');
  };

  const getCurrentUser = useCallback(() => {
    return storage.get('userData');
  }, []);

  return {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    isLoading,
    error
  };
};
