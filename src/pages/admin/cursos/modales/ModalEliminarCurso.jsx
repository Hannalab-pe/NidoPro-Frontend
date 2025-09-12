import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

const ModalEliminarCurso = ({ isOpen, onClose, onConfirm, curso }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!curso) return;

    try {
      setLoading(true);
      console.log('🗑️ Eliminando curso:', curso.id);

      await onConfirm(curso.id);

    } catch (error) {
      console.error('❌ Error al eliminar curso:', error);
      // El error ya está siendo manejado por el componente padre
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!curso) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Eliminar Curso
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Esta acción no se puede deshacer
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        ¿Estás seguro de que deseas eliminar el curso{' '}
                        <span className="font-semibold text-gray-900">
                          "{curso.nombre}"
                        </span>
                        ?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Esta acción eliminará permanentemente el curso y toda su información asociada.
                        Los estudiantes matriculados en este curso podrían verse afectados.
                      </p>
                    </div>
                  </div>

                  {/* Información del curso */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium text-gray-900">{curso.nombre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Grado:</span>
                      <span className="font-medium text-gray-900">{curso.grado}°</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacidad:</span>
                      <span className="font-medium text-gray-900">{curso.capacidadMaxima} estudiantes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-medium ${curso.estado === 'activo' ? 'text-green-600' : 'text-red-600'}`}>
                        {curso.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Curso
                      </>
                    )}
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

export default ModalEliminarCurso;
