import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  BookOpen,
  Eye,
  Share2,
  Printer,
  Settings
} from 'lucide-react';

const Reportes = () => {
  const [selectedCategory, setSelectedCategory] = useState('academic');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  // Datos fake de reportes
  const reportCategories = [
    {
      id: 'academic',
      name: 'Académicos',
      icon: BookOpen,
      color: 'bg-blue-500',
      reports: [
        {
          id: 1,
          name: 'Notas por Grado',
          description: 'Reporte consolidado de calificaciones por grado y materia',
          lastGenerated: '2024-08-15',
          frequency: 'Mensual',
          status: 'available'
        },
        {
          id: 2,
          name: 'Asistencia Estudiantil',
          description: 'Reporte de asistencia de estudiantes por período',
          lastGenerated: '2024-08-14',
          frequency: 'Semanal',
          status: 'available'
        },
        {
          id: 3,
          name: 'Rendimiento por Materia',
          description: 'Análisis de rendimiento académico por asignatura',
          lastGenerated: '2024-08-10',
          frequency: 'Trimestral',
          status: 'available'
        },
        {
          id: 4,
          name: 'Estudiantes en Riesgo',
          description: 'Lista de estudiantes con bajo rendimiento académico',
          lastGenerated: '2024-08-08',
          frequency: 'Mensual',
          status: 'pending'
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financieros',
      icon: DollarSign,
      color: 'bg-green-500',
      reports: [
        {
          id: 5,
          name: 'Estado de Resultados',
          description: 'Ingresos y gastos del período seleccionado',
          lastGenerated: '2024-08-15',
          frequency: 'Mensual',
          status: 'available'
        },
        {
          id: 6,
          name: 'Pagos Pendientes',
          description: 'Reporte de mensualidades y pagos pendientes',
          lastGenerated: '2024-08-14',
          frequency: 'Semanal',
          status: 'available'
        },
        {
          id: 7,
          name: 'Flujo de Caja',
          description: 'Análisis de flujo de efectivo mensual',
          lastGenerated: '2024-08-12',
          frequency: 'Mensual',
          status: 'available'
        },
        {
          id: 8,
          name: 'Gastos por Categoría',
          description: 'Desglose de gastos operativos por categoría',
          lastGenerated: '2024-08-10',
          frequency: 'Mensual',
          status: 'generating'
        }
      ]
    },
    {
      id: 'administrative',
      name: 'Administrativos',
      icon: Users,
      color: 'bg-purple-500',
      reports: [
        {
          id: 9,
          name: 'Personal Docente',
          description: 'Reporte completo del personal docente y administrativo',
          lastGenerated: '2024-08-13',
          frequency: 'Trimestral',
          status: 'available'
        },
        {
          id: 10,
          name: 'Matrícula y Deserción',
          description: 'Estadísticas de matrícula y tasas de deserción',
          lastGenerated: '2024-08-11',
          frequency: 'Trimestral',
          status: 'available'
        },
        {
          id: 11,
          name: 'Uso de Aulas',
          description: 'Ocupación y utilización de espacios educativos',
          lastGenerated: '2024-08-09',
          frequency: 'Mensual',
          status: 'available'
        },
        {
          id: 12,
          name: 'Satisfacción de Padres',
          description: 'Encuestas de satisfacción y feedback de padres',
          lastGenerated: '2024-08-05',
          frequency: 'Trimestral',
          status: 'pending'
        }
      ]
    },
    {
      id: 'statistical',
      name: 'Estadísticos',
      icon: BarChart3,
      color: 'bg-yellow-500',
      reports: [
        {
          id: 13,
          name: 'Dashboard Ejecutivo',
          description: 'KPIs principales y métricas de gestión',
          lastGenerated: '2024-08-15',
          frequency: 'Diario',
          status: 'available'
        },
        {
          id: 14,
          name: 'Tendencias Académicas',
          description: 'Análisis de tendencias en el rendimiento académico',
          lastGenerated: '2024-08-12',
          frequency: 'Trimestral',
          status: 'available'
        },
        {
          id: 15,
          name: 'Comparativo Anual',
          description: 'Comparación de métricas con años anteriores',
          lastGenerated: '2024-08-01',
          frequency: 'Anual',
          status: 'available'
        }
      ]
    }
  ];

  const periods = [
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mes' },
    { value: 'quarter', label: 'Último trimestre' },
    { value: 'semester', label: 'Último semestre' },
    { value: 'year', label: 'Último año' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: BarChart3 },
    { value: 'csv', label: 'CSV', icon: FileText }
  ];

  const currentCategory = reportCategories.find(cat => cat.id === selectedCategory);

  const stats = [
    { 
      title: 'Reportes Disponibles', 
      value: '15', 
      icon: FileText, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Generados Hoy', 
      value: '8', 
      icon: TrendingUp, 
      color: 'bg-green-500' 
    },
    { 
      title: 'En Proceso', 
      value: '2', 
      icon: Settings, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Programados', 
      value: '12', 
      icon: Calendar, 
      color: 'bg-purple-500' 
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'generating': return 'Generando';
      case 'pending': return 'Pendiente';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Generator */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generar Nuevo Reporte</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {formats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Generar
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {reportCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} text-white`
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 lg:p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentCategory.color} text-white`}>
              <currentCategory.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reportes {currentCategory.name}
              </h3>
              <p className="text-sm text-gray-600">
                {currentCategory.reports.length} reportes disponibles
              </p>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Generación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frecuencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCategory.reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.lastGenerated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 p-1"
                          disabled={report.status !== 'available'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 p-1"
                          disabled={report.status !== 'available'}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-purple-600 hover:text-purple-900 p-1"
                          disabled={report.status !== 'available'}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900 p-1"
                          disabled={report.status !== 'available'}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {currentCategory.reports.map((report) => (
            <div key={report.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {report.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {report.description}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {getStatusText(report.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Última generación:</span>
                  <div className="font-medium text-gray-900">
                    {new Date(report.lastGenerated).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Frecuencia:</span>
                  <div className="font-medium text-gray-900">
                    {report.frequency}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button 
                  className="text-blue-600 hover:text-blue-900 p-1"
                  disabled={report.status !== 'available'}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  className="text-green-600 hover:text-green-900 p-1"
                  disabled={report.status !== 'available'}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  className="text-purple-600 hover:text-purple-900 p-1"
                  disabled={report.status !== 'available'}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  className="text-gray-600 hover:text-gray-900 p-1"
                  disabled={report.status !== 'available'}
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Reporte de Notas por Grado generado exitosamente
              </div>
              <div className="text-xs text-gray-500">
                Hace 2 horas • PDF • 156 KB
              </div>
            </div>
            <button className="text-green-600 hover:text-green-800">
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Dashboard Ejecutivo actualizado
              </div>
              <div className="text-xs text-gray-500">
                Hace 4 horas • Excel • 89 KB
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Settings className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Generando reporte de Gastos por Categoría
              </div>
              <div className="text-xs text-gray-500">
                En proceso • Tiempo estimado: 5 minutos
              </div>
            </div>
            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
