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
import { useProfesores } from '../../../../hooks/useProfesores';

const ModalEliminarProfesor = ({ isOpen, onClose, profesor }) => {
  // Hook personalizado para gestión de profesores
  const { deleteTeacher, deleting } = useProfesores();
  
  // Estado local para confirmación
  const [confirmName, setConfirmName] = useState('');
  
  if (!profesor) return null;

  const isConfirmDisabled = confirmName.trim().toLowerCase() !== profesor.name.toLowerCase();

  const handleConfirm = async () => {
    if (isConfirmDisabled) return;
    
    try {
      // El hook se encarga de todo el proceso (delete + toast + update state)
      await deleteTeacher(profesor.id);
      
      // Limpiar y cerrar modal después del éxito
      handleClose();
    } catch (error) {
      console.error('❌ Error al eliminar profesor:', error);
      // El error ya está siendo manejado por el hook con toast
    }
  };

  const handleClose = () => {
    setConfirmName('');
    onClose();
  };

  // Obtener imagen del profesor
  const getTeacherPhoto = () => {
    if (profesor.photo) {
      if (typeof profesor.photo === 'object' && profesor.photo.url) {
        return profesor.photo.url;
      }
      return profesor.photo;
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
                <div className="flex items-center justify-between p-6 border-b bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        Confirmar Eliminación
                      </Dialog.Title>
                      <p className="text-sm text-red-600 font-medium">Esta acción no se puede deshacer</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={deleting}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Información del Profesor */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={getTeacherPhoto()}
                        alt={profesor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{profesor.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium">{profesor.subject}</span>
                          <span>•</span>
                          <Clock className="w-4 h-4" />
                          <span>{profesor.schedule}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profesor.status)}`}>
                            {getStatusText(profesor.status)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium">{profesor.experience || 0} años</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información adicional en grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">Título</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate" title={profesor.degree}>
                          {profesor.degree || 'No especificado'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Estudiantes</span>
                        </div>
                        <p className="text-sm font-semibold text-green-600">
                          {profesor.students || 0}
                        </p>
                      </div>
                    </div>

                    {/* Rating si existe */}
                    {profesor.rating && Number(profesor.rating) > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Calificación:</span>
                          {renderRating(profesor.rating)}
                        </div>
                      </div>
                    )}

                    {/* Clases asignadas */}
                    {profesor.classes && profesor.classes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Clases asignadas:</p>
                        <div className="flex flex-wrap gap-1">
                          {profesor.classes.slice(0, 4).map((clase, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {clase}
                            </span>
                          ))}
                          {profesor.classes.length > 4 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{profesor.classes.length - 4} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Warning Message */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-3">
                          ¿Estás seguro de eliminar al profesor "{profesor.name}"?
                        </h4>
                        <div className="text-sm text-red-700 space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Se eliminará toda la información personal y académica del profesor</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Se perderán todos los registros de evaluaciones y calificaciones</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Se desasignarán automáticamente todas las clases actuales</span>
                          </div>
                          {profesor.students > 0 && (
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="font-medium">
                                Los {profesor.students} estudiantes a su cargo quedarán sin profesor asignado en {profesor.subject}
                              </span>
                            </div>
                          )}
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="font-medium">Esta acción es permanente e irreversible</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Input */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-700 mb-3">
                      Para confirmar la eliminación, escribe exactamente{' '}
                      <span className="font-bold text-red-600">"{profesor.name}"</span>{' '}
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
                      placeholder={`Escribe "${profesor.name}" para confirmar`}
                      disabled={deleting}
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
                      disabled={deleting}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={deleting || isConfirmDisabled}
                      className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] ${
                        isConfirmDisabled 
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Eliminar Profesor
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

export default ModalEliminarProfesor;