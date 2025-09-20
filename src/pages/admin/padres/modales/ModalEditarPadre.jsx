import React, { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Briefcase,
  AlertCircle,
  Save,
  Edit,
  Loader2
} from 'lucide-react';
import { usePadres } from '../../../../hooks/usePadres';

// Esquema de validación con Yup
const validationSchema = yup.object({
  nombre: yup.string()
    .required('El nombre es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .trim(),
  apellido: yup.string()
    .required('El apellido es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios')
    .trim(),
  numero: yup.string()
    .required('El teléfono es requerido')
    .matches(/^\d{9}$/, 'El teléfono debe tener exactamente 9 dígitos')
    .trim(),
  correo: yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  direccion: yup.string().required('La dirección es requerida').trim(),
  documentoIdentidad: yup.string().required('El documento de identidad es requerido').trim(),
  tipoDocumentoIdentidad: yup.string().required('El tipo de documento es requerido')
});

// Componente FormField reutilizable
const FormField = ({ label, error, required, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Componente FormSection reutilizable
const FormSection = ({ title, icon: Icon, iconColor, children }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      {title}
    </h3>
    {children}
  </div>
);

const relations = ['Madre', 'Padre', 'Abuelo', 'Abuela', 'Tutor', 'Tía', 'Tío', 'Otro'];
const documentTypes = ['DNI', 'Carnet de Extranjería', 'Pasaporte'];
const apoderadoTypes = ['Padre', 'Madre', 'Tutor', 'Otro'];

const ModalEditarPadre = ({ isOpen, onClose, padre, onSuccess }) => {
  // Hook personalizado para gestión de padres
  const { updateParent, updating, uploading } = usePadres();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      numero: '',
      correo: '',
      direccion: '',
      documentoIdentidad: '',
      tipoDocumentoIdentidad: ''
    }
  });

  const isLoading = updating || uploading;

  // Cargar datos del padre cuando se abre el modal
  useEffect(() => {
    if (padre && isOpen) {
      reset({
        nombre: padre.nombre || '',
        apellido: padre.apellido || '',
        numero: padre.numero || '',
        correo: padre.correo || '',
        direccion: padre.direccion || '',
        documentoIdentidad: padre.documentoIdentidad || '',
        tipoDocumentoIdentidad: padre.tipoDocumentoIdentidad || ''
      });
    }
  }, [padre, isOpen, reset]);

  const inputClassName = (error) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
    } disabled:bg-gray-100 disabled:cursor-not-allowed`;

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('📤 Enviando datos actualizados del padre:', data);

      // Preparar datos para el API con los campos correctos
      const padreData = {
        nombre: data.nombre,
        apellido: data.apellido,
        numero: data.numero,
        correo: data.correo,
        direccion: data.direccion,
        documentoIdentidad: data.documentoIdentidad,
        tipoDocumentoIdentidad: data.tipoDocumentoIdentidad
        // Nota: tipoApoderado no se incluye porque no debe cambiarse
      };

      // Usar el ID del padre para la actualización
      await updateParent(padre.idApoderado || padre.id, padreData);

      console.log('✅ Padre actualizado exitosamente');

      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error) {
      console.error('❌ Error al actualizar padre:', error);
      // El error ya se maneja en el hook
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-blue-600" />
                    Editar Padre/Madre
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Información Personal */}
                  <FormSection title="Información Personal" icon={User} iconColor="text-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre" error={errors.nombre?.message} required>
                        <input
                          {...register('nombre')}
                          className={inputClassName(errors.nombre)}
                          placeholder="Ej: Carlos"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Apellido" error={errors.apellido?.message} required>
                        <input
                          {...register('apellido')}
                          className={inputClassName(errors.apellido)}
                          placeholder="Ej: Uriel"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Tipo de Documento" error={errors.tipoDocumentoIdentidad?.message} required>
                        <select
                          {...register('tipoDocumentoIdentidad')}
                          className={inputClassName(errors.tipoDocumentoIdentidad)}
                          disabled={isLoading}
                        >
                          <option value="">Seleccionar tipo</option>
                          {documentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Número de Documento" error={errors.documentoIdentidad?.message} required>
                        <input
                          {...register('documentoIdentidad')}
                          className={inputClassName(errors.documentoIdentidad)}
                          placeholder="Ej: 09429090"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información de Contacto */}
                  <FormSection title="Información de Contacto" icon={Phone} iconColor="text-green-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Teléfono" error={errors.numero?.message} required>
                        <input
                          type="tel"
                          {...register('numero')}
                          className={inputClassName(errors.numero)}
                          placeholder="Ej: 940898438"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Email" error={errors.correo?.message} required>
                        <input
                          type="email"
                          {...register('correo')}
                          className={inputClassName(errors.correo)}
                          placeholder="Ej: carlosuriel@gmail.com"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información de Residencia */}
                  <FormSection title="Información de Residencia" icon={MapPin} iconColor="text-orange-600">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField label="Dirección" error={errors.direccion?.message} required>
                        <input
                          {...register('direccion')}
                          className={inputClassName(errors.direccion)}
                          placeholder="Ej: Av San Tomas 124 Calle 1"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>
                </form>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {updating ? 'Actualizando...' : 'Guardando...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Actualizar Padre
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

export default ModalEditarPadre;
