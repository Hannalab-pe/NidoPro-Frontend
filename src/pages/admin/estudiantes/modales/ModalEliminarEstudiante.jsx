import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Trash2,
  User
} from 'lucide-react';

const ModalEliminarEstudiante = ({ isOpen, onClose, estudiante, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  
  if (!isOpen || !estudiante) return null;

  const isConfirmDisabled = confirmName.trim().toLowerCase() !== estudiante.name.toLowerCase();

  const handleConfirm = async () => {
    if (isConfirmDisabled) return;
    
    setLoading(true);
    
    try {
      await onConfirm(estudiante.id);
      setConfirmName('');
      onClose();
    } catch (error) {
      console.error('Error al eliminar el estudiante:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h2>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Estudiante Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={estudiante.photo}
                alt={estudiante.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{estudiante.name}</h3>
                <p className="text-sm text-gray-600">{estudiante.grade}</p>
                <p className="text-sm text-gray-500">Padre/Madre: {estudiante.parent}</p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-2">
                  ¿Estás seguro de eliminar a "{estudiante.name}"?
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
              Para confirmar la eliminación, escribe <strong>"{estudiante.name}"</strong> en el campo de abajo:
            </p>
            <input
              type="text"
              id="confirmName"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder={`Escribe "${estudiante.name}" para confirmar`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || isConfirmDisabled}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
      </div>
    </div>
  );
};

export default ModalEliminarEstudiante;
