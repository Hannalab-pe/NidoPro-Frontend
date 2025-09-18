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
  School,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { useCreateTrabajador } from 'src/hooks/queries/useTrabajadoresQueries';
import { useRoles } from '../../../../hooks/useRoles';
import { useAulasAsignacion } from '../../../../hooks/useAulasAsignacion';
import { useTiposContrato } from '../../../../hooks/useTiposContrato';

// Esquema de validación con Yup para trabajadores
const validationSchema = yup.object({
  // Información del Trabajador
  nombre: yup.string().required('El nombre es requerido').trim(),
  apellido: yup.string().required('El apellido es requerido').trim(),
  tipoDocumento: yup.string().required('El tipo de documento es requerido'),
  nroDocumento: yup.string().required('El número de documento es requerido').trim(),
  direccion: yup.string().required('La dirección es requerida').trim(),
  correo: yup.string()
    .email('El correo no es válido')
    .required('El correo es requerido'),
  telefono: yup.string().required('El teléfono es requerido').trim(),
  estaActivo: yup.boolean(),
  idRol: yup.string().required('El rol es requerido'),
  idAula: yup.string().when('isDocente', {
    is: true,
    then: (schema) => schema.required('Debe asignar un aula al docente'),
    otherwise: (schema) => schema.notRequired()
  }),

  // Información del Sueldo
  sueldoBase: yup.number().required('El sueldo base es requerido').positive('Debe ser un valor positivo'),
  bonificacion: yup.number().nullable().positive('Debe ser un valor positivo'),
  asignacion: yup.number().nullable().positive('Debe ser un valor positivo'),
  fechaAsignacion: yup.string().required('La fecha de asignación es requerida'),
  fechaVigenciaDesde: yup.string().required('La fecha de vigencia desde es requerida'),
  fechaHasta: yup.string().nullable(),
  observacionesSueldo: yup.string().nullable(),
  estaActivoSueldo: yup.boolean(),

  // Información del Contrato
  idTipoContrato: yup.string().required('El tipo de contrato es requerido'),
  numeroContrato: yup.string().nullable(),
  fechaInicio: yup.string().required('La fecha de inicio es requerida'),
  fechaFin: yup.string().nullable(),
  jornadaLaboral: yup.string().required('La jornada laboral es requerida'),
  horasSemanales: yup.number().required('Las horas semanales son requeridas').positive('Debe ser un valor positivo'),
  descripcionFunciones: yup.string().nullable(),
  lugarTrabajo: yup.string().nullable(),
  renovacion: yup.boolean(),
  diasAviso: yup.number().nullable().positive('Debe ser un valor positivo'),
  aprobado: yup.boolean(),
  fechaAprobacion: yup.string().nullable(),
  archivos: yup.mixed().nullable()
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
const FormSection = ({ title, icon: Icon, iconColor, children, description }) => (
  <div className="border border-gray-200 rounded-lg p-6 bg-white">
    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      {title}
    </h3>
    {description && (
      <p className="text-sm text-gray-600 mb-4">{description}</p>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ModalAgregarTrabajador = ({ isOpen, onClose, onSuccess }) => {
  // Hook personalizado para gestión de trabajadores
  const { mutateAsync: createTrabajador, isPending: creating } = useCreateTrabajador();

  // Hook para obtener los roles disponibles
  const { roles, isLoading: loadingRoles } = useRoles();

  // Estado para controlar si es docente
  const [isDocente, setIsDocente] = useState(false);
  const [cargarAulasSinAsignacion, setCargarAulasSinAsignacion] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(false);

  // Calcular parámetros para el hook
  const aulasParams = React.useMemo(() => ({
    soloSinAsignacion: cargarAulasSinAsignacion,
    enabled: rolSeleccionado
  }), [cargarAulasSinAsignacion, rolSeleccionado]);

  // Hook para asignación de aulas (incluye carga de aulas)
  const {
    aulas,
    loadingAulas,
    asignarAulaADocente,
    asignandoAula
  } = useAulasAsignacion(aulasParams.soloSinAsignacion, aulasParams.enabled);

  // Hook para tipos de contrato
  const { tiposContrato, loading: loadingTiposContrato, error: errorTiposContrato } = useTiposContrato();

  // Generar número de contrato aleatorio
  const generarNumeroContrato = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CTR-${timestamp}-${random}`;
  };

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
      // Trabajador
      nombre: '',
      apellido: '',
      tipoDocumento: 'DNI',
      nroDocumento: '',
      direccion: '',
      correo: '',
      telefono: '',
      estaActivo: true,
      idRol: '',
      idAula: '',

      // Sueldo
      sueldoBase: '',
      bonificacion: '',
      asignacion: '',
      fechaAsignacion: new Date().toISOString().split('T')[0],
      fechaVigenciaDesde: new Date().toISOString().split('T')[0],
      fechaHasta: '',
      observacionesSueldo: '',
      estaActivoSueldo: true,

      // Contrato
      idTipoContrato: '',
      numeroContrato: generarNumeroContrato(),
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
      jornadaLaboral: 'Tiempo Completo',
      horasSemanales: 40,
      descripcionFunciones: '',
      lugarTrabajo: '',
      renovacion: true,
      diasAviso: 30,
      aprobado: true,
      fechaAprobacion: new Date().toISOString().split('T')[0],
      archivos: null
    }
  });

  // Vigilar cambios en el rol seleccionado
  const selectedRoleId = watch('idRol');
  const selectedTipoContrato = watch('idTipoContrato');

  // Efecto para detectar si el rol seleccionado es DOCENTE
  useEffect(() => {
    if (selectedRoleId && roles.length > 0) {
      const selectedRole = roles.find(rol => rol.idRol === selectedRoleId);
      const isDocenteRole = selectedRole?.nombre?.toLowerCase() === 'docente';

      console.log('👨‍🏫 Rol seleccionado:', selectedRole?.nombre, 'es docente:', isDocenteRole);

      setIsDocente(isDocenteRole);
      setCargarAulasSinAsignacion(isDocenteRole);
      setRolSeleccionado(true);
      setValue('isDocente', isDocenteRole);

      // Limpiar selección de aula si no es docente
      if (!isDocenteRole) {
        setValue('idAula', '');
      }
    } else {
      setRolSeleccionado(false);
      setCargarAulasSinAsignacion(false);
    }
  }, [selectedRoleId, roles, setValue]);

  // Efecto para calcular fecha fin basado en tipo de contrato
  useEffect(() => {
    if (selectedTipoContrato && tiposContrato.length > 0) {
      const tipoContrato = tiposContrato.find(tc => tc.idTipoContrato === selectedTipoContrato);
      if (tipoContrato && tipoContrato.duracionMaximaMeses) {
        const fechaInicio = watch('fechaInicio');
        if (fechaInicio) {
          const fechaFin = new Date(fechaInicio);
          fechaFin.setMonth(fechaFin.getMonth() + tipoContrato.duracionMaximaMeses);
          setValue('fechaFin', fechaFin.toISOString().split('T')[0]);
        }
      }
    }
  }, [selectedTipoContrato, tiposContrato, watch, setValue]);

  const onSubmit = async (data) => {
    console.log('📋 Form submission - data:', data);

    try {
      // Crear trabajador con el servicio actualizado
      console.log('👤 Creando trabajador...');
      const nuevoTrabajador = await createTrabajador(data);
      console.log('✅ Trabajador creado exitosamente:', nuevoTrabajador);

      // Si es docente y se seleccionó un aula, asignarla
      if (isDocente && data.idAula && nuevoTrabajador?.idTrabajador) {
        console.log('🏫 Iniciando asignación de aula...');
        await asignarAulaADocente(nuevoTrabajador.idTrabajador, data.idAula);
        console.log('✅ Proceso completo: Trabajador creado y aula asignada');
      }

      // Cerrar modal después del éxito
      handleClose();

      // Llamar onSuccess si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error al crear trabajador:', error);
    }
  };

  const handleClose = () => {
    reset();
    setIsDocente(false);
    onClose();
  };

  const inputClassName = (fieldError) =>
    `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      fieldError ? 'border-red-500' : 'border-gray-300'
    }`;

  // Estado de carga general
  const isLoading = creating || loadingRoles || asignandoAula || loadingTiposContrato;

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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Agregar Nuevo Trabajador Completo
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
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
                  {/* 1. Información del Trabajador */}
                  <FormSection
                    title="Información del Trabajador"
                    icon={User}
                    iconColor="text-blue-600"
                    description="Datos personales y de contacto del nuevo trabajador"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                      {/* Campo de Aula - Solo para docentes */}
                      {isDocente && (
                        <FormField
                          label="Aula Asignada"
                          required
                          error={errors.idAula?.message}
                          className="md:col-span-2 lg:col-span-3"
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
                        </FormField>
                      )}
                    </div>
                  </FormSection>

                  {/* 2. Información del Sueldo */}
                  <FormSection
                    title="Información del Sueldo"
                    icon={DollarSign}
                    iconColor="text-green-600"
                    description="Configuración salarial y beneficios del trabajador"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Sueldo Base" required error={errors.sueldoBase?.message}>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">S/</span>
                          <input
                            type="number"
                            step="0.01"
                            {...register('sueldoBase')}
                            className={`${inputClassName(errors.sueldoBase)} pl-8`}
                            placeholder="0.00"
                            disabled={isLoading}
                          />
                        </div>
                      </FormField>

                      <FormField label="Bonificación" error={errors.bonificacion?.message}>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">S/</span>
                          <input
                            type="number"
                            step="0.01"
                            {...register('bonificacion')}
                            className={`${inputClassName(errors.bonificacion)} pl-8`}
                            placeholder="0.00"
                            disabled={isLoading}
                          />
                        </div>
                      </FormField>

                      <FormField label="Asignación" error={errors.asignacion?.message}>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">S/</span>
                          <input
                            type="number"
                            step="0.01"
                            {...register('asignacion')}
                            className={`${inputClassName(errors.asignacion)} pl-8`}
                            placeholder="0.00"
                            disabled={isLoading}
                          />
                        </div>
                      </FormField>

                      <FormField label="Fecha de Asignación" required error={errors.fechaAsignacion?.message}>
                        <input
                          type="date"
                          {...register('fechaAsignacion')}
                          className={inputClassName(errors.fechaAsignacion)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Fecha Vigencia Desde" required error={errors.fechaVigenciaDesde?.message}>
                        <input
                          type="date"
                          {...register('fechaVigenciaDesde')}
                          className={inputClassName(errors.fechaVigenciaDesde)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Fecha Hasta" error={errors.fechaHasta?.message}>
                        <input
                          type="date"
                          {...register('fechaHasta')}
                          className={inputClassName(errors.fechaHasta)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Estado del Sueldo" error={errors.estaActivoSueldo?.message}>
                        <select
                          {...register('estaActivoSueldo')}
                          className={inputClassName(errors.estaActivoSueldo)}
                          disabled={isLoading}
                        >
                          <option value={true}>Activo</option>
                          <option value={false}>Inactivo</option>
                        </select>
                      </FormField>

                      <FormField label="Observaciones" error={errors.observacionesSueldo?.message} className="md:col-span-2 lg:col-span-3">
                        <textarea
                          {...register('observacionesSueldo')}
                          rows={3}
                          className={inputClassName(errors.observacionesSueldo)}
                          placeholder="Observaciones adicionales sobre el sueldo..."
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* 3. Información del Contrato */}
                  <FormSection
                    title="Información del Contrato"
                    icon={FileText}
                    iconColor="text-purple-600"
                    description="Detalles del contrato laboral y condiciones de trabajo"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Tipo de Contrato" required error={errors.idTipoContrato?.message}>
                        <select
                          {...register('idTipoContrato')}
                          className={inputClassName(errors.idTipoContrato)}
                          disabled={isLoading || loadingTiposContrato}
                        >
                          <option value="">
                            {loadingTiposContrato ? 'Cargando tipos de contrato...' : 'Seleccione tipo de contrato'}
                          </option>
                          {Array.isArray(tiposContrato) && tiposContrato.map((tipo) => (
                            <option key={tipo.idTipoContrato} value={tipo.idTipoContrato}>
                              {tipo.nombreTipo}
                            </option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Número de Contrato" error={errors.numeroContrato?.message}>
                        <input
                          {...register('numeroContrato')}
                          className={inputClassName(errors.numeroContrato)}
                          placeholder="Se genera automáticamente"
                          disabled={isLoading}
                          readOnly
                        />
                      </FormField>

                      <FormField label="Fecha de Inicio" required error={errors.fechaInicio?.message}>
                        <input
                          type="date"
                          {...register('fechaInicio')}
                          className={inputClassName(errors.fechaInicio)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Fecha de Fin" error={errors.fechaFin?.message}>
                        <input
                          type="date"
                          {...register('fechaFin')}
                          className={inputClassName(errors.fechaFin)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Jornada Laboral" required error={errors.jornadaLaboral?.message}>
                        <select
                          {...register('jornadaLaboral')}
                          className={inputClassName(errors.jornadaLaboral)}
                          disabled={isLoading}
                        >
                          <option value="Tiempo Completo">Tiempo Completo</option>
                          <option value="Medio Tiempo">Medio Tiempo</option>
                          <option value="Tiempo Parcial">Tiempo Parcial</option>
                        </select>
                      </FormField>

                      <FormField label="Horas Semanales" required error={errors.horasSemanales?.message}>
                        <input
                          type="number"
                          {...register('horasSemanales')}
                          className={inputClassName(errors.horasSemanales)}
                          placeholder="40"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Lugar de Trabajo" error={errors.lugarTrabajo?.message}>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                          <input
                            {...register('lugarTrabajo')}
                            className={`${inputClassName(errors.lugarTrabajo)} pl-10`}
                            placeholder="Ej: Institución Educativa XYZ"
                            disabled={isLoading}
                          />
                        </div>
                      </FormField>

                      <FormField label="Renovación Automática" error={errors.renovacion?.message}>
                        <select
                          {...register('renovacion')}
                          className={inputClassName(errors.renovacion)}
                          disabled={isLoading}
                        >
                          <option value={true}>Sí</option>
                          <option value={false}>No</option>
                        </select>
                      </FormField>

                      <FormField label="Días de Aviso" error={errors.diasAviso?.message}>
                        <input
                          type="number"
                          {...register('diasAviso')}
                          className={inputClassName(errors.diasAviso)}
                          placeholder="30"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Estado del Contrato" error={errors.aprobado?.message}>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <select
                            {...register('aprobado')}
                            className={inputClassName(errors.aprobado)}
                            disabled={isLoading}
                          >
                            <option value={true}>Aprobado</option>
                            <option value={false}>Pendiente</option>
                          </select>
                        </div>
                      </FormField>

                      <FormField label="Fecha de Aprobación" error={errors.fechaAprobacion?.message}>
                        <input
                          type="date"
                          {...register('fechaAprobacion')}
                          className={inputClassName(errors.fechaAprobacion)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Descripción de Funciones" error={errors.descripcionFunciones?.message} className="md:col-span-2 lg:col-span-3">
                        <textarea
                          {...register('descripcionFunciones')}
                          rows={3}
                          className={inputClassName(errors.descripcionFunciones)}
                          placeholder="Describa las funciones y responsabilidades del puesto..."
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField label="Archivos Adjuntos" error={errors.archivos?.message} className="md:col-span-2 lg:col-span-3">
                        <div className="space-y-2">
                          <input
                            type="file"
                            {...register('archivos')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>Formatos permitidos: PDF, Word, Excel, imágenes (máx. 10MB)</span>
                          </div>
                          {watch('archivos') && watch('archivos').length > 0 && (
                            <div className="text-sm text-blue-600">
                              📎 {watch('archivos').length} archivo(s) seleccionado(s)
                            </div>
                          )}
                        </div>
                      </FormField>
                    </div>
                  </FormSection>
                </form>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
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
                        {asignandoAula ? 'Asignando aula...' : 'Guardando...'}
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