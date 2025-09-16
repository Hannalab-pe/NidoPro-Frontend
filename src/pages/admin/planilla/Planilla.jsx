// src/pages/admin/planilla/Planilla.jsx
import React, { useState, useMemo, useEffect } from 'react';
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
  DollarSign,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const Planilla = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [generatingPlanillas, setGeneratingPlanillas] = useState(false);
  
  // Nuevos estados para la funcionalidad de agregar a planilla existente
  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAnio, setSelectedAnio] = useState('');
  const [planillaExistente, setPlanillaExistente] = useState(null);
  const [buscandoPlanilla, setBuscandoPlanilla] = useState(false);

  const {
    trabajadoresSinPlanilla,
    trabajadoresSinPlanillaOriginal,
    loading,
    error,
    statistics,
    searchTrabajadores,
    refreshAll,
    hasTrabajadoresSinPlanilla,
    generarPlanillasConTrabajadores,
    obtenerPlanillaPorPeriodo,
    agregarTrabajadoresAPlanilla,
    filtrarTrabajadoresPorPeriodo,
    isAgregandoTrabajadores
  } = usePlanilla();

  // Obtener usuario del store para pasar a la tabla
  const { user } = useAuthStore();

  // Efecto para filtrar trabajadores cuando cambian mes/año seleccionados o cuando cambian los datos originales
  useEffect(() => {
    if (selectedMes && selectedAnio) {
      console.log('Filtrando trabajadores para período seleccionado:', { selectedMes, selectedAnio });
      filtrarTrabajadoresPorPeriodo(selectedMes, selectedAnio);
    } else if (!selectedMes && !selectedAnio) {
      // Si no hay período seleccionado, mostrar todos los trabajadores
      filtrarTrabajadoresPorPeriodo('', '');
    }
  }, [selectedMes, selectedAnio, trabajadoresSinPlanillaOriginal, filtrarTrabajadoresPorPeriodo]);

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
      // Después de refrescar, volver a aplicar el filtro si hay período seleccionado
      if (selectedMes && selectedAnio) {
        await filtrarTrabajadoresPorPeriodo(selectedMes, selectedAnio);
      }
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los datos');
    }
  };

  // Nueva función para buscar planilla por período
  const handleBuscarPlanilla = async () => {
    if (!selectedMes || !selectedAnio) {
      toast.error('Debe seleccionar mes y año');
      return;
    }

    setBuscandoPlanilla(true);
    try {
      console.log('Buscando planilla para:', { mes: selectedMes, anio: selectedAnio });
      
      // Usar la función del hook para obtener la planilla
      const planilla = await obtenerPlanillaPorPeriodo(selectedMes, selectedAnio);
      
      if (planilla) {
        setPlanillaExistente(planilla);
        toast.success(`Planilla encontrada: ${planilla.mes}/${planilla.anio}`);
        // Filtrar trabajadores para este período
        await filtrarTrabajadoresPorPeriodo(selectedMes, selectedAnio);
      } else {
        toast.error('No se encontró planilla para el período seleccionado');
        setPlanillaExistente(null);
        // Mostrar todos los trabajadores cuando no hay planilla
        await filtrarTrabajadoresPorPeriodo('', '');
      }
    } catch (error) {
      console.error('Error al buscar planilla:', error);
      toast.error(error.message || 'Error al buscar la planilla');
      setPlanillaExistente(null);
    } finally {
      setBuscandoPlanilla(false);
    }
  };

  // Nueva función para agregar trabajadores a planilla existente
  const handleAgregarATrabajadoresPlanilla = async (trabajadoresSeleccionados) => {
    if (!planillaExistente) {
      toast.error('No hay planilla seleccionada');
      return;
    }

    if (!trabajadoresSeleccionados || trabajadoresSeleccionados.length === 0) {
      toast.error('Debe seleccionar al menos un trabajador');
      return;
    }

    try {
      await agregarTrabajadoresAPlanilla(planillaExistente.idPlanillaMensual, trabajadoresSeleccionados);
      toast.success(`${trabajadoresSeleccionados.length} trabajadores agregados a la planilla`);
      
      // Limpiar selección
      setPlanillaExistente(null);
      setSelectedMes('');
      setSelectedAnio('');
    } catch (error) {
      console.error('Error al agregar trabajadores:', error);
      toast.error(error.message || 'Error al agregar trabajadores a la planilla');
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

      {/* Nueva sección: Agregar trabajadores a planilla existente */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Agregar trabajadores a planilla existente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <select
              value={selectedMes}
              onChange={(e) => setSelectedMes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar mes</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <select
              value={selectedAnio}
              onChange={(e) => setSelectedAnio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar año</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleBuscarPlanilla}
              disabled={buscandoPlanilla || !selectedMes || !selectedAnio}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {buscandoPlanilla ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Buscar Planilla
                </>
              )}
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={async () => {
                setPlanillaExistente(null);
                setSelectedMes('');
                setSelectedAnio('');
                // Mostrar todos los trabajadores cuando se limpia
                await filtrarTrabajadoresPorPeriodo('', '');
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
        
        {/* Mostrar información de planilla encontrada */}
        {planillaExistente && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Planilla encontrada: {planillaExistente.mes}/{planillaExistente.anio}
                  </h4>
                  <p className="text-sm text-green-700">
                    Estado: {planillaExistente.estadoPlanilla} | 
                    Total ingresos: S/ {planillaExistente.totalIngresos} | 
                    Total descuentos: S/ {planillaExistente.totalDescuentos}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPlanillaExistente(null)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
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
              onAgregarAPlanilla={planillaExistente ? handleAgregarATrabajadoresPlanilla : null}
              planillaExistente={planillaExistente}
              isAgregandoTrabajadores={isAgregandoTrabajadores}
              user={user}
              selectedMes={selectedMes}
              selectedAnio={selectedAnio}
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