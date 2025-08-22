import React, { Fragment } from 'react';
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
  Calendar,
  GraduationCap,
  Save,
  UserPlus,
  Loader2
} from 'lucide-react';
import ImageUploader from '../../../../components/common/ImageUploader';
import { useStudents } from '../../../../hooks/useStudents';

// Esquema de validación con Yup
const validationSchema = yup.object({
  name: yup.string().required('El nombre es requerido').trim(),
  age: yup.number()
    .required('La edad es requerida')
    .min(5, 'La edad mínima es 5 años')
    .max(18, 'La edad máxima es 18 años'),
  grade: yup.string().required('El grado es requerido'),
  parent: yup.string().required('El nombre del padre/madre es requerido').trim(),
  phone: yup.string().required('El teléfono es requerido').trim(),
  email: yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  address: yup.string().required('La dirección es requerida').trim(),
  photo: yup.object().nullable().required('La foto del estudiante es requerida'),
  birthDate: yup.string(),
  dni: yup.string(),
  emergencyContact: yup.string(),
  emergencyPhone: yup.string(),
  allergies: yup.string(),
  medicalNotes: yup.string()
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

const grades = ['1ro Grado', '2do Grado', '3ro Grado', '4to Grado', '5to Grado', '6to Grado'];

const ModalAgregarEstudiante = ({ isOpen, onClose }) => {
  // Hook personalizado para gestión de estudiantes
  const { createStudent, creating, uploading } = useStudents();

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
      age: '',
      grade: '',
      parent: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      dni: '',
      emergencyContact: '',
      emergencyPhone: '',
      allergies: '',
      medicalNotes: '',
      photo: null,
      photoFile: null
    }
  });

  const photoValue = watch('photo');
  const photoFileValue = watch('photoFile');

  // Función para subir imagen (ahora maneja solo el archivo local)
  const handleUploadImage = async (file) => {
    console.log('🔄 handleUploadImage called with file:', file);
    // Solo retornamos el archivo, el hook se encarga del upload
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
      await createStudent(data);
      
      // Cerrar modal después del éxito
      handleClose();
    } catch (error) {
      console.error('❌ Error al crear estudiante:', error);
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
                      Agregar Nuevo Estudiante
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
                    {/* Foto del Estudiante */}
                    <FormField 
                      label="Foto del Estudiante" 
                      required 
                      error={errors.photo?.message}
                      className="mb-6"
                    >
                      <ImageUploader
                        onUpload={handleUploadImage}
                        onImageUpload={handleImageUpload}
                        currentImage={photoValue?.url}
                        required={true}
                        disabled={isLoading}
                      />
                    </FormField>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre Completo" required error={errors.name?.message}>
                        <input
                          {...register('name')}
                          className={inputClassName(errors.name)}
                          placeholder="Ej: Ana García Rodríguez"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="DNI" error={errors.dni?.message}>
                        <input
                          {...register('dni')}
                          className={inputClassName(errors.dni)}
                          placeholder="Ej: 12345678"
                          maxLength="8"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Edad" required error={errors.age?.message}>
                        <input
                          type="number"
                          {...register('age')}
                          className={inputClassName(errors.age)}
                          placeholder="Ej: 10"
                          min="5"
                          max="18"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Fecha de Nacimiento" error={errors.birthDate?.message}>
                        <input
                          type="date"
                          {...register('birthDate')}
                          className={inputClassName(errors.birthDate)}
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información Académica */}
                  <FormSection title="Información Académica" icon={GraduationCap} iconColor="text-green-600">
                    <FormField label="Grado" required error={errors.grade?.message}>
                      <select
                        {...register('grade')}
                        className={inputClassName(errors.grade)}
                        disabled={isLoading}
                      >
                        <option value="">Seleccionar grado</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </FormField>
                  </FormSection>

                  {/* Información del Padre/Madre */}
                  <FormSection title="Información del Padre/Madre" icon={User} iconColor="text-purple-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre del Padre/Madre" required error={errors.parent?.message}>
                        <input
                          {...register('parent')}
                          className={inputClassName(errors.parent)}
                          placeholder="Ej: María Rodríguez"
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

                      <FormField label="Email" required error={errors.email?.message}>
                        <input
                          type="email"
                          {...register('email')}
                          className={inputClassName(errors.email)}
                          placeholder="Ej: maria.rodriguez@email.com"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Dirección" required error={errors.address?.message}>
                        <input
                          {...register('address')}
                          className={inputClassName(errors.address)}
                          placeholder="Ej: Av. Universitaria 123, Lima"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Contacto de Emergencia */}
                  <FormSection title="Contacto de Emergencia" icon={Phone} iconColor="text-red-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre del Contacto" error={errors.emergencyContact?.message}>
                        <input
                          {...register('emergencyContact')}
                          className={inputClassName(errors.emergencyContact)}
                          placeholder="Ej: Carlos García"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Teléfono de Emergencia" error={errors.emergencyPhone?.message}>
                        <input
                          type="tel"
                          {...register('emergencyPhone')}
                          className={inputClassName(errors.emergencyPhone)}
                          placeholder="Ej: +51 987 654 322"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información Médica */}
                  <FormSection title="Información Médica (Opcional)" icon={Calendar} iconColor="text-yellow-600">
                    <div className="space-y-4">
                      <FormField label="Alergias" error={errors.allergies?.message}>
                        <textarea
                          {...register('allergies')}
                          className={inputClassName(errors.allergies)}
                          rows="2"
                          placeholder="Ej: Alérgico a los mariscos, polen..."
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Notas Médicas" error={errors.medicalNotes?.message}>
                        <textarea
                          {...register('medicalNotes')}
                          className={inputClassName(errors.medicalNotes)}
                          rows="2"
                          placeholder="Medicamentos, condiciones especiales, etc."
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
                        {uploading ? 'Subiendo...' : 'Guardando...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar
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

export default ModalAgregarEstudiante;
