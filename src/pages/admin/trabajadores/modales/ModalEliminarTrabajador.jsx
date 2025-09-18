import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  AlertTriangle, 
  Trash2,
  Loader2,
  Users,
  BookOpen,
  GraduationCap,
  Star,
  Clock,
  Award
} from 'lucide-react';
import { useToggleTrabajadorStatus } from 'src/hooks/queries/useTrabajadoresQueries';

const ModalEliminarTrabajador = ({ isOpen, onClose, onSuccess, trabajador }) => {
  // Hook para cambiar el estado del trabajador
  const toggleStatusMutation = useToggleTrabajadorStatus();
  
  // Estado local para confirmación
  const [confirmName, setConfirmName] = useState('');
  
  if (!trabajador) return null;

  const trabajadorName = `${trabajador.nombre} ${trabajador.apellido}`;
  const isConfirmDisabled = confirmName.trim().toLowerCase() !== trabajadorName.toLowerCase();
  const action = trabajador.estaActivo ? 'desactivar' : 'activar';
  const actionTitle = trabajador.estaActivo ? 'Desactivar' : 'Activar';

  const handleConfirm = async () => {
    if (isConfirmDisabled) return;
    
    try {
      console.log('🔄 Modal - Trabajador a togglear:', trabajador);
      console.log('🔄 Modal - ID del trabajador:', trabajador.idTrabajador || trabajador.id);
      
      // Usar la mutación para cambiar el estado del trabajador
      toggleStatusMutation.mutate({ trabajador });
      
      // Limpiar y cerrar modal después del éxito
      handleClose();
      
      // Llamar onSuccess para refresh adicional
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`❌ Error al ${action} trabajador:`, error);
      // El error ya está siendo manejado por el hook con toast
    }
  };

  const handleClose = () => {
    setConfirmName('');
    onClose();
  };

  // Obtener imagen del trabajador
  const getTrabajadorPhoto = () => {
    if (trabajador.foto) {
      if (typeof trabajador.foto === 'object' && trabajador.foto.url) {
        return trabajador.foto.url;
      }
      return trabajador.foto;
    }
    return '/default-avatar.png';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'leave': return 'En Licencia';
      default: return 'Sin estado';
    }
  };

  // Función para mostrar rating con estrellas
  const renderRating = (rating) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-xs font-medium text-gray-900 ml-1">
          {numRating.toFixed(1)}
        </span>
      </div>
    );
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        {actionTitle} Trabajador
                      </Dialog.Title>
                      <p className="text-sm text-orange-600 font-medium">¿Estás seguro de continuar?</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={toggleStatusMutation.isLoading}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Información del Trabajador */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-gray-200">
                        <span className="text-lg font-medium text-blue-600">
                          {trabajador.nombre?.charAt(0)}{trabajador.apellido?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{trabajadorName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{trabajador.email}</span>
                          <span>•</span>
                          <span>{trabajador.telefono}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trabajador.estaActivo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trabajador.estaActivo ? 'Activo' : 'Inactivo'}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{trabajador.idRol?.nombre || 'Sin rol'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información adicional en grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-sm font-medium text-gray-700">Documento</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {trabajador.tipoDocumento} {trabajador.nroDocumento}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-sm font-medium text-gray-700">Dirección</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate" title={trabajador.direccion}>
                          {trabajador.direccion}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Warning Message */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-800 mb-3">
                          ¿Estás seguro de {action} al trabajador "{trabajadorName}"?
                        </h4>
                        <div className="text-sm text-orange-700 space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>
                              {trabajador.estaActivo 
                                ? 'El trabajador será desactivado y no podrá acceder al sistema'
                                : 'El trabajador será reactivado y podrá acceder al sistema nuevamente'
                              }
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>
                              {trabajador.estaActivo
                                ? 'Se suspenderán temporalmente sus permisos y responsabilidades'
                                : 'Se restaurarán sus permisos y responsabilidades según su rol'
                              }
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="font-medium">
                              {trabajador.estaActivo
                                ? 'Esta acción se puede revertir posteriormente'
                                : 'El trabajador volverá a estar operativo'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Input */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-700 mb-3">
                      Para confirmar la acción, escribe exactamente{' '}
                      <span className="font-bold text-orange-600">"{trabajadorName}"</span>{' '}
                      en el campo de abajo:
                    </p>
                    <input
                      type="text"
                      id="confirmName"
                      value={confirmName}
                      onChange={(e) => setConfirmName(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                        confirmName && isConfirmDisabled 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                          : confirmName && !isConfirmDisabled
                          ? 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder={`Escribe "${trabajadorName}" para confirmar`}
                      disabled={toggleStatusMutation.isLoading}
                      autoComplete="off"
                    />
                    {confirmName && isConfirmDisabled && (
                      <p className="text-red-600 text-xs mt-1">
                        El nombre no coincide exactamente. Verifica las mayúsculas y espacios.
                      </p>
                    )}
                    {confirmName && !isConfirmDisabled && (
                      <p className="text-green-600 text-xs mt-1">
                        ✓ Confirmación correcta
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={toggleStatusMutation.isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={toggleStatusMutation.isLoading || isConfirmDisabled}
                      className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] ${
                        isConfirmDisabled 
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : trabajador.estaActivo
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {toggleStatusMutation.isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {trabajador.estaActivo ? 'Desactivando...' : 'Activando...'}
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          {actionTitle} Trabajador
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalEliminarTrabajador;