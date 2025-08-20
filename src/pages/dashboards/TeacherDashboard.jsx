import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { 
  BarChart3, 
  Target, 
  MessageCircle, 
  Calendar, 
  Users, 
  ClipboardList, 
  StickyNote, 
  Gamepad2,
  GraduationCap,
  School,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Clock,
  ChevronRight,
  Bot,
  CheckCircle,
  AlertCircle,
  Menu,
  X
} from "lucide-react";

// Importar los componentes que creamos
import Objetivos from "../teacher/objetivos/Objetivos";
import AIChat from "../teacher/iachat/AIChat";
import Horarios from "../teacher/horarios/Horarios";
import Asistencias from "../teacher/asistencia/Asistencia";
import Notas from "../teacher/notas/Notas";
import Juegos from "../teacher/juegos/Juegos";
import MisEstudiantes from "../teacher/misestudiantes/MisEstudiantes";
import MisAulas from "../teacher/misaulas/MisAulas";
import Clases from "../teacher/clases/Clases";

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const menuItems = [
    { id: "overview", label: "Panel Principal", icon: BarChart3 },
    { id: "goals", label: "Mis Metas", icon: Target },
    { id: "ai-chat", label: "Asistente IA", icon: MessageCircle },
    { id: "schedule", label: "Cronograma", icon: Calendar },
    { id: "attendance", label: "Asistencias", icon: ClipboardList },
    { id: "notes", label: "Anotaciones", icon: StickyNote },
    { id: "games", label: "Juegos", icon: Gamepad2 },
    { id: "students", label: "Mis Alumnos", icon: Users },
    { id: "classrooms", label: "Mis Aulas", icon: School }
  ];

  const stats = [
    { 
      title: "Mis Estudiantes", 
      value: "28", 
      change: "+2 nuevos", 
      icon: Users, 
      color: "#3B82F6"
    },
    { 
      title: "Clases Hoy", 
      value: "4", 
      change: "2 pendientes", 
      icon: Calendar, 
      color: "#10B981"
    },
    { 
      title: "Asistencia Promedio", 
      value: "94%", 
      change: "+3% esta semana", 
      icon: TrendingUp, 
      color: "#F59E0B"
    },
    { 
      title: "Metas Completadas", 
      value: "12/15", 
      change: "80% progreso", 
      icon: Target, 
      color: "#8B5CF6"
    }
  ];

  const recentActivities = [
    { 
      action: "Nueva calificación registrada", 
      user: "Matemáticas - 5to Grado", 
      time: "Hace 30 min",
      icon: CheckCircle 
    },
    { 
      action: "Asistencia tomada", 
      user: "Ciencias - 4to Grado", 
      time: "Hace 1 hora",
      icon: ClipboardList 
    },
    { 
      action: "Nueva anotación creada", 
      user: "Comportamiento - Ana García", 
      time: "Hace 2 horas",
      icon: StickyNote 
    },
    { 
      action: "Juego educativo asignado", 
      user: "Matemáticas - Todos los grupos", 
      time: "Hace 3 horas",
      icon: Gamepad2 
    }
  ];

  // Función para cerrar el menú móvil al seleccionar una opción
  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">NidoPro</span>
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
                className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 group ${
                  isActive 
                    ? "bg-green-50 text-green-700 border-r-4 border-green-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "rotate-90 text-green-600" : "text-gray-400"}`} />
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
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.id === activeSection)?.label || "Panel Profesor"}
              </h1>
              <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                Bienvenido/a, {user?.username} | {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search Box */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar estudiantes, materias..." 
                  className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
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

              {/* Metas del Día */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Target className="w-5 h-5 text-gray-600" />
                    <span>Metas del Día</span>
                  </h3>
                  <button 
                    onClick={() => setActiveSection("goals")}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Ver todas
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Completar evaluaciones de Matemáticas</p>
                        <p className="text-xs text-gray-600">5to Grado - Progreso: 8/10 completadas</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">80%</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Revisar tareas de Ciencias</p>
                        <p className="text-xs text-gray-600">4to Grado - 15 tareas pendientes</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pendiente</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Preparar material para mañana</p>
                        <p className="text-xs text-gray-600">Clase de Historia - 3ro Grado</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Programado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horario del Día */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span>Mi Horario Hoy</span>
                  </h3>
                  <button 
                    onClick={() => setActiveSection("schedule")}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Ver cronograma completo
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="text-sm font-medium text-green-800">08:00 - 09:00</div>
                      <div className="text-sm text-gray-700 mt-1">Matemáticas</div>
                      <div className="text-xs text-gray-500">5to Grado A</div>
                    </div>
                    
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="text-sm font-medium text-blue-800">09:15 - 10:15</div>
                      <div className="text-sm text-gray-700 mt-1">Ciencias</div>
                      <div className="text-xs text-gray-500">4to Grado B</div>
                    </div>
                    
                    <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                      <div className="text-sm font-medium text-purple-800">11:00 - 12:00</div>
                      <div className="text-sm text-gray-700 mt-1">Historia</div>
                      <div className="text-xs text-gray-500">3ro Grado A</div>
                    </div>
                    
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="text-sm font-medium text-orange-800">14:00 - 15:00</div>
                      <div className="text-sm text-gray-700 mt-1">Matemáticas</div>
                      <div className="text-xs text-gray-500">5to Grado B</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actividad Reciente */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>Actividad Reciente</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <IconComponent className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.user}</p>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Asistente IA Quick Access */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue bg-opacity-20 rounded-lg">
                      <Bot className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Asistente IA Educativo</h3>
                      <p className="text-blue-100">¿Necesitas ideas para tu próxima clase?</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveSection("ai-chat")}
                    className="bg-white text-black bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Chatear ahora
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Renderizar componentes */}
          {activeSection === "goals" && <Objetivos />}
          {activeSection === "ai-chat" && <AIChat />}
          {activeSection === "schedule" && <Horarios />}
          {activeSection === "attendance" && <Asistencias />}
          {activeSection === "notes" && <Notas />}
          {activeSection === "games" && <Juegos />}
          {activeSection === "students" && <MisEstudiantes />}
          {activeSection === "classrooms" && (
            <div>
              <MisAulas />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
