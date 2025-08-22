import React, { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Phone, 
  Calendar,
  GraduationCap,
  Save,
  Edit3,
  Loader2
} from 'lucide-react';
import ImageUploader from '../../../../components/common/ImageUploader';
import { useStudents } from '../../../../hooks/useStudents';

// Esquema de validación con Yup (igual que crear)
const validationSchema = yup.object({
  nombre: yup.string().required('El nombre es requerido').trim(),
  apellido: yup.string().required('El apellido es requerido').trim(),
  edad: yup.number()
    .required('La edad es requerida')
    .min(5, 'La edad mínima es 5 años')
    .max(18, 'La edad máxima es 18 años'),
  grado: yup.string().required('El grado es requerido'),
  nombrePadre: yup.string().required('El nombre del padre/madre es requerido').trim(),
  telefonoPadre: yup.string().required('El teléfono es requerido').trim(),
  emailPadre: yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  direccion: yup.string().required('La dirección es requerida').trim(),
  // Para editar, la foto no es requerida si ya existe
  foto: yup.object().nullable(),
  fechaNacimiento: yup.string(),
  nroDocumento: yup.string(),
  contactoEmergencia: yup.string(),
  telefonoEmergencia: yup.string(),
  alergias: yup.string(),
  notasMedicas: yup.string()
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

const ModalEditarEstudiante = ({ isOpen, onClose, estudiante }) => {
  // Hook personalizado para gestión de estudiantes
  const { updateStudent, updating, uploading } = useStudents();

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
      edad: '',
      grado: '',
      nombrePadre: '',
      telefonoPadre: '',
      emailPadre: '',
      direccion: '',
      fechaNacimiento: '',
      nroDocumento: '',
      contactoEmergencia: '',
      telefonoEmergencia: '',
      alergias: '',
      notasMedicas: '',
      foto: null,
      photoFile: null
    }
  });

  const photoValue = watch('photo');

  // Cargar datos del estudiante cuando se abre el modal
  useEffect(() => {
    if (estudiante && isOpen) {
      console.log('📝 Cargando datos del estudiante para editar:', estudiante);
      
      // Resetear y cargar datos
      reset({
        nombre: estudiante.nombre || '',
        apellido: estudiante.apellido || '',
        edad: estudiante.edad || '',
        grado: estudiante.grado || '',
        nombrePadre: estudiante.nombrePadre || '',
        telefonoPadre: estudiante.telefonoPadre || '',
        emailPadre: estudiante.emailPadre || '',
        direccion: estudiante.direccion || '',
        fechaNacimiento: estudiante.fechaNacimiento || '',
        nroDocumento: estudiante.nroDocumento || '',
        contactoEmergencia: estudiante.contactoEmergencia || '',
        telefonoEmergencia: estudiante.telefonoEmergencia || '',
        alergias: estudiante.alergias || '',
        notasMedicas: estudiante.notasMedicas || '',
        foto: estudiante.foto ? {
          url: estudiante.foto.url || estudiante.foto,
          publicId: estudiante.foto.publicId || estudiante.fotoPublicId
        } : null,
        photoFile: null
      });
    }
  }, [estudiante, isOpen, reset]);

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
      if (estudiante?.photo) {
        setValue('photo', {
          url: estudiante.photo.url || estudiante.photo,
          publicId: estudiante.photo.publicId || estudiante.photoPublicId
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
      await updateStudent(estudiante.id, data);
      
      // Cerrar modal después del éxito
      handleClose();
    } catch (error) {
      console.error('❌ Error al actualizar estudiante:', error);
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-blue-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={photoValue?.url || estudiante.photo?.url || estudiante.photo || '/default-avatar.png'}
                      alt="Estudiante"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Edit3 className="w-6 h-6 text-blue-600" />
                        Editar Estudiante
                      </Dialog.Title>
                      <p className="text-blue-600 font-medium">{`${estudiante.nombre} ${estudiante.apellido}`}</p>
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
                    {/* Foto del Estudiante */}
                    <FormField 
                      label="Foto del Estudiante" 
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
                      <FormField label="Nombre" required error={errors.nombre?.message}>
                        <input
                          {...register('nombre')}
                          className={inputClassName(errors.nombre)}
                          placeholder="Ej: Ana"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Apellido" required error={errors.apellido?.message}>
                        <input
                          {...register('apellido')}
                          className={inputClassName(errors.apellido)}
                          placeholder="Ej: García Rodríguez"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="DNI" error={errors.nroDocumento?.message}>
                        <input
                          {...register('nroDocumento')}
                          className={inputClassName(errors.nroDocumento)}
                          placeholder="Ej: 12345678"
                          maxLength="8"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Edad" required error={errors.edad?.message}>
                        <input
                          type="number"
                          {...register('edad')}
                          className={inputClassName(errors.edad)}
                          placeholder="Ej: 10"
                          min="5"
                          max="18"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Fecha de Nacimiento" error={errors.fechaNacimiento?.message}>
                        <input
                          type="date"
                          {...register('fechaNacimiento')}
                          className={inputClassName(errors.fechaNacimiento)}
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información Académica */}
                  <FormSection title="Información Académica" icon={GraduationCap} iconColor="text-green-600">
                    <FormField label="Grado" required error={errors.grado?.message}>
                      <select
                        {...register('grado')}
                        className={inputClassName(errors.grado)}
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
                      <FormField label="Nombre del Padre/Madre" required error={errors.nombrePadre?.message}>
                        <input
                          {...register('nombrePadre')}
                          className={inputClassName(errors.nombrePadre)}
                          placeholder="Ej: María Rodríguez"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Teléfono" required error={errors.telefonoPadre?.message}>
                        <input
                          type="tel"
                          {...register('telefonoPadre')}
                          className={inputClassName(errors.telefonoPadre)}
                          placeholder="Ej: +51 987 654 321"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Email" required error={errors.emailPadre?.message}>
                        <input
                          type="email"
                          {...register('emailPadre')}
                          className={inputClassName(errors.emailPadre)}
                          placeholder="Ej: maria.rodriguez@email.com"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Dirección" required error={errors.direccion?.message}>
                        <input
                          {...register('direccion')}
                          className={inputClassName(errors.direccion)}
                          placeholder="Ej: Av. Universitaria 123, Lima"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Contacto de Emergencia */}
                  <FormSection title="Contacto de Emergencia" icon={Phone} iconColor="text-red-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nombre del Contacto" error={errors.contactoEmergencia?.message}>
                        <input
                          {...register('contactoEmergencia')}
                          className={inputClassName(errors.contactoEmergencia)}
                          placeholder="Ej: Carlos García"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Teléfono de Emergencia" error={errors.telefonoEmergencia?.message}>
                        <input
                          type="tel"
                          {...register('telefonoEmergencia')}
                          className={inputClassName(errors.telefonoEmergencia)}
                          placeholder="Ej: +51 987 654 322"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información Médica */}
                  <FormSection title="Información Médica (Opcional)" icon={Calendar} iconColor="text-yellow-600">
                    <div className="space-y-4">
                      <FormField label="Alergias" error={errors.alergias?.message}>
                        <textarea
                          {...register('alergias')}
                          className={inputClassName(errors.alergias)}
                          rows="2"
                          placeholder="Ej: Alérgico a los mariscos, polen..."
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Notas Médicas" error={errors.notasMedicas?.message}>
                        <textarea
                          {...register('notasMedicas')}
                          className={inputClassName(errors.notasMedicas)}
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

export default ModalEditarEstudiante;