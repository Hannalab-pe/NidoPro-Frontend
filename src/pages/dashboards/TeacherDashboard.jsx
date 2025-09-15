import React, { useState, useMemo } from "react";
import { useAuthStore } from "../../store";
import { useTeacherDashboard } from "../../hooks/useTeacherDashboard";
import { StudentsByClassroomChart, GradesDistributionChart } from "../../components/charts/TeacherCharts";
import { 
  BarChart3, 
  MessageCircle, 
  Calendar, 
  Users, 
  ClipboardList, 
  StickyNote, 
  Gamepad2,
  GraduationCap,
  School,
  LogOut,
  Search,
  TrendingUp,
  ChevronRight,
  Bot,
  Menu,
  X,
  Baby,
  FileText,
  BookOpen,
  CircleUser,
  RefreshCw
} from "lucide-react";

// Importar los componentes que creamos
import Objetivos from "../teacher/objetivos/Objetivos";
import AIChat from "../teacher/iachat/AIChat";
import Horarios from "../teacher/horarios/Horarios";
import Asistencias from "../teacher/asistencia/Asistencia";
import Notas from "../teacher/notas/Notas";
import Juegos from "../teacher/juegos/Juegos";
import { MisEstudiantes } from "../teacher/misestudiantes";
import MisAulas from "../teacher/misaulas/MisAulas";
import Clases from "../teacher/clases/Clases";
import TeacherPlanificaciones from '../teacher/planificaciones/TeacherPlanificaciones';
import { Tareas } from '../teacher/tareas';
import Evaluaciones from '../teacher/evaluaciones/Evaluaciones';
import { EvaluacionesEstudiantes } from '../teacher/evaluaciones';

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();
  
  // Hook personalizado para datos del profesor
  const { 
    chartData,
    dashboardData,
    loading, 
    error, 
    refreshData 
  } = useTeacherDashboard();

  const menuItems = [
    // 📊 DASHBOARD
    { id: "overview", label: "Panel Principal", icon: BarChart3, category: "dashboard" },

    // 🤖 HERRAMIENTAS EDUCATIVAS
    { id: "ai-chat", label: "Asistente IA", icon: MessageCircle, category: "herramientas" },
    { id: "games", label: "Juegos", icon: Gamepad2, category: "herramientas" },

    // 📚 TRABAJO ACADÉMICO
    { id: "schedule", label: "Cronograma", icon: Calendar, category: "academico" },
    { id: "attendance", label: "Asistencias", icon: ClipboardList, category: "academico" },
    { id: "tareas", label: "Tareas", icon: BookOpen, category: "academico" },
    { id: "evaluaciones-estudiantes", label: "Evaluaciones Estudiantes", icon: FileText, category: "academico" },
    { id: "notes", label: "Anotaciones", icon: StickyNote, category: "academico" },
    { id: "planificaciones", label: "Planificaciones", icon: FileText, category: "academico" },

    // 👥 GESTIÓN DE ESTUDIANTES
    { id: "students", label: "Mis Alumnos", icon: Users, category: "gestion" },
    { id: "classrooms", label: "Mis Aulas", icon: School, category: "gestion" },

    // 📄 EVALUACIONES PERSONALES
    { id: "evaluaciones", label: "Mis Evaluaciones", icon: FileText, category: "evaluaciones" }
  ];

  // Calcular estadísticas dinámicas basadas en datos reales
  const dynamicStats = useMemo(() => {
    const estudiantesData = dashboardData?.estudiantes?.porAula || {};
    const aulasData = dashboardData?.aulas?.data || [];
    
    const totalEstudiantes = Object.values(estudiantesData).reduce((total, estudiantes) => {
      return total + (Array.isArray(estudiantes) ? estudiantes.length : 0);
    }, 0);
    const totalAulas = aulasData.length;
    
    return [
      { 
        title: "Mis Estudiantes", 
        value: totalEstudiantes.toString(), 
        change: `${totalAulas} aulas`, 
        icon: Users, 
        color: "#3B82F6"
      },
      { 
        title: "Mis Aulas", 
        value: totalAulas.toString(), 
        change: "Asignadas", 
        icon: School, 
        color: "#10B981"
      },
      { 
        title: "Promedio por Aula", 
        value: totalAulas > 0 ? Math.round(totalEstudiantes / totalAulas).toString() : "0", 
        change: "estudiantes", 
        icon: GraduationCap, 
        color: "#F59E0B"
      },
      { 
        title: "Total de Datos", 
        value: (totalEstudiantes + totalAulas).toString(), 
        change: "activos", 
        icon: BarChart3, 
        color: "#8B5CF6"
      }
    ];
  }, [dashboardData]);

  const stats = dynamicStats;

  // Función para cerrar el menú móvil al seleccionar una opción
  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Función para obtener la etiqueta de categoría
  const getCategoryLabel = (category) => {
    const labels = {
      dashboard: "Dashboard",
      herramientas: "Herramientas Educativas",
      academico: "Trabajo Académico",
      gestion: "Gestión de Estudiantes",
      evaluaciones: "Evaluaciones Personales"
    };
    return labels[category] || category;
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile close button */}
        <div className="flex items-center bg-green-600 justify-between p-7 border-b border-gray-200 lg:justify-start">
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
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1 pb-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              
              // Determinar si mostrar separador de categoría
              const prevItem = index > 0 ? menuItems[index - 1] : null;
              const showCategorySeparator = prevItem && prevItem.category !== item.category;
              
              return (
                <div key={item.id}>
                  {/* Separador de categoría */}
                  {showCategorySeparator && (
                    <div className="my-4 px-4 ">
                      <div className="h-px bg-gray-400"></div>
                      <div className="text-sm font-bold text-green-900 uppercase tracking-wider mt-2 mb-1">
                        {getCategoryLabel(item.category)}
                      </div>
                      <div className="h-px bg-gray-400"></div>
                    </div>
                  )}
                  
                  <button
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
                </div>
              );
            })}
          </div>
        </nav>
        
        {/* User Info Card & Logout Button */}
        <div className="mt-auto p-3 border-t border-gray-200">
          {/* User Info */}
           <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-3 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-green-100 cursor-pointer">
             <div className="w-11 h-11 rounded-full border-2 border-green-500 shadow bg-green-100 flex items-center justify-center">
               <CircleUser className="w-6 h-6 text-green-600" />
             </div>
             <div className="flex flex-col min-w-0">
               <span className="font-semibold text-gray-900 text-sm truncate">
                 {user?.nombre || ''} {user?.apellido || ''}
               </span>
               {user?.role?.nombre && (
                 <span className="text-[10px] text-white bg-green-500 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
                   {user.rol}
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
                Panel de Docente
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
          {activeSection === "overview" && (
            <div className="space-y-6 lg:space-y-8">
              <h1 className="text-5xl font-bold mb-6 text-gray-700">Bienvenido, {user?.nombre || ''}</h1>
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

              <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-xl shadow-sm p-4 lg:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-700 bg-opacity-20 rounded-lg">
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

              {/* Gráficos de Datos del Profesor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <span>Estadísticas de Mis Aulas</span>
                  </h3>
                  <button 
                    onClick={refreshData}
                    disabled={loading}
                    className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                  </button>
                </div>
                <div className="p-4 lg:p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                      <span className="ml-2 text-gray-600">Cargando datos...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-8">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                      <span className="ml-2 text-red-600">Error al cargar datos: {error}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <StudentsByClassroomChart 
                        data={chartData} 
                      />
                      <GradesDistributionChart 
                        data={chartData}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Asistente IA Quick Access */}
              
            </div>
          )}

          {/* Renderizar componentes */}
          {activeSection === "goals" && <Objetivos />}
          {activeSection === "ai-chat" && <AIChat />}
          {activeSection === "schedule" && <Horarios />}
          {activeSection === "attendance" && <Asistencias />}
          {activeSection === "tareas" && <Tareas />}
          {activeSection === "evaluaciones-estudiantes" && <EvaluacionesEstudiantes />}
          {activeSection === "notes" && <Notas />}
          {activeSection === "games" && <Juegos />}
          {activeSection === "students" && <MisEstudiantes />}
          {activeSection === "classrooms" && <MisAulas />}
          {activeSection === "planificaciones" && <TeacherPlanificaciones />}
          {activeSection === "evaluaciones" && <Evaluaciones />}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;