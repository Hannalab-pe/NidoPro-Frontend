import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, UserPlus, DollarSign, User, Users, School, Baby, Upload, Save, Loader2, Search, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useMatricula } from '../../../../hooks/useMatricula';
import { useAulasAsignacion } from '../../../../hooks/useAulasAsignacion';
import { useApoderados } from '../../../../hooks/useApoderados';
import FormField from '../../../../components/common/FormField';

const schema = yup.object({
  // Información de Matrícula
  costoMatricula: yup.number()
    .required('El costo de matrícula es requerido')
    .positive('El costo debe ser mayor a 0'),
  fechaIngreso: yup.string()
    .required('La fecha de ingreso es requerida'),
  idGrado: yup.string()
    .required('El grado es requerido'),
  metodoPago: yup.string()
    .required('El método de pago es requerido'),
  
  // Información del Estudiante
  estudianteNombre: yup.string()
    .required('El nombre del estudiante es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  estudianteApellido: yup.string()
    .required('El apellido del estudiante es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  estudianteTipoDoc: yup.string()
    .required('El tipo de documento es requerido'),
  estudianteDocumento: yup.string()
    .required('El número de documento es requerido')
    .min(8, 'El documento debe tener al menos 8 caracteres'),
  contactoEmergencia: yup.string()
    .required('El contacto de emergencia es requerido'),
  nroEmergencia: yup.string()
    .required('El número de emergencia es requerido'),
  
  // Información del Apoderado
  apoderadoNombre: yup.string()
    .required('El nombre del apoderado es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  apoderadoApellido: yup.string()
    .required('El apellido del apoderado es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  apoderadoTipoDoc: yup.string()
    .required('El tipo de documento es requerido'),
  apoderadoDocumento: yup.string()
    .required('El número de documento es requerido')
    .min(8, 'El documento debe tener al menos 8 caracteres'),
  apoderadoTelefono: yup.string()
    .required('El teléfono es requerido'),
  apoderadoCorreo: yup.string()
    .required('El correo es requerido')
    .email('Debe ser un correo válido'),
  apoderadoDireccion: yup.string()
    .required('La dirección es requerida'),

  // Asignación de Aula
  tipoAsignacionAula: yup.string()
    .required('El tipo de asignación es requerido'),
  idAulaEspecifica: yup.string()
    .when('tipoAsignacionAula', {
      is: 'manual',
      then: (schema) => schema.required('Debe seleccionar un aula específica'),
      otherwise: (schema) => schema.nullable()
    }),
  
  // Campos opcionales
  observaciones: yup.string(),
  motivoPreferencia: yup.string()
});

const ModalAgregarMatricula = ({ isOpen, onClose, refetch }) => {
  const { matricularEstudiante, loading } = useMatricula();
  const { aulas, loadingAulas, fetchAulasPorGrado } = useAulasAsignacion();
  const { apoderados, loadingApoderados, searchApoderados } = useApoderados();
  
  const [voucherImage, setVoucherImage] = useState(null);
  const [voucherFile, setVoucherFile] = useState(null);
  const [uploadingVoucher, setUploadingVoucher] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showApoderadoSearch, setShowApoderadoSearch] = useState(false);
  const [selectedApoderado, setSelectedApoderado] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      metodoPago: 'Transferencia',
      estudianteTipoDoc: 'DNI',
      apoderadoTipoDoc: 'DNI',
      tipoAsignacionAula: 'manual',
      fechaIngreso: new Date().toISOString().split('T')[0]
    }
  });

  const selectedGrado = watch('idGrado');
  const tipoAsignacionAula = watch('tipoAsignacionAula');

  // Opciones predefinidas
  const grados = [
    { id: 1, nombre: '3 años' },
    { id: 2, nombre: '4 años' },
    { id: 3, nombre: '5 años' }
  ];

  const metodosPago = ['Transferencia', 'Depósito', 'Efectivo', 'Tarjeta'];
  const tiposDocumento = ['DNI', 'Carnet de Extranjería', 'Pasaporte'];

  // Efectos
  useEffect(() => {
    if (selectedGrado) {
      fetchAulasPorGrado(selectedGrado);
    }
  }, [selectedGrado, fetchAulasPorGrado]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchApoderados(searchTerm);
    }
  }, [searchTerm, searchApoderados]);

  // Funciones de manejo
  const handleClose = () => {
    reset();
    setVoucherImage(null);
    setVoucherFile(null);
    setSearchTerm('');
    setSelectedApoderado(null);
    setShowApoderadoSearch(false);
    onClose();
  };

  const handleSelectApoderado = (apoderado) => {
    setSelectedApoderado(apoderado);
    setValue('apoderadoNombre', apoderado.nombre);
    setValue('apoderadoApellido', apoderado.apellido);
    setValue('apoderadoTipoDoc', apoderado.tipoDocumento || 'DNI');
    setValue('apoderadoDocumento', apoderado.documentoIdentidad || '');
    setValue('apoderadoTelefono', apoderado.numero || '');
    setValue('apoderadoCorreo', apoderado.correo || '');
    setValue('apoderadoDireccion', apoderado.direccion || '');
    setShowApoderadoSearch(false);
    setSearchTerm('');
  };

  const clearSelectedApoderado = () => {
    setSelectedApoderado(null);
    setValue('apoderadoNombre', '');
    setValue('apoderadoApellido', '');
    setValue('apoderadoTipoDoc', 'DNI');
    setValue('apoderadoDocumento', '');
    setValue('apoderadoTelefono', '');
    setValue('apoderadoCorreo', '');
    setValue('apoderadoDireccion', '');
  };

  const onSubmit = async (data) => {
    try {
      let voucherUrl = null;

      if (voucherFile) {
        setUploadingVoucher(true);
        const formData = new FormData();
        formData.append('image', voucherFile);

        const uploadResponse = await fetch('http://localhost:3000/api/v1/upload/cloudinary', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir el voucher');
        }

        const uploadResult = await uploadResponse.json();
        voucherUrl = uploadResult.secure_url;
        setUploadingVoucher(false);
      }

      const matriculaData = {
        // Información de matrícula
        costoMatricula: parseFloat(data.costoMatricula),
        fechaIngreso: data.fechaIngreso,
        idGrado: parseInt(data.idGrado),
        metodoPago: data.metodoPago,
        voucherUrl,
        
        // Información del estudiante
        estudiante: {
          nombre: data.estudianteNombre,
          apellido: data.estudianteApellido,
          tipoDocumento: data.estudianteTipoDoc,
          numeroDocumento: data.estudianteDocumento,
          contactoEmergencia: data.contactoEmergencia,
          numeroEmergencia: data.nroEmergencia,
          observaciones: data.observaciones
        },
        
        // Información del apoderado
        apoderado: selectedApoderado ? {
          id: selectedApoderado.id
        } : {
          nombre: data.apoderadoNombre,
          apellido: data.apoderadoApellido,
          tipoDocumento: data.apoderadoTipoDoc,
          numeroDocumento: data.apoderadoDocumento,
          telefono: data.apoderadoTelefono,
          correo: data.apoderadoCorreo,
          direccion: data.apoderadoDireccion
        },
        
        // Asignación de aula
        asignacionAula: {
          tipo: data.tipoAsignacionAula,
          idAulaEspecifica: data.tipoAsignacionAula === 'manual' ? parseInt(data.idAulaEspecifica) : null,
          motivoPreferencia: data.motivoPreferencia
        }
      };

      await matricularEstudiante(matriculaData);
      
      toast.success('Estudiante matriculado exitosamente');
      handleClose();
      if (refetch) refetch();
    } catch (error) {
      console.error('Error al matricular:', error);
      toast.error(error.message || 'Error al matricular estudiante');
      setUploadingVoucher(false);
    }
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
          <div className="flex min-h-full items-center justify-center p-2 text-center">
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
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Matricular Nuevo Estudiante
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Complete la información del estudiante para registrar su matrícula
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
                  {/* Layout principal: 4 cuadrantes (2x2 grid) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* CUADRANTE SUPERIOR IZQUIERDO: INFORMACIÓN DE MATRÍCULA */}
                    <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <DollarSign className="w-6 h-6 mr-3 text-blue-600" />
                        Información de Matrícula
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Costo de Matrícula (S/.)"
                          error={errors.costoMatricula?.message}
                          required
                        >
                          <input
                            {...register('costoMatricula')}
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: 150.00"
                          />
                        </FormField>

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
                          label="Grado"
                          error={errors.idGrado?.message}
                          required
                        >
                          <select
                            {...register('idGrado')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar grado</option>
                            {grados.map((grado) => (
                              <option key={grado.id} value={grado.id}>
                                {grado.nombre}
                              </option>
                            ))}
                          </select>
                        </FormField>

                        <FormField
                          label="Método de Pago"
                          error={errors.metodoPago?.message}
                          required
                        >
                          <select
                            {...register('metodoPago')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {metodosPago.map((metodo) => (
                              <option key={metodo} value={metodo}>
                                {metodo}
                              </option>
                            ))}
                          </select>
                        </FormField>
                      </div>

                      {/* Voucher de Pago */}
                      <div className="mt-6">
                        <FormField
                          label="Voucher de Pago"
                          className="mb-4"
                        >
                          <div className="relative w-full">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                              {voucherImage ? (
                                <div className="relative">
                                  <img 
                                    src={voucherImage} 
                                    alt="Voucher" 
                                    className="max-h-32 mx-auto rounded-lg object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVoucherImage(null);
                                      setVoucherFile(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="py-4">
                                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-600 mb-2">
                                    Subir voucher de pago
                                  </p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        setVoucherFile(file);
                                        const reader = new FileReader();
                                        reader.onload = (e) => setVoucherImage(e.target.result);
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="hidden"
                                    id="voucher-upload"
                                  />
                                  <label
                                    htmlFor="voucher-upload"
                                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                                  >
                                    Seleccionar archivo
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </FormField>
                      </div>
                    </div>

                    {/* CUADRANTE SUPERIOR DERECHO: INFORMACIÓN DEL ESTUDIANTE */}
                    <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <User className="w-6 h-6 mr-3 text-green-600" />
                        Información del Estudiante
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Nombre"
                          error={errors.estudianteNombre?.message}
                          required
                        >
                          <input
                            {...register('estudianteNombre')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: María"
                          />
                        </FormField>

                        <FormField
                          label="Apellido"
                          error={errors.estudianteApellido?.message}
                          required
                        >
                          <input
                            {...register('estudianteApellido')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: García"
                          />
                        </FormField>

                        <FormField
                          label="Tipo de Documento"
                          error={errors.estudianteTipoDoc?.message}
                          required
                        >
                          <select
                            {...register('estudianteTipoDoc')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {tiposDocumento.map((tipo) => (
                              <option key={tipo} value={tipo}>
                                {tipo}
                              </option>
                            ))}
                          </select>
                        </FormField>

                        <FormField
                          label="Número de Documento"
                          error={errors.estudianteDocumento?.message}
                          required
                        >
                          <input
                            {...register('estudianteDocumento')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: 87654321"
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
                            placeholder="Ej: Ana García"
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
                            placeholder="Ej: 987654321"
                          />
                        </FormField>
                      </div>
                      
                      {/* Observaciones */}
                      <div className="mt-6">
                        <FormField
                          label="Observaciones"
                          error={errors.observaciones?.message}
                        >
                          <textarea
                            {...register('observaciones')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Observaciones adicionales sobre el estudiante (opcional)"
                          />
                        </FormField>
                      </div>
                    </div>

                    {/* CUADRANTE INFERIOR IZQUIERDO: INFORMACIÓN DEL APODERADO */}
                    <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Users className="w-6 h-6 mr-3 text-green-600" />
                          Información del Apoderado
                        </h3>
                        
                        {/* Botón para buscar apoderado existente */}
                        {!selectedApoderado && (
                          <button
                            type="button"
                            onClick={() => setShowApoderadoSearch(!showApoderadoSearch)}
                            className="flex items-center space-x-2 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Search className="w-4 h-4" />
                            <span>Buscar Existente</span>
                          </button>
                        )}
                        
                        {/* Indicador de apoderado seleccionado */}
                        {selectedApoderado && (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                              <UserCheck className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {selectedApoderado.nombre} {selectedApoderado.apellido}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={clearSelectedApoderado}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                              title="Limpiar selección"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Buscador de apoderados */}
                      {showApoderadoSearch && !selectedApoderado && (
                        <div className="mb-6 relative">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Buscar por nombre o apellido del apoderado..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          {/* Lista de resultados */}
                          {searchTerm.length >= 2 && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {loadingApoderados ? (
                                <div className="p-4 text-center text-gray-500">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                  <p className="mt-2">Buscando...</p>
                                </div>
                              ) : apoderados.length > 0 ? (
                                apoderados.map((apoderado) => (
                                  <button
                                    key={apoderado.id}
                                    type="button"
                                    onClick={() => handleSelectApoderado(apoderado)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Users className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {apoderado.nombre} {apoderado.apellido}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          DNI: {apoderado.documentoIdentidad || 'No registrado'} {apoderado.numero && ` • Tel: ${apoderado.numero}`}
                                        </p>
                                      </div>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="p-4 text-center text-gray-500">
                                  <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                  <p>No se encontraron apoderados</p>
                                  <p className="text-xs mt-1">Búsqueda: "{searchTerm}"</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Nombre"
                            error={errors.apoderadoNombre?.message}
                            required
                          >
                            <input
                              {...register('apoderadoNombre')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej: Juan"
                            />
                          </FormField>

                          <FormField
                            label="Apellido"
                            error={errors.apoderadoApellido?.message}
                            required
                          >
                            <input
                              {...register('apoderadoApellido')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej: Pérez"
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Tipo de Documento"
                            error={errors.apoderadoTipoDoc?.message}
                            required
                          >
                            <select
                              {...register('apoderadoTipoDoc')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {tiposDocumento.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                  {tipo}
                                </option>
                              ))}
                            </select>
                          </FormField>

                          <FormField
                            label="Número de Documento"
                            error={errors.apoderadoDocumento?.message}
                            required
                          >
                            <input
                              {...register('apoderadoDocumento')}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej: 12345678"
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Teléfono"
                            error={errors.apoderadoTelefono?.message}
                            required
                          >
                            <input
                              {...register('apoderadoTelefono')}
                              type="tel"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej: +51987654321"
                            />
                          </FormField>

                          <FormField
                            label="Correo Electrónico"
                            error={errors.apoderadoCorreo?.message}
                            required
                          >
                            <input
                              {...register('apoderadoCorreo')}
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej: correo@ejemplo.com"
                            />
                          </FormField>
                        </div>

                        <FormField
                          label="Dirección"
                          error={errors.apoderadoDireccion?.message}
                          required
                        >
                          <textarea
                            {...register('apoderadoDireccion')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Av. Siempre Viva 123, San Isidro, Lima"
                          />
                        </FormField>
                      </div>
                    </div>

                    {/* CUADRANTE INFERIOR DERECHO: ASIGNACIÓN DE AULA */}
                    <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <School className="w-6 h-6 mr-3 text-blue-600" />
                        Asignación de Aula
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Tipo de Asignación"
                          error={errors.tipoAsignacionAula?.message}
                          required
                        >
                          <select
                            {...register('tipoAsignacionAula')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="manual">Asignación Manual</option>
                            <option value="automatica">Asignación Automática</option>
                          </select>
                        </FormField>

                        {tipoAsignacionAula === 'manual' && (
                          <FormField
                            label="Aula Específica"
                            error={errors.idAulaEspecifica?.message}
                            required
                          >
                            <select
                              {...register('idAulaEspecifica')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={loadingAulas}
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
                          </FormField>
                        )}
                      </div>

                      {tipoAsignacionAula === 'manual' && (
                        <div className="mt-4">
                          <FormField
                            label="Motivo de Preferencia (Opcional)"
                            error={errors.motivoPreferencia?.message}
                          >
                            <textarea
                              {...register('motivoPreferencia')}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej: Hermano en la misma sección, cercanía al hogar, etc."
                            />
                          </FormField>
                        </div>
                      )}

                      {tipoAsignacionAula === 'automatica' && (
                        <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <School className="w-4 h-4 inline mr-1" />
                            El sistema asignará automáticamente el aula más adecuada según disponibilidad y criterios del centro educativo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploadingVoucher}
                      className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {uploadingVoucher ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Subiendo voucher...
                        </>
                      ) : loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Matriculando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Matricular Estudiante
                        </>
                      )}
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

export default ModalAgregarMatricula;