// src/pages/admin/planilla/Planilla.jsx
import React, { useState, useMemo } from 'react';
import { usePlanilla } from '../../../hooks/usePlanilla';
import { useAuthStore } from '../../../store';
import TablaTrabajadoresSinPlanilla from './tablas/TablaTrabajadoresSinPlanilla';
import {
  Users,
  FileText,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

const Planilla = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [generatingPlanillas, setGeneratingPlanillas] = useState(false);

  const {
    trabajadoresSinPlanilla,
    loading,
    error,
    statistics,
    searchTrabajadores,
    refreshAll,
    hasTrabajadoresSinPlanilla,
    generarPlanillasConTrabajadores
  } = usePlanilla();

  // Obtener usuario del store para pasar a la tabla
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Usuario no autenticado
          </h3>
          <p className="text-gray-600">
            Debe iniciar sesión para acceder a esta funcionalidad
          </p>
        </div>
      </div>
    );
  }

  // Filtrar trabajadores por búsqueda local
  const filteredTrabajadores = useMemo(() => {
    if (!searchTerm) return trabajadoresSinPlanilla;
    return trabajadoresSinPlanilla.filter(trabajador =>
      trabajador.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trabajadoresSinPlanilla, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    searchTrabajadores(value);
  };

  const handleRefresh = async () => {
    try {
      await refreshAll();
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los datos');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar los datos
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || 'Ha ocurrido un error inesperado'}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Planillas</h1>
          <p className="text-gray-600 mt-1">
            Administra las planillas de los trabajadores del sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trabajadores sin Planilla</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.trabajadoresSinPlanilla}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Listo para procesar</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planillas Mensuales</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.planillasMensuales}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-blue-600">Procesadas</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalRegistros}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-gray-600">Este mes</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? 'Cargando...' : 'Activo'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Sistema operativo</span>
          </div>
        </div>
      </div>

      {/* Controles de búsqueda y filtros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar trabajadores..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos los cargos</option>
                  <option value="profesor">Profesor</option>
                  <option value="director">Director</option>
                  <option value="secretaria">Secretaria</option>
                  <option value="auxiliar">Auxiliar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de trabajadores sin planilla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Trabajadores sin Planilla
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredTrabajadores.length} trabajadores encontrados
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Cargando trabajadores...</span>
            </div>
          ) : hasTrabajadoresSinPlanilla ? (
            <TablaTrabajadoresSinPlanilla
              trabajadores={filteredTrabajadores}
              loading={loading}
              generatingPlanillas={generatingPlanillas}
              setGeneratingPlanillas={setGeneratingPlanillas}
              onGenerarPlanillas={generarPlanillasConTrabajadores}
              user={user}
            />
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay trabajadores sin planilla
              </h3>
              <p className="text-gray-600">
                Todos los trabajadores tienen sus planillas al día
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planilla;