import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
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
  Search,
  TrendingUp,
  Calendar,
  Clock,
  ChevronRight
} from "lucide-react";

// Importar todos los componentes de administración
import Students from './Students';
import Teachers from './Teachers';
import Parents from './Parents';
import Classes from './Classes';
import Finances from './Finances';
import Reports from './Reports';
import SettingsPage from './Settings';
import Users from './Users';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const { logout, getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const menuItems = [
    { id: "overview", label: "Resumen General", icon: BarChart3 },
    { id: "students", label: "Estudiantes", icon: UsersIcon },
    { id: "teachers", label: "Profesores", icon: GraduationCap },
    { id: "parents", label: "Padres de Familia", icon: UserCheck },
    { id: "classes", label: "Aulas y Clases", icon: BookOpen },
    { id: "finances", label: "Finanzas", icon: DollarSign },
    { id: "reports", label: "Reportes", icon: FileText },
    { id: "users", label: "Usuarios", icon: UsersIcon },
    { id: "settings", label: "Configuración", icon: Settings }
  ];

  const stats = [
    { 
      title: "Total Estudiantes", 
      value: "150", 
      change: "+5 este mes", 
      icon: UsersIcon, 
      color: "#3B82F6",
      trend: "up"
    },
    { 
      title: "Profesores Activos", 
      value: "12", 
      change: "+1 nuevo", 
      icon: GraduationCap, 
      color: "#10B981",
      trend: "up"
    },
    { 
      title: "Padres Registrados", 
      value: "280", 
      change: "+8 este mes", 
      icon: UserCheck, 
      color: "#F59E0B",
      trend: "up"
    },
    { 
      title: "Ingresos del Mes", 
      value: "S/ 45,200", 
      change: "+12% vs anterior", 
      icon: DollarSign, 
      color: "#8B5CF6",
      trend: "up"
    }
  ];

  const recentActivities = [
    { 
      action: "Nuevo estudiante matriculado", 
      user: "María González", 
      time: "Hace 2 horas",
      icon: UsersIcon 
    },
    { 
      action: "Profesor agregado al sistema", 
      user: "Carlos Ruiz", 
      time: "Hace 4 horas",
      icon: GraduationCap 
    },
    { 
      action: "Pago registrado", 
      user: "Ana Pérez", 
      time: "Hace 6 horas",
      icon: DollarSign 
    },
    { 
      action: "Reunión de padres programada", 
      user: "Sistema", 
      time: "Hace 1 día",
      icon: Calendar 
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-start p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <School className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NidoPro</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "rotate-90 text-blue-600" : "text-gray-400"}`} />
              </button>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-6 left-3 right-3 w-50">
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
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenida, {user?.username} | {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar estudiantes, profesores..." 
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 h-full overflow-y-auto">
          {activeSection === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actividad Reciente - Ancho completo */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>Actividad Reciente</span>
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todas</button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Quick Stats Mini Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm">Nuevos Hoy</p>
                            <p className="text-2xl font-bold">3</p>
                          </div>
                          <UsersIcon className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm">Pagos Hoy</p>
                            <p className="text-2xl font-bold">5</p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-200" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100 text-sm">Eventos</p>
                            <p className="text-2xl font-bold">2</p>
                          </div>
                          <Calendar className="w-8 h-8 text-purple-200" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-100 text-sm">Alertas</p>
                            <p className="text-2xl font-bold">1</p>
                          </div>
                          <Bell className="w-8 h-8 text-orange-200" />
                        </div>
                      </div>
                    </div>

                    {/* Timeline de Actividades */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Últimas Actividades</h4>
                      
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {recentActivities.map((activity, index) => {
                          const IconComponent = activity.icon;
                          return (
                            <div key={index} className="relative flex items-start space-x-4 pb-4">
                              {/* Timeline Dot */}
                              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-blue-500 rounded-full">
                                <IconComponent className="w-5 h-5 text-blue-600" />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-600 mt-1">Usuario: {activity.user}</p>
                                  </div>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {activity.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximos Eventos - Ancho completo con cards horizontales */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span>Próximos Eventos</span>
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver calendario</button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg">
                        <span className="text-xl font-bold">25</span>
                        <span className="text-xs">Dic</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Reunión de Padres</h4>
                        <p className="text-sm text-gray-600">Evaluación del primer trimestre</p>
                        <span className="text-xs text-gray-500">9:00 AM - 12:00 PM</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-lg">
                        <span className="text-xl font-bold">28</span>
                        <span className="text-xs">Dic</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Ceremonia de Navidad</h4>
                        <p className="text-sm text-gray-600">Presentación de estudiantes</p>
                        <span className="text-xs text-gray-500">3:00 PM - 5:00 PM</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-lg">
                        <span className="text-xl font-bold">02</span>
                        <span className="text-xs">Ene</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Inicio de Clases</h4>
                        <p className="text-sm text-gray-600">Segundo trimestre 2024</p>
                        <span className="text-xs text-gray-500">8:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usuarios Recientes - Cards en lugar de tabla */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Usuarios Recientes</h3>
                  <button 
                    onClick={() => setActiveSection("users")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>Ver todos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">DR</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Dr. Carmen Rodríguez</div>
                        <div className="text-sm text-gray-500">Administrador</div>
                        <div className="text-xs text-gray-400">Hace 2 horas</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">MV</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">María Vásquez</div>
                        <div className="text-sm text-gray-500">Profesora</div>
                        <div className="text-xs text-gray-400">Hace 4 horas</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-600">AG</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Ana García</div>
                        <div className="text-sm text-gray-500">Padre de Familia</div>
                        <div className="text-xs text-gray-400">Ayer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Renderizar componentes según la sección activa */}
          {activeSection === "students" && <Students />}
          {activeSection === "teachers" && <Teachers />}
          {activeSection === "parents" && <Parents />}
          {activeSection === "classes" && <Classes />}
          {activeSection === "finances" && <Finances />}
          {activeSection === "reports" && <Reports />}
          {activeSection === "users" && <Users />}
          {activeSection === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
