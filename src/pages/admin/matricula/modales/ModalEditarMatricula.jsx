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
  Users,
  FileText,
  Save,
  Edit,
  Loader2,
  Baby
} from 'lucide-react';
import ImageUploader from '../../../../components/common/ImageUploader';
import { useMatricula } from '../../../../hooks/useMatricula';

// Esquema de validación con Yup
const validationSchema = yup.object({
  name: yup.string().required('El nombre es requerido').trim(),
  lastName: yup.string().required('El apellido es requerido').trim(),
  email: yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  phone: yup.string().required('El teléfono es requerido').trim(),
  grade: yup.string().required('El grado es requerido'),
  birthDate: yup.date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'La fecha no puede ser futura'),
  address: yup.string().required('La dirección es requerida').trim(),
  parentName: yup.string().required('El nombre del padre/madre es requerido').trim(),
  parentPhone: yup.string().required('El teléfono del padre/madre es requerido').trim(),
  parentEmail: yup.string()
    .email('El email del padre/madre no es válido')
    .required('El email del padre/madre es requerido'),
  photo: yup.object().nullable(),
  medicalConditions: yup.string(),
  allergies: yup.string(),
  notes: yup.string()
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

const ModalEditarMatricula = ({ isOpen, onClose, estudiante }) => {
  const { updateStudent, loading } = useMatricula();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const photo = watch('photo');

  // Cargar datos del estudiante cuando se abre el modal
  useEffect(() => {
    if (estudiante && isOpen) {
      const formattedDate = estudiante.birthDate 
        ? new Date(estudiante.birthDate).toISOString().split('T')[0]
        : '';

      reset({
        name: estudiante.name || '',
        lastName: estudiante.lastName || '',
        email: estudiante.email || '',
        phone: estudiante.phone || '',
        grade: estudiante.grade || '',
        birthDate: formattedDate,
        address: estudiante.address || '',
        parentName: estudiante.parentName || '',
        parentPhone: estudiante.parentPhone || '',
        parentEmail: estudiante.parentEmail || '',
        photo: estudiante.photo || null,
        medicalConditions: estudiante.medicalConditions || '',
        allergies: estudiante.allergies || '',
        notes: estudiante.notes || ''
      });
    }
  }, [estudiante, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      await updateStudent(estudiante.id, data);
      onClose();
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleImageUpload = (imageData) => {
    setValue('photo', imageData);
  };

  const grados = [
    'Preescolar',
    '1° Primaria',
    '2° Primaria', 
    '3° Primaria',
    '4° Primaria',
    '5° Primaria',
    '6° Primaria',
    '7° Básica',
    '8° Básica',
    '9° Básica',
    '10° Media',
    '11° Media'
  ];

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                        Modifique la información de matrícula de {estudiante.name} {estudiante.lastName}
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
                  <div className="flex justify-center">
                    <ImageUploader
                      onImageUpload={handleImageUpload}
                      currentImage={photo}
                      className="w-32 h-32"
                    />
                  </div>

                  {/* Información Personal */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Información Personal del Estudiante
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nombre"
                        error={errors.name?.message}
                        required
                      >
                        <input
                          {...register('name')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese el nombre"
                        />
                      </FormField>

                      <FormField
                        label="Apellido"
                        error={errors.lastName?.message}
                        required
                      >
                        <input
                          {...register('lastName')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese el apellido"
                        />
                      </FormField>

                      <FormField
                        label="Fecha de Nacimiento"
                        error={errors.birthDate?.message}
                        required
                      >
                        <input
                          {...register('birthDate')}
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormField>

                      <FormField
                        label="Grado"
                        error={errors.grade?.message}
                        required
                      >
                        <select
                          {...register('grade')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccione un grado</option>
                          {grados.map((grado) => (
                            <option key={grado} value={grado}>
                              {grado}
                            </option>
                          ))}
                        </select>
                      </FormField>

                      <FormField
                        label="Email del Estudiante"
                        error={errors.email?.message}
                        required
                        className="md:col-span-2"
                      >
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="estudiante@ejemplo.com"
                        />
                      </FormField>

                      <FormField
                        label="Teléfono"
                        error={errors.phone?.message}
                        required
                      >
                        <input
                          {...register('phone')}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese el teléfono"
                        />
                      </FormField>

                      <FormField
                        label="Dirección"
                        error={errors.address?.message}
                        required
                      >
                        <input
                          {...register('address')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ingrese la dirección"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Información del Padre/Madre */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Información del Padre/Madre o Acudiente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nombre Completo"
                        error={errors.parentName?.message}
                        required
                      >
                        <input
                          {...register('parentName')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre del padre/madre"
                        />
                      </FormField>

                      <FormField
                        label="Teléfono"
                        error={errors.parentPhone?.message}
                        required
                      >
                        <input
                          {...register('parentPhone')}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Teléfono del padre/madre"
                        />
                      </FormField>

                      <FormField
                        label="Email"
                        error={errors.parentEmail?.message}
                        required
                        className="md:col-span-2"
                      >
                        <input
                          {...register('parentEmail')}
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="padre@ejemplo.com"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Información Médica */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <Baby className="w-5 h-5 mr-2 text-red-600" />
                      Información Médica (Opcional)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Condiciones Médicas"
                        error={errors.medicalConditions?.message}
                      >
                        <textarea
                          {...register('medicalConditions')}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Condiciones médicas relevantes"
                        />
                      </FormField>

                      <FormField
                        label="Alergias"
                        error={errors.allergies?.message}
                      >
                        <textarea
                          {...register('allergies')}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Alergias conocidas"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Notas Adicionales */}
                  <FormField
                    label="Notas Adicionales"
                    error={errors.notes?.message}
                  >
                    <textarea
                      {...register('notes')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Información adicional relevante"
                    />
                  </FormField>

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
                      disabled={loading}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
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
