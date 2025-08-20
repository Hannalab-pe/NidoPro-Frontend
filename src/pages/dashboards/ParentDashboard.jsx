import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { 
  BarChart3, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Heart, 
  Brain, 
  Calendar,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  User,
  Home,
  Menu,
  X
} from "lucide-react";

// Importar los componentes que crearemos
import Reportes from "../parent/reportes/Reportes";
import Tareas from "../parent/tareas/Tareas";
import Sugerencias from "../parent/sugerencias/Sugerencias";
import Asistencia from "../parent/asistencia/Asistencia";
import EstadoEmocional from "../parent/estadoemocional/EstadoEmocional";
import Sociabilidad from "../parent/sociabilidad/Sociabilidad";
import Aprendizaje from "../parent/aprendizaje/Aprendizaje";

const ParentDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const menuItems = [
    { id: "overview", label: "Inicio", icon: Home },
    { id: "reports", label: "Informes", icon: FileText },
    { id: "tasks", label: "Tareas", icon: BookOpen },
    { id: "suggestions", label: "Sugerencias", icon: MessageSquare },
    { id: "attendance", label: "Asistencia", icon: Calendar },
    { id: "emotional", label: "Estado Emocional", icon: Heart },
    { id: "sociability", label: "Sociabilidad", icon: Users },
    { id: "learning", label: "Aprendizaje", icon: Brain }
  ];

  // Datos del hijo/estudiante
  const studentData = {
    name: "Ana María García",
    grade: "5to Grado A",
    photo: "/api/placeholder/80/80",
    age: 10,
    teacher: "Prof. Carmen López"
  };

  const quickStats = [
    { 
      title: "Asistencia", 
      value: "95%", 
      icon: Calendar, 
      color: "#10B981",
      status: "excellent",
      detail: "Excelente puntualidad"
    },
    { 
      title: "Promedio", 
      value: "8.7", 
      icon: Star, 
      color: "#3B82F6",
      status: "good",
      detail: "Muy buen rendimiento"
    },
    { 
      title: "Tareas", 
      value: "12/15", 
      icon: CheckCircle, 
      color: "#F59E0B",
      status: "warning",
      detail: "3 tareas pendientes"
    },
    { 
      title: "Bienestar", 
      value: "😊", 
      icon: Heart, 
      color: "#EF4444",
      status: "excellent",
      detail: "Muy feliz y motivado"
    }
  ];

  const recentActivities = [
    {
      type: "task",
      title: "Tarea de Matemáticas entregada",
      time: "Hace 2 horas",
      status: "completed",
      icon: CheckCircle
    },
    {
      type: "grade",
      title: "Calificación en Ciencias: 9.0",
      time: "Ayer",
      status: "excellent",
      icon: Star
    },
    {
      type: "note",
      title: "Comentario positivo del profesor",
      time: "Hace 2 días",
      status: "positive",
      icon: MessageSquare
    },
    {
      type: "attendance",
      title: "Asistencia perfecta esta semana",
      time: "Hace 3 días",
      status: "excellent",
      icon: Calendar
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para cerrar el menú móvil al seleccionar una opción
  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Información del hijo */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img 
              src={studentData.photo} 
              alt={studentData.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{studentData.name}</h3>
            <p className="text-blue-600 font-medium">{studentData.grade}</p>
            <p className="text-gray-600">{studentData.age} años • {studentData.teacher}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">🌟</div>
            <p className="text-sm font-medium text-gray-700">Excelente</p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(stat.status)}`}>
                {stat.status === 'excellent' ? '💚' : stat.status === 'good' ? '💙' : stat.status === 'warning' ? '💛' : '❤️'}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-2">{stat.title}</div>
            <div className="text-xs text-gray-500">{stat.detail}</div>
          </div>
        ))}
      </div>

      {/* Actividades recientes */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Actividades Recientes</h3>
          <TrendingUp className="w-5 h-5 text-purple-500" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <div className="text-lg">
                {activity.status === 'excellent' ? '🎉' : 
                 activity.status === 'completed' ? '✅' : 
                 activity.status === 'positive' ? '👏' : '⭐'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Próximas actividades */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Próximas Actividades</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Presentación de Ciencias</p>
                <p className="text-sm text-gray-600">Mañana a las 10:00 AM</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Taller de Arte</p>
                <p className="text-sm text-gray-600">Viernes a las 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "reports":
        return <Reportes />;
      case "tasks":
        return <Tareas />;
      case "suggestions":
        return <Sugerencias />;
      case "attendance":
        return <Asistencia />;
      case "emotional":
        return <EstadoEmocional />;
      case "sociability":
        return <Sociabilidad />;
      case "learning":
        return <Aprendizaje />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Portal de Padres</h1>
                <p className="text-sm text-gray-600">Seguimiento del progreso de tu hijo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Padre/Madre"}</p>
                  <p className="text-xs text-gray-500">Cuenta de Padre</p>
                </div>
              </div>
              
              <button 
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:bg-transparent lg:shadow-none`}>
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden h-full lg:h-auto mt-16 lg:mt-0">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-400 lg:justify-start">
                <h2 className="text-lg font-bold text-white">Navegación</h2>
                <button
                  className="lg:hidden p-2 text-white hover:text-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
