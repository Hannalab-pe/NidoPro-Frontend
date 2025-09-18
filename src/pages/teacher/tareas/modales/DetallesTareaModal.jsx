import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
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
  Edit,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

const DetallesTareaModal = ({ isOpen, onClose, tarea }) => {
  const [activeTab, setActiveTab] = useState('detalles');

  if (!tarea) return null;

  // Función para formatear fechas
  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el estado de entrega
  const getEstadoEntrega = (entrega) => {
    if (entrega.realizoTarea) {
      return {
        label: 'Entregada',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      };
    } else {
      return {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertCircle
      };
    }
  };

  // Función para abrir archivo en nueva pestaña
  const abrirArchivo = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' />

      {/* Full-screen container to center the panel */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {tarea.titulo}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {tarea.idTarea}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('detalles')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'detalles'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Detalles de la Tarea
                    </button>
                    <button
                      onClick={() => setActiveTab('entregas')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'entregas'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Entregas ({tarea.entregas?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('informacion')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'informacion'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Información Adicional
                    </button>
                  </nav>
                </div>

                {/* Contenido de las tabs */}
                {activeTab === 'detalles' && (
                  <div className="space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Descripción</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {tarea.descripcion || 'Sin descripción'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Fecha de Asignación</label>
                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatFecha(tarea.fechaAsignacion)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Fecha de Entrega</label>
                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              {formatFecha(tarea.fechaEntrega)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">Estado</label>
                          <p className="mt-1 text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tarea.estado || 'Sin estado'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Información del aula */}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Aula Asignada</label>
                          <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                              <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {tarea.aulaInfo?.grado || 'Sin grado'} - {tarea.aulaInfo?.seccion || 'Sin sección'}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {tarea.aulaInfo?.cantidadEstudiantes || 0} estudiantes
                                </p>
                                {tarea.aulaInfo?.descripcion && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {tarea.aulaInfo.descripcion}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Archivo adjunto */}
                        {tarea.archivoUrl && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Archivo Adjunto</label>
                            <div className="mt-1 p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <PaperclipIcon className="w-5 h-5 text-green-600 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Archivo de la tarea</p>
                                    <p className="text-xs text-gray-600">Click para ver</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => abrirArchivo(tarea.archivoUrl)}
                                  className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span className="text-sm">Ver</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Estadísticas */}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Estadísticas</label>
                          <div className="mt-1 grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-lg font-semibold text-gray-900">{tarea.totalEstudiantes}</p>
                              <p className="text-xs text-gray-600">Total</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <p className="text-lg font-semibold text-green-900">{tarea.entregadas}</p>
                              <p className="text-xs text-green-600">Entregadas</p>
                            </div>
                            <div className="text-center p-2 bg-yellow-50 rounded">
                              <p className="text-lg font-semibold text-yellow-900">{tarea.pendientes}</p>
                              <p className="text-xs text-yellow-600">Pendientes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'entregas' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Entregas de Estudiantes</h4>

                    {tarea.entregas && tarea.entregas.length > 0 ? (
                      <div className="space-y-3">
                        {tarea.entregas.map((entrega) => {
                          const estadoInfo = getEstadoEntrega(entrega);
                          const EstadoIcon = estadoInfo.icon;

                          return (
                            <div key={entrega.idTareaEntrega} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <User className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {entrega.idEstudiante2?.nombre} {entrega.idEstudiante2?.apellido}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {entrega.idEstudiante2?.tipoDocumento}: {entrega.idEstudiante2?.nroDocumento}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
                                    <EstadoIcon className="w-3 h-3 mr-1" />
                                    {estadoInfo.label}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Fecha de entrega esperada</p>
                                  <p className="text-sm text-gray-900">{formatFecha(tarea.fechaEntrega)}</p>
                                </div>
                                {entrega.fechaEntrega && (
                                  <div>
                                    <p className="text-xs text-gray-500">Fecha de entrega real</p>
                                    <p className="text-sm text-gray-900">{formatFecha(entrega.fechaEntrega)}</p>
                                  </div>
                                )}
                              </div>

                              {entrega.archivoUrl && (
                                <div className="mt-3">
                                  <button
                                    onClick={() => abrirArchivo(entrega.archivoUrl)}
                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                                  >
                                    <PaperclipIcon className="w-4 h-4" />
                                    <span className="text-sm">Ver archivo entregado</span>
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                              )}

                              {entrega.observaciones && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500">Observaciones</p>
                                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {entrega.observaciones}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay entregas registradas aún</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'informacion' && (
                  <div className="space-y-6">
                    {/* Información del profesor */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Profesor</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Nombre</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea.trabajadorInfo?.nombre || 'No especificado'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Rol</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea.trabajadorInfo?.rol || 'No especificado'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Correo</label>
                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {tarea.trabajadorInfo?.correo || 'No especificado'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">ID del Profesor</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea.trabajadorInfo?.idTrabajador || 'No especificado'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información adicional de la tarea */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Información Técnica</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">ID de la Tarea</label>
                            <p className="mt-1 text-sm text-gray-900 font-mono">
                              {tarea.idTarea}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">ID del Aula</label>
                            <p className="mt-1 text-sm text-gray-900 font-mono">
                              {tarea.aulaInfo?.idAula || 'No especificado'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Prioridad</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea.prioridad || 'No especificada'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Estado Actual</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea.estado || 'No especificado'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DetallesTareaModal;
