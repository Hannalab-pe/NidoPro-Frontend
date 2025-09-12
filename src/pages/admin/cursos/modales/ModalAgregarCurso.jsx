import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, BookOpen, Users, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ModalAgregarCurso = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombreCurso: '',
    descripcion: '',
    estaActivo: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCurso.trim()) {
      newErrors.nombreCurso = 'El nombre del curso es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Creando curso:', formData);

      await onSave(formData);

      // Limpiar formulario
      setFormData({
        nombreCurso: '',
        descripcion: '',
        estaActivo: true
      });
      setErrors({});

    } catch (error) {
      console.error('❌ Error al crear curso:', error);
      // El error ya está siendo manejado por el componente padre
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nombreCurso: '',
        descripcion: '',
        estaActivo: true
      });
      setErrors({});
      onClose();
    }
  };

  const inputClassName = (fieldError) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      fieldError ? 'border-red-300' : 'border-gray-300'
    }`;

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
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Crear Nuevo Curso
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Agrega un nuevo curso al sistema
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre del Curso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Curso *
                    </label>
                    <input
                      type="text"
                      name="nombreCurso"
                      value={formData.nombreCurso}
                      onChange={handleInputChange}
                      placeholder="Ej: Matemáticas"
                      className={inputClassName(errors.nombreCurso)}
                      disabled={loading}
                    />
                    {errors.nombreCurso && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.nombreCurso}
                      </div>
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
                      placeholder="Describe el contenido del curso..."
                      rows={3}
                      className={inputClassName(errors.descripcion)}
                      disabled={loading}
                    />
                    {errors.descripcion && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.descripcion}
                      </div>
                    )}
                  </div>

                  {/* Estado Activo */}
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="estaActivo"
                        checked={formData.estaActivo}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          estaActivo: e.target.checked
                        }))}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Curso activo
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Si está marcado, el curso estará disponible para matriculación
                    </p>
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
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        'Crear Curso'
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

export default ModalAgregarCurso;
