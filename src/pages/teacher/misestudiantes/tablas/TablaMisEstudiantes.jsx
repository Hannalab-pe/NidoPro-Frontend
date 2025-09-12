import React, { useState } from 'react';
import { Eye, User, Phone, Mail, MapPin, GraduationCap, Users, Loader2 } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const TablaMisEstudiantes = ({
  estudiantes = [],
  loading = false,
  onView
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewStudent = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-green-600" />
          <p className="text-sm text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estudiantes asignados</h3>
        <p className="text-gray-600">
          No tienes estudiantes asignados en tus aulas
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {estudiantes.map((estudiante) => (
          <div
            key={estudiante.idEstudiante}
            className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300"
          >
            {/* Header con avatar y nombre */}
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {estudiante.nombre} {estudiante.apellido}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {estudiante.tipoDocumento}: {estudiante.nroDocumento}
                </p>
              </div>
            </div>

            {/* Información del aula */}
            <div className="mb-4">
              <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-1">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                <span className="font-medium truncate">
                  {estudiante.infoApoderado?.grado?.grado} - Sección {estudiante.infoApoderado?.aula?.seccion}
                </span>
              </div>
            </div>

            {/* Contacto de emergencia principal */}
            {estudiante.contactosEmergencia && estudiante.contactosEmergencia.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{estudiante.contactosEmergencia[0].telefono}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 ml-5 sm:ml-6 truncate">
                  {estudiante.contactosEmergencia[0].nombre} ({estudiante.contactosEmergencia[0].tipoContacto})
                </div>
              </div>
            )}

            {/* Apoderado */}
            {estudiante.infoApoderado?.apoderado && (
              <div className="mb-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{estudiante.infoApoderado.apoderado.nombre} {estudiante.infoApoderado.apoderado.apellido}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 ml-5 sm:ml-6 truncate">
                  {estudiante.infoApoderado.apoderado.numero}
                </div>
              </div>
            )}

            {/* Botón de acción */}
            <button
              onClick={() => handleViewStudent(estudiante)}
              className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors font-medium"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Ver detalles
            </button>
          </div>
        ))}
      </div>

      {/* Modal de detalles del estudiante */}
      <ModalVerEstudiante
        isOpen={showModal}
        onClose={closeModal}
        estudiante={selectedStudent}
      />
    </>
  );
};

// Componente del modal de ver estudiante
const ModalVerEstudiante = ({ isOpen, onClose, estudiante }) => {
  if (!estudiante) return null;

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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-4xl mx-4 sm:mx-auto transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-8 py-4 sm:py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-lg sm:text-2xl font-bold text-white">
                          {estudiante.nombre} {estudiante.apellido}
                        </Dialog.Title>
                        <p className="text-sm sm:text-base text-green-100">
                          {estudiante.tipoDocumento}: {estudiante.nroDocumento}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="px-4 sm:px-8 py-6 sm:py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Información Personal */}
                    <div className="space-y-6">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2 sm:pb-3">
                        Información Personal
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700">Nombre Completo</label>
                          <p className="text-sm sm:text-base text-gray-900">{estudiante.nombreCompleto}</p>
                        </div>
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700">Documento</label>
                          <p className="text-sm sm:text-base text-gray-900">{estudiante.tipoDocumento}: {estudiante.nroDocumento}</p>
                        </div>
                      </div>

                      {estudiante.observaciones && (
                        <div>
                          <label className="block text-base font-medium text-gray-700">Observaciones</label>
                          <p className="text-base text-gray-900">{estudiante.observaciones}</p>
                        </div>
                      )}
                    </div>

                    {/* Información Académica */}
                    <div className="space-y-6">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2 sm:pb-3">
                        Información Académica
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700">Grado</label>
                          <p className="text-sm sm:text-base text-gray-900">{estudiante.infoApoderado?.grado?.grado}</p>
                        </div>
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700">Sección</label>
                          <p className="text-sm sm:text-base text-gray-900">{estudiante.infoApoderado?.aula?.seccion}</p>
                        </div>
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700">Aula</label>
                          <p className="text-sm sm:text-base text-gray-900">{estudiante.infoApoderado?.aula?.idAula}</p>
                        </div>
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700">Estado Aula</label>
                          <span className={`inline-flex px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                            estudiante.infoApoderado?.aula?.estado === 'activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {estudiante.infoApoderado?.aula?.estado}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Información del Apoderado */}
                    {estudiante.infoApoderado?.apoderado && (
                      <div className="space-y-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2 sm:pb-3">
                          Apoderado Principal
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Nombre</label>
                            <p className="text-sm sm:text-base text-gray-900">
                              {estudiante.infoApoderado.apoderado.nombre} {estudiante.infoApoderado.apoderado.apellido}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Tipo</label>
                            <p className="text-sm sm:text-base text-gray-900">{estudiante.infoApoderado.apoderado.tipoApoderado}</p>
                          </div>
                          <div>
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Teléfono</label>
                            <p className="text-sm sm:text-base text-gray-900">{estudiante.infoApoderado.apoderado.numero}</p>
                          </div>
                          <div>
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Email</label>
                            <p className="text-sm sm:text-base text-gray-900">{estudiante.infoApoderado.apoderado.correo}</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700">Dirección</label>
                          <p className="text-sm sm:text-base text-gray-900">{estudiante.infoApoderado.apoderado.direccion}</p>
                        </div>
                      </div>
                    )}

                    {/* Contactos de Emergencia */}
                    {estudiante.contactosEmergencia && estudiante.contactosEmergencia.length > 0 && (
                      <div className="space-y-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2 sm:pb-3">
                          Contactos de Emergencia
                        </h4>

                        <div className="space-y-3">
                          {estudiante.contactosEmergencia.map((contacto, index) => (
                            <div key={contacto.idContacto} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">
                                  {contacto.nombre} {contacto.apellido}
                                </h5>
                                {contacto.esPrincipal && (
                                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Principal
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                                <div>
                                  <span className="font-medium text-gray-700">Relación:</span>
                                  <p className="text-gray-900">{contacto.relacionEstudiante}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Teléfono:</span>
                                  <p className="text-gray-900">{contacto.telefono}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Email:</span>
                                  <p className="text-gray-900">{contacto.email}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Tipo:</span>
                                  <p className="text-gray-900">{contacto.tipoContacto}</p>
                                </div>
                              </div>

                              {contacto.observaciones && (
                                <div className="mt-2">
                                  <span className="font-medium text-gray-700">Observaciones:</span>
                                  <p className="text-base text-gray-900">{contacto.observaciones}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-gray-700 transition-colors"
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

export default TablaMisEstudiantes;
