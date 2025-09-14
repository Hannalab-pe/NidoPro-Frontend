import React, { useState } from "react";
import { useAuthStore } from "../../store";
import {
  BarChart3,
  FileText,
  BookOpen,
  MessageSquare,
  Users as UsersIcon,
  Heart,
  Brain,
  Calendar,
  LogOut,
  Bell,
  Star,
  CheckCircle,
  User,
  Menu,
  X,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import Reportes from "../parent/reportes/Reportes";
import Tareas from "../parent/tareas/Tareas";
import Sugerencias from "../parent/sugerencias/Sugerencias";
import Asistencia from "../parent/asistencia/Asistencia";
import EstadoEmocional from "../parent/estadoemocional/EstadoEmocional";
import Sociabilidad from "../parent/sociabilidad/Sociabilidad";
import Aprendizaje from "../parent/aprendizaje/Aprendizaje";
import ParentAIChat from '../parent/iachat/ParentAIChat';
import Anotaciones from '../parent/anotaciones/Anotaciones';
import Cronograma from '../parent/cronograma/Cronograma';

const ParentDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();

  const menuItems = [
    { id: "overview", label: "Resumen Familiar", icon: BarChart3 },
    { id: "tasks", label: "Actividades", icon: BookOpen },
    { id: "cronograma", label: "Cronograma", icon: Calendar },
    { id: "attendance", label: "Asistencia", icon: CheckCircle },
    { id: "anotaciones", label: "Anotaciones", icon: Bell },
    { id: "iachat", label: "Asistente IA", icon: MessageSquare }
  ];

  // Datos del hijo/estudiante
  const studentData = {
    name: `${user?.nombre || ''} ${user?.apellido || ''}`,
    grade: "5to Grado A",
    photo: "https://res.cloudinary.com/dhdpp8eq2/image/upload/v1755701581/estudiantes/zoslqzw97fnfnuxfhcmj.gif",
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
    <div className="space-y-6 lg:space-y-8">
      {/* Información del hijo */}
      <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-xl p-6 flex items-center gap-6">
        <img 
          src={studentData.photo} 
          alt={studentData.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
        />
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
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white p-4 lg:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.detail}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Actividades recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Actividades Recientes</span>
          </h3>
        </div>
        <div className="p-4 lg:p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {activity.status === 'excellent' ? '🎉' : 
                     activity.status === 'completed' ? '✅' : 
                     activity.status === 'positive' ? '👏' : '⭐'}
                  </span>
                </div>
              );
            })}
          </div>
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
      case "cronograma":
        return <Cronograma />;
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
      case "anotaciones":
        return <Anotaciones />;
      case "iachat":
        return <ParentAIChat />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 border-r">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile close button */}
        <div className="flex items-center bg-yellow-600 justify-between p-7 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3 ">
            <User className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Nido Pro</span>
          </div>
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 group hover:translate-x-2 cursor-pointer ${
                  isActive 
                    ? "bg-yellow-600 text-white" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "rotate-90 text-white" : "text-gray-400"}`} />
              </button>
            );
          })}
        </nav>
        {/* User Info Card & Logout Button */}
        <div className="mt-auto px-3 pb-6 flex flex-col gap-3">
          {/* User Info */}
           <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-2 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-yellow-100 cursor-pointer">
             <img
               src={user?.photo || 'https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg'}
               alt="Foto de usuario"
               className="w-11 h-11 object-cover rounded-full border-2 border-yellow-500 shadow bg-white"
             />
             <div className="flex flex-col min-w-0">
               <span className="font-semibold text-gray-900 text-sm truncate">
                 {user?.nombre || ''} {user?.apellido || ''}
               </span>
               <span className="text-xs text-gray-700 truncate">{user?.email || 'correo@ejemplo.com'}</span>
               {user?.role?.nombre && (
                 <span className="text-[10px] text-white bg-yellow-500 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
                   {user.role.nombre}
                 </span>
               )}
             </div>
           </div>
          {/* Logout Button */}
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-yellow-600 border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Panel Familiar
              </h1>
              <p className="text-sm text-white mt-1 hidden sm:block">
                {user?.fullName || user?.nombre || user?.username} | {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              
            </div>
          </div>
        </header>
        {/* Content Area */}
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
