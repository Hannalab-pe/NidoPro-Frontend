import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  Trash2, 
  AlertTriangle,
  User,
  GraduationCap,
  Loader2
} from 'lucide-react';
import DefaultAvatar from '../../../../components/common/DefaultAvatar';
import { useMatricula } from '../../../../hooks/useMatricula';

const ModalEliminarMatricula = ({ isOpen, onClose, matricula, onDelete }) => {
  const { deleteStudent, loading } = useMatricula();

  if (!matricula) return null;

  const handleDelete = async () => {
    try {
      await deleteStudent(matricula.id);
      onDelete(); // Llamar la función onDelete pasada como prop
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
    }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Eliminar Matrícula
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Esta acción no se puede deshacer
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

                {/* Contenido */}
                <div className="space-y-4">
                  {/* Alerta */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800 mb-1">
                          ¡Atención! Esta acción es irreversible
                        </h3>
                        <p className="text-sm text-red-700">
                          Al eliminar esta matrícula se perderán todos los datos asociados al estudiante, 
                          incluyendo calificaciones, asistencia y reportes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del estudiante */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {matricula.photo ? (
                          <img
                            src={matricula.photo}
                            alt={`${matricula.name} ${matricula.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar
                            name={`${matricula.name} ${matricula.lastName}`}
                            size="w-12 h-12"
                            textSize="text-sm"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <User className="w-4 h-4 mr-1 text-gray-600" />
                          {matricula.name} {matricula.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          {matricula.grade}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {matricula.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Confirmación */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Para confirmar la eliminación, escriba:</strong> ELIMINAR
                    </p>
                    <input
                      type="text"
                      placeholder="Escriba ELIMINAR para confirmar"
                      className="w-full mt-2 px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      onChange={(e) => {
                        const deleteButton = document.getElementById('delete-button');
                        if (deleteButton) {
                          deleteButton.disabled = e.target.value !== 'ELIMINAR';
                        }
                      }}
                    />
                  </div>

                  {/* Lista de datos que se eliminarán */}
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Se eliminarán los siguientes datos:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Información personal del estudiante</li>
                      <li>Datos de contacto y acudientes</li>
                      <li>Historial académico y calificaciones</li>
                      <li>Registro de asistencia</li>
                      <li>Reportes y observaciones</li>
                      <li>Fotografías y documentos adjuntos</li>
                    </ul>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    id="delete-button"
                    onClick={handleDelete}
                    disabled={true}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Eliminando...' : 'Eliminar Matrícula'}</span>
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

export default ModalEliminarMatricula;
