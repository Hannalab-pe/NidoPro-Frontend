import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuthStore } from "../../store";
import { authService } from "../../services/authService";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ usuario: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setLoading, setError, clearError } = useAuthStore();
  
  // Ruta a la que redirigir después del login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Mapear email a usuario para compatibilidad
    if (name === 'usuario') {
      setFormData(prev => ({
        ...prev,
        email: value // Mantener compatibilidad con authService
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.usuario) {
      errors.usuario = 'El DNI es requerido';
    } else if (formData.usuario.length < 8) {
      errors.usuario = 'El DNI debe tener al menos 8 dígitos';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    clearError();
    
    try {
      // Intentar login con backend
      let userData;
      try {
        userData = await authService.login(formData);
        toast.success('¡Bienvenido a NidoPro!');
      } catch (backendError) {
        console.warn('Backend no disponible, usando modo desarrollo:', backendError.message);
        // Fallback a modo desarrollo
        userData = await authService.loginDev(formData);
        toast.success('¡Bienvenido a NidoPro! (Modo desarrollo)');
      }
      
      // Actualizar store de Zustand
      login(userData);
      
      // Guardar token en localStorage
      localStorage.setItem('token', userData.token);
      
      // Redirigir
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('Error en login:', error);
      toast.error(error.message || 'Error al iniciar sesión');
      setFormErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a NidoPro
          </h2>
          <p className="text-gray-600">
            Accede a tu cuenta para gestionar el centro educativo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DNI Field */}
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
              DNI / Documento
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="usuario"
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                placeholder="12345678"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  formErrors.usuario 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              />
            </div>
            {formErrors.usuario && (
              <p className="mt-2 text-sm text-red-600">{formErrors.usuario}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  formErrors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          {/* Global Error */}
          {formErrors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formErrors.general}</p>
            </div>
          )}
          
   

          {/* Options */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
              />
              <span className="ml-2 text-sm text-gray-600">Recordarme</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verificando...
              </div>
            ) : (
              "Ingresar al Sistema"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">¿Necesitas ayuda?</p>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
            Contacta soporte técnico
          </a>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
