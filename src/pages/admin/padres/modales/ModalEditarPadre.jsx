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
  AlertTriangle,
  Save,
  Edit3,
  Loader2,
  Users,
  UserCheck,
  Shield
} from 'lucide-react';
import { useApoderados } from '../../../../hooks/useApoderados';

// Esquema de validación con Yup (solo campos editables)
const validationSchema = yup.object({
  nombre: yup.string().required('El nombre es requerido').trim(),
  apellido: yup.string().required('El apellido es requerido').trim(),
  numero: yup.string().required('El número de teléfono es requerido').trim(),
  correo: yup.string().email('El correo no es válido').required('El correo es requerido').trim(),
  direccion: yup.string().required('La dirección es requerida').trim(),
  // Campos excluidos (no editables): documentoIdentidad, tipoDocumentoIdentidad
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

const ModalEditarPadre = ({ isOpen, onClose, padre }) => {
  // Hook personalizado para gestión de apoderados
  const { updateApoderado, updating } = useApoderados();

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
      // Campos de solo lectura (no editables)
      documentoIdentidad: '',
      tipoDocumentoIdentidad: 'DNI'
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

  // Cargar datos del padre cuando se abre el modal
  useEffect(() => {
    if (padre && isOpen) {
      console.log('📝 Cargando datos del padre para editar:', padre);
      console.log('📝 ID del padre:', padre.id);
      console.log('📝 ID alternativo (idApoderado):', padre.idApoderado);
      console.log('📝 Estructura completa:', JSON.stringify(padre, null, 2));
      
      // Resetear y cargar solo los datos que existen en el backend
      reset({
        nombre: padre.nombre || '',
        apellido: padre.apellido || '',
        numero: padre.numero || '',
        correo: padre.correo || '',
        direccion: padre.direccion || '',
        // Campos de solo lectura
        documentoIdentidad: padre.documentoIdentidad || '',
        tipoDocumentoIdentidad: padre.tipoDocumentoIdentidad || 'DNI'
      });
    }
  }, [padre, isOpen, reset]);

  const onSubmit = async (data) => {
    console.log('📋 Form submission - data:', data);
    console.log('📋 Padre completo:', padre);
    
    try {
      // Determinar el ID correcto del padre
      const padreId = padre.id || padre.idApoderado;
      console.log('📋 ID a usar para actualización:', padreId);
      
      if (!padreId) {
        console.error('❌ No se pudo determinar el ID del padre');
        throw new Error('No se pudo identificar al padre para actualizar');
      }
      
      // Excluir campos inmutables de los datos a enviar (no se pueden editar)
      const { documentoIdentidad, tipoDocumentoIdentidad, ...dataToUpdate } = data;
      console.log('📋 Datos a actualizar (sin campos inmutables):', dataToUpdate);
      console.log('📋 Campos excluidos:', { documentoIdentidad, tipoDocumentoIdentidad });
      
      // El hook se encarga del proceso de actualización
      await updateApoderado(padreId, dataToUpdate);
      
      // Cerrar modal después del éxito
      handleClose();
    } catch (error) {
      console.error('❌ Error al actualizar padre:', error);
      // El error ya está siendo manejado por el hook con toast
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!padre) return null;

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
                <div className="flex items-center justify-between p-6 border-b bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        Editar Apoderado
                      </Dialog.Title>
                      <p className="text-sm text-gray-600">
                        {padre.nombre} {padre.apellido}
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
                          placeholder="Ej: Juan"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Apellido" required error={errors.apellido?.message}>
                        <input
                          {...register('apellido')}
                          className={inputClassName(errors.apellido)}
                          placeholder="Ej: Pérez"
                          disabled={isLoading}
                        />
                      </FormField>
                    </FormSection>

                    {/* Información de Documentos (Solo lectura) */}
                    <FormSection title="Información de Documentos" icon={Shield} iconColor="text-purple-600">
                      <FormField label="Tipo de Documento" required>
                        <select
                          {...register('tipoDocumentoIdentidad')}
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
                          {...register('documentoIdentidad')}
                          className={`${inputClassName()} bg-gray-100 cursor-not-allowed`}
                          placeholder="Ej: 12345678"
                          disabled={true}
                          readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          ℹ️ El número de documento no se puede modificar (es único e inmutable)
                        </p>
                      </FormField>
                    </FormSection>

                    {/* Información de Contacto */}
                    <FormSection title="Información de Contacto" icon={Phone} iconColor="text-green-600">
                      <FormField label="Teléfono" required error={errors.numero?.message}>
                        <input
                          {...register('numero')}
                          type="tel"
                          className={inputClassName(errors.numero)}
                          placeholder="Ej: +51987654321"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Correo Electrónico" required error={errors.correo?.message}>
                        <input
                          {...register('correo')}
                          type="email"
                          className={inputClassName(errors.correo)}
                          placeholder="Ej: correo@ejemplo.com"
                          disabled={isLoading}
                        />
                      </FormField>
                    </FormSection>

                    {/* Dirección */}
                    <FormSection title="Dirección" icon={MapPin} iconColor="text-orange-600">
                      <FormField label="Dirección" required error={errors.direccion?.message} className="md:col-span-2">
                        <textarea
                          {...register('direccion')}
                          rows={3}
                          className={inputClassName(errors.direccion)}
                          placeholder="Ej: Av. Siempre Viva 123, San Isidro, Lima"
                          disabled={isLoading}
                        />
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
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Actualizar Apoderado
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