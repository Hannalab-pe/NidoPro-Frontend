import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store";
import { authService } from "../../services/authService";
import { User, Lock, Eye, EyeOff, GraduationCap, Sparkles } from "lucide-react";

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
    } else if (formData.usuario.length < 2) {
      errors.usuario = 'El DNI debe tener al menos 8 dígitos';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 2) {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos decorativos grandes */}
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-25 blur-2xl"></div>
        <div className="absolute -bottom-12 -right-24 w-64 h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-25 blur-2xl"></div>
        
        {/* Formas geométricas flotantes */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-500 rounded-lg rotate-45 opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-pink-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-yellow-500 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-7 h-7 bg-purple-500 rounded-lg rotate-12 opacity-35 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl flex items-center justify-center">
          
          {/* Left Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-start pl-6 pr-3">
            <div className="w-full max-w-md">
              
              {/* Form Container */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/30 p-8 relative">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Form Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Iniciar Sesión
                  </h3>
                  <p className="text-gray-600">
                    Accede a tu cuenta para continuar
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* DNI Field */}
                  <div>
                    <label htmlFor="usuario" className="block text-sm font-semibold text-gray-700 mb-2">
                      DNI / Documento
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="usuario"
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleInputChange}
                        placeholder="12345678"
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                          formErrors.usuario 
                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500 hover:border-gray-300'
                        }`}
                        required
                      />
                    </div>
                    {formErrors.usuario && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                        {formErrors.usuario}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                          formErrors.password 
                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                            : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500 hover:border-gray-300'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Global Error */}
                  {formErrors.general && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {formErrors.general}
                      </p>
                    </div>
                  )}

                  {/* Options */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
                      />
                      <span className="ml-3 text-sm text-gray-600 font-medium">Recordarme</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed scale-100'
                        : 'bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Verificando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Ingresar al Sistema
                      </div>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 mb-3">¿Necesitas ayuda?</p>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium inline-flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Contacta soporte técnico
                  </a>
                </div>

                {/* Decorative elements for form */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg rotate-45 opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Welcome Panel */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-12 relative">
            <div className="relative z-10">
              {/* Logo y Brand */}
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                    NidoPro
                  </h1>
                  <p className="text-sm text-gray-600">Sistema Educativo</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                  Bienvenido a<br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NidoPro
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Plataforma educativa completa para la gestión integral de centros educativos
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Gestión de estudiantes y padres</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Sistema de matrículas integrado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Reportes y análisis en tiempo real</span>
                </div>
              </div>
            </div>

            {/* Decorative circles for right panel */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30"></div>
            <div className="absolute bottom-20 left-32 w-20 h-20 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
