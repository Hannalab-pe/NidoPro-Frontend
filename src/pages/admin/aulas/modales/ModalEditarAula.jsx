import React, { useState, useEffect } from 'react';
import { X, Users, Save } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useUpdateAula } from '../../../../hooks/queries/useAulasQueries';
import { toast } from 'sonner';

const ModalEditarAula = ({ isOpen, onClose, aula }) => {
  const [cantidadEstudiantes, setCantidadEstudiantes] = useState('');

  const updateAulaMutation = useUpdateAula();

  // Cargar datos del aula cuando se abre el modal
  useEffect(() => {
    if (isOpen && aula) {
      setCantidadEstudiantes(aula.cantidadEstudiantes || 0);
    }
  }, [isOpen, aula]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aula?.idAula) {
      toast.error('Error: No se pudo identificar el aula');
      return;
    }

    try {
      await updateAulaMutation.mutateAsync({
        id: aula.idAula,
        cantidadEstudiantes: parseInt(cantidadEstudiantes) || 0
      });

      toast.success('Aula actualizada exitosamente', {
        description: `Capacidad máxima actualizada a ${cantidadEstudiantes}`
      });

      onClose();
    } catch (error) {
      console.error('Error al actualizar aula:', error);
      toast.error('Error al actualizar aula', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    }
  };

  const handleClose = () => {
    setCantidadEstudiantes('');
    onClose();
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
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Editar Capacidad Máxima
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Aula Sección {aula?.seccion}
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidad Máxima
                    </label>
                    <input
                      type="number"
                      value={cantidadEstudiantes}
                      onChange={(e) => setCantidadEstudiantes(e.target.value)}
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Capacidad actual: {aula?.cantidadEstudiantes || 0}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      disabled={updateAulaMutation.isPending}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={updateAulaMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateAulaMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Actualizar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalEditarAula;
