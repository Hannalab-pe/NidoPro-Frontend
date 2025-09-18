import React, { useState, useMemo } from 'react';
import { Eye, Search, Filter } from 'lucide-react';

const TablaEvaluacionesDocente = ({ evaluaciones, loading, onViewEvaluacion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocente, setSelectedDocente] = useState('');

  // Get unique docentes for filter
  const docentesOptions = useMemo(() => {
    if (!Array.isArray(evaluaciones)) return [];
    const unique = [...new Set(evaluaciones.map(ev => ev.idTrabajador2?.idTrabajador))];
    return unique.map(id => {
      const docente = evaluaciones.find(ev => ev.idTrabajador2?.idTrabajador === id)?.idTrabajador2;
      return docente ? { id: docente.idTrabajador, nombre: `${docente.nombre} ${docente.apellido}` } : null;
    }).filter(Boolean);
  }, [evaluaciones]);

  // Filter evaluations
  const filteredEvaluaciones = useMemo(() => {
    if (!Array.isArray(evaluaciones)) return [];
    return evaluaciones.filter(ev => {
      const matchesSearch = !searchTerm ||
        ev.idTrabajador2?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.idTrabajador2?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.idBimestre2?.nombreBimestre?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDocente = !selectedDocente || ev.idTrabajador2?.idTrabajador === selectedDocente;

      return matchesSearch && matchesDocente;
    });
  }, [evaluaciones, searchTerm, selectedDocente]);

  const handleView = (evaluacion) => {
    if (onViewEvaluacion) onViewEvaluacion(evaluacion);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por docente o bimestre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedDocente}
                onChange={(e) => setSelectedDocente(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los docentes</option>
                {docentesOptions.map(docente => (
                  <option key={docente.id} value={docente.id}>
                    {docente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Docente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bimestre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntajes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación Final
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coordinador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvaluaciones.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No se encontraron evaluaciones
                </td>
              </tr>
            ) : (
              filteredEvaluaciones.map((evaluacion) => (
                <tr key={evaluacion.idEvaluacionDocente} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {evaluacion.idTrabajador2?.nombre} {evaluacion.idTrabajador2?.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      {evaluacion.idTrabajador2?.correo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluacion.idBimestre2?.nombreBimestre}
                    </div>
                    <div className="text-sm text-gray-500">
                      Bimestre {evaluacion.idBimestre2?.numeroBimestre}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 space-y-1">
                      <div>Planificación: {evaluacion.puntajePlanificacion}</div>
                      <div>Metodología: {evaluacion.puntajeMetodologia}</div>
                      <div>Puntualidad: {evaluacion.puntajePuntualidad}</div>
                      <div>Creatividad: {evaluacion.puntajeCreatividad}</div>
                      <div>Comunicación: {evaluacion.puntajeComunicacion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      evaluacion.calificacionFinal === 'A' ? 'bg-green-100 text-green-800' :
                      evaluacion.calificacionFinal === 'B' ? 'bg-blue-100 text-blue-800' :
                      evaluacion.calificacionFinal === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {evaluacion.calificacionFinal} ({evaluacion.puntajeTotal})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {evaluacion.idCoordinador?.nombre} {evaluacion.idCoordinador?.apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleView(evaluacion)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Mostrando {filteredEvaluaciones.length} de {evaluaciones.length} evaluaciones
        </div>
      </div>
    </div>
  );
};

export default TablaEvaluacionesDocente;