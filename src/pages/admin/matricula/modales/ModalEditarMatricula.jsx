import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap,
  Calendar,
  Users,
  FileText,
  Save,
  Edit,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useMatricula } from '../../../../hooks/useMatricula';
import { matriculaKeys } from '../../../../hooks/queries/useMatriculaQueries';
import matriculaService from '../../../../services/matriculaService';

// Esquema de validación actualizado según estructura real
const validationSchema = yup.object({
  // Datos del estudiante (solo campos editables que existen)
  nombreEstudiante: yup.string()
    .required('El nombre del estudiante es requerido')
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  apellidoEstudiante: yup.string()
    .required('El apellido del estudiante es requerido')
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  observacionesEstudiante: yup.string().trim(),
  
  // Datos del apoderado
  nombreApoderado: yup.string()
    .required('El nombre del apoderado es requerido')
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  apellidoApoderado: yup.string()
    .required('El apellido del apoderado es requerido')
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  numeroApoderado: yup.string().required('El teléfono del apoderado es requerido').trim(),
  correoApoderado: yup.string()
    .email('El email del apoderado no es válido')
    .required('El email del apoderado es requerido'),
  direccionApoderado: yup.string().trim(),
  
  // Contactos de emergencia
  nombreContacto: yup.string()
    .required('El nombre del contacto de emergencia es requerido')
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  apellidoContacto: yup.string()
    .required('El apellido del contacto de emergencia es requerido')
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  telefonoContacto: yup.string().required('El teléfono de emergencia es requerido').trim(),
  emailContacto: yup.string().email('El email del contacto no es válido').trim(),
  tipoContacto: yup.string().required('El tipo de contacto es requerido')
});

