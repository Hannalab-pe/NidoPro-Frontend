import React, { useState } from 'react';
import {
  Edit,
  Trash2,
  Eye,
  Download,
  FileText,
  User,
  Calendar,
  MessageSquare,
  MoreVertical,
  Loader,
  AlertCircle
} from 'lucide-react';

const TablaEvaluaciones = ({ evaluaciones, loading, error, onEditar, onEliminar }) => {
  const [menuOpen, setMenuOpen] = useState(null);

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncar texto largo
  const truncarTexto = (texto, maxLength = 50) => {
    if (!texto) return 'N/A';
    return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar evaluaciones</h3>
          <p className="text-gray-600">{error.message || 'Ha ocurrido un error al cargar las evaluaciones.'}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando evaluaciones...</span>
        </div>
      </div>
    );
  }

  if (evaluaciones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evaluaciones</h3>
          <p className="text-gray-600">Aún no se han registrado evaluaciones docentes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header de la tabla */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Evaluaciones Registradas</h3>
        <p className="text-sm text-gray-600">Total: {evaluaciones.length} evaluaciones</p>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Docente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archivo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evaluaciones.map((evaluacion) => (
              <tr key={evaluacion.idComentario} className="hover:bg-gray-50">
                {/* Docente */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {evaluacion.idTrabajador?.nombre} {evaluacion.idTrabajador?.apellido}
                      </div>
                      <div className="text-sm text-gray-500">
                        {evaluacion.idTrabajador?.idRol?.nombre || 'Docente'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Motivo */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {evaluacion.motivo}
                  </div>
                </td>

                {/* Descripción */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="truncate" title={evaluacion.descripcion}>
                        {truncarTexto(evaluacion.descripcion, 60)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Fecha */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatearFecha(evaluacion.fechaCreacion)}
                    </span>
                  </div>
                </td>

                {/* Archivo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {evaluacion.archivoUrl ? (
                    <a
                      href={evaluacion.archivoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Ver archivo
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      <FileText className="w-3 h-3" />
                      Sin archivo
                    </span>
                  )}
                </td>

                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === evaluacion.idComentario ? null : evaluacion.idComentario)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Menú desplegable */}
                    {menuOpen === evaluacion.idComentario && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setMenuOpen(null);
                              onEditar(evaluacion);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>

                          {evaluacion.archivoUrl && (
                            <a
                              href={evaluacion.archivoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setMenuOpen(null)}
                            >
                              <Eye className="w-4 h-4" />
                              Ver archivo
                            </a>
                          )}

                          <button
                            onClick={() => {
                              setMenuOpen(null);
                              onEliminar(evaluacion.idComentario);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer de la tabla */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {evaluaciones.length} evaluación{evaluaciones.length !== 1 ? 'es' : ''}
          </div>
          <div className="text-sm text-gray-500">
            Última actualización: {new Date().toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaEvaluaciones;