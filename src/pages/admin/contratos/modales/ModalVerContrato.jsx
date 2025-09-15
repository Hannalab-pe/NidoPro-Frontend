import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Download, FileText, Calendar, MapPin, DollarSign, Clock, User } from 'lucide-react';

const ModalVerContrato = ({ isOpen, onClose, contrato }) => {
  if (!contrato) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Indefinido';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
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
f
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
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Detalles del Contrato
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        {contrato.numeroContrato}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Información General */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      Información General
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Número de Contrato</div>
                        <div className="font-medium text-gray-900">{contrato.numeroContrato}</div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Tipo de Contrato</div>
                        <div className="font-medium text-gray-900">{contrato.idTipoContrato?.nombreTipo || 'Sin tipo'}</div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Estado</div>
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contrato.estadoContrato === 'ACTIVO'
                              ? 'bg-green-100 text-green-800'
                              : contrato.estadoContrato === 'INACTIVO'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {contrato.estadoContrato}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Fecha de Inicio</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(contrato.fechaInicio)}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Fecha de Fin</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(contrato.fechaFin)}
                        </div>
                      </div>
                      {contrato.fechaFinPeriodoPrueba && (
                        <div className="bg-white p-3 rounded-md border">
                          <div className="text-sm text-gray-500">Fin Período de Prueba</div>
                          <div className="font-medium text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(contrato.fechaFinPeriodoPrueba)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información del Empleado */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Información del Empleado
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Nombre Completo</div>
                        <div className="font-medium text-gray-900">
                          {contrato.idTrabajador2?.nombre} {contrato.idTrabajador2?.apellido}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Cargo</div>
                        <div className="font-medium text-gray-900">{contrato.cargoContrato}</div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Sueldo Contratado</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          {formatCurrency(contrato.sueldoContratado)}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Jornada Laboral</div>
                        <div className="font-medium text-gray-900">{contrato.jornadaLaboral}</div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Horas Semanales</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {contrato.horasSemanales} horas
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500">Lugar de Trabajo</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {contrato.lugarTrabajo}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles Adicionales */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      Detalles Adicionales
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-md border">
                        <div className="text-sm text-gray-500 mb-1">Descripción de Funciones</div>
                        <div className="text-gray-900">{contrato.descripcionFunciones}</div>
                      </div>
                      {contrato.observacionesContrato && (
                        <div className="bg-white p-3 rounded-md border">
                          <div className="text-sm text-gray-500 mb-1">Observaciones</div>
                          <div className="text-gray-900">{contrato.observacionesContrato}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documentos */}
                  {(contrato.archivoContratoUrl || contrato.archivoFirmadoUrl) && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <Download className="w-5 h-5 mr-2 text-purple-600" />
                        Documentos
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {contrato.archivoContratoUrl && (
                          <a
                            href={contrato.archivoContratoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Ver Contrato Original
                          </a>
                        )}
                        {contrato.archivoFirmadoUrl && (
                          <a
                            href={contrato.archivoFirmadoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Ver Contrato Firmado
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información de Auditoría */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Información de Auditoría</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Creado por:</span>
                        <div className="font-medium text-gray-900">
                          {contrato.creadoPor?.nombre} {contrato.creadoPor?.apellido}
                        </div>
                        <div className="text-gray-500">
                          {new Date(contrato.creadoEn).toLocaleString('es-ES')}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Aprobado por:</span>
                        <div className="font-medium text-gray-900">
                          {contrato.aprobadoPor?.nombre} {contrato.aprobadoPor?.apellido}
                        </div>
                        <div className="text-gray-500">
                          {contrato.fechaAprobacion ? new Date(contrato.fechaAprobacion).toLocaleString('es-ES') : 'Pendiente'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    onClick={onClose}
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

export default ModalVerContrato;