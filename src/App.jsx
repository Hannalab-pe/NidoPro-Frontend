import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store';
import { ProtectedRoute } from './components/auth';
import Login from './pages/auth/Login';
import Dashboard from './pages/auth/Dashboard';

function App() {
  const { initializeAuth, isAuthenticated, loading } = useAuthStore();

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    initializeAuth();
  }, []);

  // Mostrar loading mientras se inicializa
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando NidoPro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen bg-gray-50">
      <Router>
        <Routes>
          {/* Ruta raíz - redirige según autenticación */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Login - solo accesible si no está autenticado */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login />
            } 
          />
          
          {/* Dashboard protegido */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Página no encontrada</p>
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
      
      {/* Toaster para notificaciones globales */}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        duration={4000}
      />
    </div>
  );
}

export default App;
