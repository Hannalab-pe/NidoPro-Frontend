import React, { useState } from 'react';
import { Edit, Trash2, Plus, FileText, Eye } from 'lucide-react';

const TablaNotas = ({ 
  notas = [], 
  onEdit, 
  onDelete, 
  onAdd,
  onView,
  isLoading = false 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroEstudiante, setFiltroEstudiante] = useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const notasFiltradas = React.useMemo(() => {
    let filtered = notas;

    if (filtroCategoria !== 'todas') {
      filtered = filtered.filter(nota => nota.categoria === filtroCategoria);
    }

    if (filtroEstudiante) {
      filtered = filtered.filter(nota => 
        nota.estudiante?.nombre?.toLowerCase().includes(filtroEstudiante.toLowerCase()) ||
        nota.estudiante?.apellido?.toLowerCase().includes(filtroEstudiante.toLowerCase())
      );
    }

    return filtered;
  }, [notas, filtroCategoria, filtroEstudiante]);

  const notasOrdenadas = React.useMemo(() => {
    if (!sortConfig.key) return notasFiltradas;
    
    return [...notasFiltradas].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [notasFiltradas, sortConfig]);

  const categorias = React.useMemo(() => {
    const cats = [...new Set(notas.map(nota => nota.categoria))];
    return cats.sort();
  }, [notas]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Notas y Observaciones</h3>
          {onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Nota
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por estudiante..."
              value={filtroEstudiante}
              onChange={(e) => setFiltroEstudiante(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {notasOrdenadas.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <div className="text-gray-500">
            {notas.length === 0 ? 'No hay notas registradas' : 'No se encontraron notas con los filtros aplicados'}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('fecha')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Fecha
                  {sortConfig.key === 'fecha' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th 
                  onClick={() => handleSort('categoria')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Categoría
                  {sortConfig.key === 'categoria' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asunto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notasOrdenadas.map((nota) => (
                <tr key={nota.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(nota.fecha).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(nota.fecha).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={nota.estudiante?.avatar || `https://ui-avatars.com/api/?name=${nota.estudiante?.nombre}&background=0D8ABC&color=fff`}
                          alt={nota.estudiante?.nombre}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {nota.estudiante?.nombre} {nota.estudiante?.apellido}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      nota.categoria === 'academico' ? 'bg-blue-100 text-blue-800' :
                      nota.categoria === 'comportamiento' ? 'bg-yellow-100 text-yellow-800' :
                      nota.categoria === 'social' ? 'bg-green-100 text-green-800' :
                      nota.categoria === 'emocional' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {nota.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {nota.asunto}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {nota.contenido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      nota.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                      nota.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {nota.prioridad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(nota)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                          title="Ver nota completa"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(nota)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(nota)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer con estadísticas */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            Mostrando {notasOrdenadas.length} de {notas.length} notas
          </div>
          <div className="flex space-x-4 text-xs">
            <span className="text-red-600">
              Alta: {notas.filter(n => n.prioridad === 'alta').length}
            </span>
            <span className="text-yellow-600">
              Media: {notas.filter(n => n.prioridad === 'media').length}
            </span>
            <span className="text-green-600">
              Baja: {notas.filter(n => n.prioridad === 'baja').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaNotas;
