import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Loader2, CheckCircle, School, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAulasHook } from '../../../../hooks/useAulas';
import { useGradosOptions } from '../../../../hooks/useGrados';

const ModalEditarAula = ({ isOpen, onClose, aula }) => {
  const [form, setForm] = useState({
    seccion: '',
    cantidadEstudiantes: '',
    descripcion: '',
    ubicacion: '',
    equipamiento: '',
    idGrado: ''
  });
  const [loading, setLoading] = useState(false);
  const { updateAula, updating } = useAulasHook();
  const { options: gradosOptions, isLoading: loadingGrados } = useGradosOptions();

  // Cargar datos del aula cuando se abre el modal
  useEffect(() => {
    if (aula && isOpen) {
      setForm({
        seccion: aula.seccion || '',
        cantidadEstudiantes: aula.cantidadEstudiantes?.toString() || '',
        descripcion: aula.descripcion || '',
        ubicacion: aula.ubicacion || '',
        equipamiento: aula.equipamiento || '',
        idGrado: aula.idGrado || ''
      });
    }
  }, [aula, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aula?.idAula) {
      toast.error('No se pudo identificar el aula a actualizar');
      return;
    }

    // Validaciones
    if (!form.seccion.trim()) {
      toast.error('La sección es requerida');
      return;
    }

    if (!form.cantidadEstudiantes || isNaN(form.cantidadEstudiantes) || Number(form.cantidadEstudiantes) < 0) {
      toast.error('La cantidad de estudiantes debe ser un número válido mayor o igual a 0');
      return;
    }

    if (!form.idGrado) {
      toast.error('Debe seleccionar un grado');
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para enviar
      const aulaData = {
        seccion: form.seccion.trim(),
        cantidadEstudiantes: Number(form.cantidadEstudiantes),
        descripcion: form.descripcion.trim(),
        ubicacion: form.ubicacion.trim(),
        equipamiento: form.equipamiento.trim(),
        idGrado: form.idGrado
      };

      await updateAula(aula.idAula, aulaData);
      onClose();
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setForm({
        seccion: '',
        cantidadEstudiantes: '',
        descripcion: '',
        ubicacion: '',
        equipamiento: '',
        idGrado: ''
      });
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <School className="w-5 h-5 mr-2 text-blue-600" />
                    Editar Aula
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-1">
                        Sección *
                      </label>
                      <input
                        type="text"
                        id="seccion"
                        name="seccion"
                        value={form.seccion}
                        onChange={handleChange}
                        placeholder="Ej: A, B, C"
                        required
                        disabled={loading}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label htmlFor="cantidadEstudiantes" className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad de Estudiantes *
                      </label>
                      <input
                        type="number"
                        id="cantidadEstudiantes"
                        name="cantidadEstudiantes"
                        value={form.cantidadEstudiantes}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        required
                        disabled={loading}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Selector de Grado */}
                  <div>
                    <label htmlFor="idGrado" className="block text-sm font-medium text-gray-700 mb-1">
                      Grado Académico *
                    </label>
                    <div className="relative">
                      <select
                        id="idGrado"
                        name="idGrado"
                        value={form.idGrado}
                        onChange={handleChange}
                        required
                        disabled={loading || loadingGrados}
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white"
                      >
                        <option value="">
                          {loadingGrados ? 'Cargando grados...' : 'Seleccione un grado'}
                        </option>
                        {gradosOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        id="ubicacion"
                        name="ubicacion"
                        value={form.ubicacion}
                        onChange={handleChange}
                        placeholder="Ej: Primer piso, Edificio A"
                        disabled={loading}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Descripción del aula..."
                      disabled={loading}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Equipamiento */}
                  <div>
                    <label htmlFor="equipamiento" className="block text-sm font-medium text-gray-700 mb-1">
                      Equipamiento
                    </label>
                    <textarea
                      id="equipamiento"
                      name="equipamiento"
                      value={form.equipamiento}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Proyector, pizarra digital, computadoras..."
                      disabled={loading}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !form.seccion || !form.cantidadEstudiantes || !form.idGrado}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Actualizar Aula
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
