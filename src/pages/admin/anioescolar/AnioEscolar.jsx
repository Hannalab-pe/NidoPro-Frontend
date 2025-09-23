import React, { useState } from 'react';
import { Calendar, DollarSign, Plus, Settings, Edit, Eye, Table, FileText, BarChart3 } from 'lucide-react';
import CrearPeriodoModal from './modales/CrearPeriodoModal';
import EditarPeriodoModal from './modales/EditarPeriodoModal';
import GenerarPensionesModal from './modales/GenerarPensionesModal';
import GenerarBimestresModal from './modales/GenerarBimestresModal';
import EditarBimestresModal from './modales/EditarBimestresModal';
import { usePeriodosEscolares } from '../../../hooks/queries/usePeriodoEscolarQueries';
import { useBimestres } from '../../../hooks/queries/useBimestreQueries';

const AnioEscolar = () => {
  const [activeSection, setActiveSection] = useState('periodos');
  const [modalCrearPeriodo, setModalCrearPeriodo] = useState(false);
  const [modalEditarPeriodo, setModalEditarPeriodo] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
  const [modalGenerarPensiones, setModalGenerarPensiones] = useState(false);
  const [modalGenerarBimestres, setModalGenerarBimestres] = useState(false);
  const [modalEditarBimestres, setModalEditarBimestres] = useState(false);
  const [bimestresSeleccionados, setBimestresSeleccionados] = useState([]);
  const [periodoBimestresSeleccionado, setPeriodoBimestresSeleccionado] = useState(null);

  // Obtener períodos escolares
  const { data: periodos = [], isLoading: loadingPeriodos, error: errorPeriodos } = usePeriodosEscolares();

  // Obtener bimestres
  const { data: bimestresData = [], isLoading: loadingBimestres, error: errorBimestres } = useBimestres();

  // Handlers para modales
  const handleEditarPeriodo = (periodo) => {
    setPeriodoSeleccionado(periodo);
    setModalEditarPeriodo(true);
  };

  const handleCloseEditarPeriodo = () => {
    setModalEditarPeriodo(false);
    setPeriodoSeleccionado(null);
  };

  const handleEditarBimestres = (bimestres, periodo) => {
    setBimestresSeleccionados(bimestres);
    setPeriodoBimestresSeleccionado(periodo);
    setModalEditarBimestres(true);
  };

  const handleCloseEditarBimestres = () => {
    setModalEditarBimestres(false);
    setBimestresSeleccionados([]);
    setPeriodoBimestresSeleccionado(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Año Escolar</h1>
            <p className="text-gray-600">Administra períodos escolares, bimestres y pensiones</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSection('periodos')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === 'periodos'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Períodos</span>
          </button>
          <button
            onClick={() => setActiveSection('bimestres')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === 'bimestres'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Bimestres</span>
          </button>
          <button
            onClick={() => setActiveSection('acciones')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === 'acciones'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Acciones</span>
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'periodos' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Períodos Escolares</h2>
                <p className="text-gray-600">Gestiona los períodos escolares del sistema</p>
              </div>
            </div>
            <button
              onClick={() => setModalCrearPeriodo(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Período
            </button>
          </div>

          {loadingPeriodos ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando períodos escolares...</p>
            </div>
          ) : errorPeriodos ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">Error al cargar los períodos escolares</p>
            </div>
          ) : periodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-8 bg-gray-50 rounded-lg">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No hay períodos escolares registrados</p>
                <button
                  onClick={() => setModalCrearPeriodo(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Crear primer período
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {periodos.map((periodo) => (
                <div key={periodo.idPeriodoEscolar} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Año {periodo.anioEscolar}
                        </h3>
                        {periodo.estaActivo && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditarPeriodo(periodo)}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                      title="Editar período"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inicio:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(periodo.fechaInicio).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fin:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(periodo.fechaFin).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {periodo.descripcion && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-600 text-xs">Descripción:</p>
                        <p className="text-gray-900 font-medium">{periodo.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'bimestres' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Table className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bimestres por Período</h2>
                <p className="text-gray-600">Gestiona y edita los bimestres generados</p>
              </div>
            </div>
            <button
              onClick={() => setModalGenerarBimestres(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Generar Bimestres
            </button>
          </div>

          {loadingBimestres ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando bimestres...</p>
            </div>
          ) : errorBimestres ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">Error al cargar los bimestres</p>
            </div>
          ) : !bimestresData?.bimestres || bimestresData.bimestres.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-8 bg-gray-50 rounded-lg">
                <Table className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No hay bimestres registrados</p>
                <button
                  onClick={() => setModalGenerarBimestres(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Generar bimestres
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Agrupar bimestres por período */}
              {periodos.map((periodo) => {
                const bimestresDelPeriodo = bimestresData.bimestres.filter(
                  bimestre => bimestre.idPeriodoEscolar === periodo.idPeriodoEscolar
                );

                if (bimestresDelPeriodo.length === 0) return null;

                return (
                  <div key={periodo.idPeriodoEscolar} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Año {periodo.anioEscolar}
                          </h3>
                          {periodo.estaActivo && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Activo
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            ({bimestresDelPeriodo.length} bimestre{bimestresDelPeriodo.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <button
                          onClick={() => handleEditarBimestres(bimestresDelPeriodo, periodo)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Editar Fechas
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bimestre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha Inicio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha Fin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Límite Programación
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bimestresDelPeriodo.map((bimestre) => (
                            <tr key={bimestre.idBimestre} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {bimestre.numeroBimestre}° Bimestre
                                </div>
                                <div className="text-sm text-gray-500">
                                  {bimestre.nombreBimestre}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(bimestre.fechaInicio).toLocaleDateString('es-ES')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(bimestre.fechaFin).toLocaleDateString('es-ES')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(bimestre.fechaLimiteProgramacion).toLocaleDateString('es-ES')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {bimestre.estaActivo ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Activo
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                    Inactivo
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSection === 'acciones' && (
        <div className="space-y-6">
          {/* Generar Pensiones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Generar Pensiones</h3>
                <p className="text-gray-600">Configura las pensiones automáticamente para un período escolar</p>
              </div>
            </div>
            <button
              onClick={() => setModalGenerarPensiones(true)}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
            >
              <DollarSign className="w-6 h-6" />
              <span className="font-semibold">Generar Pensiones</span>
            </button>
          </div>

          {/* Generar Bimestres */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Generar Bimestres</h3>
                <p className="text-gray-600">Crea automáticamente los bimestres para un período escolar</p>
              </div>
            </div>
            <button
              onClick={() => setModalGenerarBimestres(true)}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
            >
              <Settings className="w-6 h-6" />
              <span className="font-semibold">Generar Bimestres</span>
            </button>
          </div>
        </div>
      )}

      {/* Modales */}
      {modalCrearPeriodo && (
        <CrearPeriodoModal
          isOpen={modalCrearPeriodo}
          onClose={() => setModalCrearPeriodo(false)}
        />
      )}

      {modalEditarPeriodo && (
        <EditarPeriodoModal
          isOpen={modalEditarPeriodo}
          onClose={handleCloseEditarPeriodo}
          periodo={periodoSeleccionado}
        />
      )}

      {modalEditarBimestres && (
        <EditarBimestresModal
          isOpen={modalEditarBimestres}
          onClose={handleCloseEditarBimestres}
          bimestres={bimestresSeleccionados}
          periodo={periodoBimestresSeleccionado}
        />
      )}

      {modalGenerarPensiones && (
        <GenerarPensionesModal
          isOpen={modalGenerarPensiones}
          onClose={() => setModalGenerarPensiones(false)}
        />
      )}

      {modalGenerarBimestres && (
        <GenerarBimestresModal
          isOpen={modalGenerarBimestres}
          onClose={() => setModalGenerarBimestres(false)}
        />
      )}
    </div>
  );
};

export default AnioEscolar;