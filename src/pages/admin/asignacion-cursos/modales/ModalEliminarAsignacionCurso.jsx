import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDeleteAsignacionCurso } from 'src/hooks/queries/useAsignacionCursosQueries';

const ModalEliminarAsignacionCurso = ({ isOpen, onClose, onSuccess, asignacion }) => {
  const [errors, setErrors] = useState({});

  // Hook para eliminar asignación
  const deleteMutation = useDeleteAsignacionCurso();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!asignacion) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(asignacion.idAsignacionCurso);
      onSuccess();
    } catch (error) {
      console.error('Error eliminando asignación de curso:', error);
      setErrors({ submit: 'Error al eliminar la asignación. Por favor, inténtelo de nuevo.' });
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!asignacion) return null;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
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
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Eliminar Asignación de Curso
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar esta asignación?
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-4">
                  {/* Error general */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  {/* Alerta de confirmación */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          ¿Estás seguro?
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Esta acción eliminará la asignación del curso al docente. Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información de la asignación a eliminar */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Información de la asignación:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Docente:</span>
                        <span className="font-medium text-gray-900">
                          {asignacion.idTrabajador?.nombre} {asignacion.idTrabajador?.apellido}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Curso:</span>
                        <span className="font-medium text-gray-900">
                          {asignacion.idCurso?.nombreCurso || asignacion.idCurso?.nombre}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de asignación:</span>
                        <span className="font-medium text-gray-900">
                          {asignacion.fechaAsignacion ? new Date(asignacion.fechaAsignacion).toLocaleDateString('es-ES') : 'Sin fecha'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`font-medium ${asignacion.estaActivo ? 'text-green-600' : 'text-red-600'}`}>
                          {asignacion.estaActivo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {deleteMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar Asignación
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalEliminarAsignacionCurso;