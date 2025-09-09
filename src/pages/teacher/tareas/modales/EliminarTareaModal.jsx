import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, FileText, Calendar, Users } from 'lucide-react';

const EliminarTareaModal = ({ isOpen, onClose, tarea }) => {
  const [confirmacionTexto, setConfirmacionTexto] = useState('');
  const [eliminandoTambienEntregas, setEliminandoTambienEntregas] = useState(false);

  const handleEliminar = () => {
    if (confirmacionTexto.toLowerCase() !== 'eliminar') {
      return;
    }

    // Aquí iría la lógica para eliminar la tarea
    console.log('Eliminar tarea:', {
      id: tarea.id,
      titulo: tarea.titulo,
      eliminarEntregas: eliminandoTambienEntregas
    });

    // Resetear estado
    setConfirmacionTexto('');
    setEliminandoTambienEntregas(false);
    onClose();
  };

  const handleClose = () => {
    setConfirmacionTexto('');
    setEliminandoTambienEntregas(false);
    onClose();
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const puedeEliminar = confirmacionTexto.toLowerCase() === 'eliminar';

  if (!isOpen || !tarea) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Eliminar Tarea</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Advertencia */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  ¡Atención! Esta acción no se puede deshacer
                </h3>
                <p className="text-sm text-red-700">
                  Al eliminar esta tarea se perderán todos los datos asociados de forma permanente.
                </p>
              </div>
            </div>
          </div>

          {/* Información de la tarea */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Información de la tarea a eliminar:</h3>
            
            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Título:</span>
                <span className="ml-2 text-gray-700">{tarea.titulo}</span>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Fecha de vencimiento:</span>
                <span className="ml-2 text-gray-700">{formatFecha(tarea.fechaVencimiento)}</span>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Estudiantes:</span>
                <span className="ml-2 text-gray-700">{tarea.totalEstudiantes} estudiantes</span>
              </div>
            </div>

            {/* Estadísticas de entregas */}
            {tarea.entregadas > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Entregas existentes:</h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-yellow-700">Entregadas:</span>
                    <span className="ml-1 text-yellow-900">{tarea.entregadas}</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-700">Pendientes:</span>
                    <span className="ml-1 text-yellow-900">{tarea.pendientes}</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-700">Calificadas:</span>
                    <span className="ml-1 text-yellow-900">{tarea.calificadas}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Opciones de eliminación */}
          {tarea.entregadas > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Opciones de eliminación:</h3>
              
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={eliminandoTambienEntregas}
                  onChange={(e) => setEliminandoTambienEntregas(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Eliminar también todas las entregas y calificaciones
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Esto eliminará permanentemente todas las entregas de los estudiantes, 
                    archivos adjuntos, calificaciones y comentarios asociados a esta tarea.
                  </p>
                </div>
              </label>

              {!eliminandoTambienEntregas && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Las entregas y calificaciones se mantendrán en el sistema 
                    como registros históricos, pero ya no estarán asociadas a ninguna tarea.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirmación de texto */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Para confirmar, escribe <span className="font-bold text-red-600">"ELIMINAR"</span> en el campo:
            </label>
            <input
              type="text"
              value={confirmacionTexto}
              onChange={(e) => setConfirmacionTexto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Escribe ELIMINAR"
            />
          </div>

          {/* Lista de consecuencias */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Se eliminarán:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• La tarea y toda su información</li>
              <li>• Archivos adjuntos de la tarea</li>
              <li>• Instrucciones y descripción</li>
              {eliminandoTambienEntregas && (
                <>
                  <li className="text-red-700 font-medium">• Todas las entregas de los estudiantes</li>
                  <li className="text-red-700 font-medium">• Calificaciones y comentarios</li>
                  <li className="text-red-700 font-medium">• Archivos adjuntos de las entregas</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleEliminar}
            disabled={!puedeEliminar}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              puedeEliminar
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Permanentemente</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarTareaModal;
