import React, { useState } from 'react';
import { Check, X, Clock, Calendar } from 'lucide-react';

const TablaAsistencia = ({ 
  asistencias = [], 
  onMarcarPresente,
  onMarcarAusente,
  onMarcarTarde,
  fecha = new Date().toISOString().split('T')[0],
  clase = '',
  isLoading = false 
}) => {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  const estudiantesFiltrados = React.useMemo(() => {
    if (filtroEstado === 'todos') return asistencias;
    return asistencias.filter(asistencia => asistencia.estado === filtroEstado);
  }, [asistencias, filtroEstado]);

  const estadisticas = React.useMemo(() => {
    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === 'presente').length;
    const ausentes = asistencias.filter(a => a.estado === 'ausente').length;
    const tardes = asistencias.filter(a => a.estado === 'tarde').length;
    
    return {
      total,
      presentes,
      ausentes,
      tardes,
      porcentajeAsistencia: total > 0 ? Math.round((presentes / total) * 100) : 0
    };
  }, [asistencias]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header con información de la clase y fecha */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Control de Asistencia</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(fecha).toLocaleDateString('es-ES')}
            </div>
            {clase && (
              <div className="font-medium">
                Clase: {clase}
              </div>
            )}
          </div>
        </div>
        
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{estadisticas.presentes}</div>
            <div className="text-xs text-gray-500">Presentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.tardes}</div>
            <div className="text-xs text-gray-500">Tardes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{estadisticas.ausentes}</div>
            <div className="text-xs text-gray-500">Ausentes</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex space-x-2">
          {['todos', 'presente', 'ausente', 'tarde'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                filtroEstado === estado
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {estudiantesFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">No hay estudiantes para mostrar</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora Llegada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estudiantesFiltrados.map((asistencia) => (
                <tr key={asistencia.estudianteId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={asistencia.estudiante?.avatar || `https://ui-avatars.com/api/?name=${asistencia.estudiante?.nombre}&background=0D8ABC&color=fff`}
                          alt={asistencia.estudiante?.nombre}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {asistencia.estudiante?.nombre} {asistencia.estudiante?.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {asistencia.estudianteId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      asistencia.estado === 'presente' 
                        ? 'bg-green-100 text-green-800'
                        : asistencia.estado === 'tarde'
                        ? 'bg-yellow-100 text-yellow-800'
                        : asistencia.estado === 'ausente'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {asistencia.estado === 'presente' && <Check className="h-3 w-3 mr-1" />}
                      {asistencia.estado === 'tarde' && <Clock className="h-3 w-3 mr-1" />}
                      {asistencia.estado === 'ausente' && <X className="h-3 w-3 mr-1" />}
                      {asistencia.estado || 'Sin marcar'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {asistencia.horaLlegada || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">
                      {asistencia.observaciones || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onMarcarPresente && onMarcarPresente(asistencia.estudianteId)}
                        className={`p-1 rounded-md ${
                          asistencia.estado === 'presente'
                            ? 'bg-green-100 text-green-700'
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                        title="Marcar presente"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onMarcarTarde && onMarcarTarde(asistencia.estudianteId)}
                        className={`p-1 rounded-md ${
                          asistencia.estado === 'tarde'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                        }`}
                        title="Marcar tarde"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onMarcarAusente && onMarcarAusente(asistencia.estudianteId)}
                        className={`p-1 rounded-md ${
                          asistencia.estado === 'ausente'
                            ? 'bg-red-100 text-red-700'
                            : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                        }`}
                        title="Marcar ausente"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Resumen en el footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            Asistencia: {estadisticas.porcentajeAsistencia}% 
            ({estadisticas.presentes}/{estadisticas.total} presentes)
          </div>
          <div className="text-gray-500">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaAsistencia;
