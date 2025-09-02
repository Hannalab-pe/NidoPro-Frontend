import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  Star,
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
  Eye,
  Briefcase,
  FileText,
  CreditCard,
  DollarSign,
  School,
  IdCard,
  ContactRound
} from 'lucide-react';

const InfoField = ({ label, value, icon: Icon, className = "" }) => (
  <div className={`bg-gray-50 p-3 rounded-lg ${className}`}>
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <p className="text-gray-900 ml-6">{value || 'No especificado'}</p>
  </div>
);

// Componente para generar avatar con iniciales
const generateAvatar = (nombre, apellido) => {
  const initials = `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-gray-500'
  ];
  const colorIndex = (nombre?.charCodeAt(0) || 0) % colors.length;
  
  return (
    <div className={`w-20 h-20 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
      {initials || '??'}
    </div>
  );
};

const ModalVerEstudiante = ({ isOpen, onClose, estudiante }) => {
  if (!estudiante) return null;

  // Console log para debuggear la estructura de datos
  console.log('🔍 Datos completos del estudiante recibidos:', estudiante);
  console.log('📊 Claves disponibles:', Object.keys(estudiante));
  console.log('📝 Valores por clave:', Object.entries(estudiante));

  // Función handleClose que respeta el ciclo de vida del componente
  const handleClose = () => {
    onClose();
  };

  // Obtener datos del estudiante y estructuras anidadas
  const datosEstudiante = estudiante.datosCompletos?.estudiante || {};
  const datosMatricula = estudiante.datosCompletos?.matricula || {};
  const datosAsignacion = estudiante.datosCompletos?.asignacion || {};

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
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    {generateAvatar(estudiante.nombre, estudiante.apellido)}
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                        {estudiante.nombre} {estudiante.apellido}
                      </Dialog.Title>
                      <p className="text-gray-600 mt-1">
                        {estudiante.aulaInfo?.nombreGrado} - Sección {estudiante.aulaInfo?.seccion}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {estudiante.estado || 'Activo'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información Personal */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Información Personal
                      </h4>
                      <div className="space-y-3">
                        <InfoField
                          label="Nombre Completo"
                          value={`${estudiante.nombre} ${estudiante.apellido}`}
                          icon={User}
                        />
                        <InfoField
                          label="Número de Documento"
                          value={estudiante.numeroDocumento}
                          icon={IdCard}
                        />
                        <InfoField
                          label="Tipo de Documento"
                          value={estudiante.tipoDocumento}
                          icon={FileText}
                        />
                        <InfoField
                          label="ID del Estudiante"
                          value={estudiante.idEstudiante}
                          icon={User}
                        />
                      </div>
                    </div>

                    {/* Información de Contacto de Emergencia */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-red-600" />
                        Contacto de Emergencia
                      </h4>
                      <div className="space-y-3">
                        <InfoField
                          label="Contacto de Emergencia"
                          value={estudiante.contactoEmergencia}
                          icon={ContactRound}
                        />
                        <InfoField
                          label="Teléfono de Emergencia"
                          value={estudiante.numeroEmergencia}
                          icon={Phone}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información Académica */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <School className="w-5 h-5 mr-2 text-green-600" />
                        Información Académica
                      </h4>
                      <div className="space-y-3">
                        <InfoField
                          label="Aula Asignada"
                          value={`${estudiante.aulaInfo?.nombreGrado || 'No especificado'} - Sección ${estudiante.aulaInfo?.seccion || 'No especificado'}`}
                          icon={School}
                        />
                        <InfoField
                          label="ID del Aula"
                          value={estudiante.aulaInfo?.idAula}
                          icon={MapPin}
                        />
                        <InfoField
                          label="Fecha de Asignación"
                          value={estudiante.fechaAsignacion ? new Date(estudiante.fechaAsignacion).toLocaleDateString() : 'No especificado'}
                          icon={Calendar}
                        />
                        <InfoField
                          label="Estado de Matrícula"
                          value={estudiante.estado}
                          icon={UserCheck}
                        />
                      </div>
                    </div>

                    {/* Información de Matrícula */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                        Información de Matrícula
                      </h4>
                      <div className="space-y-3">
                        <InfoField
                          label="ID de Matrícula"
                          value={estudiante.idMatricula}
                          icon={FileText}
                        />
                        <InfoField
                          label="Costo de Matrícula"
                          value={estudiante.costoMatricula ? `S/. ${estudiante.costoMatricula}` : 'No especificado'}
                          icon={DollarSign}
                        />
                        <InfoField
                          label="Método de Pago"
                          value={estudiante.metodoPago}
                          icon={CreditCard}
                        />
                        <InfoField
                          label="ID Matrícula-Aula"
                          value={estudiante.idMatriculaAula}
                          icon={School}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                {estudiante.observaciones && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-yellow-600" />
                      Observaciones
                    </h4>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-gray-800">{estudiante.observaciones}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleClose}
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

export default ModalVerEstudiante;
