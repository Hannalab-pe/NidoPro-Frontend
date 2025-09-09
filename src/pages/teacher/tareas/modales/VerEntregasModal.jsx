import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  X, 
  CheckCircle, 
  Clock, 
  Users, 
  PaperclipIcon, 
  FileText,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Target,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import tareaService from '../../../../services/tareaService';

const VerEntregasModal = ({ isOpen, onClose, tarea }) => {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState('entregadas'); // 'entregadas' o 'pendientes'

  // Cargar entregas cuando se abre el modal
  useEffect(() => {
    if (isOpen && tarea?.idTarea) {
      cargarEntregas();
    } else if (!isOpen) {
      // Limpiar datos cuando se cierra el modal
      setEntregas([]);
      setError(null);
      setTabActiva('entregadas');
      setLoading(false);
    }
  }, [isOpen, tarea]);

  const cargarEntregas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Cargando entregas para tarea:', tarea.idTarea);
      
      const response = await tareaService.obtenerEntregasPorTarea(tarea.idTarea);
      
      console.log('✅ Entregas cargadas:', response);
      console.log('📊 Datos de entregas:', response.entregas);
      setEntregas(response.entregas || []);
      
    } catch (err) {
      console.error('❌ Error al cargar entregas:', err);
      setError(err.message || 'Error al cargar las entregas');
      toast.error('Error al cargar las entregas de la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Limpiar inmediatamente para evitar que se vea contenido mientras se cierra
    setEntregas([]);
    setError(null);
    setTabActiva('entregadas');
    setLoading(false);
    onClose();
  };

  // Filtrar entregas - considerar tanto realizoTarea como estado
  const entregasRealizadas = isOpen ? entregas.filter(entrega => 
    entrega.realizoTarea === true || entrega.estado === 'entregado'
  ) : [];
  const entregasPendientes = isOpen ? entregas.filter(entrega => 
    entrega.realizoTarea === false && entrega.estado !== 'entregado'
  ) : [];

  // Debug logs (solo si el modal está abierto)
  if (isOpen && entregas.length > 0) {
    console.log('🔍 Debug entregas:', {
      total: entregas.length,
      entregasRealizadas: entregasRealizadas.length,
      entregasPendientes: entregasPendientes.length,
      entregas: entregas.map(e => ({
        id: e.idTareaEntrega,
        realizoTarea: e.realizoTarea,
        estado: e.estado,
        nombre: e.idEstudiante2?.nombre
      }))
    });
  }

  // Estadísticas
  const totalEstudiantes = entregas.length;
  const totalEntregadas = entregasRealizadas.length;
  const totalPendientes = entregasPendientes.length;
  const porcentajeEntrega = totalEstudiantes > 0 ? Math.round((totalEntregadas / totalEstudiantes) * 100) : 0;

  const formatFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!tarea || !isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Dialog.Title as="h3" className="text-2xl font-bold mb-2">
                        {tarea.titulo}
                      </Dialog.Title>
                      <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{tarea.aulaInfo?.grado || 'Sin grado'} - {tarea.aulaInfo?.seccion || 'Sin sección'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Vence: {formatFecha(tarea.fechaEntrega)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>{totalEntregadas}/{totalEstudiantes} entregas ({porcentajeEntrega}%)</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-green-700 hover:cursor-pointer hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando entregas...</h3>
                      <p className="text-gray-600">Obteniendo información de las entregas de la tarea</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar entregas</h3>
                      <p className="text-gray-600 text-center mb-4">{error}</p>
                      <button
                        onClick={cargarEntregas}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Reintentar
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Estadísticas */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Users className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                              <p className="text-blue-800 font-semibold text-lg">{totalEstudiantes}</p>
                              <p className="text-blue-600 text-sm">Total estudiantes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                              <p className="text-green-800 font-semibold text-lg">{totalEntregadas}</p>
                              <p className="text-green-600 text-sm">Entregadas</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                            <div>
                              <p className="text-yellow-800 font-semibold text-lg">{totalPendientes}</p>
                              <p className="text-yellow-600 text-sm">Pendientes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Target className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                              <p className="text-purple-800 font-semibold text-lg">{porcentajeEntrega}%</p>
                              <p className="text-purple-600 text-sm">Completado</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                          <button
                            onClick={() => setTabActiva('entregadas')}
                            className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                              tabActiva === 'entregadas'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Entregadas ({totalEntregadas})</span>
                            </div>
                          </button>
                          <button
                            onClick={() => setTabActiva('pendientes')}
                            className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                              tabActiva === 'pendientes'
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Pendientes ({totalPendientes})</span>
                            </div>
                          </button>
                        </nav>
                      </div>

                      {/* Contenido de tabs */}
                      <div className="max-h-96 overflow-y-auto">
                        {tabActiva === 'entregadas' ? (
                          <div className="space-y-4">
                            {entregasRealizadas.length > 0 ? (
                              <div className="grid gap-4">
                                {entregasRealizadas.map((entrega) => (
                                  <div key={entrega.idTareaEntrega} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                          <span className="text-green-600 font-semibold text-sm">
                                            {entrega.idEstudiante2?.nombre?.charAt(0)}{entrega.idEstudiante2?.apellido?.charAt(0)}
                                          </span>
                                        </div>
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {entrega.idEstudiante2?.nombre} {entrega.idEstudiante2?.apellido}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            DNI: {entrega.idEstudiante2?.nroDocumento}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="flex items-center text-green-600 mb-1">
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          <span className="text-sm font-medium">Entregada</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          {formatFecha(entrega.fechaEntrega)}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {entrega.archivoUrl && (
                                      <div className="mt-3 flex items-center justify-between bg-white rounded-lg p-3 border">
                                        <div className="flex items-center text-sm text-gray-600">
                                          <PaperclipIcon className="w-4 h-4 mr-2" />
                                          <span>Archivo adjunto</span>
                                        </div>
                                        <div className="flex space-x-2">
                                          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs">
                                            <Eye className="w-3 h-3" />
                                            <span>Ver</span>
                                          </button>
                                          <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs">
                                            <Download className="w-3 h-3" />
                                            <span>Descargar</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {entrega.observaciones && (
                                      <div className="mt-3 p-3 bg-white rounded-lg border">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Observaciones:</p>
                                        <p className="text-sm text-gray-600">{entrega.observaciones}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <CheckCircle className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas realizadas</h3>
                                <p className="text-gray-500">Aún ningún estudiante ha entregado esta tarea</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {entregasPendientes.length > 0 ? (
                              <div className="grid gap-4">
                                {entregasPendientes.map((entrega) => (
                                  <div key={entrega.idTareaEntrega} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                          <span className="text-yellow-600 font-semibold text-sm">
                                            {entrega.idEstudiante2?.nombre?.charAt(0)}{entrega.idEstudiante2?.apellido?.charAt(0)}
                                          </span>
                                        </div>
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {entrega.idEstudiante2?.nombre} {entrega.idEstudiante2?.apellido}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            DNI: {entrega.idEstudiante2?.nroDocumento}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="flex items-center text-yellow-600 mb-1">
                                          <Clock className="w-4 h-4 mr-1" />
                                          <span className="text-sm font-medium">Pendiente</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Vence: {formatFecha(entrega.fechaEntrega)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <CheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">¡Excelente!</h3>
                                <p className="text-gray-500">Todos los estudiantes han entregado la tarea</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
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

export default VerEntregasModal;
