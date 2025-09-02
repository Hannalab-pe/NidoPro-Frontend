import React, { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  nombreEstudiante: yup.string().required('El nombre del estudiante es requerido').trim(),
  apellidoEstudiante: yup.string().required('El apellido del estudiante es requerido').trim(),
  nroDocumentoEstudiante: yup.string().required('El documento del estudiante es requerido').trim(),
  tipoDocumentoEstudiante: yup.string().required('El tipo de documento es requerido'),
  contactoEmergencia: yup.string().required('El contacto de emergencia es requerido').trim(),
  nroEmergencia: yup.string().required('El número de emergencia es requerido').trim(),
  observacionesEstudiante: yup.string().trim(),
  
  // Datos del apoderado
  nombreApoderado: yup.string().required('El nombre del apoderado es requerido').trim(),
  apellidoApoderado: yup.string().required('El apellido del apoderado es requerido').trim(),
  numeroApoderado: yup.string().required('El teléfono del apoderado es requerido').trim(),
  correoApoderado: yup.string()
    .email('El email del apoderado no es válido')
    .required('El email del apoderado es requerido'),
  direccionApoderado: yup.string().trim(),
  
  // Datos de matrícula
  costoMatricula: yup.number().required('El costo es requerido').positive('El costo debe ser positivo'),
  metodoPago: yup.string().required('El método de pago es requerido'),
  fechaIngreso: yup.date().required('La fecha de ingreso es requerida')
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

  // Mutation para actualizar estudiante
  const updateEstudianteMutation = useMutation({
    mutationFn: ({ id, data }) => matriculaService.updateEstudiante(id, data),
    onSuccess: () => {
      // Invalidar queries relacionadas con matrícula
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
    }
  });

  // Mutation para actualizar apoderado
  const updateApoderadoMutation = useMutation({
    mutationFn: ({ id, data }) => matriculaService.updateApoderado(id, data),
    onSuccess: () => {
      // Invalidar queries relacionadas con matrícula
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
    }
  });

  const isUpdating = updateEstudianteMutation.isPending || updateApoderadoMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  // Cargar datos de la matrícula cuando se abre el modal
  useEffect(() => {
    if (matricula && isOpen) {
      // Extraer entidades relacionadas de la estructura real
      const estudiante = matricula.idEstudiante || {};
      const apoderado = matricula.idApoderado || {};
      const grado = matricula.idGrado || {};

      const formattedFechaIngreso = matricula.fechaIngreso 
        ? new Date(matricula.fechaIngreso).toISOString().split('T')[0]
        : '';

      reset({
        // Datos del estudiante - solo los que existen en la estructura real
        nombreEstudiante: estudiante.nombre || '',
        apellidoEstudiante: estudiante.apellido || '',
        nroDocumentoEstudiante: estudiante.nroDocumento || '',
        tipoDocumentoEstudiante: estudiante.tipoDocumento || 'DNI',
        contactoEmergencia: estudiante.contactoEmergencia || '',
        nroEmergencia: estudiante.nroEmergencia || '',
        observacionesEstudiante: estudiante.observaciones || '',
        
        // Datos del apoderado - solo los que existen
        nombreApoderado: apoderado.nombre || '',
        apellidoApoderado: apoderado.apellido || '',
        numeroApoderado: apoderado.numero || '',
        correoApoderado: apoderado.correo || '',
        direccionApoderado: apoderado.direccion || '',
        
        // Datos de matrícula
        costoMatricula: matricula.costoMatricula || '',
        metodoPago: matricula.metodoPago || '',
        fechaIngreso: formattedFechaIngreso
      });
    }
  }, [matricula, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      // Extraer IDs del estudiante y apoderado
      const estudianteId = matricula.idEstudiante?.idEstudiante || matricula.idEstudiante?.id;
      const apoderadoId = matricula.idApoderado?.idApoderado || matricula.idApoderado?.id;
      
      // Preparar datos del estudiante para actualización
      const estudianteData = {
        nombre: data.nombreEstudiante,
        apellido: data.apellidoEstudiante,
        nroDocumento: data.nroDocumentoEstudiante,
        tipoDocumento: data.tipoDocumentoEstudiante,
        contactoEmergencia: data.contactoEmergencia,
        nroEmergencia: data.nroEmergencia,
        observaciones: data.observacionesEstudiante
      };
      
      // Preparar datos del apoderado para actualización
      const apoderadoData = {
        nombre: data.nombreApoderado,
        apellido: data.apellidoApoderado,
        numero: data.numeroApoderado,
        correo: data.correoApoderado,
        direccion: data.direccionApoderado
      };

      // Ejecutar las actualizaciones en paralelo
      const promises = [];
      
      if (estudianteId) {
        promises.push(
          updateEstudianteMutation.mutateAsync({ id: estudianteId, data: estudianteData })
        );
      }

      if (apoderadoId) {
        promises.push(
          updateApoderadoMutation.mutateAsync({ id: apoderadoId, data: apoderadoData })
        );
      }

      // Esperar a que se completen todas las actualizaciones
      await Promise.all(promises);

      toast.success('¡Información actualizada exitosamente!', {
        description: 'Los datos del estudiante y apoderado han sido actualizados'
      });
      
      onSave(); // Llamar callback de éxito
      
    } catch (error) {
      toast.error('Error al actualizar la información', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    }
  };

  const handleClose = () => {
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                  {/* Foto del estudiante */}

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
                        label="Tipo de Documento"
                        error={errors.tipoDocumentoEstudiante?.message}
                        required
                      >
                        <select
                          {...register('tipoDocumentoEstudiante')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="DNI">DNI</option>
                          <option value="Pasaporte">Pasaporte</option>
                          <option value="Carnet de Extranjería">Carnet de Extranjería</option>
                        </select>
                      </FormField>

                      <FormField
                        label="Número de Documento"
                        error={errors.nroDocumentoEstudiante?.message}
                        required
                      >
                        <input
                          {...register('nroDocumentoEstudiante')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese el número de documento"
                        />
                      </FormField>

                      <FormField
                        label="Contacto de Emergencia"
                        error={errors.contactoEmergencia?.message}
                        required
                      >
                        <input
                          {...register('contactoEmergencia')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre del contacto de emergencia"
                        />
                      </FormField>

                      <FormField
                        label="Número de Emergencia"
                        error={errors.nroEmergencia?.message}
                        required
                      >
                        <input
                          {...register('nroEmergencia')}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Teléfono de emergencia"
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

                  {/* Información de Matrícula */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                      Información de Matrícula
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Fecha de Ingreso"
                        error={errors.fechaIngreso?.message}
                        required
                      >
                        <input
                          {...register('fechaIngreso')}
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormField>

                      <FormField
                        label="Costo de Matrícula"
                        error={errors.costoMatricula?.message}
                        required
                      >
                        <input
                          {...register('costoMatricula')}
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </FormField>

                      <FormField
                        label="Método de Pago"
                        error={errors.metodoPago?.message}
                        required
                        className="md:col-span-2"
                      >
                        <select
                          {...register('metodoPago')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccione método</option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Transferencia bancaria">Transferencia bancaria</option>
                          <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                          <option value="Tarjeta de débito">Tarjeta de débito</option>
                        </select>
                      </FormField>
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
