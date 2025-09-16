// src/pages/admin/planilla/tablas/TablaTrabajadoresSinPlanilla.jsx
import React, { useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  FileText,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  Building,
  CheckSquare,
  Square,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const TablaTrabajadoresSinPlanilla = ({
  trabajadores = [],
  loading = false,
  generatingPlanillas = false,
  setGeneratingPlanillas,
  onGenerarPlanillas,
  onAgregarAPlanilla,
  planillaExistente,
  isAgregandoTrabajadores = false,
  user,
  selectedMes,
  selectedAnio
}) => {
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);
  const [selectedTrabajadores, setSelectedTrabajadores] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleVerDetalles = (trabajador) => {
    setSelectedTrabajador(trabajador);
  };

  const handleContactar = (trabajador) => {
    if (trabajador.correo) {
      window.open(`mailto:${trabajador.correo}`, '_blank');
    } else {
      toast.warning('No hay email registrado para este trabajador');
    }
  };

  // Funciones para selección múltiple
  const handleSelectTrabajador = (trabajadorId) => {
    setSelectedTrabajadores(prev => {
      const isSelected = prev.includes(trabajadorId);
      if (isSelected) {
        return prev.filter(id => id !== trabajadorId);
      } else {
        return [...prev, trabajadorId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTrabajadores([]);
      setSelectAll(false);
    } else {
      setSelectedTrabajadores(trabajadores.map(t => t.idTrabajador));
      setSelectAll(true);
    }
  };

  const handleGenerarPlanillas = async () => {
    if (selectedTrabajadores.length === 0) {
      toast.warning('Selecciona al menos un trabajador');
      return;
    }

    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }

    // Validar que se haya seleccionado mes y año cuando no hay planilla existente
    if (!planillaExistente && (!selectedMes || !selectedAnio)) {
      toast.error('Debe seleccionar mes y año para generar una nueva planilla');
      return;
    }

    if (setGeneratingPlanillas) {
      setGeneratingPlanillas(true);
    }

    try {
      if (planillaExistente && onAgregarAPlanilla) {
        // Agregar trabajadores a planilla existente
        await onAgregarAPlanilla(selectedTrabajadores);
      } else if (onGenerarPlanillas) {
        // Generar nuevas planillas con mes/año seleccionados
        await onGenerarPlanillas(selectedTrabajadores, selectedMes, selectedAnio);
      } else {
        // Implementación local como fallback
        const currentDate = new Date();
        const mes = selectedMes ? parseInt(selectedMes) : currentDate.getMonth() + 1;
        const anio = selectedAnio ? parseInt(selectedAnio) : currentDate.getFullYear();
        
        const payload = {
          mes: mes,
          anio: anio,
          fechaPagoProgramada: new Date(anio, mes - 1 + 1, 0).toISOString().split('T')[0],
          trabajadores: selectedTrabajadores,
          generadoPor: user?.entidadId || user?.id
        };

        console.log('Payload para generar planillas:', payload);
        // Aquí iría la llamada real a la API usando el servicio
        // await planillaService.generarPlanillasConTrabajadores(payload);
      }

      const mesDisplay = selectedMes ? parseInt(selectedMes) : new Date().getMonth() + 1;
      const anioDisplay = selectedAnio ? parseInt(selectedAnio) : new Date().getFullYear();
      const actionMessage = planillaExistente 
        ? 'agregados a la planilla existente' 
        : `generando planillas para ${mesDisplay}/${anioDisplay}`;
      toast.success(`${selectedTrabajadores.length} trabajadores ${actionMessage}...`);

      // Resetear selección después de la operación
      setSelectedTrabajadores([]);
      setSelectAll(false);

    } catch (error) {
      console.error('Error al generar planillas:', error);
      toast.error(error.message || 'Error al generar las planillas');
    } finally {
      if (setGeneratingPlanillas) {
        setGeneratingPlanillas(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando trabajadores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de acciones para selección múltiple */}
      {selectedTrabajadores.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedTrabajadores.length} trabajador(es) seleccionado(s)
              </span>
            </div>
            <button
              onClick={handleGenerarPlanillas}
              disabled={generatingPlanillas || isAgregandoTrabajadores}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(generatingPlanillas || isAgregandoTrabajadores) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {planillaExistente ? 'Agregando...' : 'Generando...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {planillaExistente 
                    ? 'Agregar a Planilla' 
                    : `Generar Planilla ${selectedMes ? parseInt(selectedMes) : new Date().getMonth() + 1}/${selectedAnio ? parseInt(selectedAnio) : new Date().getFullYear()}`
                  }
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 hover:text-blue-600"
                  >
                    {selectAll ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    <span>Seleccionar</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trabajador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trabajadores.map((trabajador) => {
                const isSelected = selectedTrabajadores.includes(trabajador.idTrabajador);
                return (
                  <tr key={trabajador.idTrabajador} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSelectTrabajador(trabajador.idTrabajador)}
                        className="flex items-center justify-center w-5 h-5"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {trabajador.imagenUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={trabajador.imagenUrl}
                              alt={`${trabajador.nombre} ${trabajador.apellido}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {trabajador.nombre} {trabajador.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {trabajador.idTrabajador}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {trabajador.tipoDocumento}: {trabajador.nroDocumento}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {trabajador.correo && (
                          <button
                            onClick={() => handleContactar(trabajador)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Enviar email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                        )}
                        {trabajador.telefono && (
                          <span className="text-sm text-gray-500">
                            {trabajador.telefono}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={trabajador.direccion}>
                        {trabajador.direccion || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        trabajador.estaActivo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {trabajador.estaActivo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleVerDetalles(trabajador)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de tarjetas para mobile */}
      <div className="lg:hidden space-y-4">
        {trabajadores.map((trabajador) => {
          const isSelected = selectedTrabajadores.includes(trabajador.idTrabajador);
          return (
            <div key={trabajador.idTrabajador} className={`bg-white border border-gray-200 rounded-lg p-4 ${isSelected ? 'border-blue-300 bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSelectTrabajador(trabajador.idTrabajador)}
                    className="flex items-center justify-center w-6 h-6"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400 hover:text-blue-600" />
                    )}
                  </button>
                  <div className="flex-shrink-0 h-12 w-12">
                    {trabajador.imagenUrl ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={trabajador.imagenUrl}
                        alt={`${trabajador.nombre} ${trabajador.apellido}`}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {trabajador.nombre} {trabajador.apellido}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {trabajador.tipoDocumento}: {trabajador.nroDocumento}
                    </p>
                    <p className="text-xs text-gray-500">ID: {trabajador.idTrabajador}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  trabajador.estaActivo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trabajador.estaActivo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{trabajador.correo || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Teléfono:</span>
                  <p className="font-medium">{trabajador.telefono || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Dirección:</span>
                  <p className="font-medium truncate" title={trabajador.direccion}>
                    {trabajador.direccion || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {trabajador.correo && (
                    <button
                      onClick={() => handleContactar(trabajador)}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="Enviar email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  )}
                  {trabajador.telefono && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {trabajador.telefono}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVerDetalles(trabajador)}
                    className="text-blue-600 hover:text-blue-900 p-2"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de detalles del trabajador */}
      {selectedTrabajador && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Detalles del Trabajador
                </h2>
                <button
                  onClick={() => setSelectedTrabajador(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Información básica */}
                <div className="flex items-center space-x-4">
                  {selectedTrabajador.imagenUrl ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={selectedTrabajador.imagenUrl}
                      alt={`${selectedTrabajador.nombre} ${selectedTrabajador.apellido}`}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedTrabajador.nombre} {selectedTrabajador.apellido}
                    </h3>
                    <p className="text-gray-600">ID: {selectedTrabajador.idTrabajador}</p>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Documento
                      </label>
                      <p className="text-sm text-gray-900">{selectedTrabajador.tipoDocumento || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Número de Documento
                      </label>
                      <p className="text-sm text-gray-900">{selectedTrabajador.nroDocumento || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">{selectedTrabajador.correo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Teléfono
                      </label>
                      <p className="text-sm text-gray-900">{selectedTrabajador.telefono || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dirección
                      </label>
                      <p className="text-sm text-gray-900">{selectedTrabajador.direccion || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTrabajador.estaActivo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedTrabajador.estaActivo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado de Planilla
                      </label>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Sin Planilla
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedTrabajador(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleSelectTrabajador(selectedTrabajador.idTrabajador);
                      setSelectedTrabajador(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedTrabajadores.includes(selectedTrabajador.idTrabajador) ? 'Deseleccionar' : 'Seleccionar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {trabajadores.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron trabajadores
          </h3>
          <p className="text-gray-600">
            No hay trabajadores que coincidan con los criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default TablaTrabajadoresSinPlanilla;