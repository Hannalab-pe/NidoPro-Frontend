import React from 'react';
import { X, AlertTriangle, School } from 'lucide-react';
import { useAulasHook } from '../../../../hooks/useAulas';
import Button from '../../../../components/common/Button';

const ModalEliminarAula = ({ isOpen, onClose, aula }) => {
  const { deleteAula, deleting } = useAulasHook();

  const handleDelete = async () => {
    try {
      await deleteAula(aula.idAula || aula.id);
      onClose();
    } catch (error) {
      console.error('Error al eliminar aula:', error);
    }
  };

  if (!isOpen || !aula) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Eliminar Aula</h2>
              <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={deleting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <School className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Aula Sección {aula.seccion}</p>
              <p className="text-sm text-gray-500">
                {aula.cantidadEstudiantes || 0} estudiantes • {aula.ubicacion || 'Sin ubicación'}
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">¿Estás seguro?</h3>
                <p className="text-sm text-red-700 mt-1">
                  Al eliminar esta aula se perderá toda la información asociada. 
                  Los estudiantes asignados quedarán sin aula.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Para confirmar la eliminación, verifica que esta sea el aula correcta:
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Sección:</span>
              <span className="font-medium">{aula.seccion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estudiantes:</span>
              <span className="font-medium">{aula.cantidadEstudiantes || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ubicación:</span>
              <span className="font-medium">{aula.ubicacion || 'Sin ubicación'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar Aula'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarAula;
