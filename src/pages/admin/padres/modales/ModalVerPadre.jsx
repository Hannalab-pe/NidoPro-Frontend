import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Briefcase,
  AlertCircle,
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
  Eye,
  FileText
} from 'lucide-react';

const ModalVerPadre = ({ isOpen, onClose, padre }) => {
  if (!padre) return null;

  // Función para obtener imagen del padre
  const getParentPhoto = () => {
    if (padre.photo) {
      if (typeof padre.photo === 'object' && padre.photo.url) {
        return padre.photo.url;
      }
      return padre.photo;
    }
    return '/default-avatar.png';
  };

  // Función para obtener color de estado
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Activo' : 'Inactivo';
  };

  // Función para obtener color de participación
  const getParticipationColor = (level) => {
    switch(level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParticipationText = (level) => {
    switch(level) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Sin datos';
    }
  };

  const getParticipationIcon = (level) => {
    switch(level) {
      case 'high': return '🌟';
      case 'medium': return '👍';
      case 'low': return '💭';
      default: return '❓';
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No registrada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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
                      src={getParentPhoto()}
                      alt={padre.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Eye className="w-6 h-6 text-blue-600" />
                        {padre.name}
                      </Dialog.Title>
                      <div className="flex items-center gap-2 mt-1">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-blue-600 font-medium">{padre.relation}</span>
                        {padre.occupation && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{padre.occupation}</span>
                          </>
                        )}
                      </div>
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
                  {/* Estado y Métricas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Estado</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(padre.status)}`}>
                        {getStatusText(padre.status)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Participación</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-lg">{getParticipationIcon(padre.participationLevel)}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getParticipationColor(padre.participationLevel)}`}>
                          {getParticipationText(padre.participationLevel)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Hijos</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {padre.children?.length || 0}
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
                          <p className="text-gray-900 font-medium">{padre.name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Relación/Parentesco
                          </label>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <span className="text-gray-900 font-medium">{padre.relation}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Ocupación
                          </label>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900">{padre.occupation || 'No especificada'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                          </label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-900">{padre.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Teléfono
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span className="text-gray-900">{padre.phone}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Dirección
                          </label>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-900">{padre.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hijos */}
                  {padre.children && padre.children.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Hijos Registrados ({padre.children.length})
                      </h3>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                        <div className="grid gap-3">
                          {padre.children.map((child, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 font-semibold text-sm">
                                    {child.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{child.name}</p>
                                  <p className="text-sm text-gray-600">{child.grade}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">{child.age} años</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contacto de Emergencia */}
                  {(padre.emergencyContact?.name || padre.emergencyContact?.phone) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Contacto de Emergencia
                      </h3>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Nombre del Contacto
                            </label>
                            <p className="text-gray-900 font-medium">
                              {padre.emergencyContact?.name || 'No registrado'}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Teléfono de Emergencia
                            </label>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-red-600" />
                              <span className="text-gray-900">
                                {padre.emergencyContact?.phone || 'No registrado'}
                              </span>
                            </div>
                          </div>
                          
                          {padre.emergencyContact?.relation && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Relación
                              </label>
                              <p className="text-gray-900">{padre.emergencyContact.relation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notas Adicionales */}
                  {padre.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        Notas Adicionales
                      </h3>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-900 leading-relaxed">{padre.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Información de Registro */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Información de Registro
                    </h3>
                    
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-700">Fecha de Registro</span>
                          </div>
                          <p className="text-lg font-semibold text-green-600">
                            {formatDate(padre.registrationDate)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Última Visita</span>
                          </div>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatDate(padre.lastVisit)}
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

export default ModalVerPadre;