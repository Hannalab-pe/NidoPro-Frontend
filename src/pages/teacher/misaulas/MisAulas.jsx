import React from 'react';
import TablaAulas from './tablas/TablaAulas';

const MisAulas = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Aulas</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las aulas asignadas y visualiza a los estudiantes
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de Aulas */}
      <TablaAulas />
    </div>
  );
};

export default MisAulas;
