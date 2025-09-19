import React, { useState, useEffect } from 'react';
import { X, DollarSign, Settings, Save } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'sonner';

const GenerarPensionesModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    anioEscolar: new Date().getFullYear(),
    diaVencimientoPersonalizado: 15,
    descripcion: '',
    regenerarExistentes: false,
    aplicarDescuentosPagoAdelantado: false
  });
  const [loading, setLoading] = useState(false);
  const [entidadId, setEntidadId] = useState('');

  useEffect(() => {
    // Obtener entidadId del localStorage (auth-storage)
    const persistedState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const userEntidadId = persistedState?.state?.user?.entidadId;

    console.log('🔍 Estado persistido:', persistedState);
    console.log('👤 Usuario:', persistedState?.state?.user);
    console.log('🆔 EntidadId encontrado:', userEntidadId);

    // Si no está en user.entidadId, intentar obtenerlo del token JWT
    let finalEntidadId = userEntidadId;

    if (!finalEntidadId) {
      const token = persistedState?.state?.token || localStorage.getItem('token');
      if (token && token !== 'null') {
        try {
          // Decodificar JWT para obtener entidadId
          const payload = JSON.parse(atob(token.split('.')[1]));
          finalEntidadId = payload.entidadId || payload.entidad_id || payload.entityId;
          console.log('🔑 EntidadId del JWT:', finalEntidadId);
        } catch (error) {
          console.error('❌ Error decodificando JWT:', error);
        }
      }
    }

    if (finalEntidadId) {
      setEntidadId(finalEntidadId);
    } else {
      console.error('❌ No se pudo encontrar entidadId ni en localStorage ni en JWT');
      toast.error('No se pudo obtener la información del usuario. Verifica que estés logueado correctamente.');
      onClose();
      return;
    }

    // Actualizar descripción por defecto
    setFormData(prev => ({
      ...prev,
      descripcion: `Generación automática de pensiones para el año escolar ${new Date().getFullYear()}`
    }));
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        registradoPorId: entidadId
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/pension-estudiante/configurar-anio-escolar-optimizada?registradoPorId=${entidadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al generar las pensiones');
      }

      const result = await response.json();

      toast.success('Pensiones generadas exitosamente');
      onClose();

      // Reset form
      setFormData({
        anioEscolar: new Date().getFullYear(),
        diaVencimientoPersonalizado: 15,
        descripcion: `Generación automática de pensiones para el año escolar ${new Date().getFullYear()}`,
        regenerarExistentes: false,
        aplicarDescuentosPagoAdelantado: false
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al generar las pensiones');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <Dialog.Title as="h2" className="text-xl font-bold text-gray-900">
                      Generar Pensiones
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Año Escolar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año Escolar
                    </label>
                    <input
                      type="number"
                      name="anioEscolar"
                      value={formData.anioEscolar}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="2024"
                      required
                    />
                  </div>

                  {/* Día Vencimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Día de Vencimiento
                    </label>
                    <input
                      type="number"
                      name="diaVencimientoPersonalizado"
                      value={formData.diaVencimientoPersonalizado}
                      onChange={handleInputChange}
                      min="1"
                      max="31"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Descripción de la generación..."
                      required
                    />
                  </div>

                  {/* Regenerar Existentes */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="regenerarExistentes"
                      checked={formData.regenerarExistentes}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Regenerar pensiones existentes
                    </label>
                  </div>

                  {/* Aplicar Descuentos */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="aplicarDescuentosPagoAdelantado"
                      checked={formData.aplicarDescuentosPagoAdelantado}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Aplicar descuentos por pago adelantado
                    </label>
                  </div>



                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Generando...' : 'Generar'}</span>
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

export default GenerarPensionesModal;