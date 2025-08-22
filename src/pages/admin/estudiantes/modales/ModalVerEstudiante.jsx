import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  GraduationCap,
  Heart,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Eye
} from 'lucide-react';

const ModalVerEstudiante = ({ isOpen, onClose, estudiante }) => {
  if (!estudiante) return null;

  // Obtener URL de imagen segura
  const getStudentPhoto = () => {
    if (estudiante.photo) {
      // Si es un objeto con URL
      if (typeof estudiante.photo === 'object' && estudiante.photo.url) {
        return estudiante.photo.url;
      }
      // Si es una string directa
      return estudiante.photo;
    }
    return '/default-avatar.png';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Activo' : 'Inactivo';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAverageColor = (average) => {
    if (average >= 18) return 'text-green-600';
    if (average >= 14) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceLabel = (attendance) => {
    if (attendance >= 95) return 'Excelente';
    if (attendance >= 85) return 'Buena';
    return 'Necesita mejorar';
  };

  const getAverageLabel = (average) => {
    if (average >= 18) return 'Sobresaliente';
    if (average >= 14) return 'Satisfactorio';
    return 'En proceso';
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-blue-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={getStudentPhoto()}
                      alt={estudiante.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Eye className="w-6 h-6 text-blue-600" />
                        {estudiante.name}
                      </Dialog.Title>
                      <p className="text-blue-600 font-medium">{estudiante.grade}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Estado y Información Básica */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Estado</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(estudiante.status)}`}>
                        {getStatusText(estudiante.status)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Asistencia</p>
                      <p className={`text-2xl font-bold ${getAttendanceColor(estudiante.attendance || 0)}`}>
                        {estudiante.attendance || 0}%
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Promedio</p>
                      <p className={`text-2xl font-bold ${getAverageColor(estudiante.average || 0)}`}>
                        {estudiante.average || 0}
                      </p>
                    </div>
                  </div>

                  {/* Información Personal */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Información Personal
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nombre Completo
                          </label>
                          <p className="text-gray-900 font-medium">{estudiante.name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Edad
                          </label>
                          <p className="text-gray-900">{estudiante.age} años</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Grado
                          </label>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900 font-medium">{estudiante.grade}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            DNI
                          </label>
                          <p className="text-gray-900">{estudiante.dni || 'No registrado'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Fecha de Nacimiento
                          </label>
                          <p className="text-gray-900">{estudiante.birthDate || 'No registrada'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Dirección
                          </label>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-900">{estudiante.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del Padre/Madre */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      Información del Padre/Madre
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nombre
                          </label>
                          <p className="text-gray-900 font-medium">{estudiante.parent}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Teléfono
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="text-gray-900">{estudiante.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                          </label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900">{estudiante.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Emergencia */}
                  {(estudiante.emergencyContact || estudiante.emergencyPhone) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Contacto de Emergencia
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nombre del Contacto
                          </label>
                          <p className="text-gray-900">{estudiante.emergencyContact || 'No registrado'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Teléfono de Emergencia
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-600" />
                            <span className="text-gray-900">{estudiante.emergencyPhone || 'No registrado'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Información Médica */}
                  {(estudiante.allergies || estudiante.medicalNotes) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-yellow-600" />
                        Información Médica
                      </h3>
                      
                      <div className="space-y-3">
                        {estudiante.allergies && (
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Alergias
                            </label>
                            <p className="text-gray-900 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                              {estudiante.allergies}
                            </p>
                          </div>
                        )}
                        
                        {estudiante.medicalNotes && (
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Notas Médicas
                            </label>
                            <p className="text-gray-900 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                              {estudiante.medicalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rendimiento Académico */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Rendimiento Académico
                    </h3>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Asistencia</span>
                          </div>
                          <p className={`text-3xl font-bold ${getAttendanceColor(estudiante.attendance || 0)}`}>
                            {estudiante.attendance || 0}%
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {getAttendanceLabel(estudiante.attendance || 0)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-700">Promedio</span>
                          </div>
                          <p className={`text-3xl font-bold ${getAverageColor(estudiante.average || 0)}`}>
                            {estudiante.average || 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {getAverageLabel(estudiante.average || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t bg-gray-50">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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