import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  X, 
  User, 
  Phone, 
  IdCard,
  ContactRound,
  Save,
  Loader2
} from 'lucide-react';
import FormField from '../../../../components/common/FormField';

// Schema de validación
const estudianteSchema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
  apellido: yup.string().required('El apellido es obligatorio'),
  numeroDocumento: yup.string().required('El número de documento es obligatorio'),
  tipoDocumento: yup.string().required('El tipo de documento es obligatorio'),
  contactoEmergencia: yup.string(),
  numeroEmergencia: yup.string(),
  observaciones: yup.string()
});

const ModalEditarEstudiante = ({ isOpen, onClose, estudiante, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(estudianteSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      numeroDocumento: '',
      tipoDocumento: 'DNI',
      contactoEmergencia: '',
      numeroEmergencia: '',
      observaciones: ''
    }
  });

  // Cargar datos del estudiante cuando se abra el modal
  useEffect(() => {
    if (isOpen && estudiante) {
      console.log('📝 Cargando datos del estudiante para edición:', estudiante);
      
      setValue('nombre', estudiante.nombre || '');
      setValue('apellido', estudiante.apellido || '');
      setValue('numeroDocumento', estudiante.numeroDocumento || '');
      setValue('tipoDocumento', estudiante.tipoDocumento || 'DNI');
      setValue('contactoEmergencia', estudiante.contactoEmergencia || '');
      setValue('numeroEmergencia', estudiante.numeroEmergencia || '');
      setValue('observaciones', estudiante.observaciones || '');
    }
  }, [isOpen, estudiante, setValue]);

  // Función handleClose que respeta el ciclo de vida del componente
  const handleClose = () => {
    reset();
    setIsSubmitting(false);
    onClose();
  };

  // Función para manejar el submit del formulario
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log('📝 Datos del formulario de edición:', data);
      console.log('👤 Estudiante original:', estudiante);

      // TODO: Aquí iría la llamada a la API para actualizar el estudiante
      // Por ahora simulamos una operación exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ Estudiante actualizado exitosamente');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error al actualizar estudiante:', error);
      // TODO: Mostrar mensaje de error al usuario
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!estudiante) return null;

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
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                      Editar Estudiante
                    </Dialog.Title>
                    <p className="text-gray-600 mt-1">
                      Modifica la información del estudiante {estudiante.nombre} {estudiante.apellido}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    <span className="sr-only">Cerrar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Información Personal */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Información Personal
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre" required error={errors.nombre?.message}>
                        <input
                          type="text"
                          {...register('nombre')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese el nombre"
                          disabled={isSubmitting}
                        />
                      </FormField>

                      <FormField label="Apellido" required error={errors.apellido?.message}>
                        <input
                          type="text"
                          {...register('apellido')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese el apellido"
                          disabled={isSubmitting}
                        />
                      </FormField>

                      <FormField label="Tipo de Documento" required error={errors.tipoDocumento?.message}>
                        <select
                          {...register('tipoDocumento')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        >
                          <option value="DNI">DNI</option>
                          <option value="CE">Carnet de Extranjería</option>
                          <option value="PASAPORTE">Pasaporte</option>
                        </select>
                      </FormField>

                      <FormField label="Número de Documento" required error={errors.numeroDocumento?.message}>
                        <input
                          type="text"
                          {...register('numeroDocumento')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese el número de documento"
                          disabled={isSubmitting}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Información de Contacto de Emergencia */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-red-600" />
                      Contacto de Emergencia
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Contacto de Emergencia" error={errors.contactoEmergencia?.message}>
                        <input
                          type="text"
                          {...register('contactoEmergencia')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre del contacto de emergencia"
                          disabled={isSubmitting}
                        />
                      </FormField>

                      <FormField label="Teléfono de Emergencia" error={errors.numeroEmergencia?.message}>
                        <input
                          type="tel"
                          {...register('numeroEmergencia')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Número de teléfono"
                          disabled={isSubmitting}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <FormField label="Observaciones" error={errors.observaciones?.message}>
                      <textarea
                        {...register('observaciones')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Observaciones adicionales sobre el estudiante"
                        disabled={isSubmitting}
                      />
                    </FormField>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar Cambios
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

export default ModalEditarEstudiante;
