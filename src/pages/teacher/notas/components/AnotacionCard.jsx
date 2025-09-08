// src/pages/teacher/notas/components/AnotacionCard.jsx
import React from 'react';
import { 
  Calendar, 
  User, 
  BookOpen, 
  Clock,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react';

const AnotacionCard = ({ anotacion, onEdit, onDelete }) => {
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear fecha y hora
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determinar color de prioridad o tipo
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 p-6">
      {/* Header de la card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {anotacion.titulo}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>
                {anotacion.estudiante?.nombre} {anotacion.estudiante?.apellido}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{anotacion.curso?.nombreCurso}</span>
            </div>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex items-center gap-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(anotacion)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar anotación"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(anotacion)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar anotación"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido de la observación */}
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <p className="text-gray-700 leading-relaxed">
            {anotacion.observacion}
          </p>
        </div>
      </div>

      {/* Footer con fechas */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Observación: {formatDate(anotacion.fechaObservacion)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Creado: {formatDateTime(anotacion.fechaCreacion)}</span>
          </div>
        </div>
        
        {/* Badge de estado o prioridad si existe */}
        {anotacion.prioridad && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(anotacion.prioridad)}`}>
            {anotacion.prioridad}
          </span>
        )}
      </div>
    </div>
  );
};

export default AnotacionCard;
