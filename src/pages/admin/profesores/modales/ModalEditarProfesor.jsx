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
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  Save,
  Edit3,
  Loader2,
  Star
} from 'lucide-react';
import ImageUploader from '../../../../components/common/ImageUploader';
import { useProfesores } from '../../../../hooks/useProfesores';

// Esquema de validación con Yup (igual que crear)
const validationSchema = yup.object({
  name: yup.string().required('El nombre es requerido').trim(),
  email: yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  phone: yup.string().required('El teléfono es requerido').trim(),
  subject: yup.string().required('La materia es requerida'),
  experience: yup.number()
    .required('La experiencia es requerida')
    .min(0, 'La experiencia debe ser positiva')
    .max(50, 'La experiencia no puede ser mayor a 50 años'),
  degree: yup.string().required('El título es requerido').trim(),
  address: yup.string().required('La dirección es requerida').trim(),
  schedule: yup.string().required('El horario es requerido'),
  // Para editar, la foto no es requerida si ya existe
  photo: yup.object().nullable(),
  specializations: yup.array().of(yup.string()),
  notes: yup.string()
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

const subjects = [
  'Matemáticas', 'Comunicación', 'Ciencias Naturales', 'Ciencias Sociales',
  'Inglés', 'Educación Física', 'Arte y Cultura', 'Música', 'Computación',
  'Personal Social', 'Religión', 'Tutoría'
];

const schedules = ['Mañana', 'Tarde', 'Completo'];

const ModalEditarProfesor = ({ isOpen, onClose, profesor }) => {
  // Hook personalizado para gestión de profesores
  const { updateTeacher, updating, uploading } = useProfesores();

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
      subject: '',
      experience: '',
      degree: '',
      address: '',
      schedule: '',
      photo: null,
      photoFile: null,
      specializations: [],
      notes: ''
    }
  });

  const photoValue = watch('photo');

  // Cargar datos del profesor cuando se abre el modal
  useEffect(() => {
    if (profesor && isOpen) {
      console.log('📝 Cargando datos del profesor para editar:', profesor);
      
      // Resetear y cargar datos
      reset({
        name: profesor.name || '',
        email: profesor.email || '',
        phone: profesor.phone || '',
        subject: profesor.subject || '',
        experience: profesor.experience || '',
        degree: profesor.degree || '',
        address: profesor.address || '',
        schedule: profesor.schedule || '',
        specializations: profesor.specializations || [],
        notes: profesor.notes || '',
        photo: profesor.photo ? {
          url: profesor.photo.url || profesor.photo,
          publicId: profesor.photo.publicId || profesor.photoPublicId
        } : null,
        photoFile: null
      });
    }
  }, [profesor, isOpen, reset]);

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
      // Mantener la foto original si no se sube una nueva
      if (profesor?.photo) {
        setValue('photo', {
          url: profesor.photo.url || profesor.photo,
          publicId: profesor.photo.publicId || profesor.photoPublicId
        });
      } else {
        setValue('photo', null);
      }
    }
  };

  const onSubmit = async (data) => {
    console.log('📋 Form submission - data:', data);
    
    try {
      // El hook se encarga de todo el proceso (upload + save)
      await updateTeacher(profesor.id, data);
      
      // Cerrar modal después del éxito
      handleClose();
    } catch (error) {
      console.error('❌ Error al actualizar profesor:', error);
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
  const isLoading = updating || uploading;

  if (!profesor) return null;

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
                <div className="flex items-center justify-between p-6 border-b bg-blue-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={photoValue?.url || profesor.photo?.url || profesor.photo || '/default-avatar.png'}
                      alt="Profesor"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Edit3 className="w-6 h-6 text-blue-600" />
                        Editar Profesor
                      </Dialog.Title>
                      <p className="text-blue-600 font-medium">{profesor.name}</p>
                    </div>
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
                    {/* Foto del Profesor */}
                    <FormField 
                      label="Foto del Profesor" 
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
                          placeholder="Ej: María Elena Vásquez"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Email" required error={errors.email?.message}>
                        <input
                          type="email"
                          {...register('email')}
                          className={inputClassName(errors.email)}
                          placeholder="Ej: maria.vasquez@colegio.edu"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Teléfono" required error={errors.phone?.message}>
                        <input
                          type="tel"
                          {...register('phone')}
                          className={inputClassName(errors.phone)}
                          placeholder="Ej: +51 987 123 456"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Dirección" required error={errors.address?.message}>
                        <input
                          {...register('address')}
                          className={inputClassName(errors.address)}
                          placeholder="Ej: San Isidro, Lima"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información Académica */}
                  <FormSection title="Información Académica" icon={GraduationCap} iconColor="text-green-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Materia Principal" required error={errors.subject?.message}>
                        <select
                          {...register('subject')}
                          className={inputClassName(errors.subject)}
                          disabled={isLoading}
                        >
                          <option value="">Seleccionar materia</option>
                          {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Años de Experiencia" required error={errors.experience?.message}>
                        <input
                          type="number"
                          {...register('experience')}
                          className={inputClassName(errors.experience)}
                          placeholder="Ej: 8"
                          min="0"
                          max="50"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Título/Grado Académico" required error={errors.degree?.message}>
                        <input
                          {...register('degree')}
                          className={inputClassName(errors.degree)}
                          placeholder="Ej: Licenciada en Educación Matemática"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Horario de Trabajo" required error={errors.schedule?.message}>
                        <select
                          {...register('schedule')}
                          className={inputClassName(errors.schedule)}
                          disabled={isLoading}
                        >
                          <option value="">Seleccionar horario</option>
                          {schedules.map(schedule => (
                            <option key={schedule} value={schedule}>{schedule}</option>
                          ))}
                        </select>
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información Adicional */}
                  <FormSection title="Información Adicional (Opcional)" icon={Star} iconColor="text-purple-600">
                    <FormField label="Especializaciones" error={errors.specializations?.message} className="mb-4">
                      <input
                        {...register('specializations')}
                        className={inputClassName(errors.specializations)}
                        placeholder="Ej: Álgebra, Geometría, Cálculo (separados por comas)"
                        disabled={isLoading}
                        defaultValue={profesor.specializations?.join(', ') || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const specializations = value ? value.split(',').map(s => s.trim()).filter(s => s) : [];
                          setValue('specializations', specializations);
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separe múltiples especializaciones con comas
                      </p>
                    </FormField>

                    <FormField label="Notas" error={errors.notes?.message}>
                      <textarea
                        {...register('notes')}
                        className={inputClassName(errors.notes)}
                        rows="3"
                        placeholder="Información adicional sobre el profesor, metodología, logros, etc."
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
                        Guardar Cambios
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

export default ModalEditarProfesor;