// Componente FormField reutilizable
const FormField = ({ label, error, required, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ModalEditarMatricula = ({ isOpen, onClose, matricula, onSave }) => {
  // Validación temprana para evitar errores de undefined
  if (!matricula) {
    return null;
  }

  const queryClient = useQueryClient();
  const [matriculaCompleta, setMatriculaCompleta] = useState(null);
  const [loadingContactos, setLoadingContactos] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  // Cargar datos completos de la matrícula cuando se abre el modal
  useEffect(() => {
    const cargarMatriculaCompleta = async () => {
      if (matricula && isOpen && matricula.idEstudiante?.idEstudiante) {
        setLoadingContactos(true);
        try {
          console.log('🔍 Cargando matrícula completa para estudiante:', matricula.idEstudiante.idEstudiante);
          
          // Intentar obtener la matrícula completa con contactos
          const matriculaConContactos = await matriculaService.getMatriculaByEstudianteId(matricula.idEstudiante.idEstudiante);
          
          console.log('✅ Matrícula completa obtenida:', matriculaConContactos);
          setMatriculaCompleta(matriculaConContactos);
          
        } catch (error) {
          console.error('❌ Error al cargar matrícula completa:', error);
          // Si falla, usar la matrícula original
          setMatriculaCompleta(matricula);
        } finally {
          setLoadingContactos(false);
        }
      } else {
        // Si no tenemos ID de estudiante, usar directamente la matrícula original
        setMatriculaCompleta(matricula);
        setLoadingContactos(false);
      }
    };

    cargarMatriculaCompleta();
  }, [matricula, isOpen]);

  // Cargar datos del formulario cuando tenemos la matrícula completa
  useEffect(() => {
    if (matriculaCompleta && isOpen) {
      console.log('📋 Cargando datos en el formulario...');
      console.log('📋 Matrícula completa:', matriculaCompleta);
      
      // Extraer entidades relacionadas de la estructura real
      const estudiante = matriculaCompleta.idEstudiante || {};
      const apoderado = matriculaCompleta.idApoderado || {};
      const contactosEmergencia = estudiante.contactosEmergencia || [];
      const contactoPrincipal = contactosEmergencia.find(c => c.esPrincipal) || contactosEmergencia[0] || {};

      console.log('👤 Estudiante:', estudiante);
      console.log('👨‍👩‍👧‍👦 Contactos emergencia:', contactosEmergencia);
      console.log('📞 Contacto principal:', contactoPrincipal);

      // Si no hay contactos, mostrar mensaje informativo
      if (contactosEmergencia.length === 0) {
        console.log('⚠️ No hay contactos de emergencia registrados. El usuario podrá agregar información.');
      }

      const formattedFechaIngreso = matriculaCompleta.fechaIngreso 
        ? new Date(matriculaCompleta.fechaIngreso).toISOString().split('T')[0]
        : '';

      const formData = {
        // Datos del estudiante - solo campos editables
        nombreEstudiante: estudiante.nombre || '',
        apellidoEstudiante: estudiante.apellido || '',
        observacionesEstudiante: estudiante.observaciones || '',
        
        // Datos del apoderado - solo los que existen
        nombreApoderado: apoderado.nombre || '',
        apellidoApoderado: apoderado.apellido || '',
        numeroApoderado: apoderado.numero || '',
        correoApoderado: apoderado.correo || '',
        direccionApoderado: apoderado.direccion || '',
        
        // Contacto de emergencia principal - campos vacíos si no hay datos
        nombreContacto: contactoPrincipal.nombre || '',
        apellidoContacto: contactoPrincipal.apellido || '',
        telefonoContacto: contactoPrincipal.telefono || '',
        emailContacto: contactoPrincipal.email || '',
        tipoContacto: contactoPrincipal.tipoContacto || '',
        
        // Datos de matrícula (solo los que se pueden editar según el API)
        // No incluimos fechaIngreso, costoMatricula, etc.
      };

      console.log('📝 Datos del formulario:', formData);
      reset(formData);
    }
  }, [matriculaCompleta, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);

      // Usar la matrícula completa si está disponible, sino la original
      const matriculaToUse = matriculaCompleta || matricula;

      console.log('📝 Iniciando actualización con nuevo endpoint...');
      console.log('📝 Datos del formulario:', data);
      console.log('📝 Matrícula a actualizar:', matriculaToUse);

      // Preparar datos del apoderado para el nuevo endpoint
      const apoderadoData = {
        numero: data.numeroApoderado,
        direccion: data.direccionApoderado,
        correo: data.correoApoderado
      };

      // Preparar datos del estudiante para el nuevo endpoint
      const estudianteData = {
        nombre: data.nombreEstudiante,
        apellido: data.apellidoEstudiante
      };

      // Preparar contactos de emergencia existentes
      const contactosEmergencia = [];
      const contactosExistentes = matriculaToUse.idEstudiante?.contactosEmergencia || [];

      // Si hay un contacto principal existente, incluirlo para actualización
      const contactoPrincipal = contactosExistentes.find(c => c.esPrincipal) || contactosExistentes[0];
      if (contactoPrincipal) {
        contactosEmergencia.push({
          idContactoEmergencia: contactoPrincipal.idContactoEmergencia || contactoPrincipal.id,
          nombre: data.nombreContacto,
          apellido: data.apellidoContacto,
          telefono: data.telefonoContacto,
          email: data.emailContacto,
          tipoContacto: data.tipoContacto,
          relacionEstudiante: data.tipoContacto, // Usar el mismo valor que tipoContacto
          prioridad: 1
        });
      }

      // Verificar que tenemos el ID de la matrícula
      const matriculaId = matriculaToUse.idMatricula || matriculaToUse.id;
      if (!matriculaId) {
        throw new Error('No se pudo obtener el ID de la matrícula');
      }

      console.log('📝 ID de matrícula:', matriculaId);

      // Preparar el payload para el nuevo endpoint
      const updatePayload = {
        apoderadoData,
        estudianteData,
        contactosEmergencia,
        nuevosContactos: [] // No agregamos nuevos contactos en esta versión
      };

      console.log('📦 Payload para nuevo endpoint:', JSON.stringify(updatePayload, null, 2));

      // Usar el nuevo endpoint PATCH
      await matriculaService.actualizarContactosMatricula(matriculaId, updatePayload);

      // Invalidar queries para refrescar los datos
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });

      toast.success('¡Información actualizada exitosamente!', {
        description: 'Los datos del apoderado y contactos han sido actualizados'
      });

      onSave(); // Llamar callback de éxito

    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      toast.error('Error al actualizar la información', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    } finally {
      setIsUpdating(false);
    }
  };  const handleClose = () => {
    reset();
    onClose();
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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Edit className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Editar Información del Estudiante
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Modifique la información de matrícula de {matricula?.idEstudiante?.nombre || ''} {matricula?.idEstudiante?.apellido || ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Layout en 2 columnas para pantallas grandes */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* Columna Izquierda */}
                    <div className="space-y-6">
                      {/* Información Personal del Estudiante */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Información Personal del Estudiante
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Nombre"
                            error={errors.nombreEstudiante?.message}
                            required
                          >
                            <input
                              {...register('nombreEstudiante')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ingrese el nombre"
                            />
                          </FormField>

                          <FormField
                            label="Apellido"
                            error={errors.apellidoEstudiante?.message}
                            required
                          >
                            <input
                              {...register('apellidoEstudiante')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ingrese el apellido"
                            />
                          </FormField>

                          <FormField
                            label="Observaciones del Estudiante"
                            error={errors.observacionesEstudiante?.message}
                            className="md:col-span-2"
                          >
                            <textarea
                              {...register('observacionesEstudiante')}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Observaciones sobre el estudiante"
                            />
                          </FormField>
                        </div>
                      </div>

                      {/* Información del Apoderado */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-green-600" />
                          Información del Apoderado
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Nombre"
                            error={errors.nombreApoderado?.message}
                            required
                          >
                            <input
                              {...register('nombreApoderado')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Nombre del apoderado"
                            />
                          </FormField>

                          <FormField
                            label="Apellido"
                            error={errors.apellidoApoderado?.message}
                            required
                          >
                            <input
                              {...register('apellidoApoderado')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Apellido del apoderado"
                            />
                          </FormField>

                          <FormField
                            label="Teléfono"
                            error={errors.numeroApoderado?.message}
                            required
                          >
                            <input
                              {...register('numeroApoderado')}
                              type="tel"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Teléfono del apoderado"
                            />
                          </FormField>

                          <FormField
                            label="Email"
                            error={errors.correoApoderado?.message}
                            required
                          >
                            <input
                              {...register('correoApoderado')}
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="apoderado@ejemplo.com"
                            />
                          </FormField>

                          <FormField
                            label="Dirección"
                            error={errors.direccionApoderado?.message}
                            className="md:col-span-2"
                          >
                            <input
                              {...register('direccionApoderado')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Dirección del apoderado"
                            />
                          </FormField>
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-6">
                      {/* Contacto de Emergencia */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                          <Phone className="w-5 h-5 mr-2 text-red-600" />
                          Contacto de Emergencia Principal
                          {loadingContactos && (
                            <Loader2 className="w-4 h-4 ml-2 animate-spin text-blue-500" />
                          )}
                        </h3>
                        
                        {loadingContactos ? (
                          <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                            <p className="text-gray-500 mt-2">Cargando contactos de emergencia...</p>
                          </div>
                        ) : (
                          <div>
                            {/* Mensaje informativo si no hay contactos en la base de datos */}
                            {(!matriculaCompleta?.idEstudiante?.contactosEmergencia || matriculaCompleta.idEstudiante.contactosEmergencia.length === 0) && (
                              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                  ⚠️ <strong>No hay contactos de emergencia registrados.</strong> 
                                  Puedes agregar la información aquí y se guardará cuando actualices la matrícula.
                                </p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                label="Nombre"
                                error={errors.nombreContacto?.message}
                                required
                              >
                                <input
                                  {...register('nombreContacto')}
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Nombre del contacto"
                                />
                              </FormField>

                              <FormField
                                label="Apellido"
                                error={errors.apellidoContacto?.message}
                                required
                              >
                                <input
                                  {...register('apellidoContacto')}
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Apellido del contacto"
                                />
                              </FormField>

                              <FormField
                                label="Teléfono"
                                error={errors.telefonoContacto?.message}
                                required
                              >
                                <input
                                  {...register('telefonoContacto')}
                                  type="tel"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Teléfono de emergencia"
                                />
                              </FormField>

                              <FormField
                                label="Email"
                                error={errors.emailContacto?.message}
                              >
                                <input
                                  {...register('emailContacto')}
                                  type="email"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="email@ejemplo.com"
                                />
                              </FormField>

                              <FormField
                                label="Tipo de Contacto"
                                error={errors.tipoContacto?.message}
                                required
                                className="md:col-span-2"
                              >
                                <select
                                  {...register('tipoContacto')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Seleccione tipo</option>
                                  <option value="Madre">Madre</option>
                                  <option value="Padre">Padre</option>
                                  <option value="Abuelo">Abuelo</option>
                                  <option value="Abuela">Abuela</option>
                                  <option value="Tío">Tío</option>
                                  <option value="Tía">Tía</option>
                                  <option value="Hermano">Hermano</option>
                                  <option value="Hermana">Hermana</option>
                                  <option value="Otro familiar">Otro familiar</option>
                                </select>
                              </FormField>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isUpdating ? 'Guardando...' : 'Guardar Cambios'}</span>
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalEditarMatricula;
