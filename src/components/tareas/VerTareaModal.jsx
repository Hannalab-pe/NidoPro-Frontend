import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  X,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  PaperclipIcon,
  Target,
  GraduationCap,
  Mail,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const VerTareaModal = ({ isOpen, onClose, tarea }) => {
  const [loading, setLoading] = useState(false);

  // Debug: mostrar qué datos llegan
  useEffect(() => {
    if (tarea) {
      console.log('📋 Datos de la tarea en el modal:', tarea);
      console.log('📎 Archivo URL:', tarea.archivoUrl);
      console.log('📎 Archivo URL (alternativo):', tarea.archivo_url);
      console.log('📎 Archivo URL (fileUrl):', tarea.fileUrl);
    }
  }, [tarea]);

  // Función para formatear fechas
  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para abrir archivo
  const abrirArchivo = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('No se encontró el archivo adjunto');
    }
  };

  // Función para descargar archivo
  const descargarArchivo = (url, nombre) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = nombre || 'archivo_tarea';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('No se encontró el archivo para descargar');
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Calcular días restantes
  const getDiasRestantes = (fechaEntrega) => {
    if (!fechaEntrega) return null;
    const hoy = new Date();
    const entrega = new Date(fechaEntrega);
    const diffTime = entrega - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Venció hace ${Math.abs(diffDays)} día(s)`;
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    return `${diffDays} días restantes`;
  };

  // Obtener estado de la tarea
  const getEstadoInfo = (tarea) => {
    if (!tarea) {
      return {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        emoji: '⏰'
      };
    }

    if (tarea.realizoTarea) {
      return {
        label: 'Completada',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        emoji: '✅'
      };
    }

    const fechaEntrega = new Date(tarea.fechaEntrega || new Date());
    const hoy = new Date();

    if (fechaEntrega < hoy) {
      return {
        label: 'Atrasada',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle,
        emoji: '⚠️'
      };
    }

    return {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      emoji: '⏰'
    };
  };

  // Si no hay tarea, no renderizar el modal
  if (!tarea) {
    return null;
  }

  const estadoInfo = getEstadoInfo(tarea);
  const EstadoIcon = estadoInfo.icon;
  const diasRestantes = getDiasRestantes(tarea?.fechaEntrega);

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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-600 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                          {tarea?.titulo || 'Detalles de la Tarea'}
                        </Dialog.Title>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${estadoInfo.color}`}>
                            <EstadoIcon className="w-3 h-3 mr-1" />
                            {estadoInfo.label}
                          </span>
                          {diasRestantes && (
                            <span className={`text-xs font-medium ${
                              tarea?.isOverdue ? 'text-red-200' :
                              diasRestantes.includes('mañana') || diasRestantes.includes('hoy') ? 'text-orange-200' :
                              'text-green-200'
                            }`}>
                              {diasRestantes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-96 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Información básica */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Información de la Tarea</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Título</label>
                            <p className="mt-1 text-sm text-gray-900 font-medium">
                              {tarea?.titulo || 'No especificado'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Descripción</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea?.descripcion || 'Sin descripción'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Fecha de Asignación</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {formatFecha(tarea?.fechaAsignacion)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Fecha de Entrega</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {formatFecha(tarea?.fechaEntrega)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Materia</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea?.aulaInfo?.descripcion || 'No especificada'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Aula</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea?.aula || 'No especificada'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Archivo adjunto de la tarea */}
                    {(() => {
                      console.log('🔍 Verificando archivoUrl:', tarea?.archivoUrl);
                      console.log('🔍 Verificando archivo_url:', tarea?.archivo_url);
                      console.log('🔍 Verificando fileUrl:', tarea?.fileUrl);
                      console.log('🔍 Verificando file_url:', tarea?.file_url);
                      const archivoUrl = tarea?.archivoUrl || tarea?.archivo_url || tarea?.fileUrl || tarea?.file_url;
                      console.log('🔍 URL final del archivo:', archivoUrl);
                      console.log('🔍 Condición final:', !!archivoUrl);
                      return archivoUrl;
                    })() && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Archivo de la Tarea</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Archivo adjunto por el profesor</p>
                                <p className="text-xs text-gray-600">Haz clic para ver o descargar el archivo</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => abrirArchivo(tarea?.archivoUrl || tarea?.archivo_url || tarea?.fileUrl || tarea?.file_url)}
                                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Ver</span>
                              </button>
                              <button
                                onClick={() => descargarArchivo(tarea?.archivoUrl || tarea?.archivo_url || tarea?.fileUrl || tarea?.file_url, `tarea_${tarea?.titulo}`)}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs"
                              >
                                <Download className="w-3 h-3" />
                                <span>Descargar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Información del profesor */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Profesor</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Nombre</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea?.profesorInfo?.nombre} {tarea?.profesorInfo?.apellido}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Correo</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {tarea?.profesorInfo?.correo || 'No especificado'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Estado de la entrega */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Estado de la Entrega</h4>
                      {tarea?.realizoTarea ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">¡Tarea completada!</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Fecha de Entrega</label>
                              <p className="mt-1 text-green-800">
                                {formatFecha(tarea?.entrega?.fechaEntregaRealizada)}
                              </p>
                            </div>
                            {tarea?.entrega?.observaciones && (
                              <div className="md:col-span-2">
                                <label className="text-xs font-medium text-gray-500">Observaciones</label>
                                <p className="mt-1 text-green-800">
                                  {tarea?.entrega?.observaciones}
                                </p>
                              </div>
                            )}
                          </div>
                          {tarea?.entrega?.archivoUrl && (
                            <div className="mt-4">
                              <label className="text-xs font-medium text-gray-500 mb-2 block">Archivo Entregado</label>
                              <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                                <div className="flex items-center text-sm text-gray-600">
                                  <PaperclipIcon className="w-4 h-4 mr-2" />
                                  <span>Tu archivo entregado</span>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => abrirArchivo(tarea?.entrega?.archivoUrl)}
                                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Ver</span>
                                  </button>
                                  <button
                                    onClick={() => descargarArchivo(tarea?.entrega?.archivoUrl, `mi_entrega_${tarea?.titulo}`)}
                                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Descargar</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-800 font-medium">Pendiente de entrega</span>
                          </div>
                          <p className="text-yellow-700 text-sm mt-2">
                            Recuerda entregar tu tarea antes de la fecha límite.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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

export default VerTareaModal;
