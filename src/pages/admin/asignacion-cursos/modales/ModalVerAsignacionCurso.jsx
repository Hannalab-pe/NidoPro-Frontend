import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, BookOpen, User, Calendar, CheckCircle, Eye, FileText } from 'lucide-react';

const InfoField = ({ label, value, icon: Icon, className = "" }) => (
  <div className={`bg-gray-50 p-3 rounded-lg ${className}`}>
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <p className="text-gray-900 ml-6">{value || 'No especificado'}</p>
  </div>
);

const ModalVerAsignacionCurso = ({ isOpen, onClose, asignacion }) => {
  if (!asignacion) return null;

  // Console log para debuggear la estructura de datos
  console.log('🔍 Datos completos de la asignación recibidos:', asignacion);
  console.log('📊 Claves disponibles:', Object.keys(asignacion));

  // Función handleClose que respeta el ciclo de vida del componente
  const handleClose = () => {
    onClose();
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
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Información de la Asignación de Curso
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Detalles completos de la asignación
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
                  {/* Información básica de la asignación */}
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Asignación de Curso
                      </h2>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {asignacion.idCurso?.nombreCurso || asignacion.idCurso?.nombre || 'Curso no especificado'}
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {asignacion.idTrabajador?.nombre} {asignacion.idTrabajador?.apellido}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {asignacion.fechaAsignacion ? new Date(asignacion.fechaAsignacion).toLocaleDateString('es-ES') : 'Fecha no especificada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información del Docente */}
                  {asignacion.idTrabajador && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Información del Docente
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField
                          label="Nombre Completo"
                          value={`${asignacion.idTrabajador.nombre || ''} ${asignacion.idTrabajador.apellido || ''}`.trim()}
                          icon={User}
                        />
                        <InfoField
                          label="Documento"
                          value={`${asignacion.idTrabajador.tipoDocumento || 'DNI'}: ${asignacion.idTrabajador.nroDocumento || 'No especificado'}`}
                          icon={FileText}
                        />
                        <InfoField
                          label="Email"
                          value={asignacion.idTrabajador.correo}
                          icon={FileText}
                        />
                        <InfoField
                          label="Teléfono"
                          value={asignacion.idTrabajador.telefono}
                          icon={FileText}
                        />
                        <InfoField
                          label="Dirección"
                          value={asignacion.idTrabajador.direccion}
                          icon={FileText}
                          className="md:col-span-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* Información del Curso */}
                  {asignacion.idCurso && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                        Información del Curso
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField
                          label="Nombre del Curso"
                          value={asignacion.idCurso.nombreCurso || asignacion.idCurso.nombre}
                          icon={BookOpen}
                        />
                        <InfoField
                          label="Descripción"
                          value={asignacion.idCurso.descripcion}
                          icon={FileText}
                          className="md:col-span-2"
                        />
                        <InfoField
                          label="Estado del Curso"
                          value={asignacion.idCurso.estaActivo ? 'Activo' : 'Inactivo'}
                          icon={CheckCircle}
                        />
                      </div>
                    </div>
                  )}

                  {/* Información de la Asignación */}
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-600" />
                      Información de la Asignación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Fecha de Asignación"
                        value={asignacion.fechaAsignacion ? new Date(asignacion.fechaAsignacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'No especificada'}
                        icon={Calendar}
                      />
                      <InfoField
                        label="Estado de la Asignación"
                        value={asignacion.estaActivo ? 'Activa' : 'Inactiva'}
                        icon={CheckCircle}
                      />
                      <InfoField
                        label="ID de Asignación"
                        value={asignacion.idAsignacionCurso}
                        icon={FileText}
                      />
                    </div>
                  </div>
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

export default ModalVerAsignacionCurso;