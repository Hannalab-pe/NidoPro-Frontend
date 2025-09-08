import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  AlertTriangle, 
  Trash2,
  Loader2
} from 'lucide-react';
import { useStudents } from '../../../../hooks/useStudents';

const ModalEliminarEstudiante = ({ isOpen, onClose, estudiante }) => {
  // Hook personalizado para gestión de estudiantes
  const { deleteStudent, deleting } = useStudents();
  
  // Estado local para confirmación
  const [confirmName, setConfirmName] = useState('');
  
  if (!estudiante) return null;

  const studentFullName = `${estudiante.nombre} ${estudiante.apellido}`;
  const isConfirmDisabled = confirmName.trim().toLowerCase() !== studentFullName.toLowerCase();

  const handleConfirm = async () => {
    if (isConfirmDisabled) return;
    
    try {
      // Obtener el ID correcto del estudiante (puede ser idEstudiante o id)
      const estudianteId = estudiante.idEstudiante || estudiante.id;
      
      if (!estudianteId) {
        console.error('❌ No se encontró ID del estudiante:', estudiante);
        throw new Error('ID del estudiante no encontrado');
      }
      
      console.log('🔄 ID del estudiante para eliminar:', estudianteId);
      
      // El hook se encarga de todo el proceso (delete + toast + update state)
      await deleteStudent(estudianteId);
      
      // Limpiar y cerrar modal después del éxito
      handleClose();
    } catch (error) {
      console.error('❌ Error al eliminar estudiante:', error);
      // El error ya está siendo manejado por el hook con toast
    }
  };

  const handleClose = () => {
    setConfirmName('');
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        Confirmar Eliminación
                      </Dialog.Title>
                      <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
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
                  {/* Estudiante Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{`${estudiante.nombre} ${estudiante.apellido}`}</h3>
                        <p className="text-sm text-gray-600">{estudiante.grado}</p>
                        <p className="text-sm text-gray-500">Padre/Madre: {estudiante.nombrePadre || 'No registrado'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Message */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-2">
                          ¿Estás seguro de eliminar a "{`${estudiante.nombre} ${estudiante.apellido}`}"?
                        </h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Se eliminará toda la información del estudiante</li>
                          <li>• Se perderán todos los registros académicos</li>
                          <li>• Se eliminará el historial de asistencia</li>
                          <li>• Esta acción no se puede deshacer</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Input */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-700 mb-3">
                      Para confirmar la eliminación, escribe <strong>"{`${estudiante.nombre} ${estudiante.apellido}`}"</strong> en el campo de abajo:
                    </p>
                    <input
                      type="text"
                      id="confirmName"
                      value={confirmName}
                      onChange={(e) => setConfirmName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder={`Escribe "${estudiante.nombre} ${estudiante.apellido}" para confirmar`}
                      disabled={deleting}
                    />
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
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px]"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Eliminar Estudiante
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

export default ModalEliminarEstudiante;