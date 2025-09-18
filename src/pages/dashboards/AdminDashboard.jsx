import React, { useState } from "react";
import { useAuthStore } from "../../store";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { DashboardBarChart, FinancialTrendChart, CategoryPieChart } from "../../components/charts";
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
  BanknoteArrowUp,
  CircleUser,
  Baby,
  Search,
  TrendingUp,
  Banana,
  Calendar,
  Clock,
  ChevronRight,
  Menu,
  X,
  ClipboardList,
  Award,
  RefreshCw,
  MessageCircle,
  Bot,
  Shield
} from "lucide-react";

// Importar todos los componentes de administración
import Estudiantes from '../admin/estudiantes/Estudiantes';
import Matricula from '../admin/matricula/Matricula';
import Trabajadores from '../admin/trabajadores/Trabajadores';
import Padres from '../admin/padres/Padres';
import AsignacionAula from '../admin/aulas/AsignacionAula';
import Aulas from '../admin/aula/Aulas';
import GestionFinanciera from '../admin/finanzas/GestionFinanciera';
import MovimientosCaja from '../admin/finanzas/movimientos/MovimientosCaja';
import PagosPensiones from '../admin/finanzas/pensiones/PagosPensiones';
import PagosMatriculas from '../admin/finanzas/matriculas/PagosMatriculas';
import PagosPlanillas from '../admin/finanzas/planillas/PagosPlanillas';
import Reportes from '../admin/reportes/Reportes';
import Configuraciones from "../admin/configuraciones/Configuracion";
import Usuarios from '../admin/usuarios/Usuarios';
import Planificaciones from '../admin/planificaciones/Planificaciones';
import Grados from '../admin/grados/aulas';
import Pensiones from '../admin/pensiones/pensiones';
import Cursos from '../admin/cursos/Cursos';
import Contratos from '../admin/contratos/Contratos';
import Planilla from '../admin/planilla/Planilla';
import Cronogramas from '../admin/cronogramas/Cronogramas';
import EvaluacionDocente from '../admin/evaluacion/EvaluacionDocente';
import AnioEscolar from '../admin/anioescolar/AnioEscolar';
import Seguros from '../admin/seguros/Seguros';
import AIChat from '../admin/iachat/AIChat';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [financeComponent, setFinanceComponent] = useState("GestionFinanciera");
  const { logout, user } = useAuthStore();

  // Usar el hook personalizado para obtener datos reales del dashboard
  const { 
    stats, 
    loading: dashboardLoading, 
    refreshData, 
    error: dashboardError,
    dashboardData,
    financialStats,
    students // Agregar estudiantes para debug
  } = useAdminDashboard();

  // Effect para escuchar eventos de cambio de vista en finanzas
  React.useEffect(() => {
    const handleFinanceViewChange = (event) => {
      setFinanceComponent(event.detail.component);
    };

    window.addEventListener('changeFinanceView', handleFinanceViewChange);
    return () => {
      window.removeEventListener('changeFinanceView', handleFinanceViewChange);
    };
  }, []);

  const menuItems = [
    // 📊 DASHBOARD
    { id: "overview", label: "Resumen General", icon: BarChart3, category: "dashboard" },
    
    // 🤖 HERRAMIENTAS EDUCATIVAS
    { id: "ai-chat", label: "Asistente IA", icon: MessageCircle, category: "herramientas" },
    
    // 💰 FINANZAS
    { id: "finances", label: "Finanzas", icon: DollarSign, category: "finanzas" },
    { id: "pensiones", label: "Pensiones", icon: BanknoteArrowUp, category: "finanzas" },
    
    // 👥 GESTIÓN DE PERSONAS
    { id: "students", label: "Estudiantes", icon: CircleUser, category: "personas" },
    { id: "parents", label: "Padres de Familia", icon: UserCheck, category: "personas" },
    { id: "trabajadores", label: "Trabajadores", icon: UsersIcon, category: "personas" },
    
    // 📚 ACADÉMICO
    { id: "matricula", label: "Matrícula", icon: GraduationCap, category: "academico" },
    { id: "cursos", label: "Gestión de Cursos", icon: BookOpen, category: "academico" },
    { id: "grados", label: "Grados Académicos", icon: School, category: "academico" },
    { id: "planificaciones", label: "Planificaciones", icon: FileText, category: "academico" },
    { id: "cronogramas", label: "Cronogramas", icon: Calendar, category: "academico" },
    { id: "evaluacion-docente", label: "Evaluación Docente", icon: Award, category: "academico" },
    { id: "anio-escolar", label: "Año Escolar", icon: Calendar, category: "academico" },
    
    // 🏫 INFRAESTRUCTURA
    { id: "aulas", label: "Gestión de Aulas", icon: School, category: "infraestructura" },
    { id: "asignacion-aula", label: "Asignación de Aulas", icon: BookOpen, category: "infraestructura" },
    
    // 📄 ADMINISTRATIVO
    { id: "contratos", label: "Contratos", icon: FileText, category: "administrativo" },
    { id: "planilla", label: "Planilla", icon: ClipboardList, category: "administrativo" },
    { id: "seguros", label: "Tipos de Seguro", icon: Shield, category: "administrativo" },
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
    // Resetear el componente de finanzas al cambiar de sección
    if (sectionId === "finances") {
      setFinanceComponent("GestionFinanciera");
    }
  };

  // Función para renderizar el componente de finanzas según el estado
  const renderFinanceComponent = () => {
    switch (financeComponent) {
      case 'MovimientosCaja':
        return <MovimientosCaja />;
      case 'PagosPensiones':
        return <PagosPensiones />;
      case 'PagosMatriculas':
        return <PagosMatriculas />;
      case 'PagosPlanillas':
        return <PagosPlanillas />;
      default:
        return <GestionFinanciera />;
    }
  };

  // Función para obtener la etiqueta de categoría
  const getCategoryLabel = (category) => {
    const labels = {
      dashboard: "Dashboard",
      herramientas: "Herramientas IA",
      finanzas: "Finanzas",
      personas: "Personas",
      academico: "Académico",
      infraestructura: "Infraestructura",
      administrativo: "Administrativo"
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
        <div className="flex items-center bg-blue-800 justify-between p-7 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3 ">
            <Baby className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Nido Pro</span>
          </div>
          <button
            className="lg:hidden p-2 text-white hover:text-gray-300"
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
                      <div className="text-sm font-bold text-blue-900 uppercase tracking-wider mt-2 mb-1">
                        {getCategoryLabel(item.category)}
                      </div>
                      <div className="h-px bg-gray-400"></div>
                    </div>
                  )}
                  
                  <button
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
                </div>
              );
            })}
          </div>
        </nav>
        
        {/* User Info Card & Logout Button */}
        <div className="mt-auto p-3 border-t border-gray-200">
          {/* User Info */}
           <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-3 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-blue-100 cursor-pointer">
             <div className="w-11 h-11 rounded-full border-2 border-blue-500 shadow bg-blue-100 flex items-center justify-center">
               <CircleUser className="w-6 h-6 text-blue-600" />
             </div>
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
              className="lg:hidden p-2 text-white hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-white mt-1 hidden sm:block">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          {activeSection === "overview" && (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-5xl font-bold text-gray-700">Bienvenido, {user?.nombre || ''}</h1>
                {dashboardLoading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Actualizando datos...</span>
                  </div>
                )}
              </div>

              {/* Mostrar errores si existen */}
              {dashboardError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-red-800 text-sm">{dashboardError}</span>
                  </div>
                </div>
              )}

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
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                          {stat.loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
                          ) : (
                            stat.value
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {stat.loading ? "..." : stat.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Estadísticas Financieras Detalladas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ingresos del Mes</h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {dashboardLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 rounded w-24"></div>
                    ) : (
                      `S/ ${financialStats.ingresosMes?.toLocaleString() || 0}`
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Movimientos positivos</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Egresos del Mes</h3>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {dashboardLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 rounded w-24"></div>
                    ) : (
                      `S/ ${financialStats.egresosMes?.toLocaleString() || 0}`
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Movimientos negativos</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Utilidad del Mes</h3>
                    <div className={`p-2 rounded-lg ${financialStats.utilidadMes >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      <DollarSign className={`w-5 h-5 ${financialStats.utilidadMes >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${financialStats.utilidadMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 rounded w-24"></div>
                    ) : (
                      `S/ ${financialStats.utilidadMes?.toLocaleString() || 0}`
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {financialStats.utilidadMes >= 0 ? 'Resultado positivo' : 'Resultado negativo'}
                  </p>
                </div>
              </div>

              {/* Asistente IA Quick Access */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl shadow-sm p-4 lg:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-900 bg-opacity-20 rounded-lg">
                      <Bot className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Asistente IA Administrativo</h3>
                      <p className="text-blue-100">¿Necesitas ayuda con análisis financiero o gestión institucional?</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("ai-chat")}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    Chatear ahora
                  </button>
                </div>
              </div>

              {/* Gráficos y Visualizaciones */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Gráfico de barras - Estadísticas generales */}
                <DashboardBarChart
                  data={[
                    {
                      name: 'Estudiantes',
                      total: dashboardData.estudiantes.total,
                      activos: dashboardData.estudiantes.activos,
                      inactivos: dashboardData.estudiantes.inactivos,
                    },
                    {
                      name: 'Trabajadores',
                      total: dashboardData.trabajadores.total,
                      activos: dashboardData.trabajadores.activos,
                      inactivos: dashboardData.trabajadores.inactivos,
                    }
                  ]}
                  title="Estadísticas de Personal"
                  height={350}
                />

                {/* Gráfico circular - Distribución por categorías */}
                <CategoryPieChart
                  data={[
                    { name: 'Docentes', value: Math.round(dashboardData.trabajadores.activos * 0.7), color: '#3b82f6' },
                    { name: 'Administrativos', value: Math.round(dashboardData.trabajadores.activos * 0.2), color: '#10b981' },
                    { name: 'Auxiliares', value: Math.round(dashboardData.trabajadores.activos * 0.1), color: '#f59e0b' },
                  ]}
                  title="Distribución de Trabajadores"
                  height={350}
                />
              </div>

              {/* Gráfico de tendencias financieras - Ancho completo */}
              <div className="mb-6">
                <FinancialTrendChart
                  data={[
                    {
                      mes: 'Ago',
                      ingresos: financialStats.ingresosMes * 0.8,
                      egresos: financialStats.egresosMes * 0.9,
                      utilidad: (financialStats.ingresosMes * 0.8) - (financialStats.egresosMes * 0.9),
                    },
                    {
                      mes: 'Sep',
                      ingresos: financialStats.ingresosMes * 0.9,
                      egresos: financialStats.egresosMes * 0.85,
                      utilidad: (financialStats.ingresosMes * 0.9) - (financialStats.egresosMes * 0.85),
                    },
                    {
                      mes: 'Oct',
                      ingresos: financialStats.ingresosMes * 1.1,
                      egresos: financialStats.egresosMes * 0.95,
                      utilidad: (financialStats.ingresosMes * 1.1) - (financialStats.egresosMes * 0.95),
                    },
                    {
                      mes: 'Nov',
                      ingresos: financialStats.ingresosMes * 1.2,
                      egresos: financialStats.egresosMes * 1.0,
                      utilidad: (financialStats.ingresosMes * 1.2) - (financialStats.egresosMes * 1.0),
                    },
                    {
                      mes: 'Dic',
                      ingresos: financialStats.ingresosMes,
                      egresos: financialStats.egresosMes,
                      utilidad: financialStats.utilidadMes,
                    }
                  ]}
                  title="Tendencias Financieras Mensuales"
                  height={400}
                />
              </div>


            </div>
          )}

          {/* Renderizar componentes según la sección activa */}
          {activeSection === "students" && <Estudiantes />}
          {activeSection === "matricula" && <Matricula />}
          {activeSection === "trabajadores" && <Trabajadores />}
          {activeSection === "contratos" && <Contratos />}
          {activeSection === "planilla" && <Planilla />}
          {activeSection === "parents" && <Padres />}
          {activeSection === "asignacion-aula" && <AsignacionAula />}
          {activeSection === "aulas" && <Aulas />}
          {activeSection === "cursos" && <Cursos />}
          {activeSection === "finances" && renderFinanceComponent()}
          {activeSection === "pensiones" && <Pensiones />}
          {activeSection === "reports" && <Reportes />}
          {activeSection === "users" && <Usuarios />}
          {activeSection === "settings" && <Configuraciones />}
          {activeSection === "planificaciones" && <Planificaciones />}
          {activeSection === "grados" && <Grados />}
          {activeSection === "cronogramas" && <Cronogramas />}
          {activeSection === "evaluacion-docente" && <EvaluacionDocente />}
          {activeSection === "anio-escolar" && <AnioEscolar />}
          {activeSection === "seguros" && <Seguros />}
          {activeSection === "ai-chat" && <AIChat />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;