import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Edit } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useActualizarPeriodoEscolar } from '../../../../hooks/queries/usePeriodoEscolarQueries';
import { toast } from 'sonner';

const EditarPeriodoModal = ({ isOpen, onClose, periodo }) => {
  const [formData, setFormData] = useState({
    anioEscolar: '',
    fechaInicio: '',
    fechaFin: '',
    estaActivo: true,
    descripcion: ''
  });

  const actualizarPeriodoMutation = useActualizarPeriodoEscolar();

  // Cargar datos del período cuando se abre el modal
  useEffect(() => {
    if (isOpen && periodo) {
      setFormData({
        anioEscolar: periodo.anioEscolar || '',
        fechaInicio: periodo.fechaInicio || '',
        fechaFin: periodo.fechaFin || '',
        estaActivo: periodo.estaActivo ?? true,
        descripcion: periodo.descripcion || ''
      });
    }
  }, [isOpen, periodo]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await actualizarPeriodoMutation.mutateAsync({
        id: periodo.idPeriodoEscolar,
        periodoData: formData
      });

      onClose();
    } catch (error) {
      console.error('Error:', error);
      // El error ya se maneja en el hook
    }
  };

  if (!isOpen || !periodo) return null;

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
          <div className="fixed inset-0 bg-black/20" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Edit className="w-6 h-6 text-orange-600" />
                    </div>
                    <Dialog.Title as="h2" className="text-xl font-bold text-gray-900">
                      Editar Período Escolar
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Año Escolar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año Escolar *
                    </label>
                    <input
                      type="number"
                      name="anioEscolar"
                      value={formData.anioEscolar}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="2025"
                      required
                    />
                  </div>

                  {/* Fecha Inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Fecha Fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={formData.fechaFin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Estado Activo */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="estaActivo"
                      checked={formData.estaActivo}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Período activo
                    </label>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Descripción del período escolar"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      disabled={actualizarPeriodoMutation.isPending}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={actualizarPeriodoMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {actualizarPeriodoMutation.isPending ? (
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

export default EditarPeriodoModal;