import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  PaperclipIcon, 
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Star,
  MessageSquare,
  Eye,
  Upload,
  Edit
} from 'lucide-react';

const DetallesTareaModal = ({ isOpen, onClose, tarea }) => {
  const [activeTab, setActiveTab] = useState('detalles');

  // Datos simulados de entregas de estudiantes
  const entregas = [
    {
      id: 1,
      estudiante: 'Ana García Pérez',
      fechaEntrega: '2024-03-20 14:30',
      estado: 'entregada',
      calificacion: 18,
      comentarios: 'Excelente trabajo, muy completo.',
      archivos: ['tarea_ana_garcia.pdf'],
      esATiempo: true
    },
    {
      id: 2,
      estudiante: 'Carlos Mendoza López',
      fechaEntrega: '2024-03-21 09:15',
      estado: 'entregada',
      calificacion: 16,
      comentarios: 'Buen trabajo, pero falta desarrollo en la pregunta 3.',
      archivos: ['ejercicios_carlos.pdf'],
      esATiempo: true
    },
    {
      id: 3,
      estudiante: 'María Rodríguez Silva',
      fechaEntrega: null,
      estado: 'pendiente',
      calificacion: null,
      comentarios: '',
      archivos: [],
      esATiempo: false
    },
    {
      id: 4,
      estudiante: 'Luis Fernández Castro',
      fechaEntrega: '2024-03-22 16:45',
      estado: 'revision',
      calificacion: null,
      comentarios: '',
      archivos: ['tarea_luis.docx', 'anexo.jpg'],
      esATiempo: false
    }
  ];

  if (!isOpen || !tarea) return null;

  const getEstadoInfo = (estado) => {
    switch (estado) {
      case 'activa':
        return {
          label: 'Activa',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'vencida':
        return {
          label: 'Vencida',
          color: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      case 'borrador':
        return {
          label: 'Borrador',
          color: 'bg-gray-100 text-gray-800',
          icon: FileText
        };
      default:
        return {
          label: 'Sin estado',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle
        };
    }
  };

  const getEstadoEntrega = (entrega) => {
    switch (entrega.estado) {
      case 'entregada':
        return {
          label: 'Entregada',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'pendiente':
        return {
          label: 'Pendiente',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'revision':
        return {
          label: 'En Revisión',
          color: 'bg-blue-100 text-blue-800',
          icon: Eye
        };
      default:
        return {
          label: 'Sin estado',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle
        };
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'text-red-600';
      case 'media':
        return 'text-yellow-600';
      case 'baja':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFechaCorta = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const estadoInfo = getEstadoInfo(tarea.estado);
  const EstadoIcon = estadoInfo.icon;

  const porcentajeProgreso = Math.round((tarea.entregadas / tarea.totalEstudiantes) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{tarea.titulo}</h2>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
                <EstadoIcon className="w-3 h-3 mr-1" />
                {estadoInfo.label}
              </span>
              <span className={`text-sm font-medium ${getPrioridadColor(tarea.prioridad)}`}>
                ● Prioridad {tarea.prioridad.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                {tarea.materia} - {tarea.grado}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('detalles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'detalles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detalles de la Tarea
            </button>
            <button
              onClick={() => setActiveTab('entregas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'entregas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Entregas ({tarea.entregadas}/{tarea.totalEstudiantes})
            </button>
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'estadisticas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estadísticas
            </button>
          </nav>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'detalles' && (
            <div className="space-y-6">
              {/* Información principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Descripción</h3>
                    <p className="text-gray-700">{tarea.descripcion}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Materia</h4>
                      <div className="flex items-center text-gray-700">
                        <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                        {tarea.materia}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Aula</h4>
                      <div className="flex items-center text-gray-700">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {tarea.aula}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Fecha de Creación</h4>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatFechaCorta(tarea.fechaCreacion)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Fecha de Vencimiento</h4>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatFechaCorta(tarea.fechaVencimiento)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progreso */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Progreso de Entrega</h3>
                    <div className="bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${porcentajeProgreso}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{tarea.entregadas} de {tarea.totalEstudiantes} estudiantes</span>
                      <span>{porcentajeProgreso}%</span>
                    </div>
                  </div>

                  {/* Estadísticas rápidas */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-700">{tarea.entregadas}</div>
                      <div className="text-xs text-green-600">Entregadas</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-yellow-700">{tarea.pendientes}</div>
                      <div className="text-xs text-yellow-600">Pendientes</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-700">{tarea.calificadas}</div>
                      <div className="text-xs text-blue-600">Calificadas</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instrucciones */}
              {tarea.instrucciones && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Instrucciones</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{tarea.instrucciones}</p>
                  </div>
                </div>
              )}

              {/* Archivos adjuntos */}
              {tarea.archivosAdjuntos && tarea.archivosAdjuntos.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Archivos Adjuntos</h3>
                  <div className="space-y-2">
                    {tarea.archivosAdjuntos.map((archivo, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center">
                          <PaperclipIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{archivo}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'entregas' && (
            <div className="space-y-4">
              {/* Filtros de entregas */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Lista de Entregas</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                    <option>Todos los estados</option>
                    <option>Entregadas</option>
                    <option>Pendientes</option>
                    <option>En revisión</option>
                  </select>
                </div>
              </div>

              {/* Lista de entregas */}
              <div className="space-y-3">
                {entregas.map((entrega) => {
                  const estadoEntrega = getEstadoEntrega(entrega);
                  const EstadoEntregaIcon = estadoEntrega.icon;

                  return (
                    <div key={entrega.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="font-medium text-gray-900">{entrega.estudiante}</span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoEntrega.color}`}>
                              <EstadoEntregaIcon className="w-3 h-3 mr-1" />
                              {estadoEntrega.label}
                            </span>
                            {!entrega.esATiempo && entrega.fechaEntrega && (
                              <span className="text-xs text-red-600 font-medium">Entrega tardía</span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Fecha de entrega:</span>
                              <span className="ml-1">
                                {entrega.fechaEntrega ? formatFecha(entrega.fechaEntrega) : 'No entregado'}
                              </span>
                            </div>
                            {entrega.calificacion && (
                              <div>
                                <span className="font-medium">Calificación:</span>
                                <span className="ml-1 font-bold text-blue-600">{entrega.calificacion}/20</span>
                              </div>
                            )}
                          </div>

                          {entrega.comentarios && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-gray-700">Comentarios:</span>
                              <p className="text-sm text-gray-600 mt-1">{entrega.comentarios}</p>
                            </div>
                          )}

                          {entrega.archivos.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-gray-700">Archivos:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {entrega.archivos.map((archivo, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                    <PaperclipIcon className="w-3 h-3 mr-1" />
                                    {archivo}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2 ml-4">
                          {entrega.estado === 'entregada' && (
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          {entrega.estado === 'revision' && (
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'estadisticas' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Estadísticas Detalladas</h3>
              
              {/* Métricas principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Tasa de Entrega</p>
                      <p className="text-2xl font-bold text-blue-700">{porcentajeProgreso}%</p>
                    </div>
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Promedio Calificaciones</p>
                      <p className="text-2xl font-bold text-green-700">17.2</p>
                    </div>
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600">Entregas a Tiempo</p>
                      <p className="text-2xl font-bold text-yellow-700">85%</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Calificadas</p>
                      <p className="text-2xl font-bold text-purple-700">{Math.round((tarea.calificadas / tarea.totalEstudiantes) * 100)}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Distribución de calificaciones */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Distribución de Calificaciones</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">18-20 (Excelente)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">15-17 (Bueno)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">11-14 (Regular)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">0-10 (Deficiente)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análisis temporal */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Análisis de Entregas por Día</h4>
                <div className="text-sm text-gray-600">
                  <p>• Primer día: 8 entregas (32%)</p>
                  <p>• Segundo día: 6 entregas (24%)</p>
                  <p>• Último día: 4 entregas (16%)</p>
                  <p>• Entregas tardías: 2 entregas (8%)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Creada el {formatFechaCorta(tarea.fechaCreacion)} • Vence el {formatFechaCorta(tarea.fechaVencimiento)}
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Edit className="w-4 h-4" />
              <span>Editar Tarea</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesTareaModal;
