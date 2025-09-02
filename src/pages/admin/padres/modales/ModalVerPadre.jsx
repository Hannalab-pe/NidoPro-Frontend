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
  FileText,
  CreditCard,
  Baby
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

const ModalVerPadre = ({ isOpen, onClose, padre }) => {
  if (!padre) return null;

  // Console log para debuggear la estructura de datos
  console.log('🔍 Datos completos del padre recibidos:', padre);
  console.log('📊 Claves disponibles:', Object.keys(padre));
  console.log('📝 Valores por clave:', Object.entries(padre));

  // Función handleClose que respeta el ciclo de vida del componente
  const handleClose = () => {
    onClose();
  };

  // Obtener URL de imagen segura
  const getParentPhoto = () => {
    if (padre.foto) {
      // Si es un objeto con URL
      if (typeof padre.foto === 'object' && padre.foto.url) {
        return padre.foto.url;
      }
      // Si es una string directa
      return padre.foto;
    }
    return '/default-avatar.png';
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
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Eye className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Información del Padre
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Detalles completos del apoderado
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

                <div className="space-y-6">
                  {/* Foto y datos básicos */}
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg">
                    <div className="flex-shrink-0">
                      {/* Aquí puedes agregar la foto del padre si es necesario */}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {padre.nombre && padre.apellido 
                          ? `${padre.nombre} ${padre.apellido}` 
                          : padre.nombre || padre.apellido || padre.name || 'Sin nombre'
                        }
                      </h2>
                      {(padre.parentesco || padre.relation) && (
                        <p className="text-lg text-pink-600 font-medium mb-2 flex items-center justify-center md:justify-start">
                          <Heart className="w-5 h-5 mr-2" />
                          {padre.parentesco || padre.relation}
                        </p>
                      )}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                        {(padre.correo || padre.email) && (
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {padre.correo || padre.email}
                          </span>
                        )}
                        {(padre.telefono || padre.phone) && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {padre.telefono || padre.phone}
                          </span>
                        )}
                        {(padre.profesion || padre.occupation) && (
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {padre.profesion || padre.occupation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información Personal */}
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-pink-600" />
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Solo mostrar campos que tienen datos */}
                      {(padre.nombre || padre.apellido || padre.name) && (
                        <InfoField
                          label="Nombre Completo"
                          value={
                            padre.nombre && padre.apellido 
                              ? `${padre.nombre} ${padre.apellido}` 
                              : padre.name || `${padre.nombre || ''} ${padre.apellido || ''}`.trim()
                          }
                          icon={User}
                        />
                      )}
                      {(padre.tipoDocumento || padre.nroDocumento) && (
                        <InfoField
                          label="Documento"
                          value={`${padre.tipoDocumento || 'DNI'}: ${padre.nroDocumento || 'No especificado'}`}
                          icon={CreditCard}
                        />
                      )}
                      {(padre.correo || padre.email) && (
                        <InfoField
                          label="Email"
                          value={padre.correo || padre.email}
                          icon={Mail}
                        />
                      )}
                      {(padre.telefono || padre.phone) && (
                        <InfoField
                          label="Teléfono"
                          value={padre.telefono || padre.phone}
                          icon={Phone}
                        />
                      )}
                      {(padre.parentesco || padre.relation) && (
                        <InfoField
                          label="Parentesco"
                          value={padre.parentesco || padre.relation}
                          icon={Heart}
                        />
                      )}
                      {(padre.profesion || padre.occupation) && (
                        <InfoField
                          label="Profesión"
                          value={padre.profesion || padre.occupation}
                          icon={Briefcase}
                        />
                      )}
                      {typeof padre.estaActivo !== 'undefined' && (
                        <InfoField
                          label="Estado"
                          value={padre.estaActivo ? 'Activo' : 'Inactivo'}
                          icon={UserCheck}
                        />
                      )}
                      {(padre.direccion || padre.address) && (
                        <InfoField
                          label="Dirección"
                          value={padre.direccion || padre.address}
                          icon={MapPin}
                          className="md:col-span-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* Información Adicional - Solo si existe */}
                  {(padre.fechaNacimiento || padre.lugarNacimiento || padre.estadoCivil) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        Información Adicional
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {padre.fechaNacimiento && (
                          <InfoField
                            label="Fecha de Nacimiento"
                            value={new Date(padre.fechaNacimiento).toLocaleDateString('es-ES')}
                            icon={Calendar}
                          />
                        )}
                        {padre.lugarNacimiento && (
                          <InfoField
                            label="Lugar de Nacimiento"
                            value={padre.lugarNacimiento}
                            icon={MapPin}
                          />
                        )}
                        {padre.estadoCivil && (
                          <InfoField
                            label="Estado Civil"
                            value={padre.estadoCivil}
                            icon={Heart}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información de Contacto de Emergencia - Solo si existe */}
                  {(padre.contactoEmergencia || padre.telefonoEmergencia || padre.emergencyContact) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                        Contacto de Emergencia
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(padre.contactoEmergencia || padre.emergencyContact?.name) && (
                          <InfoField
                            label="Nombre del Contacto"
                            value={padre.contactoEmergencia || padre.emergencyContact?.name}
                            icon={User}
                          />
                        )}
                        {(padre.telefonoEmergencia || padre.emergencyContact?.phone) && (
                          <InfoField
                            label="Teléfono de Emergencia"
                            value={padre.telefonoEmergencia || padre.emergencyContact?.phone}
                            icon={Phone}
                          />
                        )}
                        {padre.emergencyContact?.relation && (
                          <InfoField
                            label="Relación"
                            value={padre.emergencyContact.relation}
                            icon={Heart}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hijos Asociados - Solo si existe */}
                  {((padre.hijos && padre.hijos.length > 0) || (padre.children && padre.children.length > 0)) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Baby className="w-5 h-5 mr-2 text-green-600" />
                        Hijos Asociados ({(padre.hijos || padre.children)?.length})
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(padre.hijos || padre.children)?.map((hijo, index) => (
                            <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                              <Baby className="w-4 h-4 text-green-600 mr-2" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {typeof hijo === 'string' 
                                    ? hijo 
                                    : hijo.name || `${hijo.nombre || ''} ${hijo.apellido || ''}`.trim() || 'Sin nombre'
                                  }
                                </p>
                                {typeof hijo === 'object' && (hijo.grado || hijo.grade) && (
                                  <p className="text-sm text-gray-600">{hijo.grado || hijo.grade}</p>
                                )}
                                {typeof hijo === 'object' && hijo.age && (
                                  <p className="text-sm text-gray-600">{hijo.age} años</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* IDs de Referencia del Sistema */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      IDs de Referencia del Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {padre.idApoderado && (
                        <InfoField
                          label="ID del Apoderado"
                          value={padre.idApoderado}
                          icon={FileText}
                        />
                      )}
                      {padre.id && (
                        <InfoField
                          label="ID General"
                          value={padre.id}
                          icon={FileText}
                        />
                      )}
                      {padre.registrationDate && (
                        <InfoField
                          label="Fecha de Registro"
                          value={new Date(padre.registrationDate).toLocaleDateString('es-ES')}
                          icon={Calendar}
                        />
                      )}
                      {padre.lastVisit && (
                        <InfoField
                          label="Última Visita"
                          value={new Date(padre.lastVisit).toLocaleDateString('es-ES')}
                          icon={Calendar}
                        />
                      )}
                    </div>
                  </div>

                  {/* Notas Adicionales */}
                  {(padre.notas || padre.notes) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-gray-600" />
                        Notas Adicionales
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">{padre.notas || padre.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de cerrar */}
                <div className="flex justify-end pt-6 border-t mt-6">
                  <button
                    onClick={handleClose}
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

export default ModalVerPadre;