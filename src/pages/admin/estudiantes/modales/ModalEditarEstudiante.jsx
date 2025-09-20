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
  Calendar,
  Save,
  Edit3,
  Loader2,
  Baby,
  Heart,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useStudents } from '../../../../hooks/useStudents';
import { toast } from 'sonner';

// Esquema de validación con Yup (solo campos editables)
const validationSchema = yup.object({
  nombre: yup.string().required('El nombre es requerido').trim(),
  apellido: yup.string().required('El apellido es requerido').trim(),
  observaciones: yup.string().max(500, 'Las observaciones no pueden exceder 500 caracteres')
  // Campos excluidos (no editables): nroDocumento, tipoDocumento, fechaNacimiento, idRol, contactosEmergencia
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
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
      <Icon className={`w-6 h-6 mr-3 ${iconColor}`} />
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const tiposDocumento = ['DNI', 'Carnet de Extranjería', 'Pasaporte'];

const ModalEditarEstudiante = ({ isOpen, onClose, estudiante }) => {
  // Hook personalizado para gestión de estudiantes
  const { updateStudent, updating } = useStudents();

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
      // Campos de solo lectura (no editables)
      nroDocumento: '',
      tipoDocumento: 'DNI',
      fechaNacimiento: '',
      idRol: '',
      observaciones: ''
    }
  });

  // Estados computados para UI
  const isLoading = updating;

  // Función para aplicar estilos a inputs
  const inputClassName = (error) => 
    `w-full px-3 py-2 border rounded-md transition-colors ${
      error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    } focus:outline-none focus:ring-1`;

  // Cargar datos del estudiante cuando se abre el modal
  useEffect(() => {
    if (estudiante && isOpen) {
      console.log('📝 Cargando datos del estudiante para editar:', estudiante);
      console.log('📝 ID del estudiante:', estudiante.id);
      console.log('📝 ID alternativo (idEstudiante):', estudiante.idEstudiante);
      console.log('📝 Estructura completa:', JSON.stringify(estudiante, null, 2));
      
      // Resetear y cargar solo los datos que existen en el backend
      reset({
        nombre: estudiante.nombre || '',
        apellido: estudiante.apellido || '',
        // Campos de solo lectura
        nroDocumento: estudiante.nroDocumento || '',
        tipoDocumento: estudiante.tipoDocumento || 'DNI',
        fechaNacimiento: estudiante.fechaNacimiento || '',
        idRol: estudiante.idRol || '',
        observaciones: estudiante.observaciones || ''
      });
    }
  }, [estudiante, isOpen, reset]);

  const onSubmit = async (data) => {
    console.log('📋 Form submission - data:', data);
    console.log('📋 Estudiante completo:', estudiante);
    
    try {
      // Determinar el ID correcto del estudiante
      const estudianteId = estudiante.id || estudiante.idEstudiante;
      console.log('📋 ID a usar para actualización:', estudianteId);
      
      if (!estudianteId) {
        console.error('❌ No se pudo determinar el ID del estudiante');
        throw new Error('No se pudo identificar al estudiante para actualizar');
      }
      
      // Comparar y determinar qué campos han cambiado
      const dataToUpdate = {};
      
      if (data.nombre !== estudiante.nombre) {
        dataToUpdate.nombre = data.nombre;
      }
      
      if (data.apellido !== estudiante.apellido) {
        dataToUpdate.apellido = data.apellido;
      }
      
      if (data.observaciones !== estudiante.observaciones) {
        dataToUpdate.observaciones = data.observaciones;
      }
      
      // Si no hay cambios, mostrar mensaje
      if (Object.keys(dataToUpdate).length === 0) {
        toast.info('No se detectaron cambios para actualizar');
        return;
      }
      
      console.log('📋 Datos a actualizar (solo cambios):', dataToUpdate);
      
      // El hook se encarga del proceso de actualización
      await updateStudent(estudianteId, dataToUpdate);
      
      // Cerrar modal después del éxito
      handleClose();
    } catch (error) {
      console.error('❌ Error al actualizar estudiante:', error);
      // El error ya está siendo manejado por el hook con toast
    }
  };

  const handleClose = () => {
    reset({
      nombre: '',
      apellido: '',
      nroDocumento: '',
      tipoDocumento: 'DNI',
      fechaNacimiento: '',
      idRol: '',
      observaciones: ''
    });
    onClose();
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Baby className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        Editar Estudiante
                      </Dialog.Title>
                      <p className="text-sm text-gray-600">
                        {estudiante.nombre} {estudiante.apellido}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Información Personal */}
                    <FormSection title="Información Personal" icon={User} iconColor="text-blue-600">
                      <FormField label="Nombre" required error={errors.nombre?.message}>
                        <input
                          {...register('nombre')}
                          className={inputClassName(errors.nombre)}
                          placeholder="Ej: María"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Apellido" required error={errors.apellido?.message}>
                        <input
                          {...register('apellido')}
                          className={inputClassName(errors.apellido)}
                          placeholder="Ej: García"
                          disabled={isLoading}
                        />
                      </FormField>
                    </FormSection>

                    {/* Información de Documentos (Solo lectura) */}
                    <FormSection title="Información de Documentos" icon={GraduationCap} iconColor="text-purple-600">
                      <FormField label="Tipo de Documento" required>
                        <select
                          {...register('tipoDocumento')}
                          className={`${inputClassName()} bg-gray-100 cursor-not-allowed`}
                          disabled={true}
                        >
                          {tiposDocumento.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          ℹ️ El tipo de documento no se puede modificar una vez creado
                        </p>
                      </FormField>

                      <FormField label="Número de Documento" required>
                        <input
                          {...register('nroDocumento')}
                          className={`${inputClassName()} bg-gray-100 cursor-not-allowed`}
                          placeholder="Ej: 87654321"
                          disabled={true}
                          readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          ℹ️ El número de documento no se puede modificar (es único e inmutable)
                        </p>
                      </FormField>
                    </FormSection>

                    {/* Observaciones */}
                    <FormSection title="Observaciones" icon={Heart} iconColor="text-purple-600">
                      <FormField label="Observaciones" error={errors.observaciones?.message} className="md:col-span-2">
                        <textarea
                          {...register('observaciones')}
                          rows={3}
                          className={inputClassName(errors.observaciones)}
                          placeholder="Observaciones adicionales sobre el estudiante..."
                          disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          ℹ️ Máximo 500 caracteres
                        </p>
                      </FormField>
                    </FormSection>

                  </form>
                </div>

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
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Actualizar Estudiante
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