import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  AlertTriangle,
  Trash2,
  Loader2
} from 'lucide-react';

// Componente para generar avatar con iniciales
const generateAvatar = (nombre, apellido) => {
  const initials = `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-gray-500'
  ];
  const colorIndex = (nombre?.charCodeAt(0) || 0) % colors.length;
  
  return (
    <div className={`w-12 h-12 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
      {initials || '??'}
    </div>
  );
};

const ModalEliminarEstudiante = ({ isOpen, onClose, estudiante, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Función handleClose que respeta el ciclo de vida del componente
  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  // Función para manejar la eliminación
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('🗑️ Eliminando asignación del estudiante:', estudiante);

      // TODO: Aquí iría la llamada a la API para eliminar la asignación del estudiante del aula
      // Por ahora simulamos una operación exitosa
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('✅ Asignación eliminada exitosamente');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error al eliminar asignación:', error);
      // TODO: Mostrar mensaje de error al usuario
    } finally {
      setIsDeleting(false);
    }
  };

  if (!estudiante) return null;

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                        Eliminar Asignación
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mt-1">
                        Esta acción no se puede deshacer
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={handleClose}
                    disabled={isDeleting}
                  >
                    <span className="sr-only">Cerrar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                  {/* Información del estudiante */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      {generateAvatar(estudiante.nombre, estudiante.apellido)}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {estudiante.nombre} {estudiante.apellido}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {estudiante.aulaInfo?.nombreGrado} - Sección {estudiante.aulaInfo?.seccion}
                        </p>
                        <p className="text-sm text-gray-500">
                          Documento: {estudiante.numeroDocumento}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          ¿Estás seguro de que quieres eliminar esta asignación?
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Al eliminar esta asignación, el estudiante <strong>{estudiante.nombre} {estudiante.apellido}</strong> será 
                            removido del aula <strong>{estudiante.aulaInfo?.nombreGrado} - Sección {estudiante.aulaInfo?.seccion}</strong>.
                          </p>
                          <ul className="mt-2 space-y-1">
                            <li>• El estudiante ya no aparecerá en tu lista de estudiantes</li>
                            <li>• Se perderán los datos de asistencia relacionados</li>
                            <li>• Esta acción no se puede deshacer</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                    onClick={handleClose}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Sí, Eliminar
                      </>
                    )}
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

export default ModalEliminarEstudiante;
