import React, { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Save,
  UserPlus,
  Loader2,
  Briefcase,
  School
} from 'lucide-react';
import { useTrabajadores } from 'src/hooks/queries/useTrabajadoresQueries';
import { useRoles } from '../../../../hooks/useRoles';
import { useAulasAsignacion } from '../../../../hooks/useAulasAsignacion';

// Esquema de validación con Yup para trabajadores
const validationSchema = yup.object({
  nombre: yup.string().required('El nombre es requerido').trim(),
  apellido: yup.string().required('El apellido es requerido').trim(),
  tipoDocumento: yup.string().required('El tipo de documento es requerido'),
  nroDocumento: yup.string().required('El número de documento es requerido').trim(),
  direccion: yup.string().required('La dirección es requerida').trim(),
  correo: yup.string()
    .email('El correo no es válido')
    .required('El correo es requerido'),
  telefono: yup.string().required('El teléfono es requerido').trim(),
  idRol: yup.string().required('El rol es requerido'),
  estaActivo: yup.boolean(),
  idAula: yup.string().when('isDocente', {
    is: true,
    then: (schema) => schema.required('Debe asignar un aula al docente'),
    otherwise: (schema) => schema.notRequired()
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

const ModalAgregarTrabajador = ({ isOpen, onClose, onSuccess }) => {
  // Hook personalizado para gestión de trabajadores
  const { createTrabajador, creating, uploading } = useTrabajadores();
  
  // Hook para obtener los roles disponibles
  const { roles, isLoading: loadingRoles } = useRoles();
  
  // Hook para asignación de aulas (incluye carga de aulas)
  const { 
    aulas, 
    loadingAulas, 
    asignarAulaADocente, 
    asignandoAula 
  } = useAulasAsignacion();
  
  // Estado para controlar si es docente
  const [isDocente, setIsDocente] = useState(false);

  // Log para debug - mostrar aulas cargadas
  React.useEffect(() => {
    if (isOpen && aulas && roles) {
      console.log('🚪 Modal abierto - datos cargados');
      
      // Debug de roles
      console.log('👤 Roles disponibles:', roles);
      if (roles && roles.length > 0) {
        console.log('👤 Primer rol completo:', roles[0]);
        console.log('👤 Propiedades del primer rol:', Object.keys(roles[0]));
      }
      
      // Debug de aulas
      console.log('🏫 Aulas disponibles:', aulas);
      if (aulas && aulas.length > 0) {
        console.log('🏫 Primera aula completa:', aulas[0]);
        console.log('🏫 Propiedades de la primera aula:', Object.keys(aulas[0]));
      }
    }
  }, [isOpen, aulas, roles]);

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
      tipoDocumento: 'DNI',
      nroDocumento: '',
      direccion: '',
      correo: '',
      telefono: '',
      idRol: '',
      estaActivo: true,
      idAula: '',
      isDocente: false
    }
  });

  // Vigilar cambios en el rol seleccionado
  const selectedRoleId = watch('idRol');
  
  // Efecto para detectar si el rol seleccionado es DOCENTE
  useEffect(() => {
    if (selectedRoleId && roles.length > 0) {
      const selectedRole = roles.find(rol => rol.idRol === selectedRoleId);
      const isDocenteRole = selectedRole?.nombre?.toLowerCase() === 'docente';
      
      console.log('👤 Rol seleccionado:', selectedRole);
      console.log('👤 Nombre del rol:', selectedRole?.nombre);
      console.log('👤 Es docente?:', isDocenteRole);
      console.log('👤 selectedRoleId:', selectedRoleId);
      
      setIsDocente(isDocenteRole);
      setValue('isDocente', isDocenteRole);
      
      // Limpiar selección de aula si no es docente
      if (!isDocenteRole) {
        setValue('idAula', '');
      }
    }
  }, [selectedRoleId, roles, setValue]);

  const onSubmit = async (data) => {
    console.log('📋 Form submission - data:', data);
    console.log('📋 Es docente:', isDocente);
    console.log('📋 Aula seleccionada:', data.idAula);
    
    try {
      // Crear trabajador con el servicio actualizado
      console.log('👤 Creando trabajador...');
      const nuevoTrabajador = await createTrabajador(data);
      console.log('✅ Trabajador creado exitosamente:', nuevoTrabajador);
      
      // Si es docente y se seleccionó un aula, asignarla
      if (isDocente && data.idAula && nuevoTrabajador?.idTrabajador) {
        console.log('🏫 Iniciando asignación de aula...');
        console.log('🏫 ID Trabajador:', nuevoTrabajador.idTrabajador);
        console.log('🏫 ID Aula:', data.idAula);
        
        await asignarAulaADocente(nuevoTrabajador.idTrabajador, data.idAula);
        console.log('✅ Proceso completo: Trabajador creado y aula asignada');
      } else if (isDocente && !data.idAula) {
        console.warn('⚠️ Es docente pero no se seleccionó aula');
      } else if (!isDocente) {
        console.log('ℹ️ No es docente, no se asigna aula');
      }
      
      // Cerrar modal después del éxito
      handleClose();
      
      // Llamar onSuccess si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error al crear trabajador:', error);
      // El error ya está siendo manejado por el hook con toast
    }
  };

  const handleClose = () => {
    reset(); // Resetear formulario
    setIsDocente(false); // Resetear estado de docente
    onClose();
  };

  const inputClassName = (fieldError) => 
    `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      fieldError ? 'border-red-500' : 'border-gray-300'
    }`;

  // Estado de carga general
  const isLoading = creating || uploading || loadingRoles || asignandoAula;

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
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Agregar Nuevo Trabajador
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

                      <FormField label="Tipo de Documento" required error={errors.tipoDocumento?.message}>
                        <select
                          {...register('tipoDocumento')}
                          className={inputClassName(errors.tipoDocumento)}
                          disabled={isLoading}
                        >
                          <option value="DNI">DNI</option>
                          <option value="CE">Carnet de Extranjería</option>
                          <option value="Pasaporte">Pasaporte</option>
                        </select>
                      </FormField>

                      <FormField label="Número de Documento" required error={errors.nroDocumento?.message}>
                        <input
                          {...register('nroDocumento')}
                          className={inputClassName(errors.nroDocumento)}
                          placeholder="Ej: 76655432"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Dirección" required error={errors.direccion?.message}>
                        <input
                          {...register('direccion')}
                          className={inputClassName(errors.direccion)}
                          placeholder="Ej: Jr Sani 342"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Correo Electrónico" required error={errors.correo?.message}>
                        <input
                          type="email"
                          {...register('correo')}
                          className={inputClassName(errors.correo)}
                          placeholder="Ej: maria.vasquez@gmail.com"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Teléfono" required error={errors.telefono?.message}>
                        <input
                          type="tel"
                          {...register('telefono')}
                          className={inputClassName(errors.telefono)}
                          placeholder="Ej: 987654321"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Rol" required error={errors.idRol?.message}>
                        <select
                          {...register('idRol')}
                          className={inputClassName(errors.idRol)}
                          disabled={isLoading}
                        >
                          <option value="">
                            {loadingRoles ? 'Cargando roles...' : 'Seleccione un rol'}
                          </option>
                          {Array.isArray(roles) && roles
                            .filter(rol => rol.nombre?.toLowerCase() !== 'secretaria' && rol.nombre?.toLowerCase() !== 'estudiante')
                            .map((rol) => (
                              <option key={rol.idRol} value={rol.idRol}>
                                {rol.nombre}
                              </option>
                            ))}
                        </select>
                      </FormField>

                      {/* Campo de Aula - Solo para docentes */}
                      {isDocente && (
                        <FormField 
                          label="Aula Asignada" 
                          required 
                          error={errors.idAula?.message}
                          className="md:col-span-2"
                        >
                          <div className="flex items-center gap-3">
                            <School className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <select
                              {...register('idAula')}
                              className={inputClassName(errors.idAula)}
                              disabled={isLoading || loadingAulas}
                            >
                              <option value="">
                                {loadingAulas ? 'Cargando aulas...' : 'Seleccione un aula'}
                              </option>
                              {Array.isArray(aulas) && aulas.map((aula) => (
                                <option key={aula.idAula} value={aula.idAula}>
                                  Sección {aula.seccion} - {aula.cantidadEstudiantes} estudiantes
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mt-2">
                            <p className="text-blue-600 text-sm flex items-center gap-1">
                              <School className="w-4 h-4" />
                              El docente será asignado a esta aula automáticamente
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Debug: {aulas ? `${aulas.length} aulas disponibles` : 'Sin aulas cargadas'}
                            </p>
                          </div>
                        </FormField>
                      )}

                      <FormField label="Estado" error={errors.estaActivo?.message}>
                        <select
                          {...register('estaActivo')}
                          className={inputClassName(errors.estaActivo)}
                          disabled={isLoading}
                        >
                          <option value={true}>Activo</option>
                          <option value={false}>Inactivo</option>
                        </select>
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Información del Rol - Solo mostrar si hay rol seleccionado */}
                  {watch('idRol') && roles.length > 0 && (
                    <FormSection title="Información del Rol" icon={Briefcase} iconColor="text-green-600">
                      <div className="bg-green-50 p-4 rounded-lg">
                        {(() => {
                          const selectedRole = roles.find(rol => rol.idRol === watch('idRol'));
                          return selectedRole ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-800">{selectedRole.nombre}</span>
                                {isDocente && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    <School className="w-3 h-3" />
                                    Requiere aula
                                  </span>
                                )}
                              </div>
                              {selectedRole.descripcion && (
                                <p className="text-green-700 text-sm ml-6">{selectedRole.descripcion}</p>
                              )}
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </FormSection>
                  )}

                </form>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-6 bg-gray-50">
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
                        {asignandoAula ? 'Asignando aula...' : uploading ? 'Subiendo...' : 'Guardando...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Trabajador
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

export default ModalAgregarTrabajador;