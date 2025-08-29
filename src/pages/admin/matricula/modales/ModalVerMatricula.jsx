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
  Eye
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
                      {matricula.photo ? (
                        <img
                          src={matricula.photo}
                          alt={`${matricula.name} ${matricula.lastName}`}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <DefaultAvatar
                          name={`${matricula.name} ${matricula.lastName}`}
                          size="w-24 h-24"
                          textSize="text-2xl"
                        />
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {matricula.name} {matricula.lastName}
                      </h2>
                      <p className="text-lg text-blue-600 font-medium mb-2">{matricula.grade}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {calculateAge(matricula.birthDate)}
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {matricula.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {matricula.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información Personal */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Fecha de Nacimiento"
                        value={formatDate(matricula.birthDate)}
                        icon={Calendar}
                      />
                      <InfoField
                        label="Edad"
                        value={calculateAge(matricula.birthDate)}
                        icon={User}
                      />
                      <InfoField
                        label="Grado"
                        value={matricula.grade}
                        icon={GraduationCap}
                      />
                      <InfoField
                        label="Teléfono"
                        value={matricula.phone}
                        icon={Phone}
                      />
                      <InfoField
                        label="Email"
                        value={matricula.email}
                        icon={Mail}
                        className="md:col-span-2"
                      />
                      <InfoField
                        label="Dirección"
                        value={matricula.address}
                        icon={MapPin}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>

                  {/* Información del Padre/Madre */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Información del Padre/Madre o Acudiente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Nombre Completo"
                        value={matricula.parentName}
                        icon={User}
                      />
                      <InfoField
                        label="Teléfono"
                        value={matricula.parentPhone}
                        icon={Phone}
                      />
                      <InfoField
                        label="Email"
                        value={matricula.parentEmail}
                        icon={Mail}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>

                  {/* Información Médica */}
                  {(matricula.medicalConditions || matricula.allergies) && (
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Baby className="w-5 h-5 mr-2 text-red-600" />
                        Información Médica
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matricula.medicalConditions && (
                          <InfoField
                            label="Condiciones Médicas"
                            value={matricula.medicalConditions}
                            icon={FileText}
                          />
                        )}
                        {matricula.allergies && (
                          <InfoField
                            label="Alergias"
                            value={matricula.allergies}
                            icon={FileText}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notas Adicionales */}
                  {matricula.notes && (
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-gray-600" />
                        Notas Adicionales
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">{matricula.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Información de Matrícula */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                      Información de Matrícula
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Fecha de Matrícula"
                        value={formatDate(matricula.enrollmentDate)}
                        icon={Calendar}
                      />
                      <InfoField
                        label="Estado"
                        value={matricula.status === 'active' ? 'Activo' : 'Inactivo'}
                        icon={User}
                      />
                      <InfoField
                        label="Código de Estudiante"
                        value={matricula.studentCode || 'No asignado'}
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
