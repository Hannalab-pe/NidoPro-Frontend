import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar, Clock, Users, BookOpen, CheckCircle, Plus } from 'lucide-react';
import { useAulasAdmin } from '../../../../hooks/queries/useAulasQueries';
import { useAuthStore } from '../../../../store';

const ModalAgregarActividad = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    nombreActividad: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    idAulas: [],
    idTrabajador: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectAllAulas, setSelectAllAulas] = useState(false);

  // Debug logs
  console.log('🏫 Datos del usuario:', { 
    entidadId: user?.entidadId, 
    fullUserData: user 
  });
  console.log('🏫 localStorage entidadId:', localStorage.getItem('entidadId'));
  console.log('🏫 formData.idTrabajador:', formData.idTrabajador);

  // Obtener todas las aulas disponibles
  const {
    data: aulasData = [],
    isLoading: loadingAulas
  } = useAulasAdmin();

  // Extraer el array de aulas de la respuesta
  const aulas = Array.isArray(aulasData) ? aulasData :
               aulasData?.data ? aulasData.data :
               aulasData?.info?.data ? aulasData.info.data : [];

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombreActividad: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        idAulas: [],
        idTrabajador: user?.entidadId || ''
      });
      setErrors({});
      setSelectAllAulas(false);
    }
  }, [isOpen, user]);

  // Asegurar que idTrabajador se setee cuando el usuario esté disponible
  useEffect(() => {
    if (user?.entidadId && isOpen) {
      setFormData(prev => ({
        ...prev,
        idTrabajador: user.entidadId
      }));
    } else if (!user?.entidadId && isOpen) {
      // Fallback a localStorage si no está en el store
      const entidadId = localStorage.getItem('entidadId');
      if (entidadId) {
        setFormData(prev => ({
          ...prev,
          idTrabajador: entidadId
        }));
      }
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAulaToggle = (aulaId) => {
    setFormData(prev => ({
      ...prev,
      idAulas: prev.idAulas.includes(aulaId)
        ? prev.idAulas.filter(id => id !== aulaId)
        : [...prev.idAulas, aulaId]
    }));
  };

  const handleSelectAllAulas = () => {
    if (selectAllAulas) {
      setFormData(prev => ({
        ...prev,
        idAulas: []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        idAulas: aulas.map(aula => aula.idAula)
      }));
    }
    setSelectAllAulas(!selectAllAulas);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreActividad.trim()) {
      newErrors.nombreActividad = 'El nombre de la actividad es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria';
    }

    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaInicio) > new Date(formData.fechaFin)) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (formData.idAulas.length === 0) {
      newErrors.idAulas = 'Debe seleccionar al menos un aula';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Creando actividad:', formData);
      console.log('🚀 idTrabajador en formData:', formData.idTrabajador);

      await onSave(formData);
    } catch (error) {
      console.error('❌ Error al crear actividad:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = (fieldName) => `
    w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${errors[fieldName] ? 'border-red-300' : 'border-gray-300'}
  `;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Agregar Nueva Actividad
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Crea una actividad para una o varias aulas
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre de la actividad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Actividad *
                    </label>
                    <input
                      type="text"
                      name="nombreActividad"
                      value={formData.nombreActividad}
                      onChange={handleInputChange}
                      className={inputClassName('nombreActividad')}
                      placeholder="Ej: Reunión de padres, Evaluación, etc."
                    />
                    {errors.nombreActividad && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombreActividad}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className={inputClassName('descripcion')}
                      placeholder="Describe la actividad..."
                    />
                    {errors.descripcion && (
                      <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                    )}
                  </div>

                  {/* Fechas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleInputChange}
                        className={inputClassName('fechaInicio')}
                      />
                      {errors.fechaInicio && (
                        <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Fin *
                      </label>
                      <input
                        type="date"
                        name="fechaFin"
                        value={formData.fechaFin}
                        onChange={handleInputChange}
                        className={inputClassName('fechaFin')}
                      />
                      {errors.fechaFin && (
                        <p className="mt-1 text-sm text-red-600">{errors.fechaFin}</p>
                      )}
                    </div>
                  </div>

                  {/* Selección de Aulas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Aulas *
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectAllAulas}
                        className="text-sm text-blue-600 hover:text-blue-800"
                        disabled={loadingAulas}
                      >
                        {selectAllAulas ? 'Deseleccionar todas' : 'Seleccionar todas'}
                      </button>
                    </div>

                    {loadingAulas ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Cargando aulas...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {aulas.map((aula) => (
                          <label key={aula.idAula} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.idAulas.includes(aula.idAula)}
                              onChange={() => handleAulaToggle(aula.idAula)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {aula.seccion} - {aula.cantidadEstudiantes} estudiantes
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {errors.idAulas && (
                      <p className="mt-1 text-sm text-red-600">{errors.idAulas}</p>
                    )}

                    {formData.idAulas.length > 0 && (
                      <p className="mt-2 text-sm text-blue-600">
                        {formData.idAulas.length} aula{formData.idAulas.length !== 1 ? 's' : ''} seleccionada{formData.idAulas.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      disabled={loading}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Crear Actividad
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

export default ModalAgregarActividad;