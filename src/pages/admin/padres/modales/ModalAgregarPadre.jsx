import React, { Fragment, use } from 'react';
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
  UserPlus,
  Loader2
} from 'lucide-react';
import ImageUploader from '../../../../components/common/ImageUploader';
import { usePadres } from '../../../../hooks/usePadres';

// Esquema de validación con Yup
const validationSchema = yup.object({
  name: yup.string().required('El nombre es requerido').trim(),
  email: yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  phone: yup.string().required('El teléfono es requerido').trim(),
  relation: yup.string().required('La relación es requerida'),
  address: yup.string().required('La dirección es requerida').trim(),
  occupation: yup.string(),
  participationLevel: yup.string().oneOf(['high', 'medium', 'low']),
  notes: yup.string(),
  photo: yup.object().nullable(),
  emergencyContact: yup.object({
    name: yup.string(),
    phone: yup.string(),
    relation: yup.string()
  })
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
const participationLevels = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' }
];

const ModalAgregarPadre = ({ isOpen, onClose, onSuccess }) => {
  // Hook personalizado para gestión de padres
  const { createParent, creating, uploading } = usePadres();

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
      name: '',
      email: '',
      phone: '',
      relation: '',
      address: '',
      occupation: '',
      participationLevel: 'medium',
      notes: '',
      photo: null,
      photoFile: null,
      emergencyContact: {
        name: '',
        phone: '',
        relation: ''
      }
    }
  });

  const photoValue = watch('photo');

  // Función para subir imagen (maneja solo el archivo local)
  const handleUploadImage = async (file) => {
    console.log('🔄 handleUploadImage called with file:', file);
    return { file };
  };

  // Manejar upload de imagen
  const handleImageUpload = (result) => {
    console.log('📷 handleImageUpload called with result:', result);
    if (result && result.file) {
      // Guardamos el archivo para el upload posterior
      setValue('photoFile', result.file);
      
      // Creamos una URL local para preview
      const previewUrl = URL.createObjectURL(result.file);
      setValue('photo', { url: previewUrl });
    } else {
      setValue('photoFile', null);
      setValue('photo', null);
    }
  };

  const onSubmit = async (data) => {
    console.log('📋 Form submission - data:', data);
    
    try {
      // El hook se encarga de todo el proceso (upload + save)
      await createParent(data);
      
      // Llamar onSuccess si está disponible, sino handleClose
      if (onSuccess) {
        reset();
        onSuccess();
      } else {
        handleClose();
      }
    } catch (error) {
      console.error('❌ Error al crear padre:', error);
      // El error ya está siendo manejado por el hook con toast
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const inputClassName = (fieldError) => 
    `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      fieldError ? 'border-red-500' : 'border-gray-300'
    }`;

  // Estado de carga general
  const isLoading = creating || uploading;

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Agregar Nuevo Padre/Madre
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Información Personal */}
                  <FormSection title="Información Personal" icon={User} iconColor="text-blue-600">
                    {/* Foto del Padre */}
                    <FormField 
                      label="Foto del Padre/Madre" 
                      error={errors.photo?.message}
                      className="mb-6"
                    >
                      <ImageUploader
                        onUpload={handleUploadImage}
                        onImageUpload={handleImageUpload}
                        currentImage={photoValue?.url}
                        required={false}
                        disabled={isLoading}
                      />
                    </FormField>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre Completo" required error={errors.name?.message}>
                        <input
                          {...register('name')}
                          className={inputClassName(errors.name)}
                          placeholder="Ej: María Rodríguez García"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Relación/Parentesco" required error={errors.relation?.message}>
                        <select
                          {...register('relation')}
                          className={inputClassName(errors.relation)}
                          disabled={isLoading}
                        >
                          <option value="">Seleccionar relación</option>
                          {relations.map(relation => (
                            <option key={relation} value={relation}>{relation}</option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Email" required error={errors.email?.message}>
                        <input
                          type="email"
                          {...register('email')}
                          className={inputClassName(errors.email)}
                          placeholder="Ej: maria.rodriguez@email.com"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Teléfono" required error={errors.phone?.message}>
                        <input
                          type="tel"
                          {...register('phone')}
                          className={inputClassName(errors.phone)}
                          placeholder="Ej: +51 987 654 321"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Ocupación" error={errors.occupation?.message}>
                        <input
                          {...register('occupation')}
                          className={inputClassName(errors.occupation)}
                          placeholder="Ej: Enfermera, Ingeniero, etc."
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Nivel de Participación" error={errors.participationLevel?.message}>
                        <select
                          {...register('participationLevel')}
                          className={inputClassName(errors.participationLevel)}
                          disabled={isLoading}
                        >
                          {participationLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </div>

                    <FormField label="Dirección" required error={errors.address?.message}>
                      <input
                        {...register('address')}
                        className={inputClassName(errors.address)}
                        placeholder="Ej: Av. Universitaria 123, San Miguel, Lima"
                        disabled={isLoading}
                      />
                    </FormField>
                  </FormSection>

                  {/* Contacto de Emergencia */}
                  <FormSection title="Contacto de Emergencia (Opcional)" icon={AlertCircle} iconColor="text-red-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre del Contacto" error={errors.emergencyContact?.name?.message}>
                        <input
                          {...register('emergencyContact.name')}
                          className={inputClassName(errors.emergencyContact?.name)}
                          placeholder="Ej: Carlos García"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Teléfono de Emergencia" error={errors.emergencyContact?.phone?.message}>
                        <input
                          type="tel"
                          {...register('emergencyContact.phone')}
                          className={inputClassName(errors.emergencyContact?.phone)}
                          placeholder="Ej: +51 987 654 322"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Relación" error={errors.emergencyContact?.relation?.message}>
                        <input
                          {...register('emergencyContact.relation')}
                          className={inputClassName(errors.emergencyContact?.relation)}
                          placeholder="Ej: Abuelo, Tía, etc."
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Notas Adicionales */}
                  <FormSection title="Información Adicional (Opcional)" icon={Briefcase} iconColor="text-purple-600">
                    <FormField label="Notas" error={errors.notes?.message}>
                      <textarea
                        {...register('notes')}
                        className={inputClassName(errors.notes)}
                        rows="3"
                        placeholder="Notas adicionales sobre el padre/madre, información relevante, etc."
                        disabled={isLoading}
                      />
                    </FormField>
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
                        {uploading ? 'Subiendo...' : 'Guardando...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Padre
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

export default ModalAgregarPadre;