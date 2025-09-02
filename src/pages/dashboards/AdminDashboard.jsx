import React, { useState } from "react";
import { useAuthStore } from "../../store";
import { 
  BarChart3, 
  Users as UsersIcon, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  DollarSign, 
  FileText, 
  Settings,
  School,
  LogOut,
  Bell,
  CircleUser,
  Baby,
  Search,
  TrendingUp,
  Calendar,
  Clock,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

// Importar todos los componentes de administración
import Estudiantes from '../admin/estudiantes/Estudiantes';
import Matricula from '../admin/matricula/Matricula';
import Trabajadores from '../admin/trabajadores/Trabajadores';
import Padres from '../admin/padres/Padres';
import Clases from '../admin/aulas/Aulas';
import Finanzas from '../admin/finanzas/Finanzas';
import Reportes from '../admin/reportes/Reportes';
import Configuraciones from "../admin/configuraciones/Configuracion";
import Usuarios from '../admin/usuarios/Usuarios';
import Planificaciones from '../admin/planificaciones/Planificaciones';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();

  const menuItems = [
    { id: "overview", label: "Resumen General", icon: BarChart3},
    { id: "matricula", label: "Matrícula", icon: GraduationCap },
    { id: "trabajadores", label: "Trabajadores", icon: UsersIcon },
    { id: "students", label: "Estudiantes", icon: CircleUser },
    { id: "parents", label: "Padres de Familia", icon: UserCheck },
    { id: "classes", label: "Aulas y Clases", icon: BookOpen },
    { id: "finances", label: "Finanzas", icon: DollarSign },
    { id: "reports", label: "Reportes", icon: FileText },
    { id: "users", label: "Gestión de Usuarios", icon: UsersIcon },
    { id: "planificaciones", label: "Planificaciones", icon: FileText },
  ];

  const stats = [
    { title: "Total Estudiantes", value: "245", icon: UsersIcon, color: "#3B82F6", change: "+12%" },
    { title: "Profesores Activos", value: "28", icon: GraduationCap, color: "#10B981", change: "+3%" },
    { title: "Aulas Disponibles", value: "15", icon: BookOpen, color: "#F59E0B", change: "+2%" },
    { title: "Ingresos del Mes", value: "$12,450", icon: DollarSign, color: "#EF4444", change: "+8%" },
  ];

  const recentActivities = [
    { 
      action: "Nuevo estudiante registrado", 
      user: "María González", 
      time: "Hace 10 minutos",
      icon: UsersIcon 
    },
    { 
      action: "Profesor asignado a aula", 
      user: "Carlos Rodríguez", 
      time: "Hace 30 minutos",
      icon: GraduationCap 
    },
    { 
      action: "Clase programada", 
      user: "Matemáticas - Aula 101", 
      time: "Hace 1 hora",
      icon: BookOpen 
    },
    { 
      action: "Reportes generados", 
      user: "Sistema automático", 
      time: "Hace 2 horas",
      icon: FileText 
    }
  ];

  // Función para cerrar el menú móvil al seleccionar una opción
  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile close button */}
        <div className="flex items-center bg-blue-800 justify-between p-7 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3 ">
            <Baby className="w-8 h-8 text-white" />
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
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 group hover:translate-x-2 cursor-pointer ${
                  isActive 
                    ? "bg-blue-800 text-white" 
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
        <div className="absolute bottom-6 left-3 right-3 w-58 flex flex-col gap-3">
          {/* User Info */}
           <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-2 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-blue-100 cursor-pointer">
             <img
               src={'https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg'}
               alt="Foto de usuario"
               className="w-11 h-11 object-cover rounded-full border-2 border-blue-500 shadow bg-white"
             />
             <div className="flex flex-col min-w-0">
               <span className="font-semibold text-gray-900 text-sm truncate">
                 {user?.nombre || ''} {user?.apellido || ''}
               </span>
               <span className="text-xs text-gray-700 truncate">{user?.email || 'correo@ejemplo.com'}</span>
               {user?.role?.nombre && (
                 <span className="text-[10px] text-white bg-blue-500 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
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
        <header className="bg-blue-800 border-gray-200 px-4 lg:px-6 py-4">
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
                Panel de Administración
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
    
              
              {/* Notifications */}
              <button className="relative p-2 text-white border-white border hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          {activeSection === "overview" && (
            <div className="space-y-6 lg:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => {
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
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>Actividad Reciente</span>
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todas</button>
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
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600 mt-1">Usuario: {activity.user}</p>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {activity.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Renderizar componentes según la sección activa */}
          {activeSection === "students" && <Estudiantes />}
          {activeSection === "matricula" && <Matricula />}
          {activeSection === "trabajadores" && <Trabajadores />}
          {activeSection === "parents" && <Padres />}
          {activeSection === "classes" && <Clases />}
          {activeSection === "finances" && <Finanzas />}
          {activeSection === "reports" && <Reportes />}
          {activeSection === "users" && <Usuarios />}
          {activeSection === "settings" && <Configuraciones />}
          {activeSection === "planificaciones" && <Planificaciones />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;