import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, BookOpen, Users, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';

const ModalVerCurso = ({ isOpen, onClose, curso }) => {
  if (!curso) return null;

  const getEstadoColor = (estado) => {
    return estado === 'activo'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getEstadoIcon = (estado) => {
    return estado === 'activo'
      ? <CheckCircle className="w-4 h-4" />
      : <XCircle className="w-4 h-4" />;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Detalles del Curso
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Información completa del curso
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-6">
                  {/* Información básica */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <BookOpen className="w-5 h-5 text-gray-600" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        {curso.nombre}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">ID del Curso:</span>
                        <p className="font-medium text-gray-900">#{curso.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Grado:</span>
                        <p className="font-medium text-gray-900">{curso.grado}° Grado</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Capacidad Máxima:</span>
                        <p className="font-medium text-gray-900 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {curso.capacidadMaxima} estudiantes
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Estado:</span>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(curso.estado)}`}>
                            {getEstadoIcon(curso.estado)}
                            <span className="ml-1">
                              {curso.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {curso.descripcion || 'Sin descripción disponible'}
                      </p>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {curso.matriculados || 0}
                      </div>
                      <div className="text-sm text-blue-700">
                        Estudiantes Matriculados
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {curso.capacidadMaxima - (curso.matriculados || 0)}
                      </div>
                      <div className="text-sm text-green-700">
                        Cupos Disponibles
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {curso.profesores || 0}
                      </div>
                      <div className="text-sm text-purple-700">
                        Profesores Asignados
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Fecha de Creación:</span>
                        <p className="font-medium text-gray-900 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {curso.fechaCreacion
                            ? new Date(curso.fechaCreacion).toLocaleDateString('es-ES')
                            : 'No disponible'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Última Modificación:</span>
                        <p className="font-medium text-gray-900 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {curso.fechaModificacion
                            ? new Date(curso.fechaModificacion).toLocaleDateString('es-ES')
                            : 'No disponible'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón cerrar */}
                <div className="flex justify-end pt-6 border-t mt-6">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalVerCurso;
