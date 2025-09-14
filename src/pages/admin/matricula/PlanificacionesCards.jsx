import React from 'react';
import { FileText, Calendar, Download } from 'lucide-react';

const PlanificacionesCards = ({ planificaciones, loading }) => {

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!planificaciones || planificaciones.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No hay planificaciones registradas</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planificaciones.map((planificacion) => (
          <div key={planificacion.idPlanificacion} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {planificacion.tipoPlanificacion}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {planificacion.aula?.seccion || 'Sin aula asignada'}
                </p>
              </div>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-xs text-gray-600">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Planificación: {new Date(planificacion.fechaPlanificacion).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Creado: {new Date(planificacion.fechaCreacion).toLocaleDateString()}</span>
              </div>
            </div>

            {planificacion.observaciones && (
              <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                {planificacion.observaciones}
              </p>
            )}

            {planificacion.archivoUrl && (
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(planificacion.archivoUrl, '_blank')}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Ver
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = planificacion.archivoUrl;
                    link.download = `planificacion-${planificacion.idPlanificacion}.pdf`;
                    link.click();
                  }}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Descargar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PlanificacionesCards;