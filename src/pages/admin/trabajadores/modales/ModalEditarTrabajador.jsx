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
import { useTrabajadores } from '../../../../hooks/useTrabajadores';

// Esquema de validación con Yup (igual que crear)
const validationSchema = yup.object({
  nombre: yup.string().required('El nombre es requerido').trim(),
  apellido: yup.string().required('El apellido es requerido').trim(),
  email: yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  telefono: yup.string().required('El teléfono es requerido').trim(),
  materia: yup.string().required('La materia es requerida'),
  experiencia: yup.number()
    .required('La experiencia es requerida')
    .min(0, 'La experiencia debe ser positiva')
    .max(50, 'La experiencia no puede ser mayor a 50 años'),
  titulo: yup.string().required('El título es requerido').trim(),
  direccion: yup.string().required('La dirección es requerida').trim(),
  horario: yup.string().required('El horario es requerido'),
  // Para editar, la foto no es requerida si ya existe
  foto: yup.object().nullable(),
  especializaciones: yup.array().of(yup.string()),
  notas: yup.string()
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

const ModalEditarTrabajador = ({ isOpen, onClose, trabajador }) => {
  // Hook personalizado para gestión de profesores
  const { updateTeacher, updating, uploading } = useTrabajadores();

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
      email: '',
      telefono: '',
      materia: '',
      experiencia: '',
      titulo: '',
      direccion: '',
      horario: '',
      foto: null,
      photoFile: null,
      especializaciones: [],
      notas: ''
    }
  });

  const photoValue = watch('foto');

  // Cargar datos del trabajador cuando se abre el modal
  useEffect(() => {
    if (trabajador && isOpen) {
      console.log('📝 Cargando datos del trabajador para editar:', trabajador);
      
      // Resetear y cargar datos
      reset({
        nombre: trabajador.nombre || '',
        apellido: trabajador.apellido || '',
        email: trabajador.email || '',
        telefono: trabajador.telefono || '',
        materia: trabajador.materia || '',
        experiencia: trabajador.experiencia || '',
        titulo: trabajador.titulo || '',
        direccion: trabajador.direccion || '',
        horario: trabajador.horario || '',
        especializaciones: trabajador.especializaciones || [],
        notas: trabajador.notas || '',
        foto: trabajador.foto ? {
          url: trabajador.foto.url || trabajador.foto,
          publicId: trabajador.foto.publicId || trabajador.fotoPublicId
        } : null,
        photoFile: null
      });
    }
  }, [trabajador, isOpen, reset]);

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
      setValue('foto', { url: previewUrl });
    } else {
      setValue('photoFile', null);
      // Mantener la foto original si no se sube una nueva
      if (trabajador?.foto) {
        setValue('foto', {
          url: trabajador.foto.url || trabajador.foto,
          publicId: trabajador.foto.publicId || trabajador.fotoPublicId
        });
      } else {
        setValue('foto', null);
      }
    }
  };

  const onSubmit = async (data) => {
    console.log('📋 Form submission - data:', data);
    
    try {
      // El hook se encarga de todo el proceso (upload + save)
      await updateTeacher(trabajador.id, data);
      
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

  if (!trabajador) return null;

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
                <div className="flex items-center justify-between p-6 bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Edit3 className="w-6 h-6 text-blue-600" />
                        Editar Trabajador
                      </Dialog.Title>
                      <p className="text-blue-600 font-medium">{`${trabajador.nombre} ${trabajador.apellido}`}</p>
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
                      label="Foto del Trabajador" 
                      error={errors.foto?.message}
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
                          placeholder="Ej: María Elena"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Apellido" required error={errors.apellido?.message}>
                        <input
                          {...register('apellido')}
                          className={inputClassName(errors.apellido)}
                          placeholder="Ej: Vásquez García"
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

                      <FormField label="Teléfono" required error={errors.telefono?.message}>
                        <input
                          type="tel"
                          {...register('telefono')}
                          className={inputClassName(errors.telefono)}
                          placeholder="Ej: +51 987 123 456"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Dirección" required error={errors.direccion?.message}>
                        <input
                          {...register('direccion')}
                          className={inputClassName(errors.direccion)}
                          placeholder="Ej: San Isidro, Lima"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información Académica */}
                  <FormSection title="Información Académica" icon={GraduationCap} iconColor="text-green-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Materia Principal" required error={errors.materia?.message}>
                        <select
                          {...register('materia')}
                          className={inputClassName(errors.materia)}
                          disabled={isLoading}
                        >
                          <option value="">Seleccionar materia</option>
                          {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Años de Experiencia" required error={errors.experiencia?.message}>
                        <input
                          type="number"
                          {...register('experiencia')}
                          className={inputClassName(errors.experiencia)}
                          placeholder="Ej: 8"
                          min="0"
                          max="50"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Título/Grado Académico" required error={errors.titulo?.message}>
                        <input
                          {...register('titulo')}
                          className={inputClassName(errors.titulo)}
                          placeholder="Ej: Licenciada en Educación Matemática"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Horario de Trabajo" required error={errors.horario?.message}>
                        <select
                          {...register('horario')}
                          className={inputClassName(errors.horario)}
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
                    <FormField label="Especializaciones" error={errors.especializaciones?.message} className="mb-4">
                      <input
                        {...register('especializaciones')}
                        className={inputClassName(errors.especializaciones)}
                        placeholder="Ej: Álgebra, Geometría, Cálculo (separados por comas)"
                        disabled={isLoading}
                        defaultValue={trabajador.especializaciones?.join(', ') || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const especializaciones = value ? value.split(',').map(s => s.trim()).filter(s => s) : [];
                          setValue('especializaciones', especializaciones);
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separe múltiples especializaciones con comas
                      </p>
                    </FormField>

                    <FormField label="Notas" error={errors.notas?.message}>
                      <textarea
                        {...register('notas')}
                        className={inputClassName(errors.notas)}
                        rows="3"
                        placeholder="Información adicional sobre el trabajador, metodología, logros, etc."
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

export default ModalEditarTrabajador;