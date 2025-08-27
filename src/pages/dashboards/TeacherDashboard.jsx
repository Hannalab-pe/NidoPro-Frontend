import React, { useState } from "react";
import { useAuthStore } from "../../store";
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
  X,
  Baby
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
  const { logout, user } = useAuthStore();

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
        <div className="flex items-center bg-green-600 justify-between p-7 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3 ">
            <Baby className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Nido Bea</span>
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
                    ? "bg-green-600 text-white" 
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
           <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-2 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-green-100 cursor-pointer">
             <img
               src={'https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg'}
               alt="Foto de usuario"
               className="w-11 h-11 object-cover rounded-full border-2 border-green-500 shadow bg-white"
             />
             <div className="flex flex-col min-w-0">
               <span className="font-semibold text-gray-900 text-sm truncate">
                 {user?.nombre || ''} {user?.apellido || ''}
               </span>
               <span className="text-xs text-gray-700 truncate">{user?.email || 'correo@ejemplo.com'}</span>
               {user?.role?.nombre && (
                 <span className="text-[10px] text-white bg-green-500 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
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
        <header className="bg-green-600 border-gray-200 px-4 lg:px-6 py-4">
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
                Panel de Trabajador
              </h1>
              <p className="text-sm text-white mt-1 hidden sm:block">
                {user?.username} | {new Date().toLocaleDateString('es-ES', { 
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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
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

              {/* Metas del Día */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
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
                <div className="p-4 lg:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Completar evaluaciones de Matemáticas</p>
                        <p className="text-sm text-gray-600 mt-1">5to Grado - Progreso: 8/10 completadas</p>
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        80%
                      </span>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Revisar tareas de Ciencias</p>
                        <p className="text-sm text-gray-600 mt-1">4to Grado - 15 tareas pendientes</p>
                      </div>
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        Pendiente
                      </span>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Preparar material para mañana</p>
                        <p className="text-sm text-gray-600 mt-1">Clase de Historia - 3ro Grado</p>
                      </div>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Programado
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horario del Día */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
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
                <div className="p-4 lg:p-6">
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
                <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>Actividad Reciente</span>
                  </h3>
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium">Ver todas</button>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                            <IconComponent className="w-5 h-5 text-green-600" />
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

              {/* Asistente IA Quick Access */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-4 lg:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                      <Bot className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Asistente IA Educativo</h3>
                      <p className="text-green-100">¿Necesitas ideas para tu próxima clase?</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveSection("ai-chat")}
                    className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
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
          {activeSection === "classrooms" && <MisAulas />}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;