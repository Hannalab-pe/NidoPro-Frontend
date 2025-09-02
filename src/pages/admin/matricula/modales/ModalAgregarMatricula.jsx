import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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
  UserPlus,
  Loader2,
  Baby,
  CreditCard,
  Upload,
  DollarSign,
  Search,
  UserCheck
} from 'lucide-react';
import ImageUploader from '../../../../components/common/ImageUploader';
import { toast } from 'sonner';
import { matriculaKeys } from '../../../../hooks/queries/useMatriculaQueries';
import matriculaService from '../../../../services/matriculaService';

// Esquema de validación con Yup según backend
const validationSchema = yup.object({
  // Datos de matrícula
  costoMatricula: yup.number().required('El costo de matrícula es requerido').positive('Debe ser mayor a 0'),
  fechaIngreso: yup.date().required('La fecha de ingreso es requerida'),
  idGrado: yup.string().required('El grado es requerido'),
  metodoPago: yup.string().required('El método de pago es requerido'),
  
  // Datos del apoderado
  apoderadoNombre: yup.string().required('El nombre del apoderado es requerido').trim(),
  apoderadoApellido: yup.string().required('El apellido del apoderado es requerido').trim(),
  apoderadoTipoDoc: yup.string().required('El tipo de documento del apoderado es requerido'),
  apoderadoDocumento: yup.string().required('El documento del apoderado es requerido').trim(),
  apoderadoTelefono: yup.string().required('El teléfono del apoderado es requerido').trim(),
  apoderadoCorreo: yup.string().email('Correo inválido').required('El correo del apoderado es requerido').trim(),
  apoderadoDireccion: yup.string().required('La dirección del apoderado es requerida').trim(),
  
  // Datos del estudiante
  estudianteNombre: yup.string().required('El nombre del estudiante es requerido').trim(),
  estudianteApellido: yup.string().required('El apellido del estudiante es requerido').trim(),
  estudianteDocumento: yup.string().required('El documento del estudiante es requerido').trim(),
  estudianteTipoDoc: yup.string().required('El tipo de documento del estudiante es requerido'),
  contactoEmergencia: yup.string().required('El contacto de emergencia es requerido').trim(),
  nroEmergencia: yup.string().required('El número de emergencia es requerido').trim(),
  observaciones: yup.string()
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

const ModalAgregarMatricula = ({ isOpen, onClose }) => {
  const [voucherImage, setVoucherImage] = useState(null);
  const [voucherFile, setVoucherFile] = useState(null);
  const [uploadingVoucher, setUploadingVoucher] = useState(false);
  
  // Estados para el buscador de apoderados
  const [searchTerm, setSearchTerm] = useState('');
  const [showApoderadoSearch, setShowApoderadoSearch] = useState(false);
  const [selectedApoderado, setSelectedApoderado] = useState(null);

  const queryClient = useQueryClient();

  // Query para obtener apoderados cuando se busca
  const { data: apoderados = [], isLoading: loadingApoderados } = useQuery({
    queryKey: ['apoderados', searchTerm],
    queryFn: () => {
      console.log('🔍 TanStack Query: Ejecutando búsqueda con término:', searchTerm);
      return matriculaService.searchApoderados(searchTerm);
    },
    enabled: searchTerm.length >= 2, // Solo buscar si hay al menos 2 caracteres
    staleTime: 5 * 60 * 1000, // 5 minutos
    onSuccess: (data) => {
      console.log('✅ TanStack Query: Datos recibidos:', data);
      console.log('✅ TanStack Query: Cantidad de apoderados:', data?.length || 0);
    },
    onError: (error) => {
      console.error('❌ TanStack Query: Error en búsqueda:', error);
    }
  });

  // Mutation para crear matrícula usando TanStack Query
  const createMatriculaMutation = useMutation({
    mutationFn: (matriculaData) => matriculaService.createStudent(matriculaData),
    onSuccess: () => {
      // Invalidar y refrescar las queries de matrícula
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
      
      toast.success('¡Matrícula registrada exitosamente!', {
        description: 'El estudiante ha sido matriculado correctamente'
      });
      
      // Limpiar formulario y cerrar modal
      reset();
      setVoucherImage(null);
      setVoucherFile(null);
      setSelectedApoderado(null);
      setSearchTerm('');
      setShowApoderadoSearch(false);
      onClose();
    },
    onError: (error) => {
      toast.error('Error al registrar matrícula', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    }
  });

  const loading = createMatriculaMutation.isPending;

  // Funciones para el manejo de apoderados
  const handleSelectApoderado = (apoderado) => {
    setSelectedApoderado(apoderado);
    setShowApoderadoSearch(false);
    setSearchTerm('');
    
    // Auto-llenar los campos del formulario con los datos del apoderado seleccionado
    // Usando los campos del backend: nombre, apellido, numero, correo, direccion, documentoIdentidad
    setValue('apoderadoNombre', apoderado.nombre || '');
    setValue('apoderadoApellido', apoderado.apellido || '');
    setValue('apoderadoDocumento', apoderado.documentoIdentidad || '');
    setValue('apoderadoTelefono', apoderado.numero || '');
    setValue('apoderadoCorreo', apoderado.correo || '');
    setValue('apoderadoDireccion', apoderado.direccion || '');
  };

  const clearSelectedApoderado = () => {
    setSelectedApoderado(null);
    // Limpiar los campos del formulario
    setValue('apoderadoNombre', '');
    setValue('apoderadoApellido', '');
    setValue('apoderadoDocumento', '');
    setValue('apoderadoTelefono', '');
    setValue('apoderadoCorreo', '');
    setValue('apoderadoDireccion', '');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      // Datos de matrícula
      costoMatricula: '',
      fechaIngreso: '',
      idGrado: 'd59cef90-422d-4562-88df-85dbf9514a9b',
      metodoPago: 'Transferencia bancaria',
      
      // Datos del apoderado
      apoderadoNombre: '',
      apoderadoApellido: '',
      apoderadoTipoDoc: 'DNI',
      apoderadoDocumento: '',
      apoderadoTelefono: '',
      apoderadoCorreo: '',
      apoderadoDireccion: '',
      
      // Datos del estudiante
      estudianteNombre: '',
      estudianteApellido: '',
      estudianteDocumento: '',
      estudianteTipoDoc: 'DNI',
      contactoEmergencia: '',
      nroEmergencia: '',
      observaciones: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      // Estructurar datos según el formato esperado
      const matriculaData = {
        costoMatricula: data.costoMatricula.toString(),
        fechaIngreso: data.fechaIngreso instanceof Date ? data.fechaIngreso.toISOString().split('T')[0] : data.fechaIngreso,
        metodoPago: data.metodoPago,
        voucherImg: "", // Simplificado por ahora
        idGrado: data.idGrado,
        
        apoderadoData: {
          nombre: data.apoderadoNombre,
          apellido: data.apoderadoApellido,
          numero: data.apoderadoTelefono || "",
          correo: data.apoderadoCorreo || "",
          direccion: data.apoderadoDireccion || "",
          tipoDocumentoIdentidad: data.apoderadoTipoDoc,
          documentoIdentidad: data.apoderadoDocumento
        },
        
        estudianteData: {
          nombre: data.estudianteNombre,
          apellido: data.estudianteApellido,
          contactoEmergencia: data.contactoEmergencia || "",
          nroEmergencia: data.nroEmergencia || "",
          tipoDocumento: data.estudianteTipoDoc || "DNI",
          nroDocumento: data.estudianteDocumento,
          observaciones: data.observaciones || "",
          idRol: "35225955-5aeb-4df0-8014-1cdfbce9b41e" // ID del rol ESTUDIANTE
        }
      };

      // Ejecutar la mutation
      await createMatriculaMutation.mutateAsync(matriculaData);
      
    } catch (error) {
      // El error ya es manejado por la mutation
      console.error('Error al matricular estudiante:', error);
    }
  };

  const handleClose = () => {
    reset();
    setVoucherImage(null);
    setVoucherFile(null);
    setSelectedApoderado(null);
    setSearchTerm('');
    setShowApoderadoSearch(false);
    onClose();
  };

  const tiposDocumento = [
    'DNI',
    'Pasaporte',
    'Carnet de Extranjería'
  ];

  const metodosPago = [
    'Transferencia bancaria',
    'Efectivo',
    'Tarjeta de crédito',
    'Tarjeta de débito',
    'Yape',
    'Plin'
  ];

  // Grado real del backend
  const grados = [
    { id: 'd59cef90-422d-4562-88df-85dbf9514a9b', nombre: 'PreNatal' }
  ];

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
                  {/* Layout principal: dos columnas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: INFORMACIÓN DE MATRÍCULA Y ESTUDIANTE */}
                    <div className="space-y-6">
                      {/* Información de Matrícula */}
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

                      {/* Información del Estudiante */}
                      <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                          <Baby className="w-6 h-6 mr-3 text-yellow-600" />
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
                    </div>

                    {/* COLUMNA DERECHA: INFORMACIÓN DEL APODERADO */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg h-fit">
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
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  console.log('🔍 Input: Nuevo término de búsqueda:', newValue);
                                  setSearchTerm(newValue);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            
                            {/* Lista de resultados */}
                            {searchTerm.length >= 2 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {(() => {
                                  console.log('🎨 Renderizando resultados:');
                                  console.log('🎨 searchTerm:', searchTerm);
                                  console.log('🎨 loadingApoderados:', loadingApoderados);
                                  console.log('🎨 apoderados:', apoderados);
                                  console.log('🎨 apoderados.length:', apoderados?.length || 0);
                                  return null;
                                })()}
                                
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
