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
  DollarSign
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

  // Console log para debuggear la estructura de datos
  console.log('🔍 Datos de matrícula recibidos en el modal:', matricula);

  // Extraer datos - usar la estructura real que viene del backend
  const estudiante = matricula.idEstudiante || {};
  const apoderado = matricula.idApoderado || {};
  const grado = matricula.idGrado || {};

  console.log('📚 Datos del estudiante extraídos:', estudiante);
  console.log('👨‍👩‍👧‍👦 Datos del apoderado extraídos:', apoderado);
  console.log('🎓 Datos del grado extraídos:', grado);

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

                <div className="space-y-6">
                  {/* Foto y datos básicos */}
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
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
                        label="Documento"
                        value={`${estudiante.tipoDocumento || 'DNI'}: ${estudiante.nroDocumento || 'No especificado'}`}
                        icon={FileText}
                      />
                      <InfoField
                        label="Contacto de Emergencia"
                        value={estudiante.contactoEmergencia || 'No especificado'}
                        icon={User}
                      />
                      <InfoField
                        label="Teléfono de Emergencia"
                        value={estudiante.nroEmergencia || 'No especificado'}
                        icon={Phone}
                      />
                      <InfoField
                        label="Grado Asignado"
                        value={`${grado.grado || 'No especificado'} - ${grado.descripcion || ''}`}
                        icon={GraduationCap}
                      />
                      <InfoField
                        label="Estado del Grado"
                        value={grado.estaActivo ? 'Activo' : 'Inactivo'}
                        icon={User}
                      />
                    </div>
                  </div>

                  {/* Información del Padre/Madre */}
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Información del Apoderado
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Nombre Completo"
                        value={`${apoderado.nombre || ''} ${apoderado.apellido || ''}`}
                        icon={User}
                      />
                      <InfoField
                        label="Tipo de Documento"
                        value={apoderado.tipoDocumentoIdentidad || apoderado.tipoDocumento || 'DNI'}
                        icon={FileText}
                      />
                      <InfoField
                        label="Documento de Identidad"
                        value={apoderado.documentoIdentidad || apoderado.dni || apoderado.nroDocumento || 'No especificado'}
                        icon={FileText}
                      />
                      <InfoField
                        label="Teléfono"
                        value={apoderado.numero || apoderado.telefono || 'No especificado'}
                        icon={Phone}
                      />
                      <InfoField
                        label="Email"
                        value={apoderado.correo || 'No especificado'}
                        icon={Mail}
                      />
                      <InfoField
                        label="Relación"
                        value={apoderado.relacion || 'No especificado'}
                        icon={Users}
                      />
                      <InfoField
                        label="Dirección"
                        value={apoderado.direccion || 'No especificado'}
                        icon={MapPin}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>

                  {/* Observaciones del Estudiante */}
                  {estudiante.observaciones && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-gray-600" />
                        Observaciones del Estudiante
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">{estudiante.observaciones}</p>
                      </div>
                    </div>
                  )}

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

                  {/* Información de Asignación de Aula */}
                  {(matricula.idAulaEspecifica || matricula.tipoAsignacionAula || matricula.motivoPreferencia) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-orange-600" />
                        Asignación de Aula
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField
                          label="ID Aula Específica"
                          value={matricula.idAulaEspecifica || 'No especificado'}
                          icon={FileText}
                        />
                        <InfoField
                          label="Tipo de Asignación"
                          value={matricula.tipoAsignacionAula || 'No especificado'}
                          icon={User}
                        />
                        {matricula.motivoPreferencia && (
                          <InfoField
                            label="Motivo de Preferencia"
                            value={matricula.motivoPreferencia}
                            icon={FileText}
                            className="md:col-span-2"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* IDs de Referencia */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      IDs de Referencia del Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="ID del Estudiante"
                        value={typeof matricula.idEstudiante === 'object' ? estudiante.idEstudiante || 'No asignado' : matricula.idEstudiante || 'No asignado'}
                        icon={User}
                      />
                      <InfoField
                        label="ID del Apoderado"
                        value={typeof matricula.idApoderado === 'object' ? apoderado.idApoderado || 'No asignado' : matricula.idApoderado || 'No asignado'}
                        icon={Users}
                      />
                      <InfoField
                        label="ID del Grado"
                        value={typeof matricula.idGrado === 'object' ? grado.idGrado || 'No asignado' : matricula.idGrado || 'No asignado'}
                        icon={GraduationCap}
                      />
                      <InfoField
                        label="ID de la Matrícula"
                        value={matricula.idMatricula || 'No asignado'}
                        icon={FileText}
                      />
                    </div>
                  </div>
                </div>

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
