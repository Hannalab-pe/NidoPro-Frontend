import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Loader2, AlertTriangle, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAulasHook } from '../../../../hooks/useAulas';

const ModalEliminarAula = ({ isOpen, onClose, aula }) => {
  const [loading, setLoading] = useState(false);
  const { deleteAula, deleting } = useAulasHook();

  const handleDelete = async () => {
    if (!aula?.idAula) {
      toast.error('No se pudo identificar el aula a eliminar');
      return;
    }

    setLoading(true);
    try {
      await deleteAula(aula.idAula);
      onClose();
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
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
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Eliminar Aula
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        ¿Estás seguro de que deseas eliminar el aula{' '}
                        <span className="font-semibold">Sección {aula?.seccion}</span>?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Esta acción no se puede deshacer. Se eliminará permanentemente el aula
                        y toda su información asociada.
                      </p>
                    </div>
                  </div>

                  {aula && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm">
                        <p><strong>Sección:</strong> {aula.seccion}</p>
                        <p><strong>Estudiantes:</strong> {aula.cantidadEstudiantes || 0}</p>
                        <p><strong>Ubicación:</strong> {aula.ubicacion || 'No especificada'}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Aula
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

export default ModalEliminarAula;
