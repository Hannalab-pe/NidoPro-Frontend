import React, { useState, useEffect } from 'react';
import { X, Settings, Loader2 } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'sonner';

const GenerarBimestresModal = ({ isOpen, onClose }) => {
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);

  // Obtener períodos escolares al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchPeriodos();
    }
  }, [isOpen]);

  const fetchPeriodos = async () => {
    try {
      setLoadingPeriodos(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;

      const response = await fetch(`${API_BASE_URL}/periodo-escolar`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener períodos escolares');
      }

      const result = await response.json();

      if (result.success && result.periodos) {
        setPeriodos(result.periodos);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error fetching periodos:', error);
      toast.error('Error al cargar los períodos escolares');
    } finally {
      setLoadingPeriodos(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPeriodo) {
      toast.error('Por favor selecciona un período escolar');
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;

      const response = await fetch(`${API_BASE_URL}/bimestre/generar-automaticos/${selectedPeriodo}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar bimestres');
      }

      const result = await response.json();

      toast.success('Bimestres generados exitosamente');
      onClose();

      // Reset form
      setSelectedPeriodo('');

    } catch (error) {
      console.error('Error generating bimestres:', error);
      toast.error(error.message || 'Error al generar bimestres');
    } finally {
      setLoading(false);
    }
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-25" />
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
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Settings className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Generar Bimestres
                      </h3>
                      <p className="text-sm text-gray-600">
                        Selecciona un período para generar bimestres automáticamente
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Selector de Período */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período Escolar
                    </label>
                    <select
                      value={selectedPeriodo}
                      onChange={(e) => setSelectedPeriodo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      disabled={loadingPeriodos}
                    >
                      <option value="">
                        {loadingPeriodos ? 'Cargando períodos...' : 'Selecciona un período'}
                      </option>
                      {periodos.map((periodo) => (
                        <option key={periodo.idPeriodoEscolar} value={periodo.idPeriodoEscolar}>
                          {periodo.descripcion} ({periodo.anioEscolar})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Información del período seleccionado */}
                  {selectedPeriodo && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      {(() => {
                        const periodo = periodos.find(p => p.idPeriodoEscolar === selectedPeriodo);
                        return periodo ? (
                          <div className="text-sm text-purple-800">
                            <p><strong>Año:</strong> {periodo.anioEscolar}</p>
                            <p><strong>Inicio:</strong> {new Date(periodo.fechaInicio).toLocaleDateString('es-ES')}</p>
                            <p><strong>Fin:</strong> {new Date(periodo.fechaFin).toLocaleDateString('es-ES')}</p>
                            <p><strong>Estado:</strong> {periodo.estaActivo ? 'Activo' : 'Inactivo'}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !selectedPeriodo || loadingPeriodos}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{loading ? 'Generando...' : 'Generar Bimestres'}</span>
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

export default GenerarBimestresModal;