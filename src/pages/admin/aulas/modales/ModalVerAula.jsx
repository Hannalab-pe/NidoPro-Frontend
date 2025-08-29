import React from 'react';
import { X, School, Users, MapPin, Settings, FileText } from 'lucide-react';

const ModalVerAula = ({ isOpen, onClose, aula }) => {
  if (!isOpen || !aula) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Aula Sección {aula.seccion}
              </h2>
              <p className="text-sm text-gray-500">Detalles del aula</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <School className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Sección</p>
                  <p className="font-medium text-gray-900">{aula.seccion}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Estudiantes</p>
                  <p className="font-medium text-gray-900">
                    {aula.cantidadEstudiantes || 0} estudiantes
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Capacidad Máxima</p>
                  <p className="font-medium text-gray-900">
                    {aula.capacidadMaxima || 'No definida'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium text-gray-900">
                    {aula.ubicacion || 'Sin ubicación'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${
                    aula.estado === 'activa' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {aula.estado || 'Activa'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {aula.descripcion && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">Descripción</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{aula.descripcion}</p>
              </div>
            </div>
          )}

          {/* Equipamiento */}
          {aula.equipamiento && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">Equipamiento</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{aula.equipamiento}</p>
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-blue-600">Ocupación</p>
                <p className="text-lg font-semibold text-blue-900">
                  {aula.capacidadMaxima ? 
                    Math.round((aula.cantidadEstudiantes / aula.capacidadMaxima) * 100) : 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Disponibilidad</p>
                <p className="text-lg font-semibold text-blue-900">
                  {aula.capacidadMaxima ? 
                    (aula.capacidadMaxima - aula.cantidadEstudiantes) : 'N/A'} espacios
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerAula;
