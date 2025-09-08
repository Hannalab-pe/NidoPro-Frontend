import React, { Fragment } from 'react';
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
  Baby,
  FileText,
  Eye,
  DollarSign,
  Building,
  Hash,
  CheckCircle,
  Percent,
  Star,
  Book
} from 'lucide-react';
import DefaultAvatar from '../../../../components/common/DefaultAvatar';

const InfoField = ({ label, value, icon: Icon, className = "" }) => (
  <div className={`bg-gray-50 p-3 rounded-lg ${className}`}>
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <p className="text-gray-900 ml-6">{value || 'No especificado'}</p>
  </div>
);

const ModalVerMatricula = ({ isOpen, onClose, matricula }) => {
  if (!matricula) return null;

  // Extraer datos - usar la estructura real que viene del backend
  const estudiante = matricula.idEstudiante || {};
  const apoderado = matricula.idApoderado || {};
  const grado = matricula.idGrado || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'No especificado';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
          <div className="flex min-h-full items-center justify-center p-2 lg:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white p-4 lg:p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Información del Estudiante
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Detalles completos de la matrícula
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Foto y datos básicos - Ancho completo */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
                  <div className="flex-shrink-0">
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {estudiante.nombre} {estudiante.apellido}
                    </h2>
                    <p className="text-lg text-blue-600 font-medium mb-2">
                      {grado.grado || grado.nombre || `ID: ${matricula.idGrado}`}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {calculateAge(estudiante.fechaNacimiento)}
                      </span>
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {estudiante.correo || apoderado.correo || 'No especificado'}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {estudiante.telefono || apoderado.numero || 'No especificado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenido principal con layout de 2 columnas en pantallas grandes */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* Columna izquierda */}
                  <div className="space-y-6">
                    
                    {/* Información Personal */}
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Información Personal del Estudiante
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField
                          label="Nombre Completo"
                          value={`${estudiante.nombre || ''} ${estudiante.apellido || ''}`}
                          icon={User}
                        />
                        <InfoField
                          label="Número de Documento"
                          value={estudiante.nroDocumento || 'No especificado'}
                          icon={FileText}
                        />
                        <InfoField
                          label="Usuario del Sistema"
                          value={estudiante.idUsuario?.usuario || 'No asignado'}
                          icon={User}
                        />
                        <InfoField
                          label="Estado de Usuario"
                          value={estudiante.idUsuario?.estaActivo ? 'Activo' : 'Inactivo'}
                          icon={User}
                        />
                        <InfoField
                          label="Grado Asignado"
                          value={`${grado.grado || 'No especificado'} - ${grado.descripcion || ''}`}
                          icon={GraduationCap}
                        />
                        <InfoField
                          label="Monto de Pensión"
                          value={grado.idPension?.monto ? `S/ ${grado.idPension.monto}` : 'No especificado'}
                          icon={DollarSign}
                        />
                        <InfoField
                          label="Observaciones"
                          value={estudiante.observaciones || 'Sin observaciones'}
                          icon={FileText}
                          className="md:col-span-2"
                        />
                      </div>
                    </div>

                  {/* Información del Padre/Madre */}
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Información del Apoderado Principal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Nombre Completo"
                        value={`${apoderado.nombre || ''} ${apoderado.apellido || ''}`}
                        icon={User}
                      />
                      <InfoField
                        label="Documento de Identidad"
                        value={apoderado.documentoIdentidad || 'No especificado'}
                        icon={FileText}
                      />
                      <InfoField
                        label="Teléfono"
                        value={apoderado.numero || 'No especificado'}
                        icon={Phone}
                      />
                      <InfoField
                        label="Email"
                        value={apoderado.correo || 'No especificado'}
                        icon={Mail}
                      />
                      <InfoField
                        label="Tipo de Apoderado"
                        value={apoderado.tipoApoderado || 'No especificado'}
                        icon={Users}
                      />
                      <InfoField
                        label="Es Principal"
                        value={apoderado.esPrincipal ? 'Sí' : 'No'}
                        icon={User}
                      />
                      <InfoField
                        label="Dirección"
                        value={apoderado.direccion || 'No especificado'}
                        icon={MapPin}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>

                  {/* Información de Matrícula */}
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                      Información de Matrícula
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Fecha de Ingreso"
                        value={formatDate(matricula.fechaIngreso)}
                        icon={Calendar}
                      />
                      <InfoField
                        label="Costo de Matrícula"
                        value={matricula.costoMatricula ? `S/ ${matricula.costoMatricula}` : 'No especificado'}
                        icon={DollarSign}
                      />
                      <InfoField
                        label="Método de Pago"
                        value={matricula.metodoPago || 'No especificado'}
                        icon={FileText}
                      />
                      <InfoField
                        label="Estado del Voucher"
                        value={matricula.voucherImg ? 'Voucher cargado' : 'Sin voucher'}
                        icon={FileText}
                      />
                    </div>
                    
                    {/* Voucher Image */}
                    {matricula.voucherImg && (
                      <div className="mt-4">
                        <InfoField
                          label="Comprobante de Pago"
                          value=""
                          icon={FileText}
                        />
                        <div className="mt-2">
                          <img 
                            src={matricula.voucherImg} 
                            alt="Voucher de pago" 
                            className="w-64 h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-6">
                    
                    {/* Contactos de Emergencia */}
                    {estudiante.contactosEmergencia && estudiante.contactosEmergencia.length > 0 && (
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Phone className="w-5 h-5 mr-2 text-red-600" />
                          Contactos de Emergencia
                        </h3>
                        <div className="space-y-4">
                          {estudiante.contactosEmergencia.map((contacto, index) => (
                            <div key={contacto.idContactoEmergencia || index} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <InfoField
                                  label="Nombre Completo"
                                  value={`${contacto.nombre || ''} ${contacto.apellido || ''}`}
                                  icon={User}
                                />
                                <InfoField
                                  label="Tipo de Contacto"
                                  value={contacto.tipoContacto || 'No especificado'}
                                  icon={Users}
                                />
                                <InfoField
                                  label="Teléfono"
                                  value={contacto.telefono || 'No especificado'}
                                  icon={Phone}
                                />
                                <InfoField
                                  label="Email"
                                  value={contacto.email || 'No especificado'}
                                  icon={Mail}
                                />
                                <InfoField
                                  label="Prioridad"
                                  value={`Prioridad ${contacto.prioridad || 'No especificada'}`}
                                  icon={Star}
                                />
                                <InfoField
                                  label="Es Principal"
                                  value={contacto.esPrincipal ? 'Sí' : 'No'}
                                  icon={User}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Información del Grado */}
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                        Información del Grado
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField
                          label="Nombre del Grado"
                          value={grado.nombre || 'No especificado'}
                          icon={Book}
                        />
                        <InfoField
                          label="Descripción"
                          value={grado.descripcion || 'No especificado'}
                          icon={FileText}
                          className="md:col-span-2"
                        />
                      </div>
                    </div>

                    {/* Información del Aula */}
                    {matricula.matriculaAula && (
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Building className="w-5 h-5 mr-2 text-orange-600" />
                          Información del Aula
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoField
                            label="Nombre del Aula"
                            value={matricula.matriculaAula.aula?.nombre || 'No especificado'}
                            icon={Building}
                          />
                          <InfoField
                            label="Sección"
                            value={matricula.matriculaAula.aula?.seccion || 'No especificado'}
                            icon={Hash}
                          />
                          <InfoField
                            label="Cantidad de Estudiantes"
                            value={matricula.matriculaAula.aula?.cantidadEstudiantes || 'No especificado'}
                            icon={Users}
                          />
                          <InfoField
                            label="Fecha de Asignación"
                            value={formatDate(matricula.matriculaAula.fechaAsignacion)}
                            icon={Calendar}
                          />
                          <InfoField
                            label="Estado de Asignación"
                            value={matricula.matriculaAula.estado || 'No especificado'}
                            icon={CheckCircle}
                          />
                        </div>
                      </div>
                    )}

                    {/* Información de Pensión */}
                    {matricula.pension && (
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                          Información de Pensión
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoField
                            label="Monto de Pensión"
                            value={`S/ ${matricula.pension.monto || '0.00'}`}
                            icon={DollarSign}
                          />
                          <InfoField
                            label="Descuento"
                            value={`S/ ${matricula.pension.descuento || '0.00'}`}
                            icon={Percent}
                          />
                          <InfoField
                            label="Estado de Pensión"
                            value={matricula.pension.estado || 'No especificado'}
                            icon={CheckCircle}
                          />
                          <InfoField
                            label="Fecha de Vencimiento"
                            value={formatDate(matricula.pension.fechaVencimiento)}
                            icon={Calendar}
                          />
                          <InfoField
                            label="Observaciones"
                            value={matricula.pension.observacion || 'Ninguna'}
                            icon={FileText}
                            className="md:col-span-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Imagen del Estudiante */}
                    {estudiante.imagen_estudiante && (
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Imagen del Estudiante
                        </h3>
                        <div className="flex justify-center">
                          <img 
                            src={estudiante.imagen_estudiante} 
                            alt={`Foto de ${estudiante.nombre} ${estudiante.apellido}`}
                            className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secciones que ocupan todo el ancho */}


                {/* Botón de cerrar */}
                <div className="flex justify-end pt-6 border-t mt-6">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
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

export default ModalVerMatricula;